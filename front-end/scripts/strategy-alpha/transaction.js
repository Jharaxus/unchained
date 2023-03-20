
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

var maxAmountDeposit;

window.addEventListener('depositBalanceWorthSend', function(event) {
  maxAmountDeposit = event.detail;
});

const deposit = document.querySelector('.interface-deposit');
const errorMessageDeposit = document.createElement("p");
var messageToEraseDeposit = false;
var messageToEraseWithdraw = false;
const stateOperationsDeposit = document.getElementById("state-operations-deposit");
const stateOperationsWordsDeposit = document.getElementById("state-operations-words-deposit");

supplyButton.addEventListener("click", function() {
  if (parseFloat(inputDeposit.value) > parseFloat(maxAmountDeposit)) {
    if (!messageToEraseDeposit) {
    errorMessageDeposit.textContent = "The desired amount is superior to your wallet balance of Aave";
    errorMessageDeposit.classList.add('error-message');
    deposit.appendChild(errorMessageDeposit);
    messageToEraseDeposit = true;
    }
  }
  else {
    if (messageToEraseDeposit) {
      deposit.removeChild(errorMessageDeposit);
      messageToEraseDeposit = false;
    }
    stateOperationsWordsDeposit.style.visibility = "visible";
    stateOperationsDeposit.style.visibility = "visible";
    const depositButtonActivated = new Event('DepositButtonActivated');
    window.dispatchEvent(depositButtonActivated);
  }
});

const withdraw = document.querySelector('.interface-withdraw');
const errorMessageWithdraw = document.createElement("p");
var messageToEraseWithdraw = false;
const stateOperations = document.getElementById("state-operations");
const stateOperationsWords = document.getElementById("state-operations-words");

withdrawButton.addEventListener("click", function() {
  stateOperationsWords.style.visibility = "visible";
    stateOperations.style.visibility = "visible";
    const withdrawbuttonActivated = new Event('withdrawButtonActivated');
    window.dispatchEvent(withdrawbuttonActivated);
});

