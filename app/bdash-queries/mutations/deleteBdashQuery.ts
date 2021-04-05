import { AuthorizationError, NotFoundError, resolver } from "blitz"
import db from "db"
import * as z from "zod"

const DeleteBdashQuery = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteBdashQuery),
  resolver.authorize(),
  async ({ id }, { session }) => {
    const query = await db.bdashQuery.findUnique({ where: { id }, select: { userId: true } })
    if (query === null) {
      throw new NotFoundError()
    }
    if (session.userId !== query.userId) {
      throw new AuthorizationError()
    }
    const bdashQuery = await db.bdashQuery.delete({ where: { id } })
    return bdashQuery
  }
)
