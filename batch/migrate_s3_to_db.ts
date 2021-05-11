import db from "../db"
import { downloadResultTSV } from "../app/core/lib/s3"
import { convertTsvToQueryResult } from "../app/core/lib/QueryResult"
;(async () => {
  const queries = await db.bdashQuery.findMany({ select: { id: true, id_hash: true } })
  for (const query of queries) {
    const data = await downloadResultTSV(query.id_hash)
    const tsv = data.Body?.toString()
    if (!tsv) continue
    const result = convertTsvToQueryResult(tsv)
    await db.bdashQuery.update({
      data: { result: result ? JSON.stringify(result) : null },
      where: { id: query.id },
    })
  }
  process.exit()
})().catch((err) => {
  console.log(err)
})
