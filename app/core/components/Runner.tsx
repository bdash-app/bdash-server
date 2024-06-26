import {
  Box,
  Button,
  Heading,
  HStack,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import createBdashQuery from "app/bdash-queries/mutations/createBdashQuery"
import executeQuery from "app/bdash-queries/mutations/executeQuery"
import { dynamic, useMutation } from "blitz"
import { useCallback, useEffect, useRef, useState } from "react"
import { ChartType } from "types"
import { getDataSources, RunnerDataSource } from "../lib/dataSourceStorage"
import { QueryResultTable } from "./QueryResultTable"
import { RunnerDataSourceModal } from "./RunnerDataSourceModal"
import { RunnerShareModal } from "./RunnerShareModal"

// Avoid rendering chart on server side because plotly.js does not support SSR
const QueryResultChartEdit = dynamic(
  () => import("app/core/components/QueryResultChartEdit/QueryResultChartEdit"),
  {
    ssr: false,
  }
)

const MAX_DISPLAY_ROWS = 1000

export const Runner = () => {
  const [dataSources, setDataSources] = useState<RunnerDataSource[]>([])
  const [selectedDataSource, setSelectedDataSource] = useState<RunnerDataSource | null>(null)
  useEffect(() => {
    const newDataSources = getDataSources()
    setDataSources(newDataSources)
    if (newDataSources[0]) {
      setSelectedDataSource(newDataSources[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [executeQueryMutation, { isLoading, data }] = useMutation(executeQuery)
  const [isQueryEmpty, setIsQueryEmpty] = useState(true)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const isExecutable = !isQueryEmpty && selectedDataSource !== null
  const onChangeQuery = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIsQueryEmpty(event.target.value.length === 0)
  }
  const onClickExecute = useCallback(async () => {
    const currentQuery = textAreaRef.current?.value
    if (
      isLoading ||
      currentQuery === undefined ||
      currentQuery.length === 0 ||
      selectedDataSource === null
    )
      return
    await executeQueryMutation({
      body: currentQuery,
      dataSource: selectedDataSource,
    })
  }, [executeQueryMutation, isLoading, selectedDataSource])

  useEffect(() => {
    const handleKeyDown = (event) => {
      const isCommandEnter = event.metaKey && event.key === "Enter"
      const isCtrlEnter = event.ctrlKey && event.key === "Enter"

      if (isCommandEnter || isCtrlEnter) {
        event.preventDefault()
        onClickExecute()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClickExecute])

  const { isOpen, onOpen, onClose } = useDisclosure()

  const addDataSourceSelectValue = "add"
  const onSelectDataSource = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === addDataSourceSelectValue) {
      onOpen()
      return
    }
    const selectedDataSource = dataSources.find(
      (dataSource) => dataSource.encryptedBody === event.target.value
    )
    selectedDataSource && setSelectedDataSource(selectedDataSource)
  }
  const onAddDataSource = (addedDataSource: RunnerDataSource) => {
    setDataSources(getDataSources())
    setSelectedDataSource(addedDataSource)
    onClose()
  }

  const currentChart = useRef<ChartType | undefined>(undefined)
  const onChangeChart = (chart: ChartType) => {
    currentChart.current = chart
  }

  const [createQueryMutation, { isLoading: isSharing }] = useMutation(createBdashQuery)
  const onClickShare = useCallback(
    async (title: string) => {
      if (!data || !textAreaRef.current || !selectedDataSource) return
      const res = await createQueryMutation({
        title,
        querySql: textAreaRef.current.value,
        queryResult: data,
        chart: currentChart.current,
        dataSource: selectedDataSource,
      })
      window.location.href = `/query/${res.id_hash}`
    },
    [createQueryMutation, data, selectedDataSource]
  )

  return (
    <VStack align="flex-start">
      <Heading as="h2" size="lg" mb="2">
        Runner
      </Heading>
      <VStack w="100%" align="flex-start" gap="2">
        <Box alignSelf="stretch">
          <Heading as="h3" size="sm" mb="2">
            Data Source
          </Heading>
          <Select
            variant="outline"
            backgroundColor="white"
            value={selectedDataSource ? selectedDataSource.encryptedBody : undefined}
            placeholder="Select data source"
            onChange={onSelectDataSource}
          >
            {dataSources.map((dataSource) => (
              <option key={dataSource.encryptedBody} value={dataSource.encryptedBody}>
                {dataSource.dataSourceName}
              </option>
            ))}
            <option key={addDataSourceSelectValue} value={addDataSourceSelectValue}>
              + Add new data source
            </option>
          </Select>
        </Box>
        <VStack alignSelf="stretch" alignItems="flex-start" gap="1">
          <Heading as="h3" size="sm">
            Query
          </Heading>
          <Textarea
            ref={textAreaRef}
            placeholder="SELECT * from your_table..."
            backgroundColor="white"
            onChange={onChangeQuery}
            minHeight="30vh"
          />
          {data === undefined ? (
            <HStack>
              <Button
                colorScheme="teal"
                isLoading={isLoading}
                isDisabled={!isExecutable}
                mr={3}
                onClick={onClickExecute}
              >
                Run
              </Button>
            </HStack>
          ) : (
            <HStack gap="2">
              <Button
                colorScheme="teal"
                isLoading={isLoading}
                isDisabled={!isExecutable}
                onClick={onClickExecute}
              >
                Re-run
              </Button>
              <RunnerShareModal
                modalTitle="Share on Bdash Server"
                openButtonLabel="Share"
                primaryButtonLabel="Share"
                onClickPrimaryButton={onClickShare}
                textFieldLabel="Title"
                textFieldPlaceholder="New Query"
                initialText="New Query"
                isLoading={isSharing}
              />
            </HStack>
          )}
        </VStack>
        {data && (
          <Box mt={4} alignSelf="stretch">
            <Heading as="h3" size="sm" mb="2">
              Result
            </Heading>
            <Tabs backgroundColor="white" borderRadius="lg">
              <TabList>
                <Tab>Table</Tab>
                <Tab>Chart</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  {data.error ? (
                    <Text color="red">{data.error}</Text>
                  ) : (
                    <QueryResultTable queryResult={data} maxDisplayRows={MAX_DISPLAY_ROWS} />
                  )}
                </TabPanel>
                <TabPanel>
                  <QueryResultChartEdit query={data} onChangeChart={onChangeChart} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        )}
      </VStack>
      <RunnerDataSourceModal isOpen={isOpen} onClose={onClose} onAddDataSource={onAddDataSource} />
    </VStack>
  )
}
