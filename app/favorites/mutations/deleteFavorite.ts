import { AuthorizationError, NotFoundError, resolver } from "blitz"
import db from "db"
import * as z from "zod"

const DeleteBdashQuery = z.object({
  bdashQueryIdHash: z.string(),
})

export default resolver.pipe(
  resolver.zod(DeleteBdashQuery),
  resolver.authorize(),
  async ({ bdashQueryIdHash }, { session }) => {
    const query = await db.bdashQuery.findUnique({
      where: { id_hash: bdashQueryIdHash },
      select: { id: true, userId: true },
    })
    if (query === null) {
      throw new NotFoundError()
    }
    if (session.userId !== query.userId) {
      throw new AuthorizationError()
    }
    const fav = await db.favorite.findFirst({
      where: {
        bdashQueryId: query.id,
        userId: session.userId,
      },
    })
    if (fav === null) {
      throw new NotFoundError()
    }
    await db.favorite.delete({ where: { id: fav.id } })
    return null
  }
)
