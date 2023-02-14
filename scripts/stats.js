const distributionChart = document.getElementById('Distribution-Chart');

const distributionData = {
  labels: ['Alpha', 'Beta', 'Gamma'],
  datasets: [{
      label: 'funds owned',
      data: [12, 19, 7],
      borderWidth: 1,
      borderColor: '#0000000',
      color: 'rgb(31, 33, 73)',   // --main-bg-color
      backgroundColor: [
        'rgb(41, 103, 48)', // --bg-light-1-color
        'rgb(70, 55, 117)',  // --bg-light-2-color
        'rgb(56, 97, 130)'  // --bg-light-3-color
      ]
    }]
}

new Chart(distributionChart, {
  type: 'pie',
  data: distributionData,
});