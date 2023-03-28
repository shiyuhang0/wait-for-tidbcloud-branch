interface BranchInfo {
  projectID: number
  clusterID: number
  branchID: number
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
  const branchInfo: BranchInfo = JSON.parse(externalID)
  const {projectID, clusterID, branchID} = branchInfo
  log(
    `Start to get Sql User with projectID ${projectID}, clusterID ${clusterID} and branchID ${branchID}`
  )
  // TODO get sql user from TiDB Cloud API
  return new SqlUser('fakehost', 4000, 'fakeuser', 'fakepassword')
}
