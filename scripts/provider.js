import { ethers } from 'http://localhost:8080/third-party/ethers.js';

// Get the provider and signer from the browser window
if (typeof window.ethereum !== 'undefined') {
  console.log('MetaMask is installed!');
} else {
  console.log('Error - MetaMask not installed');
}

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner();

// Initialise the page objects to interact with
const ethereumButton = document.querySelector('.enableEthereumButton');

// Initialise the active account and chain id
let activeAccount;

// Update the account and chain id when user clicks on button
ethereumButton.addEventListener('click', () => {
  getAccount();
});

// Get the account in the window object
async function getAccount() {
  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  if (accounts.length === 0) {
    // MetaMask is locked or the user has not connected any accounts
    console.log('Please connect to MetaMask.');
  } else if (accounts[0] !== activeAccount) {
    activeAccount = accounts[0];
  }
}

// Update the selected account and chain id on change
ethereum.on('accountsChanged', getAccount);