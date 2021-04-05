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
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    // Important: return the modified config
    if (!isServer) {
      config.node = {
        fs: "empty",
      }
    }
    return config
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
