import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import axios from "axios";
import Navbar from "../../components/nav";
import { FairHub, Raffle, MultiFaucetNFT } from "../../components/abis";
import {
  LabelName,
  LabelStart,
  LabelEnd,
  LabelWinners,
  LabelDesc,
  LabelRff,
  LabelNft,
  LabelID,
  LabelVF,
  LabelVR,
} from "../../components/styles/label";
import { Input, InputOpen, InputDesc } from "../../components/styles/input";
import { Button } from "../../components/styles/button";
import { Flex } from "../../components/styles/div";
import { Typography } from "../../components/styles/typography";

function Heading() {
  return (
    <>
      <Head>
        <title>Create Raffle | Quantum Fair</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
    </>
  );
}

interface CreateData {
  status: number;
  message: string;
  result: {
    0: {
      contractAddress: string;
    };
  };
}
const router=useRouter
function CreateRaffle() {
  const vaultFactory = "0xbC462F32aD394cF4dc1200a04c3f03dfaf380375";
  const vaultRouter = "0x04B3ceE98aa97284322CB8591eD3aC33c7a35414";
  const [screen, setScreen] = React.useState(false);
  const [canyed, setCanyed] = React.useState(false);
  // const [copied, setCopied] = React.useState(false);
  const [output, setOutput] = React.useState(false);
  const [name, setName] = React.useState("");
  const [start, setStart] = React.useState("");
  const [end, setEnd] = React.useState("");
  const [winners, setWinners] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [nftContract, setnftContract] = React.useState(""); // 0xf5de760f2e916647fd766B4AD9E85ff943cE3A2b
  const [id, setId] = React.useState(""); // 3667556
  const [hub, setHub] = React.useState(""); // 0x38113c10459349fc6e3e65e2c82428781110d5b5

  async function create() {
    try {
      const FairContract = "0x7E0755a50E1C3b2BB8AbECE23F139Be25B8D5348";
      const ethereum = (window as any).ethereum;
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(ethereum);
      const walletAddress = accounts[0];
      const signer = provider.getSigner(walletAddress);
      const FairProxy = new ethers.Contract(FairContract, FairHub, signer);
      const createRaffle = await FairProxy.createRaffle(start, end, winners, {
        hash: "0xf7baab1baf661869e72d3f70214e394102486912b6ed3872d9bb9d7e36e286c3",
        hash_function: 18,
        size: 32,
      });
      await createRaffle.wait();
      const receipt = await provider.getTransactionReceipt(createRaffle.hash);
      if (receipt.status == 1) {
        const bucle = setInterval(async () => {
          await axios
            .post<CreateData>(
              `https://api-goerli.etherscan.io/api?module=account&action=txlistinternal&txhash=${createRaffle.hash}&apikey=GBCBJB46CJB6NMCGMR3X5KENZR3P84RUZH`
            )
            .then((getContract) => {
              if (getContract.data.status == 1) {
                setHub(getContract.data.result[0].contractAddress);
                setCanyed(true);
                setScreen(true);
                clearInterval(bucle);
              }
              return getContract;
            });
        }, 3000);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function open() {
    try {
      const FaucetContract = nftContract;
      const ethereum = (window as any).ethereum;
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(ethereum);
      const walletAddress = accounts[0];
      const signer = provider.getSigner(walletAddress);
      const MultiFaucet = new ethers.Contract(
        FaucetContract,
        MultiFaucetNFT,
        signer
      );
      const RaffleProxy = new ethers.Contract(hub, Raffle, signer);
      const approve = await MultiFaucet.approve(hub, id);
      const approving = await approve.wait();
      if (approving.status == 1) {
        const opener = await RaffleProxy.open(
          vaultFactory,
          vaultRouter,
          [nftContract],
          [id]
        );
        const opening = await opener.wait();
        if (opening.status == 1) {
          setOutput(true);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <Heading />
      <Navbar />
      <Flex>
        {screen ? (
          <div
            style={{
              justifyContent: "center",
              background: "#efefef",
              flexDirection: "column",
              alignItems: "center",
              display: "flex",
              transform: "translateY(30px)",
              alignContent: "center",
              zIndex: "1",
            }}
          >
            <Typography>CREATE RAFFLE 2/3</Typography>
            <LabelRff>Raffle Contract</LabelRff>
            <Input value={hub} readOnly={true} />
            <LabelNft>Nft Contract</LabelNft>
            <Input
              onChange={(e) => {
                setnftContract(e.currentTarget.value);
              }}
            />
            <LabelID>Token ID</LabelID>
            <Input
              type="number"
              onChange={(e) => {
                setId(e.currentTarget.value);
              }}
            />
            <LabelVF>Vault Factory</LabelVF>
            <InputOpen value={vaultFactory} readOnly={true} />
            <LabelVR>Vault Router</LabelVR>
            <InputOpen value={vaultRouter} readOnly={true} />
            <Button onClick={open}>Open</Button>
            <Button
              style={{ transform: "translate(-190px, -60px)" }}
              onClick={() => {
                if (String(hub).length >= 42) {
                  setScreen(false);
                }
              }}
            >
              Back
            </Button>
          </div>
        ) : (
          <div
            style={{
              justifyContent: "center",
              background: "#efefef",
              flexDirection: "column",
              alignItems: "center",
              display: "flex",
              transform: "translateY(30px)",
              alignContent: "center",
              zIndex: "1",
            }}
          >
            <Typography>CREATE RAFFLE 1/3</Typography>
            <LabelName>Raffle Name</LabelName>
            <Input
              type="text"
              onChange={(e) => {
                setName(e.currentTarget.value);
              }}
            />
            <LabelStart>Start</LabelStart>
            <Input
              type="number"
              onChange={(e) => {
                setStart(e.target.value);
              }}
            />
            <LabelEnd>End</LabelEnd>
            <Input
              type="number"
              onChange={(e) => {
                setEnd(e.currentTarget.value);
              }}
            />
            <LabelWinners>N° Winners</LabelWinners>
            <Input
              type="number"
              onChange={(e) => {
                setWinners(e.currentTarget.value);
              }}
            />
            <LabelDesc>Description</LabelDesc>
            <InputDesc
              onChange={(e) => {
                setDescription(e.currentTarget.value);
              }}
            />
            {canyed ? (
              <Button
                onClick={() => {
                  if (String(hub).length >= 42) {
                    setScreen(true);
                  }
                }}
              >
                Next
              </Button>
            ) : (
              <Button onClick={create}>Create</Button>
            )}
          </div>
        )}
        {/* hub && (
          <div
            style={{
              transform: "translateY(-500px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              background: "#e0e0e0",
              height: "18rem",
              width: "32rem",
              border: "1px solid",
              borderRadius: "6px",
              zIndex: "2",
            }}
          >
            <h1 style={{ fontFamily: "Poppins", fontSize: "1.2rem" }}>
              FairHub created success 🎉
            </h1>
            <div
              style={{
                alignItems: "center",
                display: "flex",
                flexDirection: "row",
                background: "#c5c5c5",
                borderRadius: "8px",
              }}
            >
              <h1
                style={{
                  marginLeft: "10px",
                  fontFamily: "Poppins",
                  fontSize: "1rem",
                }}
              >
                {hub}
              </h1>
              {copied ? (
                <Image
                  src="/images/checkmark-circle-outline.png"
                  alt="ok"
                  width={18}
                  height={18}
                  style={{
                    marginLeft: "10px",
                    marginRight: "10px",
                    cursor: "pointer",
                  }}
                />
              ) : (
                <Image
                  src="/images/copy-outline.png"
                  alt="copy"
                  width={18}
                  height={18}
                  style={{
                    marginLeft: "10px",
                    marginRight: "10px",
                    cursor: "pointer",
                  }}
                  onClick={async () => {
                    await navigator.clipboard.writeText(hub);
                    setCopied(true);
                  }}
                />
              )}
            </div> 
            <h1 style={{ fontFamily: "Poppins", fontSize: "0.8rem" }}>
              Copy this contract address and paste in the next step
            </h1>
            <Button
              style={{ marginBottom: "20px" }}
              onClick={() => {
                setHub(null);
                setScreen(true);
              }}
            >
              Next
            </Button>
          </div>
        )*/}
      </Flex>
    </>
  );
}
export default CreateRaffle;
