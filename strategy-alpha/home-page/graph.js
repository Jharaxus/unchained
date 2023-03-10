console.log("nani j'ai rien ici !!");
var db;
var set;
var ref;
var get;
var child;
document.addEventListener( 'DOMContentLoaded',  async function () { 
  await import('../../../src/database.js').then(function (exports) {
    exportData = exports;
  });
  child = exportData.dbchild;
  get = exportData.dbget;
  db = exportData.db;
  ref = exportData.dbref;
  set = exportData.dbset;
})

const ethereumButton = document.querySelector('.enableEthereumButton');
const distributionChart = document.getElementById('Distribution-Chart'); 
const ctx = document.getElementById('myChart');
const pElement = document.createElement('p');

var backgroundColor = [
  'rgb(41, 103, 48)', 
  'rgb(70, 55, 117)',
  'rgb(56, 97, 130)'  
];
var labels = ['Alpha', 'Beta', 'Gamma'];
var lineLabels = ['August 2023', 'january 2024', 'August 2024', 'january 2025', 'August 2025', 'january 2026'];

window.addEventListener('load', checkIfNotConnected);

function checkIfNotConnected() {
  if (!ethereumButton.disabled) { 
    console.log("ou est mon text ? ");
    const needToConnect = document.getElementById('needToConnect');
    // Create a new button element and copy the style of the Ethereum button
    const pElement = document.createElement('p');
    console.log("Je ne me répèterais pas ");
    pElement.textContent ="Connect to Metamask to see your data";
    pElement.style.position = 'absolute';
    pElement.style.top = '35%';
    pElement.style.left = '40%';
    pElement.style.color = 'white';
    pElement.style.fontSize = '30px';
    pElement.style.zIndex = '3';
    // Add the copied button to the div element
    needToConnect.appendChild(pElement);
    // displays for both graph a a blurred exemple is the user is not connected to an ethereum address
    distributionChart.style.filter = 'blur(5px)';
    ctx.style.filter = 'blur(5px)';
    const distributionData = {
      labels: ['Alpha', 'Beta', 'Gamma'],
      datasets: [{
          label: 'funds owned',
          data: [12, 19, 7],
          borderWidth: 1,
          borderColor: '#0000000',
          color: 'rgb(31, 33, 73)',   
          backgroundColor: [
            'rgb(41, 103, 48)', 
            'rgb(70, 55, 117)',  
            'rgb(56, 97, 130)' 
          ]
        }]
    }
    
    new Chart(distributionChart, {
      type: 'pie',
      data: distributionData,
    });
    const a = ['August 2023', 'january 2024', 'August 2024', 'january 2025', 'August 2025', 'january 2026'];
      const config = {
        type: 'line',
        data: {
          labels: a,
          datasets: [{
            borderColor: 'rgb(70, 55, 117)',
            label: 'total interest earned in %',
            data: [4, 9, 16, 18, 24, 32],
            borderWidth: 4,
          }]
        },
      };
      new Chart(ctx, config)
  }
}
var ethAddress = "";
window.addEventListener('addressToCatch', function(event) {
    ethAddress = event.detail;
    connect();
});

async function connect() {
  if (pElement) { // Check if the p element exists
    pElement.remove(); // Remove the p element from the DOM
  }
  // Check if the Ethereum address exists in the database
  const result = await get(ethAddress);
  
  // If the Ethereum address exists in the database, update charts with the database values
  if (result) {
    distributionChart.style.filter = 'none';
    ctx.style.filter = 'None';
    // Update distribution chart
    distributionData.labels = labels;
    distributionData.datasets[0].backgroundColor = backgroundColor;
    distributionData.datasets[0].data = result.data;
    new Chart(distributionChart, {
      type: 'pie',
      data: distributionData,
    });

    config.data.labels = lineLabels;
    config.data.datasets[0].data = result.lineData;
    new Chart(ctx, config);
  }  else {
    // If the Ethereum address does not exist in the database, create a new account with all values set to 0
    const data = {
      data: [0, 0, 0],
      lineData: [0, 0, 0, 0, 0, 0]
    };
    await set(ethereumAddress, data);
  }
}


