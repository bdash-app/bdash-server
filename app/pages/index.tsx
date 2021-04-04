import { Suspense } from "react"
import { Head, BlitzPage, usePaginatedQuery, useRouter } from "blitz"
import Layout from "app/core/layouts/Layout"
import { Box, Button, HStack, Heading } from "@chakra-ui/react"
import { BdashQueryList } from "../core/components/BdashQueryList"
import getBdashQueries from "app/bdash-queries/queries/getBdashQueries"

const ITEMS_PER_PAGE = 100

const Home = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ bdashQueries, hasMore }] = usePaginatedQuery(getBdashQueries, {
    orderBy: { id: "desc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <>
      <Head>
        <title>Bdash Server</title>
      </Head>

      <Box bg="white" pl={10} pr={10} pt={5} pb={5} borderRadius="xl">
        <Heading as="h2" size="lg" marginBottom={2}>
          All Queries
        </Heading>
        <BdashQueryList
          queries={bdashQueries.map((query) => Object.assign(query, { user: query.user }))}
        />
        {hasMore && (
          <HStack spacing={5}>
            <Button colorScheme="teal" disabled={page === 0} onClick={goToPreviousPage}>
              Previous
            </Button>
            <Button colorScheme="teal" disabled={!hasMore} onClick={goToNextPage}>
              Next
            </Button>
          </HStack>
        )}
      </Box>
    </>
  )
}

const ShowHomePage: BlitzPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Home />
    </Suspense>
  )
}

ShowHomePage.suppressFirstRenderFlicker = true
ShowHomePage.authenticate = true
ShowHomePage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowHomePage
