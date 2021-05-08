import { ChevronDownIcon } from "@chakra-ui/icons"
import {
  HStack,
  Avatar,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react"
import { useRouter } from "blitz"
import React from "react"
import { useCurrentUser } from "../hooks/useCurrentUser"

export const LoggedInUser = () => {
  const router = useRouter()

  const currentUser = useCurrentUser()
  if (currentUser === null) return null

  return (
    <Menu>
      <MenuButton as={Button} background="transparent" rightIcon={<ChevronDownIcon />}>
        <HStack>
          <Avatar size="sm" src={currentUser.icon} />
          <Text display={{ base: "none", md: "inline" }}>{currentUser.name}</Text>
        </HStack>
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => router.push(`/${currentUser.name}`)}>My Queries</MenuItem>
        <MenuItem onClick={() => router.push("/favorites")}>Favorites</MenuItem>
        <MenuItem onClick={() => router.push("/settings")}>Settings</MenuItem>
      </MenuList>
    </Menu>
  )
}
