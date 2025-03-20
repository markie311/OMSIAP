const express = require('express');
const Router = require('express').Router();

const mongoose = require('mongoose');

const mongodb = require('../../lib/mongodb/database.js');

const omsiapdatascheme = require('../../models/omsiap/omsiapdatascheme.js');

const timestamps = require('../../lib/timestamps/timestamps');

const bcrypt = require('bcrypt');

const multer = require('multer');
const fs = require('fs');

// Set up multer for handling file uploads
const storage = multer.memoryStorage();

{/*
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});
*/}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fieldSize: 20 * 1024 * 1024, // Increase field size limit to 20MB
    fileSize: 10 * 1024 * 1024   // Limit file uploads to 10MB
  }
});

// Define the file upload fields
const uploadFields = upload.fields([
   { name: 'birthcertificate_front', maxCount: 1 },
   { name: 'birthcertificate_back', maxCount: 1 },
   { name: 'governmentid_front', maxCount: 1 },
   { name: 'governmentid_back', maxCount: 1 }
]);


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

Router.route("/addregistrant").post(uploadFields, async (req, res) => {

  try {

    // Connect to MongoDB
    await mongodb.connect("mongodb+srv://ofmackysinkandpaper:38NJaxXX2AF9Mpmp@cluster0.djai0.mongodb.net/omsiap", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'omsiap',
      autoCreate: false
    });

    const OmsiapData = mongoose.model('datas', omsiapdatascheme);
    const omsiapdata = await OmsiapData.findById("Code-113-1143");

    // Generate a unique ID for the new registrant
    const uniqueId = `REG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Current timestamp for uploads
    const currentDate = `${timestamps.getDay()}, ${timestamps.getMonth()}, ${timestamps.getDate()}, ${timestamps.getFullYear()}, ${timestamps.getHour()}:${timestamps.getMinutes()}:${timestamps.getSeconds()}`;
    
    // Check for existing registrant with same name
    const normalizedNewRegistrant = {
      firstName: req.body.firstname.toLowerCase().trim(),
      middleName: req.body.middlename ? req.body.middlename.toLowerCase().trim() : '',
      lastName: req.body.lastname.toLowerCase().trim()
    };

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

    // If there are name matches, check if any have the same password
    if (nameMatches.length > 0) {
      // Get the new password from the request
      const newPassword = req.body.password || uniqueId;
      
      // Check each name match for password match
      for (const match of nameMatches) {
        // Compare the new password with the stored hashed password
        const passwordMatch = await bcrypt.compare(newPassword, match.passwords.account.password);
        
        if (passwordMatch) {
          // If password matches, reject the registration
          return res.status(200).send({
            message: "A user with the same name and password already exists. Please use a different password."
          });
        }
      }
      
      // If we reach here, no password matches were found for users with the same name
      console.log("User with same name found, but password is different. Allowing registration.");
    }

    // Create new registrant object based on the schema
    const newRegistrant = {
      id: uniqueId,
      loginstatus: "active",
      status: {
        type: "registered",
        indication: "normal",
        requests: [{
          purpose: "Registration",
          message: "Initial registration for the MFATIP PROGRAM",
          status: "REGISTERED",
          date: currentDate
        }]
      },
      name: {
        firstname: req.body.firstname,
        middlename: req.body.middlename || '',
        lastname: req.body.lastname,
        nickname: req.body.nickname || ''
      },
      contact: {
        phonenumber: req.body.phonenumber,
        telephonenumber: req.body.telephonenumber || '',
        emailaddress: req.body.emailaddress,
        address: {
          street: req.body.street || '',
          baranggay: req.body.baranggay || '',
          trademark: req.body.trademark || '',
          city: req.body.city || '',
          province: req.body.province || '',
          country: req.body.country || ''
        }
      },
      personaldata: {
        age: parseInt(req.body.age) || 0,
        sex: req.body.sex || '',
        bloodtype: req.body.bloodtype || '',
        dob: req.body.dob || '',
        citizenship: req.body.citizenship || '',
        civil_status: req.body.civil_status || '',
        government_issued_identification: {
          frontphoto: {
            name: req.files.governmentid_front ? req.files.governmentid_front[0].originalname : '',
            description: `Government ID Front - ${req.body.government_id || 'Unspecified'}`,
            image: {
              data: req.files.governmentid_front ? req.files.governmentid_front[0].buffer : null,
              contenttype: req.files.governmentid_front ? req.files.governmentid_front[0].mimetype : ''
            },
            uploaddate: currentDate
          },
          backphoto: {
            name: req.files.governmentid_back ? req.files.governmentid_back[0].originalname : '',
            description: `Government ID Back - ${req.body.government_id || 'Unspecified'}`,
            image: {
              data: req.files.governmentid_back ? req.files.governmentid_back[0].buffer : null,
              contenttype: req.files.governmentid_back ? req.files.governmentid_back[0].mimetype : ''
            },
            uploaddate: currentDate
          }
        },
        birthcertificate: {
          frontphoto: {
            name: req.files.birthcertificate_front ? req.files.birthcertificate_front[0].originalname : '',
            description: 'Birth Certificate Front',
            image: {
              data: req.files.birthcertificate_front ? req.files.birthcertificate_front[0].buffer : null,
              contenttype: req.files.birthcertificate_front ? req.files.birthcertificate_front[0].mimetype : ''
            },
            uploaddate: currentDate
          },
          backphoto: {
            name: req.files.birthcertificate_back ? req.files.birthcertificate_back[0].originalname : '',
            description: 'Birth Certificate Back',
            image: {
              data: req.files.birthcertificate_back ? req.files.birthcertificate_back[0].buffer : null,
              contenttype: req.files.birthcertificate_back ? req.files.birthcertificate_back[0].mimetype : ''
            },
            uploaddate: currentDate
          }
        }
      },
      credits: {
        omsiapawasto: {
          id: `CRED-${uniqueId}`,
          amount: 0,
          transactions: {
            deposits: [],
            widthdrawals: [],
            successful_deposits: [],
            successful_widthdrawals: []
          }
        }
      },
      transactions: [],
      passwords: {
        account: {
          password: await bcrypt.hash(req.body.password || uniqueId, 13) // Default password if not provided
        }
      }
    };

    // Add the new registrant to the database
    omsiapdata.people.push(newRegistrant);
    
    await omsiapdata.save().then(()=> {
     console.log("Registrant saved")
    }).catch((err)=> {
     console.log("ERR" + err)
    })
    
    // Create a safe version of the registrant data without sensitive information
    const safeRegistrantData = { ...newRegistrant };
    
    // Remove binary data from the response
    if (safeRegistrantData.personaldata?.government_issued_identification?.frontphoto?.image?.data) {
      safeRegistrantData.personaldata.government_issued_identification.frontphoto.image.data = "Binary data not included in response";
    }
    if (safeRegistrantData.personaldata?.government_issued_identification?.backphoto?.image?.data) {
      safeRegistrantData.personaldata.government_issued_identification.backphoto.image.data = "Binary data not included in response";
    }
    if (safeRegistrantData.personaldata?.birthcertificate?.frontphoto?.image?.data) {
      safeRegistrantData.personaldata.birthcertificate.frontphoto.image.data = "Binary data not included in response";
    }
    if (safeRegistrantData.personaldata?.birthcertificate?.backphoto?.image?.data) {
      safeRegistrantData.personaldata.birthcertificate.backphoto.image.data = "Binary data not included in response";
    }
    
    // Remove password from the response
    if (safeRegistrantData.passwords) {
      delete safeRegistrantData.passwords;
    }

    res.status(200).send({
      registrant: safeRegistrantData,
      message: "Registrant added successfully"
    });

  } catch (err) {
    console.log(`Error in addregistrant route: ${err}`);
    res.status(500).send({
      message: `Failed to add registrant: ${err.message}`
    });
  }
});

Router.route("/getregistranttobeviewed").post(async (req, res) => {

   try {

     const id = req.body.id;

     await mongodb.connect("mongodb+srv://ofmackysinkandpaper:38NJaxXX2AF9Mpmp@cluster0.djai0.mongodb.net/omsiap", {
       useNewUrlParser: true,
       useUnifiedTopology: true,
       dbName: 'omsiap',
       autoCreate: false
     });
 
     // Find the OMSIAP data document
     const OmsiapData = mongoose.model('datas', omsiapdatascheme);
     const omsiapdata = await OmsiapData.findById("Code-113-1143");
 
     const registrant = omsiapdata.people.find((user) => user._id.toString() === id);
 
     if (!registrant) {
       return res.status(200).json({
         success: false,
         message: 'Registrant not found'
       });
     }
 
     // Process image data for frontend
     const processedRegistrant = JSON.parse(JSON.stringify(registrant)); // Create a copy to avoid modifying the original
 
     // Process Government ID images
     if (registrant.personaldata?.government_issued_identification?.frontphoto?.image?.data) {
       const frontData = registrant.personaldata.government_issued_identification.frontphoto.image.data;
       const frontType = registrant.personaldata.government_issued_identification.frontphoto.image.contenttype;
       processedRegistrant.governmentid_front = `data:${frontType};base64,${Buffer.from(frontData).toString('base64')}`;
     }
 
     if (registrant.personaldata?.government_issued_identification?.backphoto?.image?.data) {
       const backData = registrant.personaldata.government_issued_identification.backphoto.image.data;
       const backType = registrant.personaldata.government_issued_identification.backphoto.image.contenttype;
       processedRegistrant.governmentid_back = `data:${backType};base64,${Buffer.from(backData).toString('base64')}`;
     }
 
     // Process Birth Certificate images
     if (registrant.personaldata?.birthcertificate?.frontphoto?.image?.data) {
       const frontData = registrant.personaldata.birthcertificate.frontphoto.image.data;
       const frontType = registrant.personaldata.birthcertificate.frontphoto.image.contenttype;
       processedRegistrant.birthcertificate_front = `data:${frontType};base64,${Buffer.from(frontData).toString('base64')}`;
     }
 
     if (registrant.personaldata?.birthcertificate?.backphoto?.image?.data) {
       const backData = registrant.personaldata.birthcertificate.backphoto.image.data;
       const backType = registrant.personaldata.birthcertificate.backphoto.image.contenttype;
       processedRegistrant.birthcertificate_back = `data:${backType};base64,${Buffer.from(backData).toString('base64')}`;
     }
 
     // Return the processed registrant data
     res.status(200).json({
       success: true,
       message: "Registrant found",
       data: processedRegistrant
     });
     
   } catch (error) {
     console.error('Error fetching registrant:', error);
     res.status(500).json({
       success: false,
       message: 'Server error',
       error: error.message
     });
   }

});

Router.route("/getregistranttobeupdated").post(async (req, res) => {

  try {

    const id = req.body.id;
    console.log(id);
    await mongodb.connect("mongodb+srv://ofmackysinkandpaper:38NJaxXX2AF9Mpmp@cluster0.djai0.mongodb.net/omsiap", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'omsiap',
      autoCreate: false
    });

    // Find the OMSIAP data document
    const OmsiapData = mongoose.model('datas', omsiapdatascheme);
    const omsiapdata = await OmsiapData.findById("Code-113-1143");

    console.log(omsiapdata.people.length);
    const registrant = omsiapdata.people.find((user) => user._id.toString() === id);
    console.log(registrant);

    if (!registrant) {
      return res.status(200).json({
        success: false,
        message: 'Registrant not found'
      });
    }

    // Process image data for frontend
    const processedRegistrant = JSON.parse(JSON.stringify(registrant)); // Create a copy to avoid modifying the original

    // Process Government ID images
    if (registrant.personaldata?.government_issued_identification?.frontphoto?.image?.data) {
      const frontData = registrant.personaldata.government_issued_identification.frontphoto.image.data;
      const frontType = registrant.personaldata.government_issued_identification.frontphoto.image.contenttype;
      processedRegistrant.governmentid_front = `data:${frontType};base64,${Buffer.from(frontData).toString('base64')}`;
    }

    if (registrant.personaldata?.government_issued_identification?.backphoto?.image?.data) {
      const backData = registrant.personaldata.government_issued_identification.backphoto.image.data;
      const backType = registrant.personaldata.government_issued_identification.backphoto.image.contenttype;
      processedRegistrant.governmentid_back = `data:${backType};base64,${Buffer.from(backData).toString('base64')}`;
    }

    // Process Birth Certificate images
    if (registrant.personaldata?.birthcertificate?.frontphoto?.image?.data) {
      const frontData = registrant.personaldata.birthcertificate.frontphoto.image.data;
      const frontType = registrant.personaldata.birthcertificate.frontphoto.image.contenttype;
      processedRegistrant.birthcertificate_front = `data:${frontType};base64,${Buffer.from(frontData).toString('base64')}`;
    }

    if (registrant.personaldata?.birthcertificate?.backphoto?.image?.data) {
      const backData = registrant.personaldata.birthcertificate.backphoto.image.data;
      const backType = registrant.personaldata.birthcertificate.backphoto.image.contenttype;
      processedRegistrant.birthcertificate_back = `data:${backType};base64,${Buffer.from(backData).toString('base64')}`;
    }

    // Return the processed registrant data
    res.status(200).json({
      success: true,
      message: "Registrant found",
      data: processedRegistrant
    });
    
  } catch (error) {
    console.error('Error fetching registrant:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }

});

Router.route("/updateregistrant").post(uploadFields, async (req, res) => {
  try {
    // Connect to MongoDB
    await mongodb.connect("mongodb+srv://ofmackysinkandpaper:38NJaxXX2AF9Mpmp@cluster0.djai0.mongodb.net/omsiap", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'omsiap',
      autoCreate: false
    });

    const OmsiapData = mongoose.model('datas', omsiapdatascheme);
    const omsiapdata = await OmsiapData.findById("Code-113-1143");

    // Parse nested objects if they're strings
    let nameData = req.body.name;
    let contactData = req.body.contact;
    let personalData = req.body.personaldata;

    try {
      if (typeof nameData === 'string') nameData = JSON.parse(nameData);
      if (typeof contactData === 'string') contactData = JSON.parse(contactData);
      if (typeof personalData === 'string') personalData = JSON.parse(personalData);
    } catch (parseError) {
      console.log("Error parsing JSON data:", parseError);
    }

    // Current timestamp for uploads
    const currentDate = `${timestamps.getDay()}, ${timestamps.getMonth()}, ${timestamps.getDate()}, ${timestamps.getFullYear()}, ${timestamps.getHour()}:${timestamps.getMinutes()}:${timestamps.getSeconds()}`;
    
    // Find the registrant to update by ID
    const registrantId = req.body.id;
    if (!registrantId) {
      return res.status(400).send({
        message: "Registrant ID is required for update"
      });
    }

    // Find the registrant index in the omsiapdata.people array
    const registrantIndex = omsiapdata.people.findIndex(person => person.id === registrantId);
    
    if (registrantIndex === -1) {
      return res.status(404).send({
        message: "Registrant not found"
      });
    }

    // Get the existing registrant
    const existingRegistrant = omsiapdata.people[registrantIndex];

    // Update registrant data
    // Update name
    if (nameData) {
      existingRegistrant.name.firstname = nameData.firstname || existingRegistrant.name.firstname;
      existingRegistrant.name.middlename = nameData.middlename !== undefined ? nameData.middlename : existingRegistrant.name.middlename;
      existingRegistrant.name.lastname = nameData.lastname || existingRegistrant.name.lastname;
      existingRegistrant.name.nickname = nameData.nickname !== undefined ? nameData.nickname : existingRegistrant.name.nickname;
    }

    // Update contact information
    if (contactData) {
      existingRegistrant.contact.phonenumber = contactData.phonenumber || existingRegistrant.contact.phonenumber;
      existingRegistrant.contact.telephonenumber = contactData.telephonenumber !== undefined ? contactData.telephonenumber : existingRegistrant.contact.telephonenumber;
      existingRegistrant.contact.emailaddress = contactData.emailaddress || existingRegistrant.contact.emailaddress;
      
      if (contactData.address) {
        existingRegistrant.contact.address.street = contactData.address.street !== undefined ? contactData.address.street : existingRegistrant.contact.address.street;
        existingRegistrant.contact.address.baranggay = contactData.address.baranggay !== undefined ? contactData.address.baranggay : existingRegistrant.contact.address.baranggay;
        existingRegistrant.contact.address.trademark = contactData.address.trademark !== undefined ? contactData.address.trademark : existingRegistrant.contact.address.trademark;
        existingRegistrant.contact.address.city = contactData.address.city !== undefined ? contactData.address.city : existingRegistrant.contact.address.city;
        existingRegistrant.contact.address.province = contactData.address.province !== undefined ? contactData.address.province : existingRegistrant.contact.address.province;
        existingRegistrant.contact.address.country = contactData.address.country !== undefined ? contactData.address.country : existingRegistrant.contact.address.country;
      }
    }

    // Update personal data
    if (personalData) {
      existingRegistrant.personaldata.age = personalData.age !== undefined ? parseInt(personalData.age) : existingRegistrant.personaldata.age;
      existingRegistrant.personaldata.sex = personalData.sex !== undefined ? personalData.sex : existingRegistrant.personaldata.sex;
      existingRegistrant.personaldata.bloodtype = personalData.bloodtype !== undefined ? personalData.bloodtype : existingRegistrant.personaldata.bloodtype;
      existingRegistrant.personaldata.dob = personalData.dob !== undefined ? personalData.dob : existingRegistrant.personaldata.dob;
      existingRegistrant.personaldata.citizenship = personalData.citizenship !== undefined ? personalData.citizenship : existingRegistrant.personaldata.citizenship;
      existingRegistrant.personaldata.civil_status = personalData.civil_status !== undefined ? personalData.civil_status : existingRegistrant.personaldata.civil_status;
    }

    // Track which images were updated
    const updatedImages = [];

    // Ensure personal data structures exist
    if (!existingRegistrant.personaldata) {
      existingRegistrant.personaldata = {};
    }

    // Handle government ID front
    if (req.files && req.files.governmentid_front && req.files.governmentid_front.length > 0) {
      console.log("Processing government ID front");
      
      // Ensure the nested structure exists
      if (!existingRegistrant.personaldata.government_issued_identification) {
        existingRegistrant.personaldata.government_issued_identification = {};
      }
      
      // Create the front photo object
      existingRegistrant.personaldata.government_issued_identification.frontphoto = {
        name: req.files.governmentid_front[0].originalname,
        description: `Government ID Front - ${req.body.government_id || 'Unspecified'}`,
        image: {
          data: req.files.governmentid_front[0].buffer,
          contenttype: req.files.governmentid_front[0].mimetype
        },
        uploaddate: currentDate
      };
      
      updatedImages.push('governmentid_front');
    } 
    // Handle data URLs for government ID front
    else if (req.body.governmentid_front_dataurl && typeof req.body.governmentid_front_dataurl === 'string' && req.body.governmentid_front_dataurl.startsWith('data:')) {
      console.log("Processing government ID front from data URL");
      
      // Extract mimetype and base64 data
      const matches = req.body.governmentid_front_dataurl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      
      if (matches && matches.length === 3) {
        const mimetype = matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        
        // Ensure the nested structure exists
        if (!existingRegistrant.personaldata.government_issued_identification) {
          existingRegistrant.personaldata.government_issued_identification = {};
        }
        
        // Create the front photo object
        existingRegistrant.personaldata.government_issued_identification.frontphoto = {
          name: `governmentid_front_${Date.now()}.${mimetype.split('/')[1] || 'jpg'}`,
          description: `Government ID Front - ${req.body.government_id || 'Unspecified'}`,
          image: {
            data: buffer,
            contenttype: mimetype
          },
          uploaddate: currentDate
        };
        
        updatedImages.push('governmentid_front');
      }
    }

    // Handle government ID back
    if (req.files && req.files.governmentid_back && req.files.governmentid_back.length > 0) {
      console.log("Processing government ID back");
      
      // Ensure the nested structure exists
      if (!existingRegistrant.personaldata.government_issued_identification) {
        existingRegistrant.personaldata.government_issued_identification = {};
      }
      
      // Create the back photo object
      existingRegistrant.personaldata.government_issued_identification.backphoto = {
        name: req.files.governmentid_back[0].originalname,
        description: `Government ID Back - ${req.body.government_id || 'Unspecified'}`,
        image: {
          data: req.files.governmentid_back[0].buffer,
          contenttype: req.files.governmentid_back[0].mimetype
        },
        uploaddate: currentDate
      };
      
      updatedImages.push('governmentid_back');
    }
    // Handle data URLs for government ID back
    else if (req.body.governmentid_back_dataurl && typeof req.body.governmentid_back_dataurl === 'string' && req.body.governmentid_back_dataurl.startsWith('data:')) {
      console.log("Processing government ID back from data URL");
      
      // Extract mimetype and base64 data
      const matches = req.body.governmentid_back_dataurl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      
      if (matches && matches.length === 3) {
        const mimetype = matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        
        // Ensure the nested structure exists
        if (!existingRegistrant.personaldata.government_issued_identification) {
          existingRegistrant.personaldata.government_issued_identification = {};
        }
        
        // Create the back photo object
        existingRegistrant.personaldata.government_issued_identification.backphoto = {
          name: `governmentid_back_${Date.now()}.${mimetype.split('/')[1] || 'jpg'}`,
          description: `Government ID Back - ${req.body.government_id || 'Unspecified'}`,
          image: {
            data: buffer,
            contenttype: mimetype
          },
          uploaddate: currentDate
        };
        
        updatedImages.push('governmentid_back');
      }
    }

    // Handle birth certificate front
    if (req.files && req.files.birthcertificate_front && req.files.birthcertificate_front.length > 0) {
      console.log("Processing birth certificate front");
      
      // Ensure the nested structure exists
      if (!existingRegistrant.personaldata.birthcertificate) {
        existingRegistrant.personaldata.birthcertificate = {};
      }
      
      // Create the front photo object
      existingRegistrant.personaldata.birthcertificate.frontphoto = {
        name: req.files.birthcertificate_front[0].originalname,
        description: 'Birth Certificate Front',
        image: {
          data: req.files.birthcertificate_front[0].buffer,
          contenttype: req.files.birthcertificate_front[0].mimetype
        },
        uploaddate: currentDate
      };
      
      updatedImages.push('birthcertificate_front');
    }
    // Handle data URLs for birth certificate front
    else if (req.body.birthcertificate_front_dataurl && typeof req.body.birthcertificate_front_dataurl === 'string' && req.body.birthcertificate_front_dataurl.startsWith('data:')) {
      console.log("Processing birth certificate front from data URL");
      
      // Extract mimetype and base64 data
      const matches = req.body.birthcertificate_front_dataurl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      
      if (matches && matches.length === 3) {
        const mimetype = matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        
        // Ensure the nested structure exists
        if (!existingRegistrant.personaldata.birthcertificate) {
          existingRegistrant.personaldata.birthcertificate = {};
        }
        
        // Create the front photo object
        existingRegistrant.personaldata.birthcertificate.frontphoto = {
          name: `birthcertificate_front_${Date.now()}.${mimetype.split('/')[1] || 'jpg'}`,
          description: 'Birth Certificate Front',
          image: {
            data: buffer,
            contenttype: mimetype
          },
          uploaddate: currentDate
        };
        
        updatedImages.push('birthcertificate_front');
      }
    }

    // Handle birth certificate back
    if (req.files && req.files.birthcertificate_back && req.files.birthcertificate_back.length > 0) {
      console.log("Processing birth certificate back");
      
      // Ensure the nested structure exists
      if (!existingRegistrant.personaldata.birthcertificate) {
        existingRegistrant.personaldata.birthcertificate = {};
      }
      
      // Create the back photo object
      existingRegistrant.personaldata.birthcertificate.backphoto = {
        name: req.files.birthcertificate_back[0].originalname,
        description: 'Birth Certificate Back',
        image: {
          data: req.files.birthcertificate_back[0].buffer,
          contenttype: req.files.birthcertificate_back[0].mimetype
        },
        uploaddate: currentDate
      };
      
      updatedImages.push('birthcertificate_back');
    }
    // Handle data URLs for birth certificate back
    else if (req.body.birthcertificate_back_dataurl && typeof req.body.birthcertificate_back_dataurl === 'string' && req.body.birthcertificate_back_dataurl.startsWith('data:')) {
      console.log("Processing birth certificate back from data URL");
      
      // Extract mimetype and base64 data
      const matches = req.body.birthcertificate_back_dataurl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      
      if (matches && matches.length === 3) {
        const mimetype = matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        
        // Ensure the nested structure exists
        if (!existingRegistrant.personaldata.birthcertificate) {
          existingRegistrant.personaldata.birthcertificate = {};
        }
        
        // Create the back photo object
        existingRegistrant.personaldata.birthcertificate.backphoto = {
          name: `birthcertificate_back_${Date.now()}.${mimetype.split('/')[1] || 'jpg'}`,
          description: 'Birth Certificate Back',
          image: {
            data: buffer,
            contenttype: mimetype
          },
          uploaddate: currentDate
        };
        
        updatedImages.push('birthcertificate_back');
      }
    }

    // Update password if provided
    if (req.body.password) {
      // Ensure passwords object exists
      if (!existingRegistrant.passwords) {
        existingRegistrant.passwords = { account: {} };
      } else if (!existingRegistrant.passwords.account) {
        existingRegistrant.passwords.account = {};
      }
      
      existingRegistrant.passwords.account.password = await bcrypt.hash(req.body.password, 13);
    }

    // Update status if provided
    if (req.body.status) {
      // Parse status if it's a string
      let statusUpdate = req.body.status;
      try {
        if (typeof statusUpdate === 'string') {
          statusUpdate = JSON.parse(statusUpdate);
        }
      } catch (parseError) {
        console.log("Error parsing status JSON:", parseError);
      }
      
      // Ensure status object exists
      if (!existingRegistrant.status) {
        existingRegistrant.status = { requests: [] };
      } else if (!existingRegistrant.status.requests) {
        existingRegistrant.status.requests = [];
      }
      
      if (statusUpdate.type) existingRegistrant.status.type = statusUpdate.type;
      if (statusUpdate.indication) existingRegistrant.status.indication = statusUpdate.indication;
      
      // Add a new status request if applicable
      if (req.body.request_message) {
        existingRegistrant.status.requests.push({
          purpose: "Profile Update",
          message: req.body.request_message,
          status: "PROCESSED",
          date: currentDate
        });
      }
    }

    // Update login status if provided
    if (req.body.loginstatus) {
      existingRegistrant.loginstatus = req.body.loginstatus;
    }

    // Update the registrant in the omsiapdata.people array
    omsiapdata.people[registrantIndex] = existingRegistrant;

    // Save the updated data with increased timeout
    await omsiapdata.save({ timeout: 60000 }).then(() => {
      console.log("Registrant updated successfully");
      console.log("Updated images:", updatedImages);
    }).catch((err) => {
      console.log("ERR: " + err);
      throw err; // Re-throw to be caught by the outer catch block
    });

    // Create a safe version of the registrant data without sensitive information
    const safeRegistrantData = JSON.parse(JSON.stringify(existingRegistrant));
    
    // Remove binary data from the response
    if (safeRegistrantData.personaldata?.government_issued_identification?.frontphoto?.image?.data) {
      safeRegistrantData.personaldata.government_issued_identification.frontphoto.image.data = "Binary data not included in response";
    }
    if (safeRegistrantData.personaldata?.government_issued_identification?.backphoto?.image?.data) {
      safeRegistrantData.personaldata.government_issued_identification.backphoto.image.data = "Binary data not included in response";
    }
    if (safeRegistrantData.personaldata?.birthcertificate?.frontphoto?.image?.data) {
      safeRegistrantData.personaldata.birthcertificate.frontphoto.image.data = "Binary data not included in response";
    }
    if (safeRegistrantData.personaldata?.birthcertificate?.backphoto?.image?.data) {
      safeRegistrantData.personaldata.birthcertificate.backphoto.image.data = "Binary data not included in response";
    }
    
    // Remove password from the response
    if (safeRegistrantData.passwords) {
      delete safeRegistrantData.passwords;
    }

    // Send back the updated registrant data with info about which images were updated
    res.status(200).send({
      registrant: safeRegistrantData,
      updatedImages: updatedImages,
      message: "Registrant updated successfully"
    });

  } catch (err) {
    console.log(`Error in updateregistrant route: ${err}`);
    res.status(500).send({
      message: `Failed to update registrant: ${err.message}`
    });
  } finally {
    // Close the MongoDB connection
    try {
      await mongodb.close();
      console.log("MongoDB connection closed");
    } catch (closeErr) {
      console.log("Error closing MongoDB connection:", closeErr);
    }
  }
});


module.exports = Router;