import { ethers } from "ethers"
import { sha256 } from "crypto-hash"

import { provider, vita20Address, vitacoreWallet } from "./constants"

export function createWallet(privateKey: string) {
  const userWallet = new ethers.Wallet(privateKey)
  const connectedWallet = userWallet.connect(provider)
  return connectedWallet
}

export const getSignature = async (
  amount: string,
  nonce: number,
  walletSmart: any,
  walletEOA: any
) => {
  const hash = ethers.utils.solidityKeccak256(
    ["address", "uint256", "uint256", "address"],
    [vitacoreWallet.address, amount, nonce, walletSmart.address]
  )

  const messageHashBin = ethers.utils.arrayify(hash)
  const signature = await walletEOA.signMessage(messageHashBin)
  return signature
}

export const nonce = 18

export const withdrawTokens = async (
  amount: string,
  walletSmart: any,
  walletEOA: any
) => {
  console.log("transfer started")
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
