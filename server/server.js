require('dotenv').config();

const express = require('express');
const app = express();

const cors = require('cors');

const mongoose = require('mongoose');

const omsiapdatascheme = require('./models/omsiap/omsiapdatascheme');

const peoplesRoute = require('./routes/people/peoplesRoute.js');

const PORT = process.env.PORT || 4000 ;

app.use(cors({
origin: "*",
methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
preflightContinue: false,
optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/people/', peoplesRoute);

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));