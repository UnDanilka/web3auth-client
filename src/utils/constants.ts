import { ethers } from "ethers"
import vita20 from "./Vita20.json"
import { createWallet } from "./utils"

export const vita20Address = "0x80688997E89d582a7644616dA38e4B9506117436"
export const vita20Abi = vita20.abi

export const provider = new ethers.providers.JsonRpcProvider(
  "https://rpc.chiadochain.net"
)

export const types = {
  Permit: [
    {
      name: "owner",
      type: "address",
    },
    {
      name: "spender",
      type: "address",
    },
    {
      name: "value",
      type: "uint256",
    },
    {
      name: "nonce",
      type: "uint256",
    },
    {
      name: "deadline",
      type: "uint256",
    },
  ],
}

export const deadline = 100000000000

export const vitacoreWallet = createWallet(
  "pink parent age bulk reunion custom fortune puzzle puppy answer spider baby"
)

export const vft = new ethers.Contract(vita20Address, vita20Abi, vitacoreWallet)

export const transferLimit = ethers.utils.parseEther("100000000000")
