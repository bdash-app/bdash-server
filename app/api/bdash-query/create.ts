import { BlitzApiRequest, BlitzApiResponse } from "blitz"
import db, { Prisma } from "db"
import { createHash } from "crypto"
import { convertTsvToQueryResult } from "app/core/lib/QueryResult"

type BdashClientRequestBody = { description: string; files: { [key: string]: { content: string } } }

const postBdashQuery = async (req: BlitzApiRequest, res: BlitzApiResponse) => {
  if (req.method !== "POST") {
    res.status(405).end()
    return
  }

  const accessToken = req.headers["authorization"]?.split("token ")[1]
  if (accessToken === undefined) {
    res.status(401).end()
    return
  }

  const user = await db.user.findUnique({ where: { accessToken } })
  if (user === null) {
    res.status(404).end()
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
    data_source_info: "",
    chart_svg: null,
    chart_config: null,
    result: "",
  }

  Object.entries(body.files).forEach(([key, value]) => {
    switch (key) {
      case "query.sql":
        data.query_sql = value.content
        break
      case "result.tsv":
        const queryResult = convertTsvToQueryResult(value.content)
        data.result = queryResult ? JSON.stringify(queryResult) : null
        break
      case "data_source.json":
        data.data_source_info = normalizeDataSourceInfo(value.content)
        break
      case "chart.svg":
        data.chart_svg = value.content
        break
      case "chart.json":
        data.chart_config = value.content
        break
      default:
        console.error(`Unexpected file: ${key}`)
        break
    }
  })

  const bdashQuery = await db.bdashQuery.create({ data, select: { id_hash: true } })

  res.statusCode = 201
  res.setHeader("Content-Type", "application/json")
  res.end(JSON.stringify({ html_url: `${process.env.WEB_HOST}/query/${bdashQuery.id_hash}` }))
}

function normalizeDataSourceInfo(json: string): string | null {
  let data
  try {
    data = JSON.parse(json)
  } catch {
    return null
  }

  if (data === null) return null
  if (typeof data !== "object") return null

  Object.keys(data).forEach((key) => {
    data[key] = data[key] === null ? "" : String(data[key])
  })

  return JSON.stringify(data)
}

export default postBdashQuery
