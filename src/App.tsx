import { useEffect, useState } from "react"
import "./App.scss"

function App() {
  const [email, setEmail] = useState("")

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handleEnterDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAuth()
    }
  }

  const handleAuth = () => {
    fetch("http://localhost:4000/emails")
      .then((res) => res.json())
      .then((emailsArray) => {
        const currentObject = emailsArray.find(
          (emailObj: any) => emailObj[email]
        )
        if (currentObject) {
          console.log("currentData", currentObject)
        } else {
          const params = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ [email]: email }),
          }
          fetch("http://localhost:4000/add", params)
            .then((res) => res.json())
            .then((res) => console.log(res))
        }
        setEmail("")
      })
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
      </div>
    </div>
  )
}

export default App
