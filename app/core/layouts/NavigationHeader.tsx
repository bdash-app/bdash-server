import { useRouterQuery } from "@blitzjs/core"
import { useRouter } from "blitz"
import { Box, Flex, Heading, Link, HStack, Text, Image } from "@chakra-ui/react"
import React, { Suspense } from "react"
import { LoggedInUser } from "./LoggedInUser"
import { SearchForm } from "./SearchForm"

export const NavigationHeader: React.FC = () => {
  const query = useRouterQuery()
  const router = useRouter()
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
        <Box flex="auto" textAlign="right">
          <Suspense fallback={null}>
            <LoggedInUser />
          </Suspense>
        </Box>
      </Flex>
    </Box>
  )
}
