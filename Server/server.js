const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const PORT = process.env.PORT || 9000;
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'W%m&iY44FX',
  database: 'car_dealership',
  multipleStatements: true
})

const app = express();
//Configuring express server
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  bodyParser.json();
  next();
});
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
})

connection.connect((err) => {
  if (!err)
    console.log('Connection Established Successfully');
  else
    console.log('Connection Failed!' + JSON.stringify(err, undefined, 2));
});



app.get('/q', function (req, res) {
  console.log(req.query.param)
  connection.query(req.query.param, function (error, results) {
    if (error) {
      res.status(400).send(error)
    };
    res.send(results);
  });
})

app.get('/end', function (req, res) {
  console.log('ending connection');
  connection.end((err) => {
    if (!err)
      console.log('Connection Ended Successfully');
    else
      console.log('Connection Not Ended!' + JSON.stringify(err, undefined, 2));
  });
})