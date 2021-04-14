import { BlitzApiRequest, BlitzApiResponse } from "blitz"
import db, { Prisma } from "db"
import { createHash } from "crypto"
import { uploadResultTSV } from "app/core/lib/s3"
import tmp from "tmp"
import fs from "fs"

type BdashClientRequestBody = { description: string; files: { [key: string]: { content: string } } }

const postBdashQuery = async (req: BlitzApiRequest, res: BlitzApiResponse) => {
  if (req.method !== "POST") {
    res.status(405)
    return
  }

  const accessToken = req.headers["authorization"]?.split("token ")[1]
  const user = await db.user.findUnique({ where: { accessToken } })
  if (user === null) {
    res.status(404)
    return
  }

  const body = req.body as BdashClientRequestBody

  const currentDate = new Date().toString()
  const random = Math.random().toString()
  const idHash = createHash("md5").update(`${user.id}_${currentDate}_${random}`).digest("hex")

  const data: Prisma.BdashQueryCreateArgs["data"] = {
    id_hash: idHash,
    userId: user.id,
    title: body.description,
    description: "",
    query_sql: "",
    result_tsv: "",
    metadata_md: "",
    chart_svg: null,
  }

  let resultTSVFilePath: string | null = null

  Object.entries(body.files).forEach(([key, value]) => {
    const extension = key.split(".").slice(-1)[0]
    switch (extension) {
      case "sql":
        data.query_sql = value.content
        break
      case "tsv":
        const tmpFile = tmp.fileSync({ mode: 0o755, prefix: "result", postfix: ".csv" })
        fs.writeFileSync(tmpFile.name, value.content)
        resultTSVFilePath = tmpFile.name
        break
      case "md":
        data.metadata_md = value.content
        break
      case "svg":
        data.chart_svg = value.content
        break
      default:
        console.error(`Unexpected file: ${key}`)
        break
    }
  })

  const bdashQuery = await db.bdashQuery.create({ data, select: { id: true, id_hash: true } })
  if (resultTSVFilePath) {
    uploadResultTSV(bdashQuery.id, resultTSVFilePath)
  }

  res.statusCode = 201
  res.setHeader("Content-Type", "application/json")
  res.end(JSON.stringify({ html_url: `${process.env.WEB_HOST}/query/${bdashQuery.id_hash}` }))
}

export default postBdashQuery
