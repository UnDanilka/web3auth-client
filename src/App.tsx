import { ethers } from "ethers"
import { useEffect, useState } from "react"
import "./App.scss"

function App() {
  const [email, setEmail] = useState("")
  const [wallet, setWallet] = useState<any>()

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
        .then((emailsArray) => {
          const existingWallet = emailsArray.find(
            (emailObj: any) => emailObj[email]
          )
          if (existingWallet) {
            console.log("existingWallet", existingWallet)
            setWallet(existingWallet[email])
          } else {
            const newWallet = ethers.Wallet.createRandom()
            console.log("newWallet", newWallet)
            const walletData = {
              address: newWallet.address,
              mnemonic: newWallet?.mnemonic?.phrase,
            }

            setWallet(walletData)

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

  useEffect(() => {
    console.log("email", email)
  }, [email])

  useEffect(() => {
    console.log("wallet", wallet)
  }, [wallet])

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
      </div>
      {wallet && (
        <>
          <div className="transaction">
            <div className="transaction_btn">Send ETH</div>
          </div>
          <div className="address">{wallet.address}</div>
        </>
      )}
    </div>
  )
}

export default App
