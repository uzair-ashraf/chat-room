const express = require('express');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, '/views'))

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
    res.render('pages/index');
})

app.listen(3000, () => {
  console.log('server is running on port 3000');
})
