import React, { Suspense } from "react"
import { Head, useQuery } from "blitz"
import { Box, Heading, Spinner } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import { BdashQueryList } from "app/core/components/BdashQueryList"
import getFavoriteQueries from "app/favorites/queries/getFavoriteQueries"

function Favorites() {
  const [queries] = useQuery(getFavoriteQueries, {})
  return (
    <Box bg="white" pl={10} pr={10} pt={5} pb={5} borderRadius="xl">
      <Heading as="h2" size="lg" marginBottom={4}>
        Your Favorites
      </Heading>
      <BdashQueryList queries={queries} />
    </Box>
  )
}

const FavoritesPage = () => {
  return (
    <>
      <Head>
        <title>{`Favorites | Bdash Server`}</title>
      </Head>
      <Suspense fallback={<Spinner color="teal" />}>
        <Favorites />
      </Suspense>
    </>
  )
}

FavoritesPage.authenticate = true
FavoritesPage.getLayout = (page) => <Layout>{page}</Layout>

export default FavoritesPage
