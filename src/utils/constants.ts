import { ethers } from "ethers"
import vita20 from "./Contracts/Vita20.json"
import { createWallet } from "./utils"

export const vita20Address = "0x80688997E89d582a7644616dA38e4B9506117436"
export const vita20Abi = vita20.abi

export const provider = new ethers.providers.JsonRpcProvider(
  "https://rpc.chiadochain.net"
)

export const vitacoreWallet = createWallet(
  "c722fecd936e271c14c2afa311649564659b12d64eaac6db6bfe9a525bbd2b0f"
)

export const vft = new ethers.Contract(vita20Address, vita20Abi, vitacoreWallet)
