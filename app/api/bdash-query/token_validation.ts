import { BlitzApiRequest, BlitzApiResponse } from "blitz"
import db from "db"

async function tokenValidation(req: BlitzApiRequest, res: BlitzApiResponse) {
  const { token } = req.body
  if (token === undefined) {
    res.json({ ok: false, message: "Access Token is required" })
    return
  }

  const user = await db.user.findUnique({ where: { accessToken: token } })
  if (user === null) {
    res.json({ ok: false, message: "Access Token is invalid" })
    return
  }

  res.json({ ok: true })
}

export default tokenValidation
