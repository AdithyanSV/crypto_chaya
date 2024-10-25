"use client"; // Ensure this is at the top

import { useState, useEffect } from 'react';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import Item from '../components/Item';

// Define the provider options for Web3Modal
const providerOptions = {
    // You can add more provider options here if needed
};

const web3Modal = new Web3Modal({
    network: "mainnet", // Specify the network
    cacheProvider: true, // Cache provider
    providerOptions // Pass the provider options
});

interface ItemType {
    id: string;
    image: string;
    price: number;
}

const items: ItemType[] = [
  { id: 'chaya', image: 'https://png.pngtree.com/png-clipart/20221109/ourmid/pngtree-fresh-milk-tea-or-indian-kadak-chai-png-image_6432496.png', price: 0.01 },
  { id: 'mutta puffs', image: 'https://png.pngtree.com/png-clipart/20231112/original/pngtree-puff-pastry-puff-pastry-picture-image_13256611.png', price: 0.02 },
  { id: 'vada', image: 'https://png.pngtree.com/png-vector/20231124/ourmid/pngtree-vadai-starter-lentil-lanka-png-image_10707772.png', price: 0.02 },
  { id: 'samosa', image: 'https://png.pngtree.com/png-vector/20240820/ourmid/pngtree-a-crispy-flaky-snack-filled-with-flavor-samosas-png-image_13554874.png', price: 0.02 }
];

const Home: React.FC = () => {
    const [selectedItem, setSelectedItem] = useState<number | null>(null);
    const [balance, setBalance] = useState<number>(1.0); // Starting balance in ETH
    const [walletConnected, setWalletConnected] = useState<boolean>(false); // To track wallet connection status
    const [web3, setWeb3] = useState<Web3 | null>(null); // State for Web3 instance
    const [account, setAccount] = useState<string | null>(null); // State for the connected account

    const connectWallet = async () => {
        try {
            const provider = await web3Modal.connect(); // Connect to wallet
            const web3Instance = new Web3(provider); // Create a Web3 instance
            setWeb3(web3Instance); // Set Web3 instance in state

            const accounts = await web3Instance.eth.getAccounts(); // Get connected accounts
            setAccount(accounts[0]); // Set the first account
            setWalletConnected(true); // Set the wallet connected status to true

            // Fetch the balance for the connected account (if you want to replace hardcoded balance)
            const balance = await web3Instance.eth.getBalance(accounts[0]);
            setBalance(parseFloat(web3Instance.utils.fromWei(balance, 'ether'))); // Set the account balance in ETH

            console.log('Wallet connected', accounts[0]);
        } catch (error) {
            console.error('User denied wallet connection:', error);
        }
    };

    useEffect(() => {
        // Attempt to connect the wallet on component mount
        connectWallet();
    }, []);

    const buyItem = async (id: number, price: number) => {
        if (balance >= price) {
            // Simulate deducting the amount from the wallet balance
            setBalance(prevBalance => prevBalance - price);
            alert(`You bought item ${id} for ${price} ETH!`);
            console.log(`Item ${id} purchased for ${price} ETH. New balance: ${(balance - price).toFixed(2)} ETH`);
        } else {
            alert('Insufficient balance! Please add more funds to your wallet.');
            console.error('Payment failed: Insufficient balance');
        }
    };

    const handleBuy = (id: number) => {
        const price = items.find(item => item.id === id)?.price;
        if (price) {
            buyItem(id, price);
        }
    };

    return (
      <div>
        <div 
            style={{ 
              padding: '50px',
              backgroundImage: 'url("/bleh.png"), url("/newspaper.png")', 
              backgroundColor: '#000000',
              backgroundSize: '75%, 120%',           
              backgroundRepeat: 'no-repeat',      
              backgroundPosition: 'center',       
              minHeight: '100vh',
              color: '#c8a033',
              position: 'relative', // Set position relative to contain absolute elements
          }}>
          
          <div
            style={{ display: 'flex',  justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <div style={{ width: '410px'}}></div>
              <h1 style={{ 
                            width: '300px',
                            height: '50px',
                            padding: '10px 20px',
                            fontSize: '16px',
                            textAlign: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            border: 'none',
                            borderRadius: '5px'}}>Crypto Chayakkada</h1>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '410px'}}>

                  <h2 style={{
                                width: '200px',
                                height: '50px',
                                padding: '10px 20px',
                                fontSize: '16px',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                backgroundImage: 'url("wall-n.png")',
                                border: 'none',
                                borderRadius: '5px',
                                color: '#00ff00'}}>Balance: {balance.toFixed(2)} ETH</h2>
                {/* Connect Wallet Button */}
                <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center'}}>
                    {!walletConnected ? (
                      <button 
                      onClick={connectWallet} 
                            style={{
                                padding: '10px 20px',
                                fontSize: '16px',
                                cursor: 'pointer',
                                backgroundColor: '#080808',
                                border: 'none',
                                borderRadius: '5px',
                                color: '#fff'
                              }}
                              >
                            Connect Wallet
                        </button>
                    ) : (<div 
                            style={{
                                width: '200px',
                                height: '50px',
                                padding: '10px 20px',
                                fontSize: '16px',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                border: 'none',
                                borderRadius: '5px',
                                color: '#00ff00'
                              }}
                              >Wallet Connected
                        </div>
                    )}
                </div>
              </div>
          </div>
          <div
                style={{
                    position: 'absolute',
                    top: '55%',
                    left: '54.55%',
                    transform: 'translateX(-50%)', // Center horizontally
                    backgroundImage: 'url("https://png.pngtree.com/png-clipart/20230927/original/pngtree-old-radio-for-decorative-png-image_13159650.png")',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    width: '100px', // Set desired size
                    height: '100px', // Set desired size
                    zIndex: 10, // Ensure it appears on top
                }}
            ></div>

            <iframe
                src="https://open.spotify.com/embed/playlist/6Aewe09tLchUm8U520m3Em?autoplay=true"
                width="300"
                height="80"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                style={{
                    position: 'absolute',
                    top:'550px',
                    left: '37.5%',
                    zIndex: 10,
                    opacity: 0,
                }}
            ></iframe>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {items.map(item => (
                  <Item key={item.id} {...item} onBuy={handleBuy} />
                ))}
            </div>
        </div>
      </div>
    );
};

export default Home;
