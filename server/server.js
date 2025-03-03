require('dotenv').config();

const express = require('express');
const app = express();

const cors = require('cors');

const mongoose = require('mongoose');

const omsiapdatascheme = require('./models/omsiap/omsiapdatascheme');

const PORT = process.env.PORT || 4000 ;

app.use(cors({
origin: "*",
methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
preflightContinue: false,
optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

mongoose.connect("mongodb+srv://ofmackysinkandpaper:38NJaxXX2AF9Mpmp@cluster0.djai0.mongodb.net/omsiap", {
useNewUrlParser: true,
useUnifiedTopology: true,
autoCreate: false
});

const OmsiapData =  mongoose.model('data', omsiapdatascheme);

const emp1 =  new OmsiapData({
    _id: "Code-113-1143",
    people: [{
        name: "mac"
    }]
})

emp1.save();

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));