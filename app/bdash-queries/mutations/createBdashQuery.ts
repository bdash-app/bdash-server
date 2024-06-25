import { resolver } from "blitz"
import { createHash } from "crypto"
import db, { Prisma } from "db"
import * as z from "zod"

const CreateBdashQuery = z.object({
  title: z.string().optional(),
  querySql: z.string().optional(),
  queryResult: z.object({
    columns: z.array(z.string()),
    rows: z.array(z.array(z.union([z.string(), z.number()]))),
  }),
  chart: z
    .object({
      type: z.string(),
      xColumn: z.string(),
      yColumns: z.array(z.string()),
      groupColumns: z.array(z.string()),
      stacking: z.union([z.literal(0), z.string()]),
    })
    .optional(),
  dataSource: z.object({
    type: z.string(),
    host: z.string(),
    port: z.union([z.string(), z.number()]),
    username: z.string(),
    database: z.string(),
  }),
})

export default resolver.pipe(
  resolver.zod(CreateBdashQuery),
  resolver.authorize(),
  async (data, { session: { userId } }) => {
    const currentDate = new Date().toString()
    const random = Math.random().toString()
    const idHash = createHash("md5").update(`${userId}_${currentDate}_${random}`).digest("hex")

    const params: Prisma.BdashQueryCreateArgs["data"] = {
      id_hash: idHash,
      userId: userId,
      title: data.title ?? "New Query",
      description: "",
      query_sql: data.querySql ?? "",
      data_source_info: JSON.stringify({
        type: data.dataSource.type,
        host: data.dataSource.host,
        port: data.dataSource.port,
        username: data.dataSource.username,
        database: data.dataSource.database,
      }),
      chart_config: data.chart ? JSON.stringify(data.chart) : null,
      result: JSON.stringify(data.queryResult),
    }
    const bdashQuery = await db.bdashQuery.create({ data: params, select: { id_hash: true } })
    return bdashQuery
  }
)
