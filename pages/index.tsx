import Head from "next/head";
import Navbar from "../components/nav";
import styled from 'styled-components'

const Hr = styled.hr`
  top: 0;
  transform: translateY(-10px);
  bottom: 0;
  background-color: #fff;
  border-top: 3px solid;
  border-color: transparent;
`

function Heading() {
  return (
    <>
      <Head>
        <title>Home | Quantum Fair</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://i.ibb.co/xJxBBbv/QF-Media-kit-ref.png" />
      </Head>
    </>
  )
}

export default function App() {
  return (
  <>
  <Heading/>
  <Navbar />    
  <Hr/>
  </>  
  );
}
