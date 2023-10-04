import { ethers } from "ethers";
import abi from "./contract.json";

const contractAddress = "0x6d8e2f154e67088F197eBE339699ce0314f42c7A";
const contractABI = abi.abi;

export const GetAllConfirmations = async () => {
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
			return confirmationsCleaned;
		} else {
			console.log("Objeto Ethereum não existe!");
			return [];
		}
	} catch (error) {
		console.log(error);
	}
}

export const Confirm = async () => {
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
