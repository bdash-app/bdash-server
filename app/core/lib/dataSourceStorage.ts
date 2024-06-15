export type RunnerDataSource = {
  name: string
  encryptedBody: string
  createdAt: Date
}

export const getDataSources = (): RunnerDataSource[] => {
  const rawDataSources = window.localStorage.getItem("dataSources")
  if (!rawDataSources) return []
  return JSON.parse(rawDataSources).map((rawDataSource) => ({
    name: rawDataSource.name,
    encryptedBody: rawDataSource.encryptedBody,
    createdAt: new Date(rawDataSource.createdAt),
  }))
}

export const addDataSource = (dataSource: RunnerDataSource) => {
  const dataSources = getDataSources()
  dataSources.push(dataSource)
  window.localStorage.setItem("dataSources", JSON.stringify(dataSources))
}
