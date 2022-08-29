import { Link } from "blitz"
import { Button, Flex } from "@chakra-ui/react"

export const LoginForm = () => {
  const redirectUrl = window.location.pathname
  return (
    <Flex width="100vw" height="100vh" alignItems="center" justifyContent="center">
      <a href={`/api/auth/google?redirectUrl=${redirectUrl}`}>
        <Button colorScheme="teal" fontSize="2xl">
          Login
        </Button>
      </a>
    </Flex>
  )
}

export default LoginForm
