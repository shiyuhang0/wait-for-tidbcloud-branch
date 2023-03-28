# wait-for-tidbcloud-branch

A JavaScript action that works with [TiDB Cloud App](https://github.com/apps/tidb-cloud). It allows you to:

- Wait for TiDB Cloud Branch check which created by TiDB Cloud App to complete.
- Generate a SQL user for this TiDB Cloud branch.

## Usage

```
uses: shiyuhang0/wait-for-tidbcloud-branch@v0
with:
  token: ${{ secrets.GITHUB_TOKEN }}
  publicKey: ${{ secrets.TIDB_CLOUD_API_PUBLIC_KEY }}
  privateKey: ${{ secrets.TIDB_CLOUD_API_PRIVATE_KEY }}
```

## Inputs

The action supports the following inputs:
- token - (required) The GitHub token to use for making API requests. Typically, this would be set to ${{ secrets.GITHUB_TOKEN }}.
- publicKey - (optional) The public key of TiDB Cloud api. Generate it from [TiDB Cloud](https://tidbcloud.com/).
- privateKey - (optional) The private key of TiDB Cloud api. Generate it from [TiDB Cloud](https://tidbcloud.com/).
- intervalSeconds - (optional) The interval seconds to check the status of TiDB Cloud Branch check. Default is 10.
- timeoutSeconds - (optional) The timeout seconds to wait for TiDB Cloud Branch check. Default is 300.

## Outputs

The action provide the following outputs:

- host - The host of the TiDB Cloud branch.
- user - The user of the TiDB Cloud branch.
- password - The password of the TiDB Cloud branch.
- port - The port of the TiDB Cloud branch.

Note that you will get empty output if you don't provide `apiPublicKey` and `apiPrivateKey`.

## Best practices

Set TiDB Cloud API publicKey and privateKey in your action secrets, and use them in your workflow.

Here is an example of how to use this action in a single job:

```
steps:
  - name: Wait for TiDB Cloud branch ready
    uses: shiyuhang0/wait-for-tidbcloud-branch@v0
    id: wait-for-branch
    with:
      token: ${{ secrets.GITHUB_TOKEN }}
      publicKey: ${{ secrets.TIDB_CLOUD_API_PUBLIC_KEY }}
      privateKey: ${{ secrets.TIDB_CLOUD_API_PRIVATE_KEY }}

  - name: Get mysql
    uses: shogo82148/actions-setup-mysql@v1
    
  - name: Run test
    run: mysql --connect-timeout 15 -u ${{steps.wait-for-branch.outputs.user}} -h ${{steps.wait-for-branch.outputs.host}} -P ${{steps.wait-for-branch.outputs.port}} -D test -p${{ steps.wait-for-branch.outputs.password }}
```

Here is an example of how to use this action for multiple jobs:

```
jobs:
  setup:
    runs-on: ubuntu-latest
    id: wait-for-branch
    steps:
      - uses: actions/checkout@v3
      - uses: ./
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          publicKey: ${{ secrets.TIDB_CLOUD_API_PUBLIC_KEY }}
          privateKey: ${{ secrets.TIDB_CLOUD_API_PRIVATE_KEY }}
    outputs:
      user: ${{ steps.wait-for-branch.outputs.user }}
      host: ${{ steps.wait-for-branch.outputs.host }}
      port: ${{ steps.wait-for-branch.outputs.port }}
      password: ${{ steps.wait-for-branch.outputs.password }}

  test:
    needs: setup
    runs-on: ubuntu-latest
    id: wait-for-branch
    steps:
      - name: Use the output
        run: |
          echo "The host is ${{ steps.wait-for-branch.outputs.host }}"
          echo "The user is ${{ steps.wait-for-branch.outputs.user }}"
          echo "The password is ${{ steps.wait-for-branch.outputs.password }}"
          echo "The port is ${{ steps.wait-for-branch.outputs.port }}"         
```


## License

See [LICENSE](LICENSE).

## Dev Guide

See [docs/dev_guide.md](docs/dev_guide.md) for more details.


