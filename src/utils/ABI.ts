import { ethers } from "ethers"
import { vft, vitacoreWallet } from "./constants"

export const mint = async (amount: string, smartAddress: string) => {
  console.log("minting started")
  const hash = await vft.mint(smartAddress, ethers.utils.parseEther(amount))
  hash.wait()
  console.log("minting finished")
}

export const transferEther = (amount: string, smartAddress: string) => {
  let tx = {
    to: smartAddress,
    value: ethers.utils.parseEther(amount),
    gasLimit: 100000,
  }
  vitacoreWallet.sendTransaction(tx).then((txObj: any) => {
    console.log("txHash", txObj.hash)
  })
}
