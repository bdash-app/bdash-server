import {
  AppProps,
  ErrorComponent,
  useRouter,
  AuthenticationError,
  AuthorizationError,
  ErrorFallbackProps,
} from "blitz"
import { ErrorBoundary } from "react-error-boundary"
import { queryCache } from "react-query"
import LoginForm from "app/core/components/LoginForm"

import { ChakraProvider } from "@chakra-ui/react"

import { extendTheme } from "@chakra-ui/react"

export default function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)
  const router = useRouter()

  return (
    <ChakraProvider theme={theme}>
      <ErrorBoundary
        FallbackComponent={RootErrorFallback}
        resetKeys={[router.asPath]}
        onReset={() => {
          // This ensures the Blitz useQuery hooks will automatically refetch
          // data any time you reset the error boundary
          queryCache.resetErrorBoundaries()
        }}
      >
        {getLayout(<Component {...pageProps} />)}
      </ErrorBoundary>
    </ChakraProvider>
  )
}

function RootErrorFallback({ error }: ErrorFallbackProps) {
  if (error instanceof AuthenticationError) {
    return <LoginForm />
  } else if (error instanceof AuthorizationError) {
    return (
      <ErrorComponent
        statusCode={error.statusCode}
        title="Sorry, you are not authorized to access this"
      />
    )
  } else {
    return (
      <ErrorComponent statusCode={error.statusCode || 400} title={error.message || error.name} />
    )
  }
}

export const theme = extendTheme({
  styles: {
    global: {
      "html, body": {
        color: "gray.600",
        lineHeight: "tall",
        background: "gray.100",
      },
      a: {
        color: "teal",
        textDecoration: "none",
        _hover: {
          textDecoration: "underline",
        },
      },
    },
  },
})
