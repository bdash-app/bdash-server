import React from "react"
import { UnorderedList, ListItem, HStack, Text, Avatar } from "@chakra-ui/react"
import { Link } from "blitz"
import { format } from "date-fns"
import type { BdashQuery, User } from "db"

type Props = {
  queries: (BdashQuery & { user?: Pick<User, "name" | "icon"> })[]
}

export const BdashQueryList: React.FC<Props> = ({ queries }) => {
  return (
    <UnorderedList>
      {queries.map((query) => (
        <ListItem key={query.id}>
          <HStack>
            <Link href="/query/[bdashQueryIdHash]" as={`/query/${query.id_hash}`}>
              <a>
                <Text fontSize="xl">{query.title}</Text>
              </a>
            </Link>
            {query.user && (
              <Text fontSize="sm" color="gray.500">
                by
                <Link href="/[userName]" as={`/${query.user.name}`}>
                  <a>
                    <Avatar size="xs" src={query.user.icon} marginLeft={1} marginRight={1} />
                    {query.user.name}
                  </a>
                </Link>
              </Text>
            )}
            <Text fontSize="sm" color="gray.500">
              {format(query.createdAt, "(yyyy-MM-dd)")}
            </Text>
          </HStack>
        </ListItem>
      ))}
    </UnorderedList>
  )
}
