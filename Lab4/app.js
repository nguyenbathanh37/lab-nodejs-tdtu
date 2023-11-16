const express = require('express');
const axios = require('axios');
const ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));


app.get('/', (req, res) => {
  axios.get('https://gorest.co.in/public-api/users')
    .then(response => {
      const users = response.data.data;
      res.render('index', { users });
    })
    .catch(error => {
      console.log(error);
    });
});

app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  axios.get(`https://gorest.co.in/public-api/users/${userId}`)
    .then(response => {
      const user = response.data.data;
      res.render('user', { user });
    })
    .catch(error => {
      console.log(error);
    });
});


app.post('/user', (req, res) => {
  const newUser = req.body;
  axios.post('https://gorest.co.in/public-api/users', newUser)
    .then(response => {
      res.redirect('/');
    })
    .catch(error => {
      console.log(error);
    });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
})