import { Ctx } from "blitz"

export default async function getPublicKeyJwk(_ = null, { session }: Ctx) {
  if (!session.userId) return null
  if (process.env.PUBLIC_KEY_JWK) {
    return JSON.parse(process.env.PUBLIC_KEY_JWK) as JsonWebKey
  }
  return null
}
