import { BlitzApiRequest, BlitzApiResponse } from "blitz"
import db, { Prisma } from "db"
import { convertTsvToQueryResult } from "app/core/lib/QueryResult"

type BdashClientRequestBody = {
  idHash: string
  description: string
  files: { [key: string]: { content: string } }
}

const putBdashQuery = async (req: BlitzApiRequest, res: BlitzApiResponse) => {
  if (req.method !== "PUT") {
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

  const bdashQuery = await db.bdashQuery.findUnique({ where: { id_hash: body.idHash } })
  if (bdashQuery === null) {
    res.status(404).end()
    return
  } else if (bdashQuery.userId !== user.id) {
    res.status(403).end()
    return
  }

  const data: Prisma.BdashQueryUpdateArgs["data"] = {
    title: body.description,
    chart_svg: null,
    chart_config: null,
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

  const updatedBdashQuery = await db.bdashQuery.update({
    where: { id_hash: body.idHash },
    data,
    select: { id_hash: true },
  })

  res.statusCode = 200
  res.setHeader("Content-Type", "application/json")
  res.end(
    JSON.stringify({
      id: updatedBdashQuery.id_hash,
      html_url: `${process.env.WEB_HOST}/query/${updatedBdashQuery.id_hash}`,
    })
  )
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

export default putBdashQuery
