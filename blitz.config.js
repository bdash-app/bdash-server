const { sessionMiddleware, simpleRolesIsAuthorized } = require("blitz")

module.exports = {
  middleware: [
    sessionMiddleware({
      isAuthorized: simpleRolesIsAuthorized,
    }),
  ],
  serverRuntimeConfig: {
    revision: revision(),
    distDir: `${__dirname}/.next`,
  },
}

function revision() {
  const fs = require("fs")
  const path = require("path")
  try {
    return fs.readFileSync(path.join(__dirname, "REVISION")).toString()
  } catch (error) {
    return null
  }
}
