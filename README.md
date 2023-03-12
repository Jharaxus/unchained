# Unchained application
Welcome to the repository of the unchained application.

## Website
You can find everything related to the website of the application in the [front-end folder](https://github.com/)

## Blockchain backend
You can find everything related to the blockchain backend of the application in the [web3-backend folder](https://github.com/)

## Launch the démo
First, launch the server as explainee in the `front-end folder`.
Then, in another terminal window, launch a local blockchain and deploy the smart contracts as explained in `web3-backend folder`.
You can now oppen you metamask extension in your browser (tested on chrome), it should automatically detect the network on port 8545. Go to your settings, Networks, and change the chain id for this network to 27.
Finnally, retrieve your wallet's public key and add it to the script `web3-back-end/script.sh`. Move to the `web3-back-end` folder and run this script.
The demo should now be working if you go to the website page at `http://localhost:8080/pages/landing-page.html`.