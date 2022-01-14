import React, { useEffect, useState } from 'react';
import './App.css';
import CandyMachine from './CandyMachine';

// Constants

const App = () => {

	const [walletAddress, setWalletAddress] = useState(null);

	const checkIfWalletIsConnected = async () => {
		try {
			const { solana } = window;
			if (solana && solana.isPhantom) {
				console.log('Phantom wallet found!', solana.isPhantom);
				const response = await solana.connect({ onlyIfTrusted: true});
				console.log(
					'Connected with public key:',
					response.publicKey.toString());
				setWalletAddress(response.publicKey.toString());
			} else {
				alert('Solana object not found! Get a Phantom Wallet 👻');
			}
		} catch (error) {
			console.log('error', error);
		}
	}

	const connectWallet = async () => {
		const { solana } = window;
		try {
			if (solana) {
				const response = await solana.connect();
				console.log('Connected with Public Key:', response.publicKey.toString());
				setWalletAddress(response.publicKey.toString());			
			}
		} catch (error) {
			console.log('error', error);
		}
	}

	/*
	* We want to render this UI when the user hasn't connected
	* their wallet to our app yet.
	*/
	const renderNotConnectedContainer = () => (
		<button
		className="cta-button connect-wallet-button"
		onClick={connectWallet}
		>
			Connect to Wallet
		</button>
	);


	useEffect(() => {
		/*
			Unlike meta mask and the ehtereum object, we need to wait for the window to have
			fully finished loading the page. before checking for the solana object. 
			Once this event gets called, we can guarantee that this object is available 
			if the user has the Phantom Wallet extension installed. d
		*/
		const onLoad = async () => {
			await checkIfWalletIsConnected();
		  };
		  window.addEventListener('load', onLoad);
		  return () => window.removeEventListener('load', onLoad);
	}, []);

	return (
		<div className="App">
			<div className="container">
				<div className="header-container">
				<p className="header">🍭 Candy Drop</p>
				<p className="sub-text">NFT drop machine with fair mint</p>
				{!walletAddress && renderNotConnectedContainer()}
				{walletAddress && <CandyMachine walletAddress={window.solana} />}
				</div>
			</div>
		</div>
	);
};

export default App;
