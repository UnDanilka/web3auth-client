import { ethers } from "ethers"
import { vitacoreWallet, vft, provider } from "./constants"

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
