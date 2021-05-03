import { Box } from "@chakra-ui/react"
import React from "react"
import styles from "./Chart.module.css"

type Props = {
  chartSvg: string
}

export const Chart: React.FC<Props> = ({ chartSvg }) => {
  return (
    <Box bg="white" pl={10} pr={10} pt={5} pb={5} borderRadius="xl">
      <div className={styles.box} dangerouslySetInnerHTML={{ __html: chartSvg }} />
    </Box>
  )
}
