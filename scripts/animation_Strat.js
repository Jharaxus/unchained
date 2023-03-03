// Create a reusable function to animate a ray of light within a delimiter element
function animateRayOfLight(delimiterElement, rayOfLightClass) {
  const rayOfLightElement = document.createElement('div'); // Create a new div element for the ray of light
  rayOfLightElement.classList.add(rayOfLightClass); // Add a class to the ray of light element
  delimiterElement.appendChild(rayOfLightElement); // Append the ray of light element to the delimiter element

  // Set a timeout to remove the ray of light element after 1 second
  setTimeout(() => {
    delimiterElement.removeChild(rayOfLightElement); // Remove the ray of light element from the delimiter element
  }, 1000);
}

// Set an interval to animate the ray of light every 2 seconds for the first delimiter element
setInterval(() => {
  const delimiterElement = document.querySelector('.delimiter');
  animateRayOfLight(delimiterElement, 'ray-of-light');
}, 3000);

// Set an interval to animate the ray of light every 2 seconds with a delay of 1 second for the second delimiter element
setInterval(() => {
  const delimiterElement = document.querySelector('.delimiter2');
  setTimeout(() => {
    animateRayOfLight(delimiterElement, 'ray-of-light2');
  }, 1000);
}, 3000);

function validateInput(event) {
  if (event.key == '.' || (event.key >= '0' && event.key <= '9') || event.key == 'Backspace' || event.key == 'backspace') {
    // allow input
  } else if (event.ctrlKey && (event.key == 'v' || event.key == 'V')) {
    // allow pasting with Ctrl+V
  } else {
    // prevent input
    event.preventDefault();
  }
}

const input = document.getElementById('wished-amount');
input.addEventListener('keydown', validateInput);

const inputAlpha = document.getElementById('wished-amount-alpha');
inputAlpha.addEventListener('keydown', validateInput);

const supplyButton = document.getElementById("supply-button");
const maxAmount = document.getElementById("max-amount").textContent;
const wishedAmount = document.getElementById("wished-amount");
const deposit = document.querySelector('.interface-deposit');
const errorMessage = document.createElement("p");
var messageToErase = false;

supplyButton.addEventListener("click", function() {
  if (parseFloat(wishedAmount.value) > parseFloat(maxAmount)) {
    if (!messageToErase) {
    errorMessage.textContent = "The desired amount is superior to your wallet balance of Aave";
    errorMessage.classList.add('error-message');
    deposit.appendChild(errorMessage);
    messageToErase = true;
    }
  }
  else if (messageToErase) {
    deposit.removeChild(errorMessage);
    messageToErase = false;
  }
});

const supplyButtonAlpha = document.getElementById("supply-button-alpha");
const maxAmountAlpha = document.getElementById("max-amount-alpha").textContent;
const wishedAmountAlpha = document.getElementById("wished-amount-alpha");
const withdraw = document.querySelector('.interface-withdraw');
const errorMessageAlpha = document.createElement("p");
var messageToEraseAlpha = false;

supplyButtonAlpha.addEventListener("click", function() {
  if (parseFloat(wishedAmountAlpha.value) > parseFloat(maxAmountAlpha)) {
    if (!messageToEraseAlpha) {
    errorMessageAlpha.textContent = "The desired amount is superior to your wallet balance of Alpha";
    errorMessageAlpha.classList.add('error-message');
    withdraw.appendChild(errorMessageAlpha);
    messageToEraseAlpha = true;
    }
  }
  else if (messageToEraseAlpha) {
    withdraw.removeChild(errorMessageAlpha);
    messageToEraseAlpha = false;
  }
});