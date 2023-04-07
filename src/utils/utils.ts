import { ethers } from "ethers"
import {
  vitacoreWallet,
  vft,
  provider,
  types,
  deadline,
  transferLimit,
} from "./constants"

export const createWallet = (mnemonic: string) => {
  const walletMnemonic = ethers.Wallet.fromMnemonic(mnemonic)

  const connectedWallet = walletMnemonic.connect(provider)
  return connectedWallet
}

export const transferTokens = async (amount: string, userWallet: any) => {
  console.log("transfer started")

  const transferFromHash = await vft.transferFrom(
    userWallet.address,
    vitacoreWallet.address,
    ethers.utils.parseEther(amount),
    {
      gasPrice: await getGasPrice(),
      gasLimit: 80000,
    }
  )

  await transferFromHash.wait(2)
  console.log("transfer finished")
}

const getChainId = async () => {
  const chainId = (await provider.getNetwork()).chainId
  return chainId
}

export const getDomain = async () => {
  const domain = {
    name: await vft.name(),
    version: "1",
    chainId: await getChainId(),
    verifyingContract: vft.address,
  }

  return domain
}

export const getGasPrice = async () => {
  const gasPrice = await provider.getGasPrice()
  return gasPrice
}

const getSignature = async (userWallet: any) => {
  const nonces = await vft.nonces(userWallet.address)

  const values = {
    owner: userWallet.address,
    spender: vitacoreWallet.address,
    value: transferLimit,
    nonce: nonces,
    deadline: deadline,
  }

  const domain = await getDomain()

  const signature = await userWallet._signTypedData(domain, types, values)

  const sig = ethers.utils.splitSignature(signature)

  return sig
}

export const signPermission = async (userWallet: any) => {
  console.log("signing permission started")

  const sig = await getSignature(userWallet)

  let permitHash = await vft.permit(
    userWallet.address,
    vitacoreWallet.address,
    transferLimit,
    deadline,
    sig.v,
    sig.r,
    sig.s,
    {
      gasPrice: await getGasPrice(),
      gasLimit: 80000,
    }
  )

  await permitHash.wait(2)
  console.log("signing permission finished")
}

export const checkAllowance = async (userWallet: any) => {
  const tokenAllowance = await vft.allowance(
    userWallet.address,
    vitacoreWallet.address
  )

  console.log(`Check allowance of tokenReceiver: ${tokenAllowance}`)
  return tokenAllowance
}

export const checkBalance = async (userWallet: any) => {
  const vitacoreWalletBalance = await vft.balanceOf(vitacoreWallet.address)
  const userWalletBalance = await vft.balanceOf(userWallet.address)

  console.log(`vitacoreWallet balance: ${vitacoreWalletBalance / 10 ** 18}`)
  console.log(`userWallet balance: ${userWalletBalance / 10 ** 18}`)
}

export const burn = async () => {
  const hash = await vft.burn(ethers.utils.parseEther("10"))
  console.log(hash)
  hash.wait()
}

export const mint = async (userWallet: any) => {
  console.log("minting started")
  const hash = await vft.mint(
    userWallet.address,
    ethers.utils.parseEther("100")
  )
  hash.wait()
  console.log("minting finished")
}
