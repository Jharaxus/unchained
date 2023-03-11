var db;
var set;
var ref;
var get;
var child;
document.addEventListener( 'DOMContentLoaded',  async function () { 
  await import('../global-scope/database.js').then(function (exports) {
    exportData = exports;
  });
  child = exportData.dbchild;
  get = exportData.dbget;
  db = exportData.db;
  ref = exportData.dbref;
  set = exportData.dbset;
})

const ethereumButton = document.querySelector('.enableEthereumButton');
const pieChart = document.getElementById('pieChart'); 
const lineGraph = document.getElementById('lineGraph');
const lineChartBox = document.querySelector('.line-chart-box');
const circularGraphBox = document.querySelector('.circular-graph-box');
const buttonNotConnected = document.getElementById('buttonNotConnected');
const buttonNotConnected2 = document.getElementById('buttonNotConnected2');

var ethAddress = "";
Chart.defaults.font.size = 18;

const pie = new Chart(pieChart, {
  type: 'pie',
  data: {
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
})

const line = new Chart(lineGraph, {
  type: 'line',
  data: {
    labels: ['August 2023', 'january 2024', 'August 2024', 'january 2025', 'August 2025', 'january 2026'],
    datasets: [{
      borderColor: 'rgb(70, 55, 117)',
      label: 'total interest earned in %',
      data: [4, 9, 16, 18, 24, 32],
      borderWidth: 4,
    }]
  }
})
window.addEventListener('load', checkIfNotConnected);

function checkIfNotConnected() {
  if (!ethereumButton.disabled) { 
    buttonNotConnected.classList.add ('buttonNotConnected');
    buttonNotConnected.textContent ="Connect your wallet to view your portfolio performances";
    buttonNotConnected2.classList.add ('buttonNotConnected2');
    buttonNotConnected2.textContent ="Connect your wallet to view your portfolio composition";
    pieChart.style.filter = 'blur(5px)';
    lineGraph.style.filter = 'blur(5px)';
    Chart.defaults.font.size = 18;
  }
}

buttonNotConnected.addEventListener('click', () => {
  ethereumButton.click();
})

buttonNotConnected2.addEventListener('click', () => {
  ethereumButton.click();
})

window.addEventListener('addressToCatch', function(event) {
  ethAddress = event.detail;
  connect();
});

async function connect() {
  buttonNotConnected.remove();
  buttonNotConnected2.remove();
  pieChart.style.filter = 'none';
  lineGraph.style.filter = 'None';
  const checkDb = ref(db);
  await get(child(checkDb, "ethAddress/" + ethAddress))
  .then((snapshot)=>{ 
    if(snapshot.exists()){
      pie.data.datasets[0].data = snapshot.val().pieData;
      pie.update();
      if (pie.data.datasets[0].data[0] == 0 && 
        pie.data.datasets[0].data[1] == 0 &&
        pie.data.datasets[0].data[2] == 0 ){
        const pElement = document.createElement("p");
        pElement.textContent = "You have not invested in any of our strategies yet";
        pElement.classList.add('pElement');
        circularGraphBox.appendChild(pElement);
      }
      line.data.datasets[0].data = snapshot.val().lineData
      line.update();
    }
    else{
      line.data.datasets[0].data = [0, 0, 0, 0, 0, 0];
      line.update();
      pie.data.datasets[0].data = [0, 0, 0];
      pie.update();
      const pElement = document.createElement("p");
      pElement.textContent = "You have not invested in any of our strategies yet";
      pElement.classList.add('pElement');
      circularGraphBox.appendChild(pElement);
      set(ref(db, "ethAddress/" + ethAddress), {
        pieData: [0, 0, 0],
        lineData: [0, 0, 0, 0, 0, 0]
      })
      .then(() => {
        /*alert("Data added successfully!")*/
      })
      .catch((error) => {
          alert(error)
      });
    }
  })
  /*if (result) {
    distributionData.datasets[0].data = result.data;
    new Chart(distributionChart, {
      type: 'pie',
      data: distributionData,
    });
    config.data.labels = lineLabels;
    config.data.datasets[0].data = result.lineData;
    new Chart(ctx, config);
  }  else {
    const data = {
      pieData: [0, 0, 0],
      lineData: [0, 0, 0, 0, 0, 0]
    };
    await set(ethereumAddress, data);
  }*/
}


