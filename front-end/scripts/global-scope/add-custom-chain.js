import { ethers } from 'http://localhost:8080/third-party/ethers.js';
import { utils } from 'ethers';
/*
chainId = '137'; 
chainId = web3.utils.toHex(chainId);


const { ethereum } = window;
await ethereum.request({
                id: 1,
                jsonrpc: "2.0",
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: chainId,
                    rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
                    chainName: "Polygon Testnet Mumbai",
                    nativeCurrency: {
                      name: "tMATIC",
                      symbol: "tMATIC", // 2-6 characters long
                      decimals: 18,
                    },
                    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
                  },
                ],
              }); 

/*
chainId = '28';
chainId = web3.utils.toHex(chainId);

const network = [
  {
    chainId: chainId,
    chainName: "Localhost 8545 from script",
    nativeCurrency: {
      name: "UnchainedCoin",
      symbol: "UNC",
      decimals: 18
    },
    rpcUrls: ["http://localhost:8545"],
  },
];

async function addNetwork() {
  console.log("dans addNetwork");
  const provider = await window.ethereum.enable();
  const web3Provider = new Web3(provider[0]);
  await web3Provider.eth.request({ method: 'wallet_addEthereumChain', params: [network] });
}


window.addEventListener('addressToCatch', function(event) {
  console.log("user connected");
  addNetwork();
});

/*
const network = [
  {
    chainId: '0x28',
    chainName: "Localhost 8545 from script",
    rpcUrls: ["http://localhost:8545"],
  },
];


async function addNetwork() {
  await window.ethereum.request({
    method: "wallet_addEthereumChain",
    params: [network],
  });
}

window.addEventListener('addressToCatch', function(event) {
  console.log("user connected");
  addNetwork();
});
*/