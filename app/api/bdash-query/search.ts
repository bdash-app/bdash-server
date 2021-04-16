import { BlitzApiRequest, BlitzApiResponse } from "blitz"
import db, { BdashQuery, User } from "db"

export type SearchBdashQueryResponse = (BdashQuery & { user?: User })[]

const searchBdashQuery = async (req: BlitzApiRequest, res: BlitzApiResponse) => {
  const { q: keyword } = req.query
  if (typeof keyword !== "string") {
    res.status(400).end()
    return
  }

  const likeArg = `%${keyword}%`
  const searchResults = await db.$queryRaw<
    BdashQuery[]
  >`SELECT * FROM BdashQuery WHERE title LIKE ${likeArg} OR description LIKE ${likeArg} OR query_sql LIKE ${likeArg};`
  const users = await db.user.findMany({
    where: { id: { in: searchResults.map((query) => query.userId) } },
  })
  const bdashQueries = searchResults.map((bdashQuery) => {
    const foundUser = users.find((user) => user.id === bdashQuery.userId)
    const bdashQueryWithUser: SearchBdashQueryResponse[number] = foundUser
      ? Object.assign(bdashQuery, { user: foundUser })
      : bdashQuery
    return bdashQueryWithUser
  })

  res.setHeader("Content-Type", "application/json")
  res.status(200)
  res.send(JSON.stringify(bdashQueries))
}

export default searchBdashQuery
