import { DefaultCtx, SessionContext, SimpleRolesIsAuthorized } from "blitz"
import { User } from "db"

// Note: You should switch to Postgres and then use a DB enum for role type
export type Role = "ADMIN" | "USER"

declare module "blitz" {
  export interface Ctx extends DefaultCtx {
    session: SessionContext
  }
  export interface Session {
    isAuthorized: SimpleRolesIsAuthorized<Role>
    PublicData: {
      userId: User["id"]
      role: Role
    }
  }
}
export type RunnerDataSourceFormValue = {
  dataSourceName: string
  host: string
  port: number
  username: string
  password: string
  database: string
  ssl: boolean
}

export type QueryResultValue = string | number | boolean | null
export type QueryResult = {
  columns: string[]
  rows: QueryResultValue[][]
  error: string | null
}
