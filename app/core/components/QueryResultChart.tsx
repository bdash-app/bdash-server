import React, { useEffect, useRef } from "react"
import Chart from "../lib/Chart"
import { QueryResult } from "../lib/QueryResult"
import { ContentBox } from "./ContentBox"

type Props = {
  queryResult: QueryResult
  chartConfig: ChartType
}

const QueryResultChart: React.FC<Props> = ({ queryResult, chartConfig }) => {
  const chartRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    drawChart(queryResult, chartConfig, chartRef)
  }, [chartConfig, queryResult])
  return (
    <ContentBox>
      <div ref={chartRef} />
    </ContentBox>
  )
}

export type ChartType = {
  readonly id: number
  readonly queryId: number
  readonly type: "line" | "scatter" | "bar" | "area" | "pie"
  readonly xColumn: string
  readonly yColumns: Array<string>
  readonly groupColumns: Array<string>
  readonly stacking: 0 | string
  readonly updatedAt: string
  readonly createdAt: string
}

const drawChart = async (
  queryResult: QueryResult,
  chartConfig: ChartType,
  targetElement: React.RefObject<HTMLDivElement>
): Promise<void> => {
  if (targetElement.current === null) return

  const params = {
    type: chartConfig.type,
    x: chartConfig.xColumn,
    y: chartConfig.yColumns,
    stacking: chartConfig.stacking,
    groupBy: chartConfig.groupColumns,
    rows: queryResult.rows.map((row) =>
      row.map((value) => (typeof value === "string" ? value : Number(value)))
    ),
    fields: queryResult.columns,
  }

  await new Chart(params).drawTo(targetElement.current)
}

export default QueryResultChart
