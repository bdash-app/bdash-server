import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js"
import { BlitzApiHandler } from "blitz"
import db, { BdashQuery } from "db"
import { z } from "zod"

type BdashQueryRow = Pick<
  BdashQuery,
  "id" | "title" | "description" | "query_sql" | "updatedAt" | "data_source_info"
>

interface DataSourceInfo {
  type?: string
  host?: string
  port?: string | number
  database?: string
}

const formatSearchResult = (query: BdashQueryRow, index: number): string => {
  const dataSourceInfo = query.data_source_info
    ? (JSON.parse(query.data_source_info) as DataSourceInfo)
    : null
  return `${index + 1}. **${query.title}**

Data Source:
    - Type: ${dataSourceInfo?.type ?? "Unknown"}
    - Host: ${dataSourceInfo?.host ?? "Unknown"}
    - Port: ${dataSourceInfo?.port ?? "Unknown"}
    - Database: ${dataSourceInfo?.database ?? "Unknown"}
Description: ${query.description}
Updated: ${query.updatedAt.toISOString()}
SQL:
\`\`\`sql
${query.query_sql}
\`\`\`
`
}

const mcpServer = new McpServer(
  { name: "Bdash Server", version: "1.0.0" },
  {
    capabilities: {
      tools: {
        listChanged: true,
      },
    },
  }
)
const transport = new StreamableHTTPServerTransport({
  sessionIdGenerator: undefined, // Stateless mode
})

mcpServer.tool(
  "search_bdash_queries",
  "Search SQL queries on Bdash Server. You can search by title, description, or SQL content.",
  {
    keyword: z
      .string()
      .describe("Search keyword (searches in title, description, and SQL content)"),
  },
  async ({ keyword }) => {
    if (!keyword || typeof keyword !== "string") {
      throw new Error("Search keyword is required")
    }

    try {
      const likeArg = `%${keyword}%`

      const searchResults = await db.$queryRaw<BdashQueryRow[]>`
        select
            id,
            title,
            description,
            query_sql,
            updatedAt,
            data_source_info
        from
            BdashQuery
        where
            title like ${likeArg}
            or description like ${likeArg}
            or query_sql like ${likeArg}
        order by
            updatedAt desc
        limit
            20
        ;`

      return {
        content: [
          {
            type: "text",
            text: `Found ${
              searchResults.length
            } queries for keyword "${keyword}":\n\n${searchResults
              .map((query, index) => formatSearchResult(query, index))
              .join("\n")}`,
          },
        ],
      }
    } catch (error) {
      throw new Error(`Error occurred during search: ${error.message}`)
    }
  }
)

mcpServer.connect(transport)

const validateAccessToken = async (accessToken: string | undefined): Promise<void> => {
  if (!accessToken) {
    throw new Error("Unauthorized")
  }
  const user = await db.user.findUnique({ where: { accessToken } })
  if (!user) {
    throw new Error("Unauthorized")
  }
}

const handler: BlitzApiHandler = async (req, res) => {
  console.debug("Received MCP request\n Headers:", req.headers, "\n Body:", req.body)

  if (req.body.method === "tools/call") {
    const accessToken = req.headers.authorization?.split(" ")[1]
    try {
      await validateAccessToken(accessToken)
    } catch (error) {
      res.status(401).json({
        jsonrpc: "2.0",
        error: { code: -32000, message: "Unauthorized" },
      })
      return
    }
  }

  try {
    await transport.handleRequest(req, res, req.body)
  } catch (error) {
    console.error("Error handling MCP request:", error)
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          // http://www.jsonrpc.org/specification#error_object
          code: -32603,
          message: "Internal server error",
        },
        id: null,
      })
      return
    }
  }
}

process.on("SIGINT", async () => {
  console.info("Shutting down server...")
  try {
    console.info("Closing transport")
    await transport.close()
  } catch (error) {
    console.error("Error closing transport:", error)
  }

  await mcpServer.close()
  console.info("Server shutdown complete")
  process.exit(0)
})

export default handler
