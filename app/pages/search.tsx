import React, { Suspense, useEffect, useState } from "react"
import { Head, BlitzPage, useRouterQuery } from "blitz"
import Layout from "app/core/layouts/Layout"
import { Box, Heading, Spinner, useToast } from "@chakra-ui/react"
import { BdashQueryList } from "../core/components/BdashQueryList"
import { SearchBdashQueryResponse } from "app/api/bdash-query/search"

export const SearchResult = () => {
  const query = useRouterQuery()
  const keyword = query["q"]?.toString() || ""
  const [isLoading, setIsLoading] = useState(false)
  const [bdashQueries, setBdashQueries] = useState<SearchBdashQueryResponse>([])
  const toast = useToast()

  useEffect(() => {
    const f = async () => {
      if (keyword.length > 0) {
        setIsLoading(true)
        try {
          const res = await fetch(`/api/bdash-query/search?q=${keyword}`)
          if (res.ok) {
            const bdashQueries = await res.json()
            bdashQueries.forEach((query) => {
              query.createdAt = new Date(query.createdAt)
              query.updatedAt = new Date(query.updatedAt)
            })
            setBdashQueries(bdashQueries)
          } else {
            toast({
              title: "Failed to retrieve result table data.",
              status: "error",
            })
          }
        } catch (error) {
          console.error(error)
          toast({
            title: "Failed to retrieve result table data.",
            status: "error",
          })
        } finally {
          setIsLoading(false)
        }
      }
    }
    f()
  }, [keyword, toast])

  return (
    <>
      <Head>
        <title>{`Search - ${keyword} | Bdash Server`}</title>
      </Head>

      <Box bg="white" pl={10} pr={10} pt={5} pb={5} borderRadius="xl">
        <Heading as="h2" size="lg" marginBottom={4}>
          {`${bdashQueries.length} results for "${keyword}"`}
        </Heading>
        {isLoading ? <Spinner color="teal" /> : <BdashQueryList queries={bdashQueries} />}
      </Box>
    </>
  )
}

const SearchResultPage: BlitzPage = () => {
  return (
    <Suspense fallback={<Spinner color="teal" />}>
      <SearchResult />
    </Suspense>
  )
}

SearchResultPage.authenticate = true
SearchResultPage.getLayout = (page) => <Layout>{page}</Layout>

export default SearchResultPage
