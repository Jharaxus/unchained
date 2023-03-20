//////////////////////////////////////////////////////////////////////////////////////////////
/////// Deposit / Withdraw interface switch
//////////////////////////////////////////////////////////////////////////////////////////////

const depositButton = document.querySelector('.deposit-button');
const withdrawButton = document.querySelector('.withdraw-button');

const interfaceBox = document.querySelector('.deposit-withdraw-interface');
const interfaceDeposit = document.querySelector('.interface-deposit');
const interfaceWithdraw = document.querySelector('.interface-withdraw');

const depositInterface = 1;
const withdrawInterface = 2;

var currentInterface = 0;

// Always start with deposit interface seclected
switchToDeposit();

depositButton.addEventListener('click', () => {
  if (currentInterface == withdrawInterface) {
    switchToDeposit();
  }
})

withdrawButton.addEventListener('click', () => {
  if (currentInterface == depositInterface) {
    switchToWithdraw();
  }
})

function switchToDeposit() {
  if (currentInterface == depositInterface)
    console.error("Already in deposit interface");
  
  withdrawButton.classList.remove("selected")
  interfaceBox.classList.remove("right-selected");

  depositButton.classList.add("selected")
  interfaceBox.classList.add("left-selected");

  interfaceWithdraw.style.display = "none";
  interfaceDeposit.style.display = "flex";

  currentInterface = depositInterface;
}

function switchToWithdraw() {
  if (currentInterface == withdrawInterface)
    console.error("Already in withdraw interface");
  
  depositButton.classList.remove("selected")
  interfaceBox.classList.remove("left-selected");

  withdrawButton.classList.add("selected")
  interfaceBox.classList.add("right-selected");

  interfaceDeposit.style.display = "none";
  interfaceWithdraw.style.display = "flex";
  
  currentInterface = withdrawInterface;

  askForStrategyBalance()
}

//////////////////////////////////////////////////////////////////////////////////////////////
/////// Token selection
//////////////////////////////////////////////////////////////////////////////////////////////

const tokens_available = [
  "aave", "tether", "usd-coin", "weth", "wrapped-bitcoin"
]
let current_token = 0

const tokens_data_cached = {
  "aave" : {
    name: 'Aave',
    symbol: 'aave',
    description: 'Aave is a decentralized money market protocol wher…s to take out loans from the liquidity pools.',
    homepage: 'https://app.aave.com/?referral=93',
    current_price: 73.01,
    image: 'https://assets.coingecko.com/coins/images/12645/large/AAVE.png?1601374110',
  },
  "wrapped-bitcoin" : {
    name: 'Wrapped Bitcoin',
    symbol: 'wbtc',
    description: '',
    homepage: 'https://www.wbtc.network/',
    current_price: 25212,
    image: 'https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png?1548822744'
  },
  "usd-coin" : {
    name: 'USD Coin',
    symbol: 'usdc',
    description: 'USDC is a fully collateralized US dollar stablecoi…s, we can create a more inclusive global economy.',
    homepage: "https://www.circle.com/en/usdc",
    current_price: 0.931162,
    image: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389"
  },
  "tether" : {
    name: 'Tether',
    symbol: 'usdt',
    description: 'Tether (USDT) is a cryptocurrency with a value mea…ersion between USD to and from your bank account.',
    homepage: "https://tether.to/",
    current_price: 0.933609,
    image: "https://assets.coingecko.com/coins/images/325/large/Tether.png?1668148663"
  },
  "weth" : {
    name: 'WETH',
    symbol: 'weth',
    description: 'What is WETH (Wrapped ETH)?\r\nWETH is the tokenized…make it compliant with its own ERC-20 standards. ',
    homepage: "https://weth.io/",
    current_price: 1657.88,
    image: "https://assets.coingecko.com/coins/images/2518/large/weth.png?1628852295"
  }
}

const tokens_data = Object.create(null)
const user_tokens_balance = Object.create(null)
const user_strategy_balances = Object.create(null)

const selectTokenLeft = document.querySelector('.token-selection-button.left')
const selectTokenRight = document.querySelector('.token-selection-button.right')

const tokenSelectedLogo = document.querySelector('.token-selected-logo')
const tokenSelectedName = document.querySelector('.token-selected-name')

const depositBalanceLabel = document.getElementById("wallet-deposit-token-balance")
const depositTokenSymbol = document.getElementById("wallet-deposit-token-symbol")
const depositBalanceWorth = document.getElementById("wallet-deposit-token-worth")

const withdrawBalanceLabel = document.getElementById("wallet-withdraw-strategy-balance")
const withdrawTokenSymbol = document.getElementById("wallet-withdraw-strategy-symbol")
const withdrawBalanceWorth = document.getElementById("wallet-withdraw-strategy-worth")

selectTokenLeft.addEventListener('click', () => {
  switchWithNextToken("left")
})
selectTokenRight.addEventListener('click', () => {
  switchWithNextToken("right")
})

function load_token_data(token) {
  axios.get('https://api.coingecko.com/api/v3/coins/' + token + '?tickers=false&market_data=true&community_data=false&developer_data=true&sparkline=true')
    .then(function(response) {
      const response_json = response["data"]
      console.log(response_json)
      tokens_data[token] = {
        "name": response_json["name"],
        "symbol": response_json["symbol"],
        "description": response_json["description"]["fr"],
        "homepage": response_json["links"]["homepage"][0],
        "current_price": Number(response_json["market_data"]["current_price"]["eur"]),
        "image": response_json["image"]["large"]
      }
      console.log(tokens_data[token])
    })
    .catch(function(error) {
      console.log(error)
      tokens_data[token] = tokens_data_cached[token]
    })
    .finally(function () {
      if (token === tokens_available[current_token]) {
        switchWithNextToken("")
      }
    })
}
var tokenDataSaviorPrice;

function switchWithNextToken(direction) {
  current_token = nextToken(current_token, tokens_available.length, direction)
  const token = tokens_available[current_token]
  const tokenData = tokens_data[token]

  tokenDataSaviorPrice = tokenData["current_price"];
  const tokenDataFetchEvent = new CustomEvent('tokenDataFetchEvent', { detail: tokenDataSaviorPrice});
  window.dispatchEvent(tokenDataFetchEvent);;

  const current_token_balance = user_tokens_balance[token]
  
  tokenSelectedLogo.src = tokenData["image"]
  tokenSelectedName.textContent = tokenData["name"]

  depositBalanceLabel.textContent = current_token_balance.toFixed(2)
  depositTokenSymbol.textContent = tokenData["symbol"]
  const valueDepositBalanceWorth = (current_token_balance * tokenData["current_price"]).toFixed(2);
  depositBalanceWorth.textContent = "worth: " + valueDepositBalanceWorth + "€";
  const depositBalanceWorthSend = new CustomEvent('depositBalanceWorthSend', { detail: valueDepositBalanceWorth});
  window.dispatchEvent(depositBalanceWorthSend)
  
  if (tokenData["name"] === "Aave") {
    const aaveNotification = new CustomEvent('switchedToAave');
    window.dispatchEvent(aaveNotification)
  }
}

function askForStrategyBalance() {
  const askEnvent = new CustomEvent('askForStrategyBalance');
  window.dispatchEvent(askEnvent)
}

window.addEventListener('replyForStrategyBalance', function(event) {
  let balance = event.detail
  let symbol = event.tokenSymbol
  const aaveValue = BigInt(Math.floor(tokens_data["aave"]["current_price"] * 1000))
  const strategyValueOwned = BigInt(balance) * aaveValue / 10n**21n
  withdrawBalanceLabel.textContent = balance.toFixed(2)
  withdrawBalanceWorth.textContent = "worth: " + strategyValueOwned + "€";
  withdrawTokenSymbol.textContent = symbol
})

function nextToken(tokenId, max, direction) {
  if (direction === "left")
    return (tokenId == 0 ? max : tokenId) - 1
  else if (direction === "right")
    return (tokenId + 1) % max
  return tokenId
}

for (let token of tokens_available) {
  load_token_data(token)
  user_tokens_balance[token] = 0
}

window.addEventListener('UpdateDeposit', function(event) {
  let result = event.detail;
  const valueDepositBalanceWorth = (result * tokenDataSaviorPrice).toFixed(2);
  depositBalanceWorth.textContent = "worth: " + valueDepositBalanceWorth + "€"; 
  const depositBalanceWorthSend = new CustomEvent('depositBalanceWorthSend', { detail: valueDepositBalanceWorth});
  window.dispatchEvent(depositBalanceWorthSend);
});