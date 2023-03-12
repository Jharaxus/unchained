
const dotLeftDeposit = document.querySelector('.dot.left-deposit');
const dotRightDeposit1 = document.querySelector('.dot.right-deposit1');
const dotRightDeposit2 = document.querySelector('.dot.right-deposit2');

const lineDeposit1 = document.querySelector('.line-deposit1');
const lineDeposit2 = document.querySelector('.line-deposit2');

<<<<<<< HEAD
const approvalWordDeposit = document.querySelector('.approval-word-deposit');
const delegateWordDeposit = document.querySelector('.delegate-word-deposit');
const completedWordDeposit = document.querySelector('.completed-word-deposit');


const web3 = new Web3(Web3.givenProvider);

let tokenAddress = "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9";
let walletAddress = "0x75741c5D7AD1BA3881001F0A4C53CaA0016694Fa";

=======
>>>>>>> 27dec97 (Fix errors)
// The minimum ABI to get ERC20 Token balance
let erc20ABI = [
  // balanceOf
  {
    "constant":true,
    "inputs":[{"name":"_owner","type":"address"}],
    "name":"balanceOf",
    "outputs":[{"name":"balance","type":"uint256"}],
    "type":"function"
  },
  // decimals
  {
    "constant":true,
    "inputs":[],
    "name":"decimals",
    "outputs":[{"name":"","type":"uint8"}],
    "type":"function"
  }
];

// ABI for our alpha vault contract
let AsvABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_delegator",
        "type": "address"
      }
    ],
    "name": "assetsDelegated",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_delegator",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "delegate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalAssetsDelegated",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_receiver",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

let aaveAddress = "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9";
let vaultAddress = "0x47c05bcca7d57c87083eb4e586007530ee4539e9";

const web3 = new Web3(Web3.givenProvider);

let aaveContract = new web3.eth.Contract(erc20ABI, aaveAddress);

activeAccount = null;

async function getAaveBalance() {
  balance = await aaveContract.methods.balanceOf(activeAccount).call(); // changer balanceOf par la methode dont j'ai besoin 
  const balanceConverted = balance / 10**16;
  return balanceConverted;
}

walletBalance = document.getElementById("wallet-deposit-token-balance");

window.addEventListener('addressToCatch', function(event) {
  activeAccount = event.detail;
  console.log(activeAccount);
  getAaveBalance().then(function (result) {
    walletBalance.textContent = result;
    const walletBalanceWorthSend = new CustomEvent('UpdateDeposit', {detail: result});
    window.dispatchEvent(walletBalanceWorthSend);
  });
});

/*
let contractAlphaStrategyVault = new web3.eth.Contract(AsvABI, "lucas", tokenAddress, );

window.addEventListener('withdrawButtonActivated', () =>{
  console.log("partiellement dedans");
  async function activatContract() {
    await contractAlphaStrategyVault.methods.run(); // changer balanceOf par la methode dont j'ai besoin 
    console.log("connected to smart contract");
  }
  activatContract();
});

window.addEventListener('DepositButtonActivated', () =>{
  dotLeftDeposit.style.borderColor = 'green';
  dotRightDeposit1.style.borderColor = 'green';
  dotRightDeposit2.style.borderColor = 'green';
  lineDeposit1.style.background = 'linear-gradient(to right, rgba(114, 224, 86, 0.402), rgb(2, 9, 26))';
  lineDeposit2.style.background = 'linear-gradient(to right, rgba(114, 224, 86, 0.402), rgb(2, 9, 26))';
  approvalWordDeposit.style.color = 'snow';
  delegateWordDeposit.style.color = 'snow';
  completedWordDeposit.style.color = 'snow';
  lineDeposit1.style.backgroundColor = 'background: linear-gradient(to right, rgba(114, 224, 86, 0.402), rgb(2, 9, 26))'
  lineDeposit2.style.backgroundColor = 'background: linear-gradient(to right, rgba(114, 224, 86, 0.402), rgb(2, 9, 26))'


});*/
