// import 'isomorphic-fetch'
// // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// // @ts-ignore
// import * as DigestFetch from 'digest-fetch'

// eslint-disable-next-line import/named
import fetch, {RequestInit} from 'node-fetch'
import crypto from 'crypto'

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

  const resp = fetchData(log, url, publicKey, privateKey)

  log(`Got response ${resp}`)

  return new SqlUser('fakehost', 'fakeuser', 'fakepassword')
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function fetchData(
  log: (message: string) => void,
  url: string,
  publicKey: string,
  privateKey: string
) {
  const nonce = crypto.randomBytes(8).toString('hex').slice(0, 16)
  const date = new Date().toUTCString().replace('GMT', 'UTC')

  const ha1 = crypto
    .createHash('md5')
    .update(`${publicKey}:MyRealm:${privateKey}`)
    .digest('hex')

  const ha2 = crypto.createHash('md5').update(`GET:${url}`).digest('hex')

  const nc = '00000001'
  const cnonce = crypto.randomBytes(8).toString('hex')

  const response = crypto
    .createHash('md5')
    .update(`${ha1}:${nonce}:${nc}:${cnonce}:auth:${ha2}`)
    .digest('hex')

  const authHeader = `Digest username="${publicKey}", realm="MyRealm", nonce="${nonce}", uri="${url}", qop=auth, nc="${nc}", cnonce="${cnonce}", response="${response}", opaque=""`

  const headers = {
    Authorization: authHeader,
    Date: date,
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.5',
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache'
  }

  const options: RequestInit = {
    headers
  }

  const resp = await fetch(`https://api.dev.tidbcloud.com${url}`, options)
  // eslint-disable-next-line no-console
  console.log(resp)
  log(`Got response ${resp}`)
  return resp
}
