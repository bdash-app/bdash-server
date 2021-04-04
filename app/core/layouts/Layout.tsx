import { ReactNode, Suspense } from "react"
import { Head } from "blitz"
import { Box, Container, Heading, Flex, Spacer, Link } from "@chakra-ui/react"
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

      <Container maxW="90%" alignContent="start" minH="100vh">
        <Flex marginBottom={4} marginTop={4} spacing={4} alignItems="center">
          <Link href="/" _hover={{ textDecoration: "none" }}>
            <Heading as="h1" size="xl">
              <Box>Bdash Server</Box>
            </Heading>
          </Link>
          <Spacer />
          <Suspense fallback="Loading...">
            <LoggedInUser />
          </Suspense>
        </Flex>
        {children}
      </Container>
    </>
  )
}

export default Layout
