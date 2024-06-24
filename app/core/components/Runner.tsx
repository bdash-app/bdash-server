import {
  Box,
  Button,
  FormControl,
  FormLabel,
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
import executeQuery from "app/bdash-queries/mutations/executeQuery"
import { useMutation } from "blitz"
import { useEffect, useRef, useState } from "react"
import { QueryResult } from "types"
import { getDataSources, RunnerDataSource } from "../lib/dataSourceStorage"
import { QueryResultTable } from "./QueryResultTable"
import { RunnerDataSourceModal } from "./RunnerDataSourceModal"

const MAX_DISPLAY_ROWS = 1000

export const Runner = () => {
  const [dataSources, setDataSources] = useState<RunnerDataSource[]>([])
  const [selectedDataSource, setSelectedDataSource] = useState<RunnerDataSource | null>(null)
  useEffect(() => {
    setDataSources(getDataSources())
    dataSources[0] ? dataSources[0].encryptedBody : undefined
  }, [])

  const [queryResult, setQueryResult] = useState<QueryResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [executeQueryMutation] = useMutation(executeQuery)
  const [isQueryEmpty, setIsQueryEmpty] = useState(true)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const isExecutable = !isQueryEmpty && selectedDataSource !== null
  const onChangeQuery = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIsQueryEmpty(event.target.value.length === 0)
  }
  const onClickExecute = async () => {
    const currentQuery = textAreaRef.current?.value
    if (currentQuery === undefined || currentQuery.length === 0 || selectedDataSource === null)
      return
    setIsRunning(true)
    const result = await executeQueryMutation({
      body: currentQuery,
      dataSource: selectedDataSource,
    })
    console.log("🔥", JSON.stringify(result, null, 2))
    setIsRunning(false)
    setQueryResult(result)
  }

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
  }

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
                {dataSource.name}
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
          />
          {queryResult === null ? (
            <Button
              colorScheme="teal"
              isLoading={isRunning}
              isDisabled={!isExecutable}
              mr={3}
              onClick={onClickExecute}
            >
              Run
            </Button>
          ) : (
            <HStack gap="2">
              <Button
                colorScheme="teal"
                isLoading={isRunning}
                isDisabled={!isExecutable}
                onClick={onClickExecute}
              >
                Re-run
              </Button>
              <Button colorScheme="teal" variant="outline" onClick={() => setQueryResult(null)}>
                Save
              </Button>
            </HStack>
          )}
        </VStack>
        {queryResult && (
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
                  {queryResult.error ? (
                    <Text color="red">{queryResult.error}</Text>
                  ) : (
                    <QueryResultTable queryResult={queryResult} maxDisplayRows={MAX_DISPLAY_ROWS} />
                  )}
                </TabPanel>
                <TabPanel>
                  <p>WIP</p>
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
