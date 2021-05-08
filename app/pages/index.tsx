import { Suspense } from "react"
import { Head, BlitzPage, usePaginatedQuery, useRouter } from "blitz"
import Layout from "app/core/layouts/Layout"
import { Button, HStack, Heading } from "@chakra-ui/react"
import { BdashQueryList } from "../core/components/BdashQueryList"
import { LoadingMain } from "../core/components/LoadingMain"
import { ContentBox } from "../core/components/ContentBox"
import getBdashQueries from "app/bdash-queries/queries/getBdashQueries"

const ITEMS_PER_PAGE = 25

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

  const isPagerHidden = page === 0 && !hasMore

  return (
    <>
      <Head>
        <title>Bdash Server</title>
      </Head>

      <ContentBox>
        <Heading as="h2" size="lg" marginBottom={4}>
          All Queries
        </Heading>
        <BdashQueryList
          queries={bdashQueries.map((query) => Object.assign(query, { user: query.user }))}
        />
        {!isPagerHidden && (
          <HStack marginTop={5} spacing={5}>
            <Button colorScheme="teal" disabled={page === 0} onClick={goToPreviousPage}>
              Previous
            </Button>
            <Button colorScheme="teal" disabled={!hasMore} onClick={goToNextPage}>
              Next
            </Button>
          </HStack>
        )}
      </ContentBox>
    </>
  )
}

const ShowHomePage: BlitzPage = () => {
  return (
    <Suspense fallback={<LoadingMain />}>
      <Home />
    </Suspense>
  )
}

ShowHomePage.suppressFirstRenderFlicker = true
ShowHomePage.authenticate = true
ShowHomePage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowHomePage
