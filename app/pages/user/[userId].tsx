import React, { Suspense } from "react"
import { Head, useQuery, useParam, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import getUser from "app/users/queries/getUser"
import { Box, Heading, Spinner } from "@chakra-ui/react"
import { BdashQueryList } from "../../core/components/BdashQueryList"

export const User = () => {
  const userId = useParam("userId", "number")
  const [user] = useQuery(getUser, { id: userId })

  return (
    <>
      <Head>
        <title>{`${user.name}'s queries | Bdash Server`}</title>
      </Head>

      <Box bg="white" pl={10} pr={10} pt={5} pb={5} borderRadius="xl">
        <Heading as="h2" size="lg" marginBottom={4}>
          {`${user.name}'s queries`}
        </Heading>
        <BdashQueryList queries={user.BdashQuery.map((query) => Object.assign(query, { user }))} />
      </Box>
    </>
  )
}

const ShowUserPage: BlitzPage = () => {
  return (
    <Suspense fallback={<Spinner color="teal" />}>
      <User />
    </Suspense>
  )
}

ShowUserPage.authenticate = true
ShowUserPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowUserPage
