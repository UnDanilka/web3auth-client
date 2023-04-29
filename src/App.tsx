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
      setWalletSmart(null)
      const userPrivateKey = await getCryptoHash(email)
      console.log(`User private key: ${userPrivateKey}`)
      const newUserWallet = new ethers.Wallet(userPrivateKey)
      console.log("newUserWallet", newUserWallet)
      setWalletEOA(newUserWallet)
      setEmail("")
      const data = await getWallets()
      console.log("data", data)
      const walletSmartMatch = data.find(
        (obj: any) => obj[newUserWallet.address]
      )
      if (walletSmartMatch) {
        const userContractAddress = walletSmartMatch[newUserWallet.address]
        const userContract = new ethers.Contract(
          userContractAddress,
          UserWallet.abi,
          vitacoreWallet
        )
        setWalletSmart(userContract)
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
    console.log("deploy sterted")
    const factory = new ethers.ContractFactory(
      UserWallet.abi,
      UserWallet.bytecode,
      vitacoreWallet
    )

    const contract = await factory.deploy(walletEOA.address)
    console.log("walletSmart", contract.address)
    setWalletSmart(contract)
    await addNewWallet(walletEOA.address, contract.address)
    console.log("deploy finished")
  }

  const sendETH = async () => {
    if (walletSmart) {
      let amountInEther = "0.01"
      let tx = {
        to: walletSmart,
        value: ethers.utils.parseEther(amountInEther),
      }
      vitacoreWallet.sendTransaction(tx).then((txObj) => {
        console.log("txHash", txObj.hash)
      })
    } else {
      await deploy()
    }
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
          <div className="test_btn" onClick={() => sendETH()}>
            SendETH
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
              style={{ marginLeft: "200px" }}
              onClick={() => transferEthers("10", walletEOA)}
            >
              Transfer ethers
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
