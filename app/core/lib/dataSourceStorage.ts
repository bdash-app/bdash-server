export type RunnerDataSource = {
  type: string
  host: string
  port: number
  database: string
  username: string
  dataSourceName: string
  encryptedBody: string
  createdAt: Date
}

export const getDataSources = (): RunnerDataSource[] => {
  const rawDataSources = window.localStorage.getItem("dataSources")
  if (!rawDataSources) return []
  return JSON.parse(rawDataSources).map(
    (rawDataSource) =>
      ({
        ...rawDataSource,
        createdAt: new Date(rawDataSource.createdAt),
      } as RunnerDataSource)
  )
}

export const addDataSource = (dataSource: RunnerDataSource) => {
  const dataSources = getDataSources()
  dataSources.push(dataSource)
  window.localStorage.setItem("dataSources", JSON.stringify(dataSources))
}

export const deleteDataSource = (dataSource: RunnerDataSource) => {
  const dataSources = getDataSources()
  const newDataSources = dataSources.filter((ds) => ds.encryptedBody !== dataSource.encryptedBody)
  window.localStorage.setItem("dataSources", JSON.stringify(newDataSources))
}
