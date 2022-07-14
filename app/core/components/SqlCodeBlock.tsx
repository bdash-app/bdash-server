import { Box } from "@chakra-ui/react"
import hljs from "highlight.js/lib/core"
import sql from "highlight.js/lib/languages/sql"
import "highlight.js/styles/a11y-light.css"
import { useEffect } from "react"
import styles from "./SqlCodeBlock.module.css"

hljs.registerLanguage("sql", sql)

export const SqlCodeBlock = ({ sql }: { sql: string }) => {
  useEffect(() => {
    hljs.initHighlighting()
  })
  return (
    <Box fontSize="sm" className={styles.box}>
      <pre>
        <code>{sql}</code>
      </pre>
    </Box>
  )
}
