require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const path = require('path');
const { Map } = require('immutable');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '../public')));

app.get('/latest/:rover', async (req, res) => {
  const rover = req.params.rover;
  try {
    let response = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/latest_photos?api_key=${process.env.API_KEY}`
    );
    const data = await response.json();
    const latest = data.latest_photos;
    const value = 2;
    res.send({ latest, value });
  } catch (err) {
    throw new Error('Something went wrong', err);
  }
});

app.get('/images/:rover', async (req, res) => {
  const rover = req.params.rover;
  try {
    let response = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=10&api_key=${process.env.API_KEY}`
    );
    const data = await response.json();
    const roverImages = data.photos.splice(0, 5);
    const roverData = Map(data.photos[0]);
    const value = 1;
    res.send({ roverData, roverImages, value });
  } catch (err) {
    throw new Error('Something went wrong', err);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
