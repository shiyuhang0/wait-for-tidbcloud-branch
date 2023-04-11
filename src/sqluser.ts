import DigestClient from '../node_modules/digest-fetch'

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
  log: (message: string) => void,
  publicKey: string,
  privateKey: string
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
  const url = `/api/internal/projects/${projectID}/clusters/${clusterID}/branches`

  log(`publicKey: ${publicKey},privateKey: ${privateKey}`)

  const resp = await new DigestClient(publicKey, privateKey).fetch(url)
  // eslint-disable-next-line no-console
  console.log(resp)

  // // eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
  // const exec = require('@actions/exec')
  //
  // let myOutput = ''
  // let myError = ''
  //
  // const options = {
  //   listeners: {
  //     stdout: (data: Buffer) => {
  //       myOutput += data.toString()
  //     },
  //     stderr: (data: Buffer) => {
  //       myError += data.toString()
  //     }
  //   }
  // }
  //
  // await exec.exec(
  //   "curl --digest --user 'SpOBpok4:a2e82f10-accf-477e-9fcf-14776869be0d' --request GET --url https://api.dev.tidbcloud.com/api/internal/projects/163469/clusters/2939253/branches",
  //   [],
  //   options
  // )
  //
  // log(`stdout: ${myOutput},error: ${myError}`)

  return new SqlUser('fakehost', 'fakeuser', 'fakepassword')
}
