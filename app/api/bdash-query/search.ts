import { BlitzApiRequest, BlitzApiResponse } from "blitz"
import db, { BdashQuery, User } from "db"
import { searchBdashQueries } from "app/core/lib/searchBdashQueries"

type SearchBdashQueryResult = Pick<BdashQuery, "id" | "id_hash" | "title" | "createdAt" | "userId">

export type SearchBdashQueryResponse = (SearchBdashQueryResult & { user?: User })[]

const searchBdashQuery = async (req: BlitzApiRequest, res: BlitzApiResponse) => {
  const { q: keyword } = req.query
  if (typeof keyword !== "string") {
    res.status(400).end()
    return
  }

  const sendResponse = (data: SearchBdashQueryResponse) => {
    res.setHeader("Content-Type", "application/json")
    res.status(200)
    res.send(JSON.stringify(data))
  }

  const searchResults = await searchBdashQueries(keyword, {
    id: true,
    id_hash: true,
    title: true,
    createdAt: true,
    userId: true,
  })

  const users = await db.user.findMany({
    where: { id: { in: searchResults.map((query) => query.userId) } },
    select: { id: true, name: true, icon: true },
  })
  const bdashQueries = searchResults.map((bdashQuery) => {
    const foundUser = users.find((user) => user.id === bdashQuery.userId)
    const bdashQueryWithUser: SearchBdashQueryResponse[number] = foundUser
      ? Object.assign(bdashQuery, { user: foundUser })
      : bdashQuery
    return bdashQueryWithUser
  })

  sendResponse(bdashQueries)
}

export default searchBdashQuery
