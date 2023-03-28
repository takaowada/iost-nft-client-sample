# IRC722 NFT コントラクトのクライアントサンプル

## ローカルIOSTノードの起動

NFT管理者サンプルで起動

## インストール

```shell
yarn create vite iost-nft-sample --template react-ts
cd iost-nft-sample
yarn add @mui/material @emotion/react @emotion/styled @mui/x-data-grid
yarn add iost
yarn add react-hook-form
```

## NFT 一覧の取得

```shell
curl -X POST http://127.0.0.1:30001/getContractStorage -d '{"id":"ContractG8uc3Dqe7mVgHRCGH6VJTED1a1vDFCx7EndXWePgxnAB","key":"userdata.alice","by_longest_chain":true}' | jq .
```

## トークンの発行

```shell
docker exec -t iserver iwallet call "ContractG8uc3Dqe7mVgHRCGH6VJTED1a1vDFCx7EndXWePgxnAB" "issue" "[1,\"bobby\"]" -a alice --chain_id 1020
```

## トークン一覧の取得

```shell
curl -X POST http://127.0.0.1:30001/getContractStorage -d '{"id":"ContractG8uc3Dqe7mVgHRCGH6VJTED1a1vDFCx7EndXWePgxnAB","key":"userdata.bobby","by_longest_chain":true}' | jq .
```

### トークン情報の取得

```shell
docker exec -t iserver iwallet call "ContractG8uc3Dqe7mVgHRCGH6VJTED1a1vDFCx7EndXWePgxnAB" "tokenInfo" "[10000001]" -a bobby --chain_id 1020
```

### トークンの転送

```shell
docker exec -t iserver iwallet call "Contract9ggUSExgmhDaEyYsZW35yAjKbJ9wmq1axpE9CZLni1MH" "transfer" "[10000001, \"alice\", \"bobby\", \"1\", \"transfer\"]" -a alice --chain_id 1020
```

### NFTの焼却

```shell
docker exec -t iserver iwallet call "ContractG8uc3Dqe7mVgHRCGH6VJTED1a1vDFCx7EndXWePgxnAB" "burn" "[4]" -a alice --chain_id 1020
```

### ブラックリストへの登録

```shell
docker exec -t iserver iwallet call "ContractG8uc3Dqe7mVgHRCGH6VJTED1a1vDFCx7EndXWePgxnAB" "addblack" "[\"bobby\"]" -a alice --chain_id 1020
```

### ブラックリストへの登録解除

```shell
docker exec -t iserver iwallet call "ContractG8uc3Dqe7mVgHRCGH6VJTED1a1vDFCx7EndXWePgxnAB" "rmblack" "[\"bobby\"]" -a alice --chain_id 1020
```

### NFTをロック

```shell
docker exec -t iserver iwallet call "ContractG8uc3Dqe7mVgHRCGH6VJTED1a1vDFCx7EndXWePgxnAB" "updatelock" "[999, \"true\"]" -a alice --chain_id 1020
```

### NFTをアンロック

```shell
docker exec -t iserver iwallet call "ContractG8uc3Dqe7mVgHRCGH6VJTED1a1vDFCx7EndXWePgxnAB" "updatelock" "[999, \"false\"]" -a alice --chain_id 1020
```

### マイグレーション（焼却）申請

```shell
docker exec -t iserver iwallet call "ContractG8uc3Dqe7mVgHRCGH6VJTED1a1vDFCx7EndXWePgxnAB" "applymigrate" "[999,\"target\",\"bobby\"]" -a bobby --chain_id 1020
```

### マイグレーション（焼却）承認

否認するには、"True" を それ以外にする。

```shell
docker exec -t iserver iwallet call "ContractG8uc3Dqe7mVgHRCGH6VJTED1a1vDFCx7EndXWePgxnAB" "apprmigrate" "[999,\"True\"]" -a alice --chain_id 1020
```

### ログの取得

```shell
curl -X POST http://127.0.0.1:30001/getContractStorage -d '{"id":"ContractG8uc3Dqe7mVgHRCGH6VJTED1a1vDFCx7EndXWePgxnAB","key":"minlogNum","by_longest_chain":true}' | jq .

curl -X POST http://127.0.0.1:30001/getContractStorage -d '{"id":"ContractG8uc3Dqe7mVgHRCGH6VJTED1a1vDFCx7EndXWePgxnAB","key":"maxlogNum","by_longest_chain":true}' | jq .

curl -X POST http://127.0.0.1:30001/getContractStorage -d '{"id":"ContractG8uc3Dqe7mVgHRCGH6VJTED1a1vDFCx7EndXWePgxnAB","key":"log1","by_longest_chain":true}' | jq .
```
