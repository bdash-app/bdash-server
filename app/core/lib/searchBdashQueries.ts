import db, { Prisma } from "db"

export const searchBdashQueries = async <SelectFields extends Prisma.BdashQuerySelect>(
  keyword: string,
  selectFields: SelectFields,
  limit?: number
): Promise<Prisma.BdashQueryGetPayload<{ select: SelectFields }>[]> => {
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

  return searchResults
}
