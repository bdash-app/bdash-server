// Copied and modified from https://github.com/bdash-app/bdash/blob/2a89a68b68804f71f8e60611f22850edeb8c9257/src/renderer/components/QueryResultChart/QueryResultChart.tsx
import React, { useEffect, useRef, useState, useCallback } from "react"
import { Box, Flex, Text } from "@chakra-ui/react"
import { Select } from "chakra-react-select"
import Chart from "app/core/lib/Chart"
import { ChartType, QueryResult } from "types"

type OptionType = {
  label: string
  value: string
}

const QueryResultChartEdit = ({
  query,
  chart: initialChart,
  onChangeChart,
}: {
  query: QueryResult
  chart?: ChartType
  onChangeChart: (chart: ChartType) => void
}) => {
  const chartElement = useRef<HTMLDivElement | null>(null)
  const [chart, setChart] = useState<ChartType | undefined>(
    initialChart ?? {
      type: "line",
      xColumn: "",
      yColumns: [],
      stacking: 0,
      groupColumns: [],
    }
  )

  const drawChart = useCallback(async () => {
    if (!query || !chart || !chartElement.current) return

    const params = {
      type: chart.type,
      x: chart.xColumn,
      y: chart.yColumns,
      stacking: chart.stacking,
      groupBy: chart.groupColumns,
      rows: query.rows,
      fields: query.columns,
    }

    await new Chart(params).drawTo(chartElement.current)
  }, [query, chart])

  useEffect(() => {
    drawChart()
  }, [drawChart])

  const update = (params: Partial<ChartType>) => {
    if (chart) {
      const newValue = { ...chart, ...params }
      setChart(newValue)
      onChangeChart?.(newValue)
    }
  }

  const handleSelectType = (option: OptionType) => {
    update({ type: option.value } as Partial<ChartType>)
  }

  const handleChangeX = (option: OptionType) => {
    update({ xColumn: option ? option.value : null } as Partial<ChartType>)
  }

  const handleChangeY = (options: OptionType[]) => {
    update({ yColumns: options ? options.map((o) => o.value) : [] })
  }

  const handleSelectStacking = (option: OptionType) => {
    update({ stacking: option.value } as Partial<ChartType>)
  }

  const handleChangeGroup = (options: OptionType[]) => {
    update({
      groupColumns: options ? options.map((o) => o.value) : [],
    })
  }

  if (!query.columns || !chart) return null

  const options = ["line", "scatter", "bar", "area", "pie"].map((value) => ({
    value,
    label: value[0].toUpperCase() + value.slice(1),
  }))
  const currentOption = options.find((option) => option.value === chart.type)
  const fieldOptions = query.columns.map((name) => ({
    value: name,
    label: name,
  }))
  const currentXColumnFieldOption = fieldOptions.find((option) => option.value === chart.xColumn)
  const currentYColumnFieldOptions = fieldOptions.filter((option) =>
    chart.yColumns.includes(option.value)
  )
  const currentGroupOptions = fieldOptions.filter((option) =>
    chart.groupColumns.includes(option.value)
  )
  const stackingOptions = ["disable", "enable", "percent"].map((o) => ({
    label: o,
    value: o,
  }))
  const currentStackingOption = stackingOptions.find((option) => option.value === chart.stacking)

  return (
    <Flex p={2}>
      <Box pr={4}>
        <Box mb={4}>
          <Text fontSize="12px" fontWeight="bold" color="#666" mb={1}>
            Chart Type
          </Text>
          <Select
            value={currentOption}
            options={options}
            onChange={(option) => handleSelectType(option as OptionType)}
          />
        </Box>
        <Box mb={4}>
          <Text fontSize="12px" fontWeight="bold" color="#666" mb={1}>
            {chart.type === "pie" ? "Label Column" : "X Column"}
          </Text>
          <Select
            value={currentXColumnFieldOption}
            options={fieldOptions}
            onChange={(option) => handleChangeX(option as OptionType)}
            isClearable
          />
        </Box>
        <Box mb={4}>
          <Text fontSize="12px" fontWeight="bold" color="#666" mb={1}>
            {chart.type === "pie" ? "Value Column" : "Y Column"}
          </Text>
          <Select
            isMulti
            value={currentYColumnFieldOptions}
            options={fieldOptions}
            onChange={(options) => handleChangeY(options as OptionType[])}
            isClearable
          />
        </Box>
        <Box mb={4} hidden={chart.type !== "bar"}>
          <Text fontSize="12px" fontWeight="bold" color="#666" mb={1}>
            Stacking
          </Text>
          <Select
            value={currentStackingOption}
            options={stackingOptions}
            onChange={(option) => handleSelectStacking(option as OptionType)}
            isClearable
          />
        </Box>
        <Box mb={4} hidden={chart.type === "pie"}>
          <Text fontSize="12px" fontWeight="bold" color="#666" mb={1}>
            Group By
          </Text>
          <Select
            isMulti
            value={currentGroupOptions}
            options={fieldOptions}
            onChange={(options) => handleChangeGroup(options as OptionType[])}
            isClearable
          />
        </Box>
      </Box>
      <Box w="0">
        <div ref={chartElement} />
      </Box>
    </Flex>
  )
}

export default QueryResultChartEdit
