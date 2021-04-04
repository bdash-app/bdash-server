import { BlitzApiRequest, BlitzApiResponse, getConfig } from "blitz"

const getRevision = async (_req: BlitzApiRequest, res: BlitzApiResponse) => {
  res.setHeader("Content-Type", "text/plain")
  res.status(200)
  const { serverRuntimeConfig } = getConfig()
  res.send(serverRuntimeConfig.revision || "REVISION file is not found")
}

export default getRevision
