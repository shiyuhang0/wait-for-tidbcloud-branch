import DigestFetch from '../node_modules/digest-fetch'

interface BranchInfo {
  project_id: string
  cluster_id: string
  branch_id: string
  branch_name: string
}

export class SqlUser {
  host: string
  username: string
  password: string

  constructor(host: string, user: string, password: string) {
    this.host = host
    this.username = user
    this.password = password
  }
}

const host = 'https://api.dev.tidbcloud.com'

export async function sqluser(
  externalID: string,
  log: (message: string) => void,
  publicKey: string,
  privateKey: string
): Promise<SqlUser> {
  log(`Start to get Sql User with externalID ${externalID}`)
  const branchInfo: BranchInfo = JSON.parse(externalID)
  const projectID = branchInfo.project_id
  const clusterID = branchInfo.cluster_id
  const branchID = branchInfo.branch_id
  const branchName = branchInfo.branch_name
  if (
    projectID === undefined ||
    clusterID === undefined ||
    branchID === undefined ||
    branchName === undefined
  ) {
    throw new Error('Invalid externalID from TiDB Cloud Branch check')
  }

  const url = `${host}/api/internal/projects/${projectID}/clusters/${clusterID}/branches/shiyuhang0-patch-5_13_b38da50/users`

  log(`request url to get sql user: ${url}`)

  const client = new DigestFetch(publicKey, privateKey)
  const resp = await client.fetch(url, {method: 'POST'})
  const data = await resp.json()
  if (data['username'] === undefined || data['password'] === undefined) {
    throw new Error(
      `Can not get sql user with response: ${JSON.stringify(data)}`
    )
  }
  return new SqlUser('', data['username'], data['password'])
}
