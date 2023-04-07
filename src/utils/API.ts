export const getEmails = async () => {
  const res = await fetch("http://localhost:4000/emails")
  const resJSON = await res.json()
  return resJSON
}

export const addNewWallet = async (email: string, walletData: any) => {
  const params = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ [email]: walletData }),
  }
  await fetch("http://localhost:4000/add", params)
    .then((res) => res.json())
    .then((res) => console.log(res))
}
