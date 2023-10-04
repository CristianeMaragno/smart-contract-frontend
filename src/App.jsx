import React, { useEffect, useState } from "react";
import './App.css';
import abi from "./utils/contract.json";
import {CheckIfWalletIsConnected, ConnectWallet} from './utils/wallet';
import {GetAllConfirmations, Confirm} from './utils/contractUse';

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [allConfirmations, setAllConfirmations] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(async () => {
    let account = await CheckIfWalletIsConnected();
    setCurrentAccount(account);

    let confirmations = await GetAllConfirmations();
    setAllConfirmations(confirmations);
  }, [])

  const handleChange = event => {
    setMessage(event.target.value);
  };

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <p className="info">Seria um prazer que você se <br/>junto a nós para o</p>
        <div className="header">
          Evento exlusivo Web 3
        </div>

        <div className="info">
          Sábado, dia 01/01/0001<br/>
          Teatro Ramos Meireles<br/>
          19:00 hrs
        </div>

        <p className="info">Clique no botão abaixo para confirmar sua presença.</p>
        <p className="info">Também há um campo para observações, utilize para marcar <br/>
        qualquer informação relevante como número de acompanhantes, alergias, etc.</p>

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

        <button className="waveButton" onClick={Confirm}>
          Confirmar presença
        </button>
        {/*
        * Se não existir currentAccount, apresente este botão
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={ConnectWallet}>
            Conectar carteira
          </button>
        )}

        <p>Lista de confirmações:</p>

        {allConfirmations?.map((confirmation, index) => {
          return (
            <div key={index} className="confirmations">
              <div>Endereço: {confirmation.address}</div>
              <div>Data/Horário: {confirmation.timestamp.toString()}</div>
              <div>Mensagem: {confirmation.message}</div>
            </div>)
        })}
      </div>
      
    </div>
  );
}