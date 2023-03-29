interface BranchInfo {
  project_id: string
  cluster_id: string
  branch_id: number
}

export class SqlUser {
  host: string
  user: string
  password: string

  constructor(host: string, user: string, password: string) {
    this.host = host
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
  const projectID = branchInfo.project_id
  const clusterID = branchInfo.cluster_id
  const branchID = branchInfo.branch_id
  if (
    projectID === undefined ||
    clusterID === undefined ||
    branchID === undefined
  ) {
    throw new Error('Invalid externalID from TiDB Cloud Branch check')
  }
  log(
    `Start to get Sql User with projectID ${projectID}, clusterID ${clusterID} and branchID ${branchID}`
  )
  // TODO get sql user from TiDB Cloud API
  return new SqlUser('fakehost', 'fakeuser', 'fakepassword')
}
