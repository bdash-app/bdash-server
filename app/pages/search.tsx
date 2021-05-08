import React, { Suspense, useEffect, useState } from "react"
import { Head, BlitzPage, useRouterQuery } from "blitz"
import Layout from "app/core/layouts/Layout"
import { Heading, useToast } from "@chakra-ui/react"
import { BdashQueryList } from "../core/components/BdashQueryList"
import { SearchBdashQueryResponse } from "app/api/bdash-query/search"
import { ContentBox } from "app/core/components/ContentBox"
import { LoadingMain } from "app/core/components/LoadingMain"

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

      <ContentBox>
        <Heading as="h2" size="lg" marginBottom={4}>
          {`${bdashQueries.length} results for "${keyword}"`}
        </Heading>
        {isLoading ? <LoadingMain /> : <BdashQueryList queries={bdashQueries} />}
      </ContentBox>
    </>
  )
}

const SearchResultPage: BlitzPage = () => {
  return (
    <Suspense fallback={<LoadingMain />}>
      <SearchResult />
    </Suspense>
  )
}

SearchResultPage.authenticate = true
SearchResultPage.getLayout = (page) => <Layout>{page}</Layout>

export default SearchResultPage
