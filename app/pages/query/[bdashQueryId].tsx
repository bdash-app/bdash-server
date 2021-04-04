import React, { Suspense } from "react"
import { Head, useQuery, useParam, BlitzPage, Link } from "blitz"
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
} from "@chakra-ui/react"
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons"
import SyntaxHighlighter from "react-syntax-highlighter"
import { a11yLight } from "react-syntax-highlighter/dist/cjs/styles/hljs"

const MAX_DISPLAY_ROWS = 1000

export const BdashQuery = () => {
  const bdashQueryId = useParam("bdashQueryId", "number")
  const [bdashQuery] = useQuery(getBdashQuery, { id: bdashQueryId })

  const resultTsvRows = bdashQuery.result_tsv.split("\n").map((row) => row.split("\t"))
  const headerRow = resultTsvRows.shift()

  return (
    <>
      <Head>
        <title>{bdashQuery.title} | Bdash Server</title>
      </Head>

      <Box bg="white" pl={10} pr={10} pt={5} pb={5} borderRadius="xl">
        <Heading as="h2" size="lg" marginBottom={2}>
          {bdashQuery.title}
        </Heading>
        <Link href="/users/[userId]" as={`/users/${bdashQuery.user.id}`}>
          <a>
            <HStack marginBottom={4}>
              <Avatar size="xs" src={bdashQuery.user.icon} />
              <Text>{bdashQuery.user.name}</Text>
            </HStack>
          </a>
        </Link>
        <VStack spacing={10} align="stretch">
          <Box>
            <SectionHeader text="SQL" />
            <Box
              borderColor="gray.300"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              paddingLeft={4}
              marginTop={4}
            >
              <SyntaxHighlighter language="sql" style={a11yLight}>
                {bdashQuery.query_sql}
              </SyntaxHighlighter>
            </Box>
          </Box>

          {bdashQuery.chart_svg && (
            <Box>
              <SectionHeader text="Chart" />
              <Box
                borderColor="gray.300"
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                paddingLeft={4}
                marginTop={4}
              >
                <div dangerouslySetInnerHTML={{ __html: bdashQuery.chart_svg }} />
              </Box>
            </Box>
          )}

          <Box>
            <SectionHeader text="Result" />
            <Box
              borderColor="gray.300"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              paddingLeft={4}
              marginTop={4}
            >
              <Table variant="simple" size="sm">
                <TableCaption placement="top">
                  {resultTsvRows.length < MAX_DISPLAY_ROWS
                    ? `${resultTsvRows.length} rows`
                    : `Displaying ${MAX_DISPLAY_ROWS} of ${resultTsvRows.length} rows`}
                </TableCaption>
                <Thead>
                  <Tr>
                    {headerRow?.map((columnName) => (
                      <Th key={columnName}>{columnName}</Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {resultTsvRows.slice(0, MAX_DISPLAY_ROWS).map((row) => (
                    <Tr key={row.join()}>
                      {row.map((column) => (
                        <Td key={column}>{column}</Td>
                      ))}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Box>
        </VStack>
      </Box>
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
    paddingLeft={2}
    borderLeftColor="teal.400"
    borderLeftWidth={5}
    borderLeftStyle="solid"
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

const ShowBdashQueryPage: BlitzPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BdashQuery />
    </Suspense>
  )
}

ShowBdashQueryPage.authenticate = true
ShowBdashQueryPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowBdashQueryPage
