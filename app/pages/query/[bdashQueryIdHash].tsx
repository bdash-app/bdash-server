import React, { memo, Suspense, useCallback, useEffect, useMemo, useState } from "react"
import { Head, useQuery, useParam, BlitzPage, Link, useMutation, useRouter } from "blitz"
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
  Spinner,
} from "@chakra-ui/react"
import { ChevronDownIcon, ChevronUpIcon, EditIcon } from "@chakra-ui/icons"
import SyntaxHighlighter from "react-syntax-highlighter"
import { a11yLight } from "react-syntax-highlighter/dist/cjs/styles/hljs"
import { format } from "date-fns"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import updateBdashQuery from "app/bdash-queries/mutations/updateBdashQuery"
import deleteBdashQuery from "app/bdash-queries/mutations/deleteBdashQuery"
import { TextLinker } from "app/core/components/TextLinker"

const MAX_DISPLAY_ROWS = 1000

export const BdashQuery = () => {
  const currentUser = useCurrentUser()
  const bdashQueryIdHash = useParam("bdashQueryIdHash", "string")
  const [bdashQuery] = useQuery(getBdashQuery, { idHash: bdashQueryIdHash })
  const {
    isOpen: isOpenEditModal,
    onOpen: onOpenEditModal,
    onClose: onCloseEditModal,
  } = useDisclosure()
  const [title, setTitle] = useState(bdashQuery.title)
  const [description, setDescription] = useState(bdashQuery.description)
  const [editingTitle, setEditingTitle] = useState(bdashQuery.title)
  const [editingDescription, setEditingDescription] = useState(bdashQuery.description)
  const [updateBdashQueryMutation] = useMutation(updateBdashQuery)
  const [deleteBdashQueryMutation] = useMutation(deleteBdashQuery)
  const toast = useToast()
  const [isLoadingResultTSV, setIsLoadingResultTSV] = useState(false)
  const [resultTSV, setResultTSV] = useState("")
  useEffect(() => {
    const f = async () => {
      setIsLoadingResultTSV(true)
      const res = await fetch(`/api/bdash-query/${bdashQueryIdHash}/result`)
      setIsLoadingResultTSV(false)
      if (res.ok) {
        const tsv = await res.text()
        setResultTSV(tsv)
      } else {
        toast({
          title: "Failed to retrieve result table data.",
          status: "error",
        })
      }
    }
    f()
  }, [bdashQueryIdHash, toast])
  const onClickEditSave = useCallback(async () => {
    if (currentUser === null) {
      return
    }
    try {
      await updateBdashQueryMutation({
        id: bdashQuery.id,
        title: editingTitle,
        description: editingDescription,
      })
      setTitle(editingTitle)
      setDescription(editingDescription)
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
        router.push(`/user/${bdashQuery.userId}`)
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
  }, [bdashQuery.id, bdashQuery.userId, deleteBdashQueryMutation, router, toast])
  const onClickEditCancel = useCallback(() => {
    onCloseEditModal()
  }, [onCloseEditModal])
  const onChangeEditTitle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setEditingTitle(title)
  }, [])
  const onChangeEditDescription = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const description = e.target.value
    setEditingDescription(description)
  }, [])

  const resultTsvRows = useMemo(() => resultTSV.split("\n").map((row) => row.split("\t")), [
    resultTSV,
  ])
  const headerRow = useMemo(() => resultTsvRows.shift() || [], [resultTsvRows])

  return (
    <>
      <Head>
        <title>{title} | Bdash Server</title>
      </Head>

      <Heading as="h2" size="lg" marginBottom={2}>
        {title}
        {bdashQuery.userId === currentUser?.id && (
          <IconButton
            onClick={onOpenEditModal}
            marginLeft={3}
            fontSize="2xl"
            aria-label="edit"
            icon={<EditIcon />}
          />
        )}
      </Heading>
      <HStack marginBottom={4}>
        <Link href="/user/[userId]" as={`/user/${bdashQuery.user.id}`}>
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

      <Box bg="white" pl={10} pr={10} pt={5} pb={5} mb={5} borderRadius="xl">
        {description ? (
          <Box fontSize="md">
            <pre>
              <TextLinker text={description} />
            </pre>
          </Box>
        ) : (
          <Text fontSize="sm" color="gray.500">
            No description
          </Text>
        )}
      </Box>

      <VStack spacing={10} align="stretch">
        <SqlSection querySql={bdashQuery.query_sql} />
        {bdashQuery.chart_svg && <SvgSection chartSvg={bdashQuery.chart_svg} />}
        <ResultSection
          headerRow={headerRow}
          resultTsvRows={resultTsvRows}
          isLoading={isLoadingResultTSV}
        />
      </VStack>

      <Modal size="xl" isOpen={isOpenEditModal} onClose={onCloseEditModal}>
        <ModalOverlay />
        <ModalContent>
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
    paddingLeft={2}
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

const ResultSection = memo(
  ({
    headerRow,
    resultTsvRows,
    isLoading,
  }: {
    headerRow: string[]
    resultTsvRows: string[][]
    isLoading: boolean
  }) => {
    return (
      <Box>
        <SectionHeader text="Result" />
        <Box bg="white" pl={10} pr={10} pt={10} pb={5} borderRadius="xl">
          <Box
            borderColor="gray.300"
            borderWidth="1px"
            borderRadius="lg"
            overflowX="scroll"
            overflowY="hidden"
          >
            {isLoading ? (
              <Spinner color="teal" />
            ) : (
              <Table variant="striped" size="sm" colorScheme="blackAlpha">
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
                      {row.map((column, i) => (
                        <Td key={`${column}_${i}`}>{column}</Td>
                      ))}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </Box>
        </Box>
      </Box>
    )
  }
)

const SqlSection = memo(({ querySql }: { querySql: string }) => (
  <Box>
    <SectionHeader text="SQL" />
    <Box bg="white" pl={10} pr={10} pt={5} pb={10} borderRadius="xl">
      <Box borderColor="gray.300" borderWidth="1px" overflow="hidden" marginTop={4}>
        <SyntaxHighlighter
          language="sql"
          style={a11yLight}
          customStyle={{ backgroundColor: "white" }}
        >
          {querySql}
        </SyntaxHighlighter>
      </Box>
    </Box>
  </Box>
))

const SvgSection = memo(({ chartSvg }: { chartSvg: string }) => (
  <Box>
    <SectionHeader text="Chart" />
    <Box bg="white" pl={10} pr={10} pt={5} pb={5} borderRadius="xl">
      <div dangerouslySetInnerHTML={{ __html: chartSvg }} />
    </Box>
  </Box>
))

const ShowBdashQueryPage: BlitzPage = () => {
  return (
    <Suspense fallback={<Spinner color="teal" />}>
      <BdashQuery />
    </Suspense>
  )
}

ShowBdashQueryPage.authenticate = true
ShowBdashQueryPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowBdashQueryPage
