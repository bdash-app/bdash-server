import db from "../db"
import { downloadResultTSV } from "../app/core/lib/s3"
;(async () => {
  const queries = await db.bdashQuery.findMany({ select: { id: true, id_hash: true } })
  for (const query of queries) {
    const data = await downloadResultTSV(query.id_hash)
    const tsv = data.Body?.toString()
    if (!tsv) continue
    await db.bdashQuery.update({
      data: { result: tsv },
      where: { id: query.id },
    })
  }
  process.exit()
})().catch((err) => {
  console.log(err)
})
