import { resolver, NotFoundError } from "blitz"
import db from "db"
import * as z from "zod"

const GetBdashQuery = z.object({
  // This accepts type of undefined, but is required at runtime
  idHash: z.string().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.zod(GetBdashQuery),
  resolver.authorize(),
  async ({ idHash }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const bdashQuery = await db.bdashQuery.findFirst({
      where: { id_hash: idHash },
      include: { user: true },
    })

    if (!bdashQuery) throw new NotFoundError()

    return bdashQuery
  }
)
