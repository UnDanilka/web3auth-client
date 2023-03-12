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

  const createWallet = (mnemonic: string) => {
    const walletMnemonic = ethers.Wallet.fromMnemonic(mnemonic)
    const provider = new ethers.providers.JsonRpcProvider(
      "https://rpc.chiadochain.net"
    )
    const connectedWallet = walletMnemonic.connect(provider)
    return connectedWallet
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

            setWallet(createdWallet)
          } else {
            const newWallet = ethers.Wallet.createRandom()
            console.log("newWallet", newWallet)
            const walletData = {
              address: newWallet.address,
              mnemonic: newWallet?.mnemonic?.phrase || "",
            }

            const createdWallet = createWallet(walletData.mnemonic)

            setWallet(createdWallet)

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

  const sendETH = async () => {
    const tx = {
      to: "0x2129e7F5aF1328BaF1298b1EDe4Fe6Ad458782d4",
      value: ethers.utils.parseEther("0.001"),
    }

    const hash = await wallet.sendTransaction(tx)
    console.log("hash", hash)
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
            <div className="transaction_btn" onClick={sendETH}>
              Send ETH
            </div>
          </div>
          <div className="address">{wallet.address}</div>
        </>
      )}
    </div>
  )
}

export default App
