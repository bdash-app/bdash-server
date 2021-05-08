import { useRouterQuery } from "@blitzjs/core"
import { useRouter } from "blitz"
import { Box, Flex, Heading, Spacer, Spinner, Link, HStack, Text, Image } from "@chakra-ui/react"
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
        paddingLeft={4}
        paddingRight={4}
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
          <Heading as="h1" size="md">
            <HStack>
              <Image src="/logo.png" alt="" width={8} height={8} maxWidth="none" />
              <Text display={{ base: "none", md: "inline" }}>Bdash Server</Text>
            </HStack>
          </Heading>
        </Link>
        <Spacer minW={4} />
        <SearchForm width={500} keyword={query["q"]?.toString()} />
        <Spacer minW={4} />
        <Suspense fallback={<Spinner color="teal" />}>
          <LoggedInUser />
        </Suspense>
      </Flex>
    </Box>
  )
}
