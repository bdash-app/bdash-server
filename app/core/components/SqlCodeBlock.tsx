import { Box } from "@chakra-ui/react"
import SyntaxHighlighter from "react-syntax-highlighter"
import { a11yLight } from "react-syntax-highlighter/dist/cjs/styles/hljs"
import styles from "./sqlCodeBlock.module.css"

export const SqlCodeBlock = ({ sql }: { sql: string }) => {
  return (
    <Box fontSize="sm" className={styles.box}>
      <SyntaxHighlighter
        language="sql"
        style={a11yLight}
        customStyle={{ backgroundColor: "white", padding: 0 }}
      >
        {sql}
      </SyntaxHighlighter>
    </Box>
  )
}
