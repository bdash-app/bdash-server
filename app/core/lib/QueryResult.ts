import Papa from "papaparse"

type QueryResultValue = string | number | boolean | null

export type QueryResult = {
  columns: string[]
  rows: QueryResultValue[][]
}

export function convertTsvToQueryResult(tsv: string): QueryResult | null {
  const { data } = Papa.parse(tsv.trim(), { delimiter: "\t" })
  const columns = data.shift()

  if (!Array.isArray(columns)) return null

  return {
    columns: columns.map(String),
    rows: data as QueryResultValue[][],
  }
}
