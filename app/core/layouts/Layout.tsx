import React, { ReactNode } from "react"
import { Head } from "blitz"
import { Container } from "@chakra-ui/react"
import { NavigationHeader } from "./NavigationHeader"

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

      <NavigationHeader />
      <Container maxW="1100px" alignContent="start" minH="100vh" pt={6} pb={6}>
        {children}
      </Container>
    </>
  )
}

export default Layout
