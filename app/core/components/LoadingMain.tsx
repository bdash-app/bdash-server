import { Center, Spinner } from "@chakra-ui/react"
import React from "react"

export function LoadingMain() {
  return (
    <Center mt={10}>
      <Spinner thickness="4px" speed="0.8s" emptyColor="gray.200" color="blue.500" size="xl" />
    </Center>
  )
}
