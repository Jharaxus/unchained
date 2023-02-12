const distributionChart = document.getElementById('Distribution-Chart');

const distributionData = {
  labels: ['Alpha', 'Beta', 'Gamma', 'Delta'],
  datasets: [{
      label: 'funds owned',
      data: [12, 19, 3, 5],
      borderWidth: 1
    }]
  }

new Chart(distributionChart, {
  type: 'pie',
  data: distributionData,
});