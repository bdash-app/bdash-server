import { randomBytes } from "crypto"
import db from "db"

interface ServiceKeyArgs {
  name: string
  key?: string
  expires?: string
}

function parseArgs(): ServiceKeyArgs {
  const args = process.argv.slice(2)
  const parsed: ServiceKeyArgs = { name: "" }

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--name":
        if (i + 1 < args.length) {
          parsed.name = args[++i]
        } else {
          console.error("❌ Missing value for --name")
          process.exit(1)
        }
        break
      case "--key":
        if (i + 1 < args.length) {
          parsed.key = args[++i]
        } else {
          console.error("❌ Missing value for --key")
          process.exit(1)
        }
        break
      case "--expires":
        if (i + 1 < args.length) {
          parsed.expires = args[++i]
        } else {
          console.error("❌ Missing value for --expires")
          process.exit(1)
        }
        break
    }
  }

  return parsed
}

function generateRandomKey(): string {
  return randomBytes(32).toString("hex")
}

function maskKey(key: string): string {
  if (key.length <= 8) return "*".repeat(key.length)
  return key.substring(0, 4) + "*".repeat(key.length - 8) + key.substring(key.length - 4)
}

async function createServiceKey() {
  try {
    const args = parseArgs()

    if (!args.name) {
      console.error("❌ --name is required")
      process.exit(1)
    }

    // Generate or use provided key
    const serviceKey = args.key || generateRandomKey()
    const isGeneratedKey = !args.key

    // Parse expiration date
    let expiresAt: Date | null = null
    if (args.expires) {
      expiresAt = new Date(args.expires + "T23:59:59.999Z")
      if (isNaN(expiresAt.getTime())) {
        console.error("❌ Invalid date format. Use YYYY-MM-DD")
        process.exit(1)
      }
    }

    // Save to database
    const created = await db.serviceKey.create({
      data: {
        key: serviceKey,
        name: args.name,
        expiresAt,
      },
    })

    console.log("✅ Service key created successfully")
    console.log(`Name: ${created.name}`)
    console.log(`Key: ${isGeneratedKey ? serviceKey : maskKey(serviceKey)}`)
    if (expiresAt) {
      console.log(`Expires: ${expiresAt.toISOString().split("T")[0]}`)
    } else {
      console.log("Expires: Never")
    }
    console.log(`Created: ${created.createdAt.toISOString()}`)
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === "P2002") {
      console.error("❌ Service key already exists")
    } else if (error instanceof Error) {
      console.error("❌ Error creating service key:", error.message)
    } else {
      console.error("❌ Unknown error occurred")
    }
    process.exit(1)
  } finally {
    await db.$disconnect()
  }
}

if (require.main === module) {
  createServiceKey()
}

export default createServiceKey
