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
  type: string
  host: string
  port: number
  username: string
  password: string
  database: string
  ssl: boolean
}

export type QueryResultValue = string | number
export type QueryResult = {
  columns: string[]
  rows: QueryResultValue[][]
  error: string | null
}

export type ChartType = {
  type: "line" | "scatter" | "bar" | "area" | "pie"
  xColumn: string
  yColumns: Array<string>
  groupColumns: Array<string>
  stacking: 0 | string
}
