import db from "db"

export const searchBdashQueries = async <T>(
  keyword: string,
  selectFields: Record<string, boolean>,
  limit?: number
): Promise<T[]> => {
  const keywords = keyword
    .trim()
    .split(/\s+/)
    .filter((k) => k.length > 0)

  if (keywords.length === 0) {
    return []
  }

  const andConditions = keywords.map((kw) => ({
    OR: [
      { title: { contains: kw } },
      { description: { contains: kw } },
      { query_sql: { contains: kw } },
    ],
  }))

  const searchResults = await db.bdashQuery.findMany({
    where: {
      AND: andConditions,
    },
    select: selectFields,
    orderBy: {
      updatedAt: "desc",
    },
    ...(limit && { take: limit }),
  })

  return searchResults as T[]
}
