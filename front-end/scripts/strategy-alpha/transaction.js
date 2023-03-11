
function validateInput(event) {
  if (event.key == '.' || (event.key >= '0' && event.key <= '9') || event.key == 'Backspace' || event.key == 'backspace') {
  }  else {
    event.preventDefault();
  }
}

const inputDeposit = document.getElementById('wished-amount-deposit');
inputDeposit.addEventListener('keydown', validateInput);

const inputWithdraw = document.getElementById('wished-amount-withdraw');
inputWithdraw.addEventListener('keydown', validateInput);

const supplyButton = document.getElementById("supply-button");
const withdrawButton = document.getElementById("withdraw-button")

var maxAmountWithdraw;
var maxAmountDeposit;

window.addEventListener('depositBalanceWorthSend', function(event) {
  console.log("deposit catch validé");
  maxAmountDeposit = event.detail;
});

window.addEventListener('withdrawBalanceWorthSend', function(event) {
  console.log("withdraw catch validé");
  maxAmountWithdraw = event.detail;
});

const deposit = document.querySelector('.interface-deposit');
const errorMessageDeposit = document.createElement("p");
var messageToEraseDeposit = false;

supplyButton.addEventListener("click", function() {
  if (parseFloat(inputDeposit.value) > parseFloat(maxAmountDeposit)) {
    if (!messageToEraseDeposit) {
    errorMessageDeposit.textContent = "The desired amount is superior to your wallet balance of Aave";
    errorMessageDeposit.classList.add('error-message');
    deposit.appendChild(errorMessageDeposit);
    messageToEraseDeposit = true;
    }
  }
  else if (messageToEraseDeposit) {
    deposit.removeChild(errorMessageDeposit);
    messageToEraseDeposit = false;
  }
});

const withdraw = document.querySelector('.interface-withdraw');
const errorMessageWithdraw = document.createElement("p");
var messageToEraseWithdraw = false;

withdrawButton.addEventListener("click", function() {
  if (parseFloat(inputWithdraw.value) > parseFloat(maxAmountWithdraw)) {
    if (!messageToEraseWithdraw) {
    errorMessageWithdraw.textContent = "The desired amount is superior to your wallet balance of Aave";
    errorMessageWithdraw.classList.add('error-message');
    withdraw.appendChild(errorMessageWithdraw);
    messageToEraseWithdraw = true;
    }
  }
  else if (messageToEraseWithdraw) {
    withdraw.removeChild(errorMessageWithdraw);
    messageToEraseWithdraw = false;
  }
});