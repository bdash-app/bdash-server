import { Input, Button, HStack, Box, LayoutProps } from "@chakra-ui/react"
import { useRouter } from "blitz"
import React, { FormEventHandler, useState } from "react"

type Props = {
  keyword?: string
} & LayoutProps

export const SearchForm: React.FC<Props> = ({ keyword, ...layoutProps }) => {
  const [inputValue, setInputValue] = useState(keyword || "")
  const router = useRouter()
  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    router.push({ pathname: "/search", query: { q: inputValue } })
  }
  return (
    <Box {...layoutProps}>
      <form onSubmit={onSubmit}>
        <HStack>
          <Input
            name="q"
            placeholder="Search..."
            variant="filled"
            size="lg"
            value={inputValue}
            onChange={(event) => {
              setInputValue(event.target.value)
            }}
          />
          <Button mt={4} colorScheme="teal" type="submit">
            Search
          </Button>
        </HStack>
      </form>
    </Box>
  )
}
