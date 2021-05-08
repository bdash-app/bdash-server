import React from "react"
import styles from "./Chart.module.css"
import { ContentBox } from "./ContentBox"

type Props = {
  chartSvg: string
}

export const Chart: React.FC<Props> = ({ chartSvg }) => {
  return (
    <ContentBox>
      <div className={styles.box} dangerouslySetInnerHTML={{ __html: chartSvg }} />
    </ContentBox>
  )
}
