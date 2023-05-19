import { ethers } from "ethers"
import { useEffect, useState } from "react"
import UserWallet from "./utils/Contracts/UserWallet.json"
import { mint, transferEther } from "./utils/ABI"
import "./App.scss"
import { provider } from "./utils/constants"

import {
  withdrawTokens,
  withdrawEthers,
  getCryptoHash,
  parseBigNum,
  getLogs,
} from "./utils/utils"
import { vitacoreWallet } from "./utils/constants"

function App() {
  const [email, setEmail] = useState("")
  const [walletEOA, setWalletEOA] = useState<any>()
  const [walletSmart, setWalletSmart] = useState<any>(null)

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handleEnterDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAuth()
    }
  }

  const handleAuth = async () => {
    if (email) {
      setWalletSmart(null)
      const userPrivateKey = await getCryptoHash(email)
      console.log(`User private key: ${userPrivateKey}`)
      const newUserWallet = new ethers.Wallet(userPrivateKey)
      console.log("newUserWallet", newUserWallet)
      setWalletEOA(newUserWallet)
      setEmail("")
      const userContractAddress = await getLogs(newUserWallet)
      if (userContractAddress) {
        const userContract = new ethers.Contract(
          userContractAddress,
          UserWallet.abi,
          vitacoreWallet
        )
        setWalletSmart(userContract)
      }
    }
  }

  const deploy = async () => {
    console.log("deploy started")
    const factory = new ethers.ContractFactory(
      UserWallet.abi,
      UserWallet.bytecode,
      vitacoreWallet
    )

    const contract = await factory.deploy(walletEOA.address)
    contract.on("Register", (eoa, contractVersion, commonInfo) => {
      console.log("eoa", eoa)
      console.log("contractVersion", contractVersion)
      console.log("commonInfo", commonInfo)
    })
    console.log("walletSmart", contract.address)
    setWalletSmart(contract)
    console.log("deploy finished")
    return contract.address
  }

  const transferAssets = async (amount: string, transfer: any) => {
    if (walletSmart) {
      transfer(amount, walletSmart.address)
    } else {
      const smartAddress = await deploy()
      transfer(amount, smartAddress)
    }
  }

  useEffect(() => {
    console.log("email", email)
  }, [email])

  useEffect(() => {
    console.log("walletSmart", walletSmart)
  }, [walletSmart])

  return (
    <div className="app">
      <div className="input">
        <div className="input_label">Enter email</div>
        <div className="input_form">
          <input
            onKeyDown={(e) => handleEnterDown(e)}
            value={email}
            type="text"
            className="input_form_field"
            onChange={handleEmailChange}
          />
          <div className="input_form_btn">
            <div onClick={handleAuth}>Go</div>
          </div>
        </div>
        <div className="test">
          <div className="test_btn" onClick={() => transferAssets("100", mint)}>
            Mint
          </div>
          <div
            className="test_btn"
            onClick={() => transferAssets("0.1", transferEther)}
          >
            SendETH
          </div>
        </div>
      </div>
      {walletEOA && (
        <>
          <div className="transaction">
            <div
              className="transaction_btn"
              onClick={() =>
                withdrawTokens(parseBigNum(10), walletSmart, walletEOA)
              }
            >
              Withdraw tokens
            </div>
            <div
              className="transaction_btn"
              style={{ marginLeft: "200px" }}
              onClick={() =>
                withdrawEthers(parseBigNum(0.1), walletSmart, walletEOA)
              }
            >
              Withdraw ethers
            </div>
          </div>
          <div className="address">EOA {walletEOA.address}</div>
          <div className="address-right">
            Smart {walletSmart?.address || ""}
          </div>
        </>
      )}
    </div>
  )
}

export default App
