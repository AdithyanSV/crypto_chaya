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
    id: number;
    image: string;
    price: number;
}

const items: ItemType[] = [
    { id: 1, image: '/path/to/image1.png', price: 0.1 }, // Replace with actual image paths
    { id: 2, image: '/path/to/image2.png', price: 0.2 },
    // Add more items with their images and prices
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
        <div style={{ padding: '20px' }}>
            <h1 style={{ textAlign: 'center' }}>Buy Items with Cryptocurrency</h1>
            <h2 style={{ textAlign: 'center' }}>Balance: {balance.toFixed(2)} ETH</h2>

            {/* Connect Wallet Button */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                {!walletConnected ? (
                    <button 
                        onClick={connectWallet} 
                        style={{
                            padding: '10px 20px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            backgroundColor: '#f8b400',
                            border: 'none',
                            borderRadius: '5px',
                            color: '#fff'
                        }}
                    >
                        Connect Wallet
                    </button>
                ) : (
                    <p style={{ fontSize: '18px', color: 'green' }}>Wallet Connected: {account}</p>
                )}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {items.map(item => (
                    <Item key={item.id} {...item} onBuy={handleBuy} />
                ))}
            </div>
        </div>
    );
};

export default Home;