import { ethers } from "ethers"
import { useEffect, useState } from "react"
import "./App.scss"
import {
  types,
  deadline,
  transferLimit,
  vitacoreWallet,
  vft,
} from "./utils/constants"
import {
  createWallet,
  getDomain,
  getGasPrice,
  transferTokens,
} from "./utils/utils"

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
      fetch("http://localhost:4000/emails")
        .then((res) => res.json())
        .then(async (emailsArray) => {
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

            const params = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ [email]: walletData }),
            }
            fetch("http://localhost:4000/add", params)
              .then((res) => res.json())
              .then((res) => console.log(res))
          }
          setEmail("")
        })
    }
  }

  const getSignature = async () => {
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

  const signPermission = async () => {
    console.log("signing permission started")

    const sig = await getSignature()

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

  const checkAllowance = async () => {
    const tokenAllowance = await vft.allowance(
      userWallet.address,
      vitacoreWallet.address
    )

    console.log(`Check allowance of tokenReceiver: ${tokenAllowance}`)
    return tokenAllowance
  }

  const checkBalance = async () => {
    const vitacoreWalletBalance = await vft.balanceOf(vitacoreWallet.address)
    const userWalletBalance = await vft.balanceOf(userWallet.address)

    console.log(`vitacoreWallet balance: ${vitacoreWalletBalance / 10 ** 18}`)
    console.log(`userWallet balance: ${userWalletBalance / 10 ** 18}`)
  }

  const burn = async () => {
    const hash = await vft.burn(ethers.utils.parseEther("10"))
    console.log(hash)
    hash.wait()
  }

  const mint = async () => {
    console.log("minting started")
    const hash = await vft.mint(
      userWallet.address,
      ethers.utils.parseEther("100")
    )
    hash.wait()
    console.log("minting finished")
  }

  useEffect(() => {
    console.log("email", email)
  }, [email])

  useEffect(() => {
    if (userWallet) {
      const permissionCondition = async () => {
        const tokenAllowance = await checkAllowance()
        if (+tokenAllowance === 0) {
          await signPermission()
        }
      }
      permissionCondition()
    }
    console.log("userWallet", userWallet)
  }, [userWallet])

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
          <div className="test_btn" onClick={mint}>
            Mint
          </div>
          <div className="test_btn" onClick={checkBalance}>
            Check balance
          </div>
          <div className="test_btn" onClick={burn}>
            Burn
          </div>
          <div className="test_btn" onClick={checkAllowance}>
            Check allowance
          </div>
          <div className="test_btn" onClick={signPermission}>
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
