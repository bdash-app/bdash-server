import { HStack, Avatar, Text } from "@chakra-ui/react"
import { Link } from "blitz"
import React from "react"
import { useCurrentUser } from "../hooks/useCurrentUser"

export const LoggedInUser = () => {
  const currentUser = useCurrentUser()
  return (
    <Link href="/profile">
      <a>
        <HStack>
          <Avatar size="sm" src={currentUser?.icon} />
          <Text>{currentUser?.name || "Guest"}</Text>
        </HStack>
      </a>
    </Link>
  )
}
