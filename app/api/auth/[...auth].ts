import { passportAuth } from "blitz"
import db from "db"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { randomBytes } from "crypto"

export default passportAuth({
  strategies: [
    {
      strategy: new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
          callbackURL: `${process.env.WEB_HOST}/api/auth/google/callback`,
          scope: ["email", "profile"],
        },
        async function (_token, _tokenSecret, profile, done) {
          const email = profile.emails && profile.emails[0]?.value
          const name = email.split("@")[0]
          const accessToken = randomBytes(20).toString("hex")
          const user = await db.user.upsert({
            where: { name }, // temp
            create: {
              email,
              name: email.split("@")[0],
              icon: profile.photos[0]?.value,
              accessToken,
            },
            update: { email },
          })
          const publicData = {
            userId: user.id,
            roles: [user.role],
            source: "google",
          }
          done(null, { publicData })
        }
      ),
      authenticateOptions: {
        hostedDomain: process.env.GOOGLE_HOSTED_DOMAIN || null,
      },
    },
  ],
})
