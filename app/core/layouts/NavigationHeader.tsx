import { useRouter, useRouterQuery } from "blitz"
import { Box, Flex, Heading, Link, HStack, Text, Image, Button } from "@chakra-ui/react"
import React, { Suspense, useContext } from "react"
import { LoggedInUser } from "./LoggedInUser"
import { SearchForm } from "./SearchForm"
import { AppContext } from "app/pages/_app"

export const NavigationHeader: React.FC = () => {
  const query = useRouterQuery()
  const router = useRouter()
  const { publicKeyJwk } = useContext(AppContext)
  return (
    <Box bg="white">
      <Flex
        maxW="1100px"
        paddingTop={2}
        paddingBottom={2}
        paddingLeft={{ base: 2, md: 4 }}
        paddingRight={{ base: 2, md: 4 }}
        marginLeft="auto"
        marginRight="auto"
        alignItems="center"
        gap="2"
      >
        <Link
          onClick={() => {
            router.push("/")
          }}
          _hover={{ textDecoration: "none" }}
        >
          <Heading as="h1" size="md" marginRight={{ base: 2, md: 4, lg: 20 }}>
            <HStack>
              <Image src="/logo.png" alt="" width={8} height={8} maxWidth="none" ignoreFallback />
              <Text whiteSpace="nowrap" display={{ base: "none", md: "inline" }}>
                Bdash Server
              </Text>
            </HStack>
          </Heading>
        </Link>
        <SearchForm w={500} keyword={query["q"]?.toString()} />
        {publicKeyJwk !== null && (
          <Link href="/runner">
            <Button colorScheme="teal" variant="outline" size={{ base: "sm", md: "md" }}>
              Runner
            </Button>
          </Link>
        )}
        <Box flex="auto" textAlign="right">
          <Suspense fallback={null}>
            <LoggedInUser />
          </Suspense>
        </Box>
      </Flex>
    </Box>
  )
}
