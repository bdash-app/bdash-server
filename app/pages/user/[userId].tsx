import React, { Suspense } from "react"
import { useQuery, useParam, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import getUserById from "app/users/queries/getUserById"
import { UserPageContainer } from "app/core/components/UserPageContainer"
import { LoadingMain } from "app/core/components/LoadingMain"

const User = () => {
  const id = useParam("userId", "number")
  const [user] = useQuery(getUserById, { id })

  return <UserPageContainer user={user} />
}

const ShowUserPage: BlitzPage = () => {
  return (
    <Suspense fallback={<LoadingMain />}>
      <User />
    </Suspense>
  )
}

ShowUserPage.authenticate = true
ShowUserPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowUserPage
