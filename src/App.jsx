import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/contract.json";

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [allConfirmations, setAllConfirmations] = useState([]);
  const [message, setMessage] = useState('');
  
  const contractAddress = "0x6d8e2f154e67088F197eBE339699ce0314f42c7A";
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Garanta que possua a Metamask instalada!");
        return;
      } else {
        console.log("Temos o objeto ethereum", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Encontrada a conta autorizada:", account);
        setCurrentAccount(account)
        getAllConfirmations()
      } else {
        console.log("Nenhuma conta autorizada foi encontrada")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implemente aqui o seu método connectWallet
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("MetaMask encontrada!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Conectado", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  const confirm = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const InvitationPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await InvitationPortalContract.getTotalConfirmations();
        console.log("Get total number of confirmations...", count.toNumber());
        const confirmTxn = await InvitationPortalContract.confirm(message);
        console.log("Mining...", confirmTxn.hash);

        await confirmTxn.wait();
        console.log("Mining -- ", confirmTxn.hash);

        count = await InvitationPortalContract.getTotalConfirmations();
        console.log("Get total number of confirmations...", count.toNumber());
      } else {
        console.log("Ethereum object not found!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getAllConfirmations = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const InvitationPortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        /*
         * Chama o método getAllWaves do seu contrato inteligente
         */
        const confirmations = await InvitationPortalContract.getAllConfirmations();


        /*
         * Apenas precisamos do endereço, data/horário, e mensagem na nossa tela, então vamos selecioná-los
         */
        let confirmationsCleaned = [];
        confirmations.forEach(confirmation => {
          confirmationsCleaned.push({
            address: confirmation.waver,
            timestamp: new Date(confirmation.timestamp * 1000),
            message: confirmation.message
          });
        });

        /*
         * Armazenando os dados
         */
        setAllConfirmations(confirmationsCleaned);
      } else {
        console.log("Objeto Ethereum não existe!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleChange = event => {
    setMessage(event.target.value);
  };

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Olá, você foi convidado para um super evento!
        </div>

        <div className="bio">
        Clique no botão abaixo para confirmar sua presença
        </div>

        <div>
          <input
            className="inputButton"
            type="text"
            id="message"
            name="message"
            onChange={handleChange}
            value={message}
          />
        </div>

        <button className="waveButton" onClick={confirm}>
          Confirmar presença 🌟
        </button>
        {/*
        * Se não existir currentAccount, apresente este botão
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Conectar carteira
          </button>
        )}

        {allConfirmations.map((confirmation, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Endereço: {confirmation.address}</div>
              <div>Data/Horário: {confirmation.timestamp.toString()}</div>
              <div>Mensagem: {confirmation.message}</div>
            </div>)
        })}
      </div>
      
    </div>
  );
}