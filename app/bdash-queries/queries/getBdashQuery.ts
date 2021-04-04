import { resolver, NotFoundError } from "blitz"
import db from "db"
import * as z from "zod"

const GetBdashQuery = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetBdashQuery), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const bdashQuery = await db.bdashQuery.findFirst({ where: { id }, include: { user: true } })

  if (!bdashQuery) throw new NotFoundError()

  return bdashQuery
})
