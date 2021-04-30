import { AuthorizationError, NotFoundError, resolver } from "blitz"
import db from "db"
import * as z from "zod"

const UpdateBdashQuery = z.object({
  id: z.number(),
  title: z.string().optional(),
  description: z.string().optional(),
  query_sql: z.string().optional(),
})

export default resolver.pipe(
  resolver.zod(UpdateBdashQuery),
  resolver.authorize(),
  async ({ id, ...data }, { session }) => {
    const query = await db.bdashQuery.findUnique({ where: { id }, select: { userId: true } })
    if (query === null) {
      throw new NotFoundError()
    }
    if (session.userId !== query.userId) {
      throw new AuthorizationError()
    }
    const bdashQuery = await db.bdashQuery.update({ where: { id }, data })
    return bdashQuery
  }
)
