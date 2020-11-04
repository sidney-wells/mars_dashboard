require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '../public')));

app.get('/:rover', async (req, res) => {
  const rover = req.params.rover;
  try {
    let image = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=10&api_key=${process.env.API_KEY}`
    );
    const data = await image.json();

    const roverImages = data.photos.splice(0, 5);
    const roverData = data.photos[0];
    res.send({ roverData, roverImages });
  } catch (err) {
    console.log('error:', err);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
