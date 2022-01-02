var GmToken = artifacts.require("GmToken");

contract("GmToken", (accounts) => {
  it("Claim should put 100 gm into first account", async () => {
    const instance = await GmToken.deployed();
    const sig = web3.eth.accounts.sign(
      web3.eth.abi.encodeParameters(["address", "uint256"], [accounts[0], 100]),
      "f493a9b813d2cbf247ab6c50eede9171690837f2f8db13b3f54f6392b68c61bd"
    );
    await instance.claimTokens(100, sig.signature);
    const balance = await instance.balanceOf(accounts[0]);
    assert.equal(balance.toString(), 100 * 10 ** 18);
  });

  it("Claim with wrong signature should shit itself", async () => {
    const instance = await GmToken.deployed();
    const sig = web3.eth.accounts.sign(
      web3.eth.abi.encodeParameters(["address", "uint256"], [accounts[1], 100]),
      "f493a9b813d2cbf247ab6c50eede9171690837f2f8db13b3f54f6392b68c61bc"
    );
    try {
      await instance.claimTokens(100, sig.signature, { from: accounts[1] });
    } catch (error) {
      assert.equal(error.reason, "invalid signature");
    }
  });
});
