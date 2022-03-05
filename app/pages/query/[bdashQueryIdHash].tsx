import React, { memo, Suspense, useCallback, useMemo, useState } from "react"
import { Head, useQuery, useParam, BlitzPage, Link, useMutation, useRouter, dynamic } from "blitz"
import Layout from "app/core/layouts/Layout"
import getBdashQuery from "app/bdash-queries/queries/getBdashQuery"
import {
  Box,
  Heading,
  Flex,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Avatar,
  HStack,
  Text,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Textarea,
  Input,
  useToast,
  useClipboard,
  Spacer,
} from "@chakra-ui/react"
import { ChevronDownIcon, ChevronUpIcon, EditIcon, StarIcon } from "@chakra-ui/icons"
import { format } from "date-fns"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import updateBdashQuery from "app/bdash-queries/mutations/updateBdashQuery"
import deleteBdashQuery from "app/bdash-queries/mutations/deleteBdashQuery"
import { TextLinker } from "app/core/components/TextLinker"
import createFavorite from "app/favorites/mutations/createFavorite"
import deleteFavorite from "app/favorites/mutations/deleteFavorite"
import { ChartType } from "app/core/components/QueryResultChart"
import { ContentBox } from "app/core/components/ContentBox"
import { LoadingMain } from "app/core/components/LoadingMain"
import { SqlCodeBlock } from "app/core/components/SqlCodeBlock"
import { QueryResult } from "app/core/lib/QueryResult"
import { QueryResultSvgChart } from "app/core/components/QueryResultSvgChart"

// Avoid rendering chart on server side because plotly.js does not support SSR
const QueryResultChart = dynamic(() => import("app/core/components/QueryResultChart"), {
  ssr: false,
})

const MAX_DISPLAY_ROWS = 1000

export const BdashQuery = () => {
  const currentUser = useCurrentUser()
  const bdashQueryIdHash = useParam("bdashQueryIdHash", "string")
  const [bdashQueryResult] = useQuery(
    getBdashQuery,
    { idHash: bdashQueryIdHash },
    { cacheTime: 1000 }
  )
  const { bdashQuery, favorite: currentFav } = bdashQueryResult
  const {
    isOpen: isOpenEditModal,
    onOpen: onOpenEditModal,
    onClose: onCloseEditModal,
  } = useDisclosure()
  const [title, setTitle] = useState(bdashQuery.title)
  const [description, setDescription] = useState(bdashQuery.description)
  const [querySql, setQuerySql] = useState(bdashQuery.query_sql)
  const [editingTitle, setEditingTitle] = useState(bdashQuery.title)
  const [editingDescription, setEditingDescription] = useState(bdashQuery.description)
  const [editingQuerySql, setEditingQuerySql] = useState(bdashQuery.query_sql)
  const [updateBdashQueryMutation] = useMutation(updateBdashQuery)
  const [deleteBdashQueryMutation] = useMutation(deleteBdashQuery)
  const [createFavoriteMutation] = useMutation(createFavorite)
  const [deleteFavoriteMutation] = useMutation(deleteFavorite)
  const toast = useToast()
  const dataSourceInfo = parseDataSourceInfo(bdashQuery.data_source_info)
  const onClickEditSave = useCallback(async () => {
    if (currentUser === null) {
      return
    }
    try {
      await updateBdashQueryMutation({
        id: bdashQuery.id,
        title: editingTitle,
        description: editingDescription,
        query_sql: editingQuerySql,
      })
      setTitle(editingTitle)
      setDescription(editingDescription)
      setQuerySql(editingQuerySql)
      onCloseEditModal()
      toast({
        title: "Query updated.",
        status: "success",
        duration: 9000,
        isClosable: true,
      })
    } catch (error) {
      console.error(error)
      window.alert("Failed to update query")
    }
  }, [
    bdashQuery.id,
    currentUser,
    editingDescription,
    editingQuerySql,
    editingTitle,
    onCloseEditModal,
    toast,
    updateBdashQueryMutation,
  ])
  const router = useRouter()
  const onClickDelete = useCallback(async () => {
    if (window.confirm("Are you sure you want to delete this query?")) {
      try {
        await deleteBdashQueryMutation({ id: bdashQuery.id })
        router.push(`/${bdashQuery.user.name}`)
        toast({
          title: "Query deleted.",
          status: "success",
          duration: 9000,
          isClosable: true,
        })
      } catch (error) {
        console.error(error)
        window.alert("Failed to delete query")
      }
    }
  }, [bdashQuery.id, bdashQuery.user.name, deleteBdashQueryMutation, router, toast])
  const onClickEditCancel = useCallback(() => {
    onCloseEditModal()
  }, [onCloseEditModal])
  const onChangeEditTitle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTitle(e.target.value)
  }, [])
  const onChangeEditDescription = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditingDescription(e.target.value)
  }, [])
  const onChangeEditQuerySql = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditingQuerySql(e.target.value)
  }, [])

  const queryResult = useMemo(() => {
    if (bdashQuery.result === null) return null
    try {
      return JSON.parse(bdashQuery.result) as QueryResult
    } catch (err) {
      console.warn(err)
      return null
    }
  }, [bdashQuery.result])

  const [fav, setFav] = useState<boolean>(currentFav)
  const handleClickFav = useCallback(() => {
    if (bdashQueryIdHash === undefined) return

    if (fav === true) {
      setFav(false)
      deleteFavoriteMutation({ bdashQueryIdHash })
    } else {
      setFav(true)
      createFavoriteMutation({ bdashQueryIdHash })
    }
  }, [bdashQueryIdHash, createFavoriteMutation, deleteFavoriteMutation, fav])

  const chartConfig = useMemo(() => {
    return bdashQuery.chart_config !== null
      ? (JSON.parse(bdashQuery.chart_config) as ChartType)
      : null
  }, [bdashQuery.chart_config])

  return (
    <>
      <Head>
        <title>{title} | Bdash Server</title>
      </Head>

      <HStack spacing={1} marginBottom={2}>
        <Heading as="h2" size="lg" marginRight={2} minWidth="0">
          {title}
        </Heading>
        {bdashQuery.userId === currentUser?.id && (
          <IconButton
            onClick={onOpenEditModal}
            fontSize="2xl"
            aria-label="edit"
            icon={<EditIcon />}
          />
        )}
        <IconButton
          onClick={handleClickFav}
          fontSize="2xl"
          aria-label="favorite"
          icon={<StarIcon color={fav ? "yellow.500" : "gray.400"} />}
        />
      </HStack>
      <HStack marginBottom={4}>
        <Link href="/[userName]" as={`/${bdashQuery.user.name}`}>
          <a>
            <HStack>
              <Text>by</Text>
              <Avatar size="xs" src={bdashQuery.user.icon} />
              <Text>{bdashQuery.user.name}</Text>
            </HStack>
          </a>
        </Link>
        <Text fontSize="sm" color="gray.500">
          {format(bdashQuery.createdAt, "(yyyy-MM-dd)")}
        </Text>
      </HStack>

      {description && (
        <ContentBox mb={5}>
          <Box fontSize="md">
            <TextLinker text={description} />
          </Box>
        </ContentBox>
      )}

      <VStack spacing={10} align="stretch">
        <SqlSection querySql={querySql} />
        {chartConfig && chartConfig.yColumns.length > 0 && queryResult ? (
          <ChartSection queryResult={queryResult} chartConfig={chartConfig} />
        ) : bdashQuery.chart_svg ? (
          <SvgSection chartSvg={bdashQuery.chart_svg} />
        ) : null}
        {queryResult && <ResultSection queryResult={queryResult} />}
        {dataSourceInfo && <DataSourceInfoSection dataSourceInfo={dataSourceInfo} />}
      </VStack>

      <Modal size="4xl" isOpen={isOpenEditModal} onClose={onCloseEditModal}>
        <ModalOverlay />
        <ModalContent paddingBottom={10}>
          <ModalHeader>Edit</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Heading size="md" marginBottom={2}>
              Title
            </Heading>
            <Input
              value={editingTitle}
              onChange={onChangeEditTitle}
              placeholder="Title of this query"
              boxSizing="border-box"
              marginBottom={5}
            />
            <Heading size="md" marginBottom={2}>
              Description
            </Heading>
            <Textarea
              value={editingDescription}
              onChange={onChangeEditDescription}
              placeholder="Description of this query"
              boxSizing="border-box"
              minHeight={150}
              marginBottom={5}
            />
            <Heading size="md" marginBottom={2}>
              SQL
            </Heading>
            <Textarea
              value={editingQuerySql}
              onChange={onChangeEditQuerySql}
              placeholder="SELECT * FROM ..."
              boxSizing="border-box"
              minHeight={200}
            />
          </ModalBody>

          <ModalFooter>
            <Flex flex={1}>
              <Button colorScheme="red" mr={3} onClick={onClickDelete} alignSelf="flex-start">
                Delete
              </Button>
            </Flex>
            <Button colorScheme="teal" mr={3} onClick={onClickEditSave}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClickEditCancel}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

const SectionHeader: React.FC<{
  text: string
  isOpen?: boolean
  onToggle?: () => void
}> = ({ text, isOpen, onToggle }) => (
  <Heading
    id={text}
    as="h2"
    size="lg"
    backgroundColor="gray.100"
    paddingTop={2}
    paddingBottom={2}
    flexDirection="row"
    display="flex"
    alignItems="center"
  >
    <Flex
      alignItems="center"
      cursor={onToggle !== undefined ? "pointer" : "default"}
      onClick={onToggle}
    >
      {isOpen !== undefined ? isOpen ? <ChevronUpIcon /> : <ChevronDownIcon /> : null}
      {text}
    </Flex>
  </Heading>
)

const ResultSection = memo(({ queryResult }: { queryResult: QueryResult }) => {
  return (
    <Box>
      <SectionHeader text="Result" />
      <ContentBox>
        <Box
          borderColor="gray.300"
          borderWidth="1px"
          borderRadius="lg"
          overflowX="scroll"
          overflowY="hidden"
        >
          <Table variant="striped" size="sm" colorScheme="blackAlpha">
            <TableCaption placement="top">
              {queryResult.rows.length < MAX_DISPLAY_ROWS
                ? `${queryResult.rows.length} rows`
                : `Displaying ${MAX_DISPLAY_ROWS} of ${queryResult.rows.length} rows`}
            </TableCaption>
            <Thead>
              <Tr>
                {queryResult.columns.map((columnName) => (
                  <Th textTransform="none" key={columnName}>
                    {columnName}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {queryResult.rows.slice(0, MAX_DISPLAY_ROWS).map((row) => (
                <Tr key={row.join()}>
                  {row.map((column, i) => (
                    <Td key={`${column}_${i}`}>
                      <TextLinker text={String(column)} />
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </ContentBox>
    </Box>
  )
})

const SqlSection = memo(({ querySql }: { querySql: string }) => {
  const { hasCopied, onCopy } = useClipboard(querySql)
  return (
    <Box>
      <HStack>
        <SectionHeader text="SQL" />
        <Spacer />
        <Button size="sm" colorScheme="blue" onClick={onCopy}>
          {hasCopied ? "Copied" : "Copy"}
        </Button>
      </HStack>
      <ContentBox>
        <SqlCodeBlock sql={querySql} />
      </ContentBox>
    </Box>
  )
})

const SvgSection = memo(({ chartSvg }: { chartSvg: string }) => (
  <Box>
    <SectionHeader text="Chart" />
    <QueryResultSvgChart chartSvg={chartSvg} />
  </Box>
))

const ChartSection = memo(
  ({ queryResult, chartConfig }: { queryResult: QueryResult; chartConfig: ChartType }) => (
    <Box>
      <SectionHeader text="Chart" />
      <QueryResultChart queryResult={queryResult} chartConfig={chartConfig} />
    </Box>
  )
)

const DataSourceInfoSection = memo(
  ({ dataSourceInfo }: { dataSourceInfo: Record<string, string> }) => {
    return (
      <Box>
        <SectionHeader text="Data Source" />
        <ContentBox>
          <Table>
            <Tbody>
              {Object.keys(dataSourceInfo).map((key) => {
                return (
                  <Tr key={key}>
                    <Th>{key}</Th>
                    <Td>{dataSourceInfo[key]}</Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </ContentBox>
      </Box>
    )
  }
)

const ShowBdashQueryPage: BlitzPage = () => {
  return (
    <Suspense fallback={<LoadingMain />}>
      <BdashQuery />
    </Suspense>
  )
}

function parseDataSourceInfo(jsonString: string | null): Record<string, string> | null {
  if (jsonString === null) return null

  try {
    return JSON.parse(jsonString)
  } catch {
    return null
  }
}

// To avoid treating this as a static page. Plotly.js can be loaded only on browser, so rendering is always failed in build time.
export async function getServerSideProps() {
  return {
    props: {},
  }
}

ShowBdashQueryPage.authenticate = true
ShowBdashQueryPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowBdashQueryPage
