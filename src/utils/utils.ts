import { ethers } from "ethers"
import { sha256 } from "crypto-hash"

import { vitacoreWallet, vft, provider } from "./constants"

export function createWallet(privateKey: string) {
  const userWallet = new ethers.Wallet(privateKey)

  const connectedWallet = userWallet.connect(provider)
  return connectedWallet
}

export const transferTokens = async (amount: string, userWallet: any) => {
  console.log("transfer started")

  console.log("transfer finished")
}

export const transferEthers = async (amount: string, userWallet: any) => {}

export const checkBalance = async (userWallet: any) => {
  const vitacoreWalletBalance = await vft.balanceOf(vitacoreWallet?.address)
  const userWalletBalance = await vft.balanceOf(userWallet.address)

  console.log(`vitacoreWallet balance: ${vitacoreWalletBalance / 10 ** 18}`)
  console.log(`userWallet balance: ${userWalletBalance / 10 ** 18}`)
}

export const getCryptoHash = async (email: string) => {
  const cryptoHash = await sha256(email)
  return cryptoHash
}
