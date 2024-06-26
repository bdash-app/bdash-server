import {
  AppProps,
  ErrorComponent,
  useRouter,
  AuthenticationError,
  AuthorizationError,
  ErrorFallbackProps,
  useQuery,
} from "blitz"
import { ErrorBoundary } from "react-error-boundary"
import { useQueryErrorResetBoundary } from "react-query"
import LoginForm from "app/core/components/LoginForm"
import { ChakraProvider } from "@chakra-ui/react"
import { extendTheme } from "@chakra-ui/react"
import { createContext } from "react"
import getPublicKeyJwk from "app/users/queries/getPublicKeyJwk"

type AppContextType = {
  publicKeyJwk: JsonWebKey | null
}
export const AppContext = createContext<AppContextType>({ publicKeyJwk: null })

export default function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)
  const router = useRouter()
  const { reset } = useQueryErrorResetBoundary()
  const [publicKeyJwk] = useQuery(getPublicKeyJwk, null, { suspense: false, enabled: true })

  return (
    <ChakraProvider theme={theme}>
      <ErrorBoundary
        FallbackComponent={RootErrorFallback}
        resetKeys={[router.asPath]}
        onReset={reset}
      >
        <AppContext.Provider value={{ publicKeyJwk: publicKeyJwk ?? null }}>
          {getLayout(<Component {...pageProps} />)}
        </AppContext.Provider>
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
        textDecoration: "none",
        _hover: {
          textDecoration: "underline",
        },
      },
    },
  },
})
