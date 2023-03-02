const ctx = document.getElementById('myChart');
  const a = ['january 2023', 'August 2023', 'january 2024', 'August 2024', 'january 2025', 'August 2026'];
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