import { ethers } from "ethers"
import { sha256 } from "crypto-hash"
import { v4 as uuidv4 } from "uuid"

import { provider, vita20Address, vitacoreWallet } from "./constants"

export function createWallet(privateKey: string) {
  const userWallet = new ethers.Wallet(privateKey)
  const connectedWallet = userWallet.connect(provider)
  return connectedWallet
}

export const getSignature = async (
  amount: string,
  nonce: string,
  walletSmart: any,
  walletEOA: any
) => {
  const hash = ethers.utils.solidityKeccak256(
    ["address", "uint256", "string", "address"],
    [vitacoreWallet.address, amount, nonce, walletSmart.address]
  )

  const messageHashBin = ethers.utils.arrayify(hash)
  const signature = await walletEOA.signMessage(messageHashBin)
  return signature
}

export const withdrawTokens = async (
  amount: string,
  walletSmart: any,
  walletEOA: any
) => {
  console.log("transfer started")
  const nonce = uuidv4()
  const signature = await getSignature(amount, nonce, walletSmart, walletEOA)
  const txHash = await walletSmart.withdrawToken(
    vita20Address,
    amount,
    nonce,
    signature
  )
  await txHash.wait()
  console.log("transfer finished")
}

export const withdrawEthers = async (
  amount: string,
  walletSmart: any,
  walletEOA: any
) => {
  console.log("transfer started")
  const nonce = uuidv4()

  const signature = await getSignature(amount, nonce, walletSmart, walletEOA)
  const txHash = await walletSmart.withdrawEth(amount, nonce, signature)
  await txHash.wait()
  console.log("transfer finished")
}

export const getCryptoHash = async (email: string) => {
  const cryptoHash = await sha256(email)
  return cryptoHash
}

export const parseBigNum = (num: number) => (num * 10 ** 18).toString()

export const getLogs = async (walletEOA: any) => {
  const eventSignature: string = "Register(address,string)"
  const eventTopic: string = ethers.utils.id(eventSignature)
  const userWalletVersion: string = "version4"
  const userWalletVersionHEX: string = ethers.utils.id(userWalletVersion)
  const EOAAddressArray = walletEOA.address.split("")
  EOAAddressArray.splice(0, 2)
  const parsedEOAAddress = [
    "0",
    "x",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    ...EOAAddressArray,
  ].join("")

  const filter: any = {
    fromBlock: 0,
    topics: [eventTopic, parsedEOAAddress, userWalletVersionHEX],
  }
  const logs = await provider.getLogs(filter)
  console.log("logs", logs)
  console.log("smartWalletAddress", logs[0]?.address)

  return logs[0]?.address
}
