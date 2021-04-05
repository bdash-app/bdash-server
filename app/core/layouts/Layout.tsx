import { ReactNode, Suspense } from "react"
import { Head } from "blitz"
import { Box, Container, Heading, Flex, Spacer, Link, Spinner } from "@chakra-ui/react"
import { LoggedInUser } from "./LoggedInUser"

type LayoutProps = {
  title?: string
  children: ReactNode
}

const Layout = ({ title, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title || "bdash-server"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box bg="white">
        <Flex
          maxW="90%"
          marginBottom={6}
          paddingTop={2}
          paddingBottom={2}
          paddingLeft={4}
          paddingRight={4}
          marginLeft="auto"
          marginRight="auto"
          spacing={4}
          alignItems="center"
        >
          <Link href="/" _hover={{ textDecoration: "none" }}>
            <Heading as="h1" size="md">
              <Box>Bdash Server</Box>
            </Heading>
          </Link>
          <Spacer />
          <Suspense fallback={<Spinner color="teal" />}>
            <LoggedInUser />
          </Suspense>
        </Flex>
      </Box>
      <Container maxW="90%" alignContent="start" minH="100vh">
        {children}
      </Container>
    </>
  )
}

export default Layout
