import db from "db"

interface DeleteServiceKeyArgs {
  name: string
}

function parseArgs(): DeleteServiceKeyArgs {
  const args = process.argv.slice(2)
  const parsed: DeleteServiceKeyArgs = { name: "" }

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
    }
  }

  return parsed
}

function maskKey(key: string): string {
  if (key.length <= 8) return "*".repeat(key.length)
  return key.substring(0, 4) + "*".repeat(key.length - 8) + key.substring(key.length - 4)
}

async function deleteServiceKey() {
  try {
    const args = parseArgs()

    if (!args.name) {
      console.error("❌ --name is required")
      console.log('Usage: npm run task task/delete_service_key.ts -- --name "service-name"')
      process.exit(1)
    }

    console.log(`Searching for service key: "${args.name}"...`)

    const serviceKey = await db.serviceKey.findUnique({
      where: { name: args.name },
    })

    if (!serviceKey) {
      console.error(`❌ Service key with name "${args.name}" not found`)
      process.exit(1)
    }

    console.log(`Found service key:`)
    console.log(`  Name: ${serviceKey.name}`)
    console.log(`  Key: ${maskKey(serviceKey.key)}`)
    console.log(`  Created: ${serviceKey.createdAt.toISOString()}`)
    if (serviceKey.expiresAt) {
      console.log(`  Expires: ${serviceKey.expiresAt.toISOString().split("T")[0]}`)
    } else {
      console.log(`  Expires: Never`)
    }

    await db.serviceKey.delete({
      where: { id: serviceKey.id },
    })

    console.log(`✅ Service key "${args.name}" has been deleted successfully`)
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Error deleting service key:", error.message)
    } else {
      console.error("❌ Unknown error occurred")
    }
    process.exit(1)
  } finally {
    await db.$disconnect()
  }
}

if (require.main === module) {
  deleteServiceKey()
}

export default deleteServiceKey
