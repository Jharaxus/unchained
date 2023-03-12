
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  const name = process.env.NAME || 'Safwane';
  res.send(`Hello ${name}!`);
});

app.get('/anvil', (req, res) => {
  
});

const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => {
  console.log(`helloworld: listening on port ${port}`);
});


/*1) faire fichier shell qui fait toutes les étapes de setup de la blockchain avec anvil. 
2) deployer un service shell sur google cloud avec le lien google cloud (en go)
3) pouvoir récupérer et envoyer des données*/