import { ethers } from "ethers"
import { useEffect, useState } from "react"
import "./App.scss"

import {
  burn,
  checkAllowance,
  checkBalance,
  createWallet,
  mint,
  transferTokens,
  signPermission,
  getCryptoHash,
} from "./utils/utils"
// import { addNewWallet, getEmails } from "./utils/API"

function App() {
  const [email, setEmail] = useState("")
  const [userWallet, setUserWallet] = useState<any>()

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
      setUserWallet(newUserWallet)
      setEmail("")
    }
  }

  useEffect(() => {
    console.log("email", email)
  }, [email])

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
          <div className="test_btn" onClick={() => mint(userWallet)}>
            Mint
          </div>
          <div className="test_btn" onClick={() => checkBalance(userWallet)}>
            Check balance
          </div>
          <div className="test_btn" onClick={burn}>
            Burn
          </div>
          <div className="test_btn" onClick={() => checkAllowance(userWallet)}>
            Check allowance
          </div>
          <div
            className="test_btn"
            onClick={() => signPermission(userWallet, "10")}
          >
            Sign permission
          </div>
        </div>
      </div>
      {userWallet && (
        <>
          <div className="transaction">
            <div
              className="transaction_btn"
              onClick={() => transferTokens("10", userWallet)}
            >
              Transfer tokens
            </div>
          </div>
          <div className="address">{userWallet.address}</div>
        </>
      )}
    </div>
  )
}

export default App
