import { decryptText } from "app/core/lib/crypto"
import { resolver } from "blitz"
import pg from "pg"
import { QueryResult, RunnerDataSourceFormValue } from "types"
import * as z from "zod"

const ExecuteQuery = z.object({
  body: z.string().min(1),
  dataSource: z.object({
    encryptedBody: z.string(),
  }),
})

export default resolver.pipe(
  resolver.zod(ExecuteQuery),
  resolver.authorize(),
  async ({ body, dataSource }): Promise<QueryResult> => {
    const privateKey: JsonWebKey = JSON.parse(process.env.PRIVATE_KEY_JWK!)
    const decrypted: RunnerDataSourceFormValue = JSON.parse(
      await decryptText(dataSource.encryptedBody, privateKey)
    )
    if (decrypted.type == "postgres") {
      const client = new pg.Client({
        host: decrypted.host,
        port: decrypted.port,
        user: decrypted.username,
        password: decrypted.password,
        database: decrypted.database,
        ssl: decrypted.ssl ? { rejectUnauthorized: false } : undefined,
      })
      await client.connect()
      try {
        const result = await client.query({ text: body, rowMode: "array" })
        const { rows, fields } = result
        return { columns: fields.map((f) => f.name), rows, error: null }
      } catch (error) {
        return { columns: [], rows: [], error: error.message }
      } finally {
        client.end()
      }
    } else {
      return { columns: [], rows: [], error: `Unsupported data source type: ${decrypted.type}` }
    }
  }
)
