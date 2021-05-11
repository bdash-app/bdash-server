import { paginate, resolver } from "blitz"
import db from "db"

type GetBdashQueriesInput = Pick<
  NonNullable<Parameters<typeof db.bdashQuery.findMany>[0]>,
  "where" | "orderBy" | "skip" | "take"
>

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetBdashQueriesInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const { items: bdashQueries, hasMore, nextPage, count } = await paginate({
      skip,
      take,
      count: () => db.bdashQuery.count({ where }),
      query: (paginateArgs) =>
        db.bdashQuery.findMany({
          ...paginateArgs,
          select: {
            id: true,
            id_hash: true,
            title: true,
            userId: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
                icon: true,
              },
            },
          },
          where,
          orderBy,
        }),
    })

    return {
      bdashQueries,
      nextPage,
      hasMore,
      count,
    }
  }
)
