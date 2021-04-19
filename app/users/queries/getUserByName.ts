import { resolver, NotFoundError } from "blitz"
import db from "db"
import * as z from "zod"

const GetUser = z.object({
  // This accepts type of undefined, but is required at runtime
  name: z.string().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetUser), resolver.authorize(), async ({ name }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const user = await db.user.findUnique({
    where: { name },
    include: { BdashQuery: { orderBy: { createdAt: "desc" } } },
  })

  if (!user) throw new NotFoundError()

  return user
})
