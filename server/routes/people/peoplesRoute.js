const express = require('express');
const Router = require('express').Router();

const mongoose = require('mongoose');

const mongodb = require('../../lib/mongodb/database.js');

const omsiapdatascheme = require('../../models/omsiap/omsiapdatascheme.js');

const timestamps = require('../../lib/timestamps/timestamps');

const bcrypt = require('bcrypt');

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

      // Check for matches among existing users
      const normalizedNewRegistrant = {
         firstName: req.body.$registrant.name.firstname.toLowerCase().trim(),
         middleName: req.body.$registrant.name.middlename ? req.body.$registrant.name.middlename.toLowerCase().trim() : '',
         lastName: req.body.$registrant.name.lastname.toLowerCase().trim(),
         password: req.body.$registrant.passwords.account.password
      };

      console.log(normalizedNewRegistrant)

      // Check for matches among existing users
      const nameMatches = omsiapdata.people.filter(user => {

         const existingFirstName = user.name.firstname.toLowerCase().trim();
         const existingMiddleName = user.name.middlename ? user.name.middlename.toLowerCase().trim() : '';
         const existingLastName = user.name.lastname.toLowerCase().trim();
   
         // Check if full name matches (first + middle + last)
         return existingFirstName === normalizedNewRegistrant.firstName &&
                existingLastName === normalizedNewRegistrant.lastName &&
                existingMiddleName === normalizedNewRegistrant.middleName;

      });

      console.log(nameMatches.length);

      if (nameMatches.length === 0) {

         const _hashedpassword = await bcrypt.hash(req.body.$registrant.passwords.account.password,13);
      
         const _registeringdate = `${timestamps.getDay()}, ${timestamps.getMonth()}, ${timestamps.getDate()},${timestamps.getFullYear()}, ${timestamps.getHour()}:${timestamps.getMinutes()}:${timestamps.getSeconds()},`
          
         req.body.$registrant.status.requests.push({
            purpose: "Registration",
            message: "Attempting for registering for the MFATIP PROGRAM",
            status: "FIRST REGISTRATION. STATUS REGISTERED",
            date: _registeringdate
         })
   
         req.body.$registrant.passwords.account.password = _hashedpassword;
    
         omsiapdata.people.push(req.body.$registrant);
         
         omsiapdata.save()
           .then(()=> {
            console.log(`Registrant registered 
             ${JSON.stringify(req.body.$registrant)}`)
   
            res.status(200).send({
             registrant: req.body.$registrant,
             message: "Registrant registered"
            });

         })

       } else {
         
         let passwordMatchFound = false;

         for (const user of nameMatches) {
            // Using bcrypt's compare function to compare plaintext password with hashed password
            const passwordMatches = await bcrypt.compare(normalizedNewRegistrant.password, user.passwords.account.password);
            if (passwordMatches) {
              passwordMatchFound = true;
              break;
            }
         }

         if (passwordMatchFound) {

            res.status(200).send({
               registrant: req.body.$registrant,
               message: "Same passwords"
             });

          } else {

            const _hashedpassword = await bcrypt.hash(req.body.$registrant.passwords.account.password,13);
      
            const _registeringdate = `${timestamps.getDay()}, ${timestamps.getMonth()}, ${timestamps.getDate()},${timestamps.getFullYear()}, ${timestamps.getHour()}:${timestamps.getMinutes()}:${timestamps.getSeconds()},`
             
            req.body.$registrant.status.requests.push({
               purpose: "Registration",
               message: "Attempting for registering for the MFATIP PROGRAM",
               status: "FIRST REGISTRATION. STATUS REGISTERED",
               date: _registeringdate
            })
      
            req.body.$registrant.passwords.account.password = _hashedpassword;
       
            omsiapdata.people.push(req.body.$registrant);
            
            omsiapdata.save()
              .then(()=> {

                console.log(`Registrant registered 
                 ${JSON.stringify(req.body.$registrant)}`)
      
                res.status(200).send({
                 registrant: req.body.$registrant,
                 message: "Registrant registered"
               });

              })

          }

       }

   } catch(err) {

      console.log(`Something went wrong on the registration route: ${err}`);

      res.status(200).send({ 
         message: `New practicing account type FGH authentication account registration failed: ${err}`
       });

   }

 

})

Router.route("/login").post( async (req, res)=> {
  try {
   
   console.log(req.body.$firstname);
   console.log(req.body.$middlename);
   console.log(req.body.$lastname);
   console.log(req.body.$password);

   await mongodb.connect("mongodb+srv://ofmackysinkandpaper:38NJaxXX2AF9Mpmp@cluster0.djai0.mongodb.net/omsiap", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'omsiap',
      autoCreate: false
    })
  
   const OmsiapData =  mongoose.model('datas', omsiapdatascheme);
   const omsiapdata = await OmsiapData.findById("Code-113-1143");

   // Normalize case for comparison
   const normalizedLoginDetails = {
    firstName: req.body.$firstname?.toLowerCase().trim() || '',
    middleName: req.body.$middlename?.toLowerCase().trim() || '',
    lastName: req.body.$lastname?.toLowerCase().trim() || '',
    password: req.body.$password || ''
  };

  const matchingUsers =  omsiapdata.people.filter(user => {

    const dbFirstName = user.name.firstname.toLowerCase().trim();
    const dbMiddleName = user.name.middlename ? user.name.middlename.toLowerCase().trim() : '';
    const dbLastName = user.name.lastname.toLowerCase().trim();
   
    return dbFirstName === normalizedLoginDetails.firstName &&
           dbLastName === normalizedLoginDetails.lastName &&
           dbMiddleName === normalizedLoginDetails.middleName;
  });

  console.log(matchingUsers.length)
   // If no matching users found
   if (matchingUsers.length === 0) {

    console.log("No user found with the provided name details")

    res.status(200).send({
      message: "No user found with the provided name details"
    });


  } else {

   for (const user of matchingUsers) {
      // Using bcrypt to compare the provided password with the stored hash
      const passwordMatches = await bcrypt.compare(normalizedLoginDetails.password, user.passwords.account.password);
      
      if (passwordMatches) {
        // Create a user object without the password for return
        const { password, ...safeUserData } = user;
        
        console.log("Login successful")

        res.status(200).send({
         registrant: safeUserData,
         message: "Login successful"
        });

      } else {
         console.log("Incorrect password")

         // If we reach here, no users matched with correct password
         res.status(200).send({
           message: "Incorrect password"
          });
      }

   } 
   

     

   

  }

  } catch(err) {

  }
})

Router.route('/getregistrant').post( async (req, res) => {

  try {

   await mongodb.connect("mongodb+srv://ofmackysinkandpaper:38NJaxXX2AF9Mpmp@cluster0.djai0.mongodb.net/omsiap", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'omsiap',
      autoCreate: false
    })
  
   const OmsiapData =  mongoose.model('datas', omsiapdatascheme);
   const omsiapdata = await OmsiapData.findById("Code-113-1143");

   console.log("Invoked")
   console.log(omsiapdata.people.length)
   console.log(req.body.$userid)

   const _user = omsiapdata.people.find(user => user.id === req.body.$userid);

   if ( _user === undefined ) {

      console.log("No registrant found with the given user ID")

      res.status(200).send({
         message: "No registrant found with the given user ID"
      });

   } else {

      console.log("Registrant found");

      res.status(200).send({
         registrant: _user,
         message: "Registrant found"
      });

   }

   console.log(_user)


  } catch(err) {

  }

})

module.exports = Router;