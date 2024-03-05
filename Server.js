require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const api = require('./routes/api');
const port = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname,'dist')));

app.use(bodyParser.json());

app.use('/api',api);
app.listen(port, Server);

function Server()
{
    console.log("Server Started At Port Number : ",port);
}