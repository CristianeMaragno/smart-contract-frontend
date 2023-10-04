import { ethers } from "ethers";

export const CheckIfWalletIsConnected = async () => {
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
      return account;
    } else {
      console.log("Nenhuma conta autorizada foi encontrada")
    }
  } catch (error) {
    console.log(error);
  }
}

export const ConnectWallet = async () => {
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