import { ethers } from "ethers"
import { useEffect, useState } from "react"
import UserWallet from "./utils/UserWallet.json"
import "./App.scss"

import {
  checkBalance,
  mint,
  transferTokens,
  transferEthers,
  getCryptoHash,
} from "./utils/utils"
import { vitacoreWallet } from "./utils/constants"
import { addNewWallet, getWallets } from "./utils/API"

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
      const userPrivateKey = await getCryptoHash(email)
      console.log(`User private key: ${userPrivateKey}`)
      const newUserWallet = new ethers.Wallet(userPrivateKey)
      console.log("newUserWallet", newUserWallet)
      setWalletEOA(newUserWallet)
      setEmail("")
      const data = await getWallets()
      const walletSmartMatch = data[newUserWallet.address]
      if (walletSmartMatch) {
        setWalletSmart(walletSmartMatch)
      }
    }
  }

  useEffect(() => {
    console.log("email", email)
  }, [email])

  useEffect(() => {
    console.log("walletSmart", walletSmart)
  }, [walletSmart])

  const deploy = async () => {
    const factory = new ethers.ContractFactory(
      UserWallet.abi,
      UserWallet.bytecode,
      vitacoreWallet
    )

    const contract = await factory.deploy(walletEOA.address)
    console.log("walletSmart", contract.address)
    setWalletSmart(contract)
    addNewWallet(walletEOA.address, contract.address)
  }

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
          <div className="test_btn" onClick={deploy}>
            Deploy
          </div>
          <div className="test_btn" onClick={() => mint(walletEOA)}>
            Mint
          </div>
          <div className="test_btn" onClick={() => checkBalance(walletEOA)}>
            Check balance
          </div>
        </div>
      </div>
      {walletEOA && (
        <>
          <div className="transaction">
            <div
              className="transaction_btn"
              onClick={() => transferTokens("10", walletEOA)}
            >
              Transfer tokens
            </div>
            <div
              className="transaction_btn"
              onClick={() => transferEthers("10", walletEOA)}
            >
              Transfer ethers
            </div>
          </div>
          <div className="address">{walletEOA.address}</div>
        </>
      )}
    </div>
  )
}

export default App
