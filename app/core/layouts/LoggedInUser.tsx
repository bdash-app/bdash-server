import { SettingsIcon } from "@chakra-ui/icons"
import { HStack, Avatar, Text } from "@chakra-ui/react"
import { Link } from "blitz"
import React from "react"
import { useCurrentUser } from "../hooks/useCurrentUser"

export const LoggedInUser = () => {
  const currentUser = useCurrentUser()
  return (
    <HStack>
      <Link href="/[userName]" as={`/${currentUser?.name}`}>
        <a>
          <HStack>
            <Avatar size="sm" src={currentUser?.icon} />
            <Text>{currentUser?.name || "Guest"}</Text>
          </HStack>
        </a>
      </Link>
      <Link href="/settings">
        <a>
          <SettingsIcon />
        </a>
      </Link>
    </HStack>
  )
}
