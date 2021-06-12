import { enhancePrisma } from "blitz"
import { PrismaClient } from "@prisma/client"
import { format } from "util"

const EnhancedPrisma = enhancePrisma(PrismaClient)

const datasources = process.env.DATABASE_PASSWORD
  ? {
      db: {
        url: format(process.env.DATABASE_URL, process.env.DATABASE_PASSWORD),
      },
    }
  : undefined

export * from "@prisma/client"
export default new EnhancedPrisma({
  datasources,
  log: ["query", "warn", "error"],
})
