import { Box, Table, TableCaption, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/react"
import { memo } from "react"
import { QueryResult } from "types"
import { ContentBox } from "./ContentBox"
import { TextLinker } from "./TextLinker"

export const QueryResultTable = memo(
  ({ queryResult, maxDisplayRows }: { queryResult: QueryResult; maxDisplayRows: number }) => {
    return (
      <ContentBox>
        <Box
          borderColor="gray.300"
          borderWidth="1px"
          borderRadius="lg"
          overflowX="scroll"
          overflowY="auto"
          maxHeight="500px"
        >
          <Table variant="striped" size="sm" colorScheme="blackAlpha">
            <TableCaption placement="top">
              {queryResult.rows.length < maxDisplayRows
                ? `${queryResult.rows.length} rows`
                : `Displaying ${maxDisplayRows} of ${queryResult.rows.length} rows`}
            </TableCaption>
            <Thead position="sticky" top={0} bgColor="white">
              <Tr>
                {queryResult.columns.map((columnName) => (
                  <Th textTransform="none" key={columnName}>
                    {columnName}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {queryResult.rows.slice(0, maxDisplayRows).map((row) => (
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
    )
  }
)
