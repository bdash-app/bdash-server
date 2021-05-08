import React from "react"
import { UnorderedList, ListItem, Text, Avatar, Box } from "@chakra-ui/react"
import { Link } from "blitz"
import { format } from "date-fns"
import type { BdashQuery, User } from "db"

type Props = {
  queries: (BdashQuery & { user?: Pick<User, "name" | "icon"> })[]
}

export const BdashQueryList: React.FC<Props> = ({ queries }) => {
  return (
    <UnorderedList marginLeft={{ base: 0, md: 1 }}>
      {queries.map((query) => (
        <ListItem
          key={query.id}
          marginBottom={{ base: 4, md: 1 }}
          paddingBottom={{ base: 4, md: 1 }}
          listStyleType={{ base: "none", md: "disc" }}
          borderColor="gray.300"
          borderStyle={{ base: "solid", md: "none" }}
          borderBottomWidth={1}
        >
          <Box fontSize="xl" display="inline-block" marginRight={2} wordBreak="break-word">
            <Link href="/query/[bdashQueryIdHash]" as={`/query/${query.id_hash}`}>
              <a>{query.title}</a>
            </Link>
          </Box>
          <Box whiteSpace="nowrap" display="inline-block">
            {query.user && (
              <Text fontSize="sm" color="gray.500" display="inline-block">
                by
                <Link href="/[userName]" as={`/${query.user.name}`}>
                  <a>
                    <Avatar size="xs" src={query.user.icon} marginLeft={1} marginRight={1} />
                    {query.user.name}
                  </a>
                </Link>
              </Text>
            )}
            <Text fontSize="sm" color="gray.500" display="inline-block">
              {format(query.createdAt, "(yyyy-MM-dd)")}
            </Text>
          </Box>
        </ListItem>
      ))}
    </UnorderedList>
  )
}
