const depositButton = document.querySelector('.deposit-button');
const withdrawButton = document.querySelector('.withdraw-button');
const interfaceBox = document.querySelector('.deposit-withdraw-interface');

const depositInterface = 1;
const withdrawInterface = 2;

var currentInterface = 0;

// Always start with deposit interface seclected
switchToDeposit();

depositButton.addEventListener('click', () => {
  console.log("Click on deposit !");
  if (currentInterface == withdrawInterface) {
    switchToDeposit();
  }
})

withdrawButton.addEventListener('click', () => {
  console.log("Click on withdraw !");
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

  currentInterface = depositInterface;
}

function switchToWithdraw() {
  if (currentInterface == withdrawInterface)
    console.error("Already in withdraw interface");
  
  depositButton.classList.remove("selected")
  interfaceBox.classList.remove("left-selected");

  withdrawButton.classList.add("selected")
  interfaceBox.classList.add("right-selected");
  
  currentInterface = withdrawInterface;
}