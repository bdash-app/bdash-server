import { BdashQuery, User } from "db"
import React from "react"
import { UnorderedList, ListItem, HStack, Text, Avatar } from "@chakra-ui/react"
import { Link } from "blitz"

type Props = {
  queries: (BdashQuery & { user: User })[]
}

export const BdashQueryList: React.FC<Props> = ({ queries }) => {
  return (
    <UnorderedList>
      {queries.map((query) => (
        <ListItem>
          <HStack>
            <Link href="/querie/[bdashQueryId]" as={`/querie/${query.id}`}>
              <a>
                <Text fontSize="xl">{query.title}</Text>
              </a>
            </Link>
            <Text fontSize="sm" color="gray.500">
              by
              <Link href="/user/[userId]" as={`/user/${query.user.id}`}>
                <a>
                  <Avatar size="xs" src={query.user.icon} marginLeft={1} marginRight={1} />
                  {query.user.name}
                </a>
              </Link>
            </Text>
          </HStack>
        </ListItem>
      ))}
    </UnorderedList>
  )
}
