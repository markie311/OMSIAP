const express = require('express');
const Router = require('express').Router();

const mongoose = require('mongoose');

const mongodb = require('../../lib/mongodb/database.js');

const omsiapdatascheme = require('../../models/omsiap/omsiapdatascheme.js');

Router.route("/registration").post( async (req,res)=> {

   try {

      await mongodb.connect("mongodb+srv://ofmackysinkandpaper:38NJaxXX2AF9Mpmp@cluster0.djai0.mongodb.net/omsiap", {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         dbName: 'omsiap',
         autoCreate: false
       })
     
      const OmsiapData =  mongoose.model('datas', omsiapdatascheme);
      const omsiapdata = await OmsiapData.findById("Code-113-1143");
     
      const _registrant = {
         id: "qwerty1234qwefdln-A-1",
         loginstatus: "logged out",
         status: {
           indication: "Registered",
           requests: [
            { 
              purpose: "Registration",
              message: "You registered for the MFATIP PROGRAM",
              status: "FIRST REGISTRATION. STATUS REGISTERED",
              date: '07-12-2022'
            }
          ]
         },
         name: {
           firstname: "Mark Anthony",
           middlename: "Apura",
           lastname: "Beloy",
           nickname: "Macky"
         },
         contact: {
           phonenumber: "123456-6789-0",
           telephonenumber: "",
           emailaddress: "emailaddress@gmail.com",
           address: {
             street: "",
             baranggay: "",
             trademark: "",
             city: "",
             province: "",
             country: ''
           }
         },
         personalinformation: {
           age: 0,
           sex: "",
           bloodtype: "",
           dob: "",
           citizenship: "",
           civil_status: "",
           government_issued_identification: "" 
         },
         credits: {
           omsiapawasto: {
             id: "",
             amount: 10,
             transactions: {
               deposits: [],
               widthdrawals: [],
               successful_deposits: [],
               successful_widthdrawals: []
             }
           }
         },
         order: {
           name: {
             firstname: "",
             middlename: "",
             lastname: ""
           },
           shippingdetails: {
             street: "",
             baranggay: "",
             city: "",
             province: "",
             country: "",
             postal_zipcode: ""
           },
           paymentdetails: {
             merchandise_total: 0,
             merchandise_total_weight: 0,
             merchandise_count: 0,
             total_payment: 0,
             totalshipment: 0,
           },
           products: []
         }
      }

      omsiapdata.people.push({
         name: "tam"
      })
      
      omsiapdata.save()
        .then(()=> {
         console.log("User saved")
      })

   } catch(err) {

      console.log(`Something went wrong on the registration route: ${err}`);

   }

 

})

module.exports = Router;