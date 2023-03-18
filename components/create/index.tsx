import React, { useState } from "react";
import { ethers } from "ethers";
import styled from "styled-components";
import { FairHub, Raffle, MultiFaucetNFT } from "../abis";
import { LabelName, LabelStart, LabelEnd, LabelWinners, LabelDesc, LabelRff, LabelNft, LabelID, LabelVF, LabelVR } from "../styles/label";
import { Input, InputOpen, InputDesc } from "../styles/input";
import { Button } from "../styles/button";
import { Flex } from "../styles/div";
import { Typography } from "../styles/typography";

function CreateRaffle() {

const [hide, setHide] = useState('flex');

const OneContent = styled.div`
  justify-content: center;
  background: #efefef;
  flex-direction: column;
  align-items: center;
  display: ${hide};
  transform: translateY(0px);
  align-content: center;
  z-index: 12;
`;


  const vaultFactory = "0xbC462F32aD394cF4dc1200a04c3f03dfaf380375";
  const vaultRouter = "0x04B3ceE98aa97284322CB8591eD3aC33c7a35414";
  const [screen, setScreen] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [output, setOutput] = useState(false);
  const [name, setName] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [winners, setWinners] = useState("");
  const [description, setDescription] = useState("");
  const [raffleContract, setraffleContract] = useState(""); // 0x4Acf1C08FD60aFE43e9B4285b8e77646855f5392
  const [nftContract, setnftContract] = useState(""); // 0xf5de760f2e916647fd766B4AD9E85ff943cE3A2b
  const [id, setId] = useState(""); // 2853340
  const arr = [name, start, end, winners, description];

  async function Args() {
    localStorage.arr = await JSON.stringify(arr);
    setScreen(true);
  }

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
      setGenerated(true);
    } catch (err) {
      console.error(err);
    }
  }

  async function open() {
    try {
      const FaucetContract = "0xf5de760f2e916647fd766B4AD9E85ff943cE3A2b";
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
      const RaffleProxy = new ethers.Contract(raffleContract, Raffle, signer);
      const approve = await MultiFaucet.setApprovalForAll(raffleContract, true);
      const Open = await RaffleProxy.open(
        vaultFactory,
        vaultRouter,
        [nftContract],
        [id]
      );
      console.log(Open);
      setHide('none');
      setOutput(true);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Flex>
     { generated && 
        <OneContent>
          <Typography>FairHub Created</Typography>
           <h1>Copy and paste on the next step</h1>
          <Button onClick={setScreen(true)}>Good</Button>
        </OneContent> }
      {screen ? (
        <OneContent>
          <Typography>CREATE RAFFLE 2/3</Typography>
          <LabelRff>Raffle Contract</LabelRff>
          <Input
            onChange={(e) => {
              setraffleContract(e.currentTarget.value);
            }}
          />
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
          <Button onClick={open}>Create</Button>
        </OneContent>
      ) : (
        <OneContent>
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
              setStart(e.currentTarget.value);
            }}
          />
          <LabelEnd>End</LabelEnd>
          <Input
            type="number"
            onChange={(e) => {
              setEnd(e.currentTarget.value);
            }}
          />
          <LabelWinners>Winners</LabelWinners>
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
          <Button onClick={create}>Next</Button>
        </OneContent>
      )}
     { output && 
        <OneContent>
          <Typography>CREATE RAFFLE 3/3</Typography>

          <Button onClick={open}>Watch</Button>
        </OneContent> }
    </Flex>
  );
}

export default CreateRaffle;
