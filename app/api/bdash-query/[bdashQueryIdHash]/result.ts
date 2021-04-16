import { downloadResultTSV } from "app/core/lib/s3"
import { BlitzApiRequest, BlitzApiResponse } from "blitz"

const getResultTSV = async (req: BlitzApiRequest, res: BlitzApiResponse) => {
  const { bdashQueryIdHash } = req.query
  if (typeof bdashQueryIdHash !== "string") {
    res.status(400).end()
    return
  }
  const data = await downloadResultTSV(bdashQueryIdHash)
  const resultTSV = data.Body?.toString()
  if (resultTSV === undefined) {
    res.status(404).end()
    return
  }
  res.setHeader("Content-Type", "text/tab-separated-values")
  res.status(200)
  res.send(resultTSV)
}

export default getResultTSV
