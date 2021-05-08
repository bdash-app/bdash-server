import React, { Suspense } from "react"
import { Head, useQuery } from "blitz"
import { Heading } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import { BdashQueryList } from "app/core/components/BdashQueryList"
import getFavoriteQueries from "app/favorites/queries/getFavoriteQueries"
import { ContentBox } from "app/core/components/ContentBox"
import { LoadingMain } from "app/core/components/LoadingMain"

function Favorites() {
  const [queries] = useQuery(getFavoriteQueries, {})
  return (
    <ContentBox>
      <Heading as="h2" size="lg" marginBottom={4}>
        Your Favorites
      </Heading>
      <BdashQueryList queries={queries} />
    </ContentBox>
  )
}

const FavoritesPage = () => {
  return (
    <>
      <Head>
        <title>{`Favorites | Bdash Server`}</title>
      </Head>
      <Suspense fallback={<LoadingMain />}>
        <Favorites />
      </Suspense>
    </>
  )
}

FavoritesPage.authenticate = true
FavoritesPage.getLayout = (page) => <Layout>{page}</Layout>

export default FavoritesPage
