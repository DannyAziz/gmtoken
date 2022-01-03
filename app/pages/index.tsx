import { useState, useEffect } from "react";
import { useWallet, useContract } from "@web3-ui/hooks";

import Layout from "components/Layout";
import Button from "components/Button";

const token = require("GmToken.json");

const Section = ({ children }) => (
  <div className="flex flex-col items-center gap-y-8 text-center">
    {children}
  </div>
);

const SectionTitle = ({ title }) => (
  <span className="text-4xl font-bold">{title}</span>
);

const TwitterConnectSection = ({ setLoading, loading, onUrlPosted }) => {
  const { connection } = useWallet();
  const [value, setValue] = useState("");

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const postUrl = async () => {
    if (value.length !== 0) {
      setLoading(true);
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tweet-check/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: value,
            address: connection.userAddress,
          }),
        }
      );
      let data = await response.json();
      if (data.error) {
        alert(data.error);
        setLoading(false);
      } else {
        onUrlPosted();
        setLoading(false);
      }
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    postUrl();
  };

  return (
    <Section>
      <SectionTitle title="Connect Twitter" />
      <div className="flex flex-col text-lg space-y-4">
        <span>
          Click the button below to tweet out your wallet address *Full address
          not ens - Then paste the URL of the tweet
        </span>
        <span className="font-bold">Why do I need to do this?</span>
        <ul className="text-left list-decimal">
          <li>
            So that we can verify that your Twitter Username and Wallet Address
            are owned by the same person
          </li>
          <li>So that we can get more eyes 👀 on this project</li>
        </ul>
      </div>
      <Button
        text="Tweet Wallet Address"
        type="green"
        onClick={() =>
          window.open(
            `https://twitter.com/intent/tweet?text=I'm connecting my Twitter account with my wallet ${connection.userAddress} on https://gm.dannyaziz.com to claim my $gm`,
            "_blank",
            "location=yes,height=570,width=520,scrollbars=yes,status=yes"
          )
        }
      />
      <form onSubmit={onSubmit} className="flex flex-col gap-y-4">
        <input
          className="p-4 rounded-sm bg-white text-black"
          placeholder="Tweet URL"
          type="url"
          value={value}
          onChange={onChange}
          required
        />
        <Button
          text="Check Tweet URL"
          type="primary"
          onClick={postUrl}
          disabled={value.length === 0 || loading}
        />
      </form>
    </Section>
  );
};

export default function Home() {
  const { connectWallet, connected, connection } = useWallet();
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(0);
  const [gmCount, setGmCount] = useState(0);
  const [contract] = useContract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    token.abi
  );
  const [transactionHash, setTransactionHash] = useState("");

  const checkGmCount = async () => {
    setLoading(true);
    let response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/wallet/${connection.userAddress}`
    );
    let data = await response.json();
    if (data.error) {
      setStage(0);
    } else if (data.gm) {
      setStage(2);
      setGmCount(data.gm);
    } else {
      setStage(1);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (connected) {
      checkGmCount();
    }
  }, [connected]);

  const claim = async () => {
    setLoading(true);
    const resposne = await fetch(`api/claim`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address: connection.userAddress,
      }),
    });
    const data = await resposne.json();
    const sig = data.sig;
    try {
      // @ts-ignore
      const res = await contract.claimTokens(gmCount * 42069, sig);
      setTransactionHash(res.hash);
      setStage(3);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert(
        "There was an error, please try again or contact @dannyaziz97 on Twitter"
      );
    }
  };

  const addToMM = async () => {
    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      // @ts-ignore
      await ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS, // The address that the token is at.
            symbol: "gm", // A ticker symbol or shorthand, up to 5 chars.
            decimals: 18,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title="gm token" loading={loading}>
      <div className="text-white py-20 px-12 flex flex-col gap-y-16">
        <Section>
          <h1 className="text-5xl sm:text-7xl font-bold">Introducing $gm </h1>
          <h2 className="text-3xl sm:text-5xl font-bold">
            Get a free gm token based on the number of times you tweeted gm in
            2021
          </h2>
          <h3 className="text-2xl font-medium">
            Not a DAO, no whitepaper, no nft, no roadmap, just gm.
          </h3>
          {connected ? (
            <Button
              text={stage == 0 ? "Connect Twitter" : "Claim"}
              type="primary"
              onClick={() =>
                document.getElementById("scrollPoint").scrollIntoView()
              }
            />
          ) : (
            <Button
              text="Connect Wallet To Claim"
              onClick={() => connectWallet()}
              type="primary"
            />
          )}
        </Section>

        <Section>
          <SectionTitle title="How does it work?" />
          <div className="text-3xl sm:text-5xl text-left flex flex-col gap-y-8">
            <span>1. Connect your Wallet</span>
            <span>2. Tweet your wallet address to connect your twitter</span>
            <span>3. Claim your $gm</span>
          </div>

          <span className="text-xl sm:text-3xl">
            There is 21 million $gm tokens, 10% has been allocated to{" "}
            <a
              className="underline"
              href="https://twitter.com/dannyaziz97"
              target="_blank"
            >
              me
            </a>{" "}
            - The rest is up for grabs
          </span>
        </Section>

        {!connected && (
          <Section>
            <SectionTitle title="Start Claim" />
            <Button
              text="Connect Wallet To Claim"
              onClick={() => connectWallet()}
              type="primary"
            />
          </Section>
        )}

        <div id="scrollPoint" />

        {connected && stage === 0 && (
          <TwitterConnectSection
            setLoading={setLoading}
            loading={loading}
            onUrlPosted={() => setStage(1)}
          />
        )}

        {connected && stage === 1 && (
          <Section>
            <SectionTitle title="Wait Please" />
            <h3 className="text-2xl font-medium">
              We are going through your tweets and calculating how much $gm your
              are eligible for
            </h3>
            <h3 className="text-2xl font-medium">
              This might take a while depending on how many tweets you have, you
              can either leave this tab open or come back in 10 minutes
            </h3>
            <Button
              text="Click To See If Ready"
              onClick={checkGmCount}
              type="primary"
            />
          </Section>
        )}

        {connected && stage === 2 && (
          <Section>
            <SectionTitle title="Claim" />
            <h3 className="text-2xl font-medium">
              You tweeted gm {gmCount} times in 2021, you are eligible for{" "}
              {gmCount * 42069} gm tokens :)
            </h3>
            <Button text="Claim" type="primary" onClick={() => claim()} />
          </Section>
        )}

        {connected && stage === 3 && (
          <Section>
            <SectionTitle title="Claimed" />
            <h3 className="text-2xl font-medium">Thanks for claiming</h3>
            <p>
              <a
                href={`https://etherscan.io/tx/${transactionHash}`}
                target="_blank"
              >
                View on Etherscan
              </a>
            </p>
            <Button
              text="Add $gm to MetaMask"
              type="primary"
              onClick={addToMM}
            />
          </Section>
        )}
      </div>
    </Layout>
  );
}
