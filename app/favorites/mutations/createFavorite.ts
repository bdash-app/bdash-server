import { AuthorizationError, NotFoundError, resolver } from "blitz"
import db, { Prisma } from "db"
import * as z from "zod"

const CreateFavorite = z.object({
  bdashQueryIdHash: z.string(),
})

export default resolver.pipe(
  resolver.zod(CreateFavorite),
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
    const data: Prisma.FavoriteCreateArgs["data"] = {
      bdashQueryId: query.id,
      userId: session.userId,
    }

    await db.favorite.create({ data })
    return null
  }
)
