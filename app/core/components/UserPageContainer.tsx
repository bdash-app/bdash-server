import { Box, Heading } from "@chakra-ui/react"
import { Head } from "blitz"
import { BdashQuery, User } from "db"
import React from "react"
import { BdashQueryList } from "./BdashQueryList"

type Props = {
  user: User & { BdashQuery: BdashQuery[] }
}

export const UserPageContainer: React.FC<Props> = ({ user }) => {
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
