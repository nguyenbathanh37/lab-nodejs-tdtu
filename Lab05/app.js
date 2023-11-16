const express = require('express');
const axios = require('axios');
const ejs = require('ejs');

const app = express();
const token = 'Bearer 66faab55fa7f0a1b12ef0536ce2ea370cafd46a273deaf3817ed67f4401e1b2d'

app.set('view engine', 'ejs');

app.use(express.static('public'));


app.listen(3000, () => {
    console.log('Server is running on port 3000');
  })