require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const Router = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', Router);

app.listen(process.env.PORT, () => {
    console.log(`Server is started on http://${process.env.HOST}:${process.env.PORT}.`);
})