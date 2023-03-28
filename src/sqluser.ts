interface BranchInfo {
  project_id: string
  cluster_id: string
  branch_id: number
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
  log(`branchInfo  ${branchInfo}`)
  const projectID = branchInfo.project_id
  const clusterID = branchInfo.cluster_id
  const branchID = branchInfo.branch_id
  log(
    `Start to get Sql User with projectID ${projectID}, clusterID ${clusterID} and branchID ${branchID}`
  )
  // TODO get sql user from TiDB Cloud API
  return new SqlUser('fakehost', 4000, 'fakeuser', 'fakepassword')
}
