import React, { Suspense } from "react"
import { useQuery, useParam, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import getUserByName from "app/users/queries/getUserByName"
import { Spinner } from "@chakra-ui/react"
import { UserPageContainer } from "app/core/components/UserPageContainer"

const User = () => {
  const name = useParam("userName")?.toString() || ""
  const [user] = useQuery(getUserByName, { name })

  return <UserPageContainer user={user} />
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
