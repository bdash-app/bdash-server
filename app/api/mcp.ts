import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js"
import { BlitzApiHandler } from "blitz"
import db, { BdashQuery } from "db"
import { z } from "zod"
import { searchBdashQueries } from "app/core/lib/searchBdashQueries"

type BdashQueryRow = Pick<
  BdashQuery,
  "id" | "id_hash" | "title" | "description" | "query_sql" | "updatedAt" | "data_source_info"
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
  const queryUrl = `${process.env.WEB_HOST}/query/${query.id_hash}`
  return `${index + 1}. **${query.title}**

URL: ${queryUrl}
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
  "Search SQL queries on Bdash Server. You can search by keyword (searches in title, description, and SQL content) or provide a Bdash Server query URL to get specific query details.",
  {
    keyword: z
      .string()
      .describe(
        "Search keyword or Bdash Server query URL (format: https://domain/query/query_hash)"
      ),
  },
  async ({ keyword }) => {
    if (!keyword || typeof keyword !== "string") {
      throw new Error("Search keyword or URL is required")
    }

    try {
      // Check if input is a Bdash Server query URL
      const urlPattern = new RegExp(`^https?://[^/]+/query/([a-zA-Z0-9_-]+)$`)
      const urlMatch = keyword.match(urlPattern)

      if (urlMatch) {
        // Extract query_hash from URL
        const queryHash = urlMatch[1]

        // Query database directly by id_hash
        const query = await db.bdashQuery.findUnique({
          where: { id_hash: queryHash },
          select: {
            id: true,
            id_hash: true,
            title: true,
            description: true,
            query_sql: true,
            updatedAt: true,
            data_source_info: true,
          },
        })

        if (!query) {
          return {
            content: [
              {
                type: "text",
                text: `Query not found for URL: ${keyword}`,
              },
            ],
          }
        }

        return {
          content: [
            {
              type: "text",
              text: `Query details for URL: ${keyword}\n\n${formatSearchResult(query, 0)}`,
            },
          ],
        }
      } else {
        // Perform keyword search
        const limit = 10

        const searchResults = await searchBdashQueries(
          keyword,
          {
            id: true,
            id_hash: true,
            title: true,
            description: true,
            query_sql: true,
            updatedAt: true,
            data_source_info: true,
          },
          limit
        )

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
      }
    } catch (error) {
      throw new Error(`Error occurred during search: ${error.message}`)
    }
  }
)

mcpServer.connect(transport)

const validateServiceKey = async (serviceKey: string): Promise<string | null> => {
  const service = await db.serviceKey.findUnique({ where: { key: serviceKey } })
  if (!service) {
    return null
  }

  // Check expiration
  if (service.expiresAt && service.expiresAt < new Date()) {
    return null
  }

  return service.name
}

const validateAccessToken = async (accessToken: string | undefined): Promise<void> => {
  if (!accessToken) {
    throw new Error("Unauthorized")
  }

  const serviceName = await validateServiceKey(accessToken)
  if (serviceName) {
    console.log(`MCP request authenticated with service key: ${serviceName}`)
    return
  }

  const user = await db.user.findUnique({ where: { accessToken } })
  if (!user) {
    throw new Error("Unauthorized")
  }
}

const handler: BlitzApiHandler = async (req, res) => {
  if (req.body.method === "tools/call") {
    const accessToken = req.headers.authorization?.split(" ")[1]
    try {
      await validateAccessToken(accessToken)
    } catch (error) {
      console.error("Unauthorized MCP request")
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

export default handler
