import { ethers } from 'http://localhost:8080/third-party/ethers.js';

// Get the provider and signer from the browser window
if (typeof window.ethereum !== 'undefined') {
  console.log('MetaMask is installed!');
} else {
  console.log('Error - MetaMask not installed');
}

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner();

// Initialise the document objects
const sendETH = document.querySelector('#sendETH');
const addressTo = document.querySelector('#addressTo');
const ETHAmount = document.querySelector('#ETHAmount');

sendETH.addEventListener('submit', async(e) => {
  e.preventDefault();

  // Get the form values
  const addressToValue = addressTo.value;
  const ETHAmountValue = ETHAmount.value;
  // Calculate amount to transfer in wei
  const weiAmountValue = ethers.utils.parseEther(ETHAmountValue) //parseInt(ETHAmountValue) * 10**18

  // Form the transaction request for sending ETH
  const transactionRequest = {
    to: addressToValue.toString(),
    value: weiAmountValue.toString()
  }

  // Send the transaction and log the receipt
  const receipt = await signer.sendTransaction(transactionRequest);
  console.log(receipt);

})

// Initialise the page objects to interact with
const ethereumButton = document.querySelector('.enableEthereumButton');
const showAccount = document.querySelector('.showAccount');
const showChainId = document.querySelector('.showChainId');

// Initialise the active account and chain id
let activeAccount;
let activeChainId;

// Update the account and chain id when user clicks on button
ethereumButton.addEventListener('click', () => {
  getAccount();
  getChainId();
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
  showAccount.innerHTML = activeAccount;
}

// Get the connected network chainId
async function getChainId() {
    activeChainId = await ethereum.request({ method: 'eth_chainId' });
    showChainId.innerHTML = activeChainId;
}

// Update the selected account and chain id on change
ethereum.on('accountsChanged', getAccount);
ethereum.on('chainChanged', getChainId);