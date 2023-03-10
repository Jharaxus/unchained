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
}

//////////////////////////////////////////////////////////////////////////////////////////////
/////// Token selection
//////////////////////////////////////////////////////////////////////////////////////////////

const tokens_available = [
  "tether", "usd-coin", "aave", "weth", "wrapped-bitcoin"
]
let current_token = "aave"

const tokens_data = Object.create(null)
const user_tokens_balance = Object.create(null)
const user_strategy_balances = Object.create(null)

const depositBalanceLabel = document.getElementById("wallet-deposit-token-balance")
const depositTokenSymbol = document.getElementById("wallet-deposit-token-symbol")
const depositBalanceWorth = document.getElementById("wallet-deposit-token-worth")

const withdrawBalanceLabel = document.getElementById("wallet-withdraw-strategy-balance")
const withdrawTokenSymbol = document.getElementById("wallet-withdraw-strategy-symbol")
const withdrawBalanceWorth = document.getElementById("wallet-withdraw-strategy-worth")

function load_token_data(token) {
  axios.get('https://api.coingecko.com/api/v3/coins/' + token + '?tickers=false&market_data=true&community_data=false&developer_data=true&sparkline=true')
    .then(function(response) {
      const response_json = response["data"]
      console.log(response_json)
      tokens_data[token] = {
        "symbol": response_json["symbol"],
        "description": response_json["description"]["fr"],
        "homepage": response_json["links"]["homepage"],
        "current_price": Number(response_json["market_data"]["current_price"]["eur"]),
        "image": response_json["image"]["large"]
      }
    })
    .catch(function(error) {
      console.log(error)
    })
    .finally(function () {
      if (token === current_token) {
        switchToToken(current_token)
      }
    })
}

function switchToToken(token) {
  const tokenData = tokens_data[token]
  console.log("Token data: " + tokenData)
  const current_token_balance = user_tokens_balance[token]
  const current_strategy_balance = user_strategy_balances[token]
  
  depositBalanceLabel.textContent = current_token_balance
  depositTokenSymbol.textContent = tokenData["symbol"]
  depositBalanceWorth.textContent = (current_token_balance * tokenData["current_price"]).toFixed(2) + "€"

  withdrawBalanceLabel.textContent = current_strategy_balance
  withdrawTokenSymbol.textContent = tokenData["symbol"]
  withdrawBalanceWorth.textContent = (current_strategy_balance * tokenData["current_price"]).toFixed(2) + "€"
}

for (let token of tokens_available) {
  load_token_data(token)
  user_tokens_balance[token] = 10
  user_strategy_balances[token] = 3
}