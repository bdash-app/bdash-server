import Papa from "papaparse"
import { QueryResultValue, QueryResult } from "types"

export function convertTsvToQueryResult(tsv: string): QueryResult | null {
  const { data } = Papa.parse(tsv.trim(), { delimiter: "\t" })
  const columns = data.shift()

  if (!Array.isArray(columns)) return null

  return {
    columns: columns.map(String),
    rows: data as QueryResultValue[][],
    error: null,
  }
}
