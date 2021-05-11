import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async (_, { session }) => {
  const favs = await db.favorite.findMany({
    where: { userId: session.userId },
    include: {
      bdashQuery: {
        select: {
          id: true,
          id_hash: true,
          title: true,
          userId: true,
          createdAt: true,
          user: {
            select: { id: true, name: true, icon: true },
          },
        },
      },
    },
  })

  return favs.map((fav) => fav.bdashQuery)
})
