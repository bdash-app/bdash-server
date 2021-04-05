import { AuthorizationError, resolver } from "blitz"
import db from "db"
import * as z from "zod"

const UpdateUser = z.object({
  id: z.number(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateUser),
  resolver.authorize(),
  async ({ id, ...data }, { session }) => {
    if (session.userId !== id) {
      throw new AuthorizationError()
    }
    const user = await db.user.update({ where: { id }, data })

    return user
  }
)
