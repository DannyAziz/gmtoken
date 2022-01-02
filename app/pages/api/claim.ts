import Web3 from "web3";
const web3 = new Web3();

export default async function handler(req, res) {
  const walletAddress = req.body.address;
  const backendResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/wallet/${walletAddress}`
  );
  const walletData = await backendResponse.json();
  if (!walletData.gm) {
    throw new Error("Wallet does not have GM");
  }
  const sig = web3.eth.accounts.sign(
    web3.eth.abi.encodeParameters(
      ["address", "uint256"],
      [walletAddress, walletData.gm * 42069]
    ),
    process.env.PRIVATE_KEY
  );
  res.status(200).json({ sig: sig.signature });
}
