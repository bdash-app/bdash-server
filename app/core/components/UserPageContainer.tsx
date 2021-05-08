import { Heading } from "@chakra-ui/react"
import { Head } from "blitz"
import { BdashQuery, User } from "db"
import React from "react"
import { BdashQueryList } from "./BdashQueryList"
import { ContentBox } from "./ContentBox"

type Props = {
  user: User & { BdashQuery: BdashQuery[] }
}

export const UserPageContainer: React.FC<Props> = ({ user }) => {
  return (
    <>
      <Head>
        <title>{`${user.name}'s queries | Bdash Server`}</title>
      </Head>

      <ContentBox>
        <Heading as="h2" size="lg" marginBottom={4}>
          {`${user.name}'s queries`}
        </Heading>
        <BdashQueryList queries={user.BdashQuery.map((query) => Object.assign(query, { user }))} />
      </ContentBox>
    </>
  )
}
