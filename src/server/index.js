require('dotenv').config();
const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const path = require('path');
const { Map } = require('immutable');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '../public')));

app.get('/latest/:rover', async (req, res) => {
  const rover = req.params.rover;
  fetch(
    `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/latest_photos?api_key=${process.env.API_KEY}`
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Something went wrong', err);
      }
    })
    .then((responseJson) => {
      const latest = responseJson.latest_photos;
      const value = 2;
      res.send({ latest, value });
    })
    .catch((error) => {
      throw new Error('This is the error', error);
    });
});

app.get('/images/:rover', (req, res) => {
  const rover = req.params.rover;
  fetch(
    `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=10&api_key=${process.env.API_KEY}`
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Something went wrong', err);
      }
    })
    .then((responseJson) => {
      const roverImages = responseJson.photos.splice(0, 5);
      const roverData = Map(responseJson.photos[0]);
      const value = 1;
      res.send({ roverData, roverImages, value });
    })
    .catch((error) => {
      throw new Error('This is the error', error);
    });
});

app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
