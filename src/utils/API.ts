export const getWallets = async () => {
  const res = await fetch("http://localhost:4000/wallets")
  const resJSON = await res.json()
  return resJSON
}

export const addNewWallet = async (publicEOA: string, publicSmart: string) => {
  const params = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ [publicEOA]: publicSmart }),
  }
  await fetch("http://localhost:4000/add", params)
    .then((res) => res.json())
    .then((res) => console.log(res))
}
