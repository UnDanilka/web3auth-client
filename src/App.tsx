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
} from "./utils/utils"
import { addNewWallet, getEmails } from "./utils/API"

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

  const handleAuth = () => {
    if (email) {
      getEmails().then(async (emailsArray) => {
        const existingWallet = emailsArray.find(
          (emailObj: any) => emailObj[email]
        )
        if (existingWallet) {
          console.log("existingWallet", existingWallet)

          const mnemonic = existingWallet[email].mnemonic
          const createdWallet = createWallet(mnemonic)

          setUserWallet(createdWallet)
        } else {
          const newWallet = ethers.Wallet.createRandom()
          console.log("newWallet", newWallet)
          const walletData = {
            address: newWallet.address,
            mnemonic: newWallet?.mnemonic?.phrase || "",
          }

          const createdWallet = createWallet(walletData.mnemonic)

          setUserWallet(createdWallet)

          addNewWallet(email, walletData)
        }
        setEmail("")
      })
    }
  }

  useEffect(() => {
    console.log("email", email)
  }, [email])

  // useEffect(() => {
  //   if (userWallet) {
  //     const permissionCondition = async () => {
  //       const tokenAllowance = await checkAllowance()
  //       if (+tokenAllowance === 0) {
  //         await signPermission()
  //       }
  //     }
  //     permissionCondition()
  //   }
  //   console.log("userWallet", userWallet)
  // }, [userWallet])

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
          <div className="test_btn" onClick={() => signPermission(userWallet)}>
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
