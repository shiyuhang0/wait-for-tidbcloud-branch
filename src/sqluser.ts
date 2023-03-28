interface BranchInfo {
  projectID: string
  clusterID: string
  branchID: string
}

export class SqlUser {
  host: string
  port: number
  user: string
  password: string

  constructor(host: string, port: number, user: string, password: string) {
    this.host = host
    this.port = port
    this.user = user
    this.password = password
  }
}

export async function sqluser(
  externalID: string,
  log: (message: string) => void
): Promise<SqlUser> {
  log(`Start to get Sql User with externalID ${externalID}`)
  const branchInfo: BranchInfo = JSON.parse(externalID)
  log(`branchInfo  ${externalID}`)
  const projectID = branchInfo.projectID
  const clusterID = branchInfo.clusterID
  const branchID = branchInfo.branchID
  log(
    `Start to get Sql User with projectID ${projectID}, clusterID ${clusterID} and branchID ${branchID}`
  )
  // TODO get sql user from TiDB Cloud API
  return new SqlUser('fakehost', 4000, 'fakeuser', 'fakepassword')
}
