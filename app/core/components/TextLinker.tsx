import React, { memo } from "react"
import { Link } from "@chakra-ui/react"

const LINE_REGEX = /(\r\n|\r|\n)/g
const URL_REGEX = /https?:\/\/[-_.!~*'a-zA-Z0-9;/?:@&=+$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+/g
type Token = string | { text: string; url: string; type: "link" }

type Props = {
  text: string
}

export const TextLinker = memo<Props>(function TextLinker({ text }) {
  const nodes = text.split(LINE_REGEX).map((line, idx) => {
    if (LINE_REGEX.test(line)) {
      return <br key={idx} />
    }

    return parse(line).map((token, i) => {
      if (typeof token === "string") {
        return token
      } else if (token.type === "link") {
        const isExternal = new URL(token.url).hostname !== window.location.hostname
        return (
          <Link href={token.url} key={i} isExternal={isExternal} colorScheme="teal">
            {token.text}
          </Link>
        )
      }
      return null
    })
  })

  return <>{nodes}</>
})

const parse = (text: string): Token[] => {
  const tokens: Token[] = []
  let result
  let currentIndex = 0

  while ((result = URL_REGEX.exec(text))) {
    if (currentIndex !== result.index) {
      tokens.push(text.slice(currentIndex, result.index))
    }
    tokens.push({ text: result[0], url: result[0], type: "link" })
    currentIndex = URL_REGEX.lastIndex
  }

  const tail = text.slice(currentIndex)
  if (tail !== "") {
    tokens.push(tail)
  }

  return tokens
}
