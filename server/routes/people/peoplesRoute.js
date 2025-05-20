const express = require('express');
const Router = require('express').Router();

const mongoose = require('mongoose');

const mongodb = require('../../lib/mongodb/database.js')

const RegistrantDataModel = require('../../models/people/registrantdatascheme.js')

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


Router.route("/registration").post(async (req, res) => {

  try {
    // Generate next sequential ID for registrant
    const generateNextRegistrantId = async () => {
      // Count all registrants
      const registrantCount = await RegistrantDataModel.countDocuments();
      
      // Check if registrant count has reached the limit of 1000
      if (registrantCount >= 1000) {
        return null;
      }
      
      // Pad the number to 4 digits
      const paddedCount = registrantCount.toString().padStart(4, '0');
      return `1000-${paddedCount}-A-1`;
    };

    // Generate unique ID for omsiapawas credits
    const generateOmsiapawasId = async () => {

      const currentDate = new Date();
      const year = currentDate.getFullYear().toString();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const day = currentDate.getDate().toString().padStart(2, '0');
      
      // Get count of registrants for today to generate sequential number
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      
      const todayRegistrantCount = await RegistrantDataModel.countDocuments({
        'registrationstatusesandlogs.registrationlog.date': {
          $regex: `^${year}-${month}-${day}`
        }
      });
      
      const sequentialNum = (todayRegistrantCount + 1).toString().padStart(3, '0');
      
      // Generate format: OMSAW-YYYYMMDD-XXX
      return `OMSAW-${year}${month}${day}-${sequentialNum}`;
    };

    // Normalize new registrant data for comparison
    const normalizedNewRegistrant = {
      firstName: req.body.$registrant.name.firstname.toLowerCase().trim(),
      middleName: req.body.$registrant.name.middlename ? req.body.$registrant.name.middlename.toLowerCase().trim() : '',
      lastName: req.body.$registrant.name.lastname.toLowerCase().trim(),
      password: req.body.$registrant.passwords.account.password
    };

    // Check for matches among existing users
    const nameMatches = await RegistrantDataModel.find({
      'name.firstname': new RegExp(`^${normalizedNewRegistrant.firstName}$`, 'i'),
      'name.lastname': new RegExp(`^${normalizedNewRegistrant.lastName}$`, 'i'),
      'name.middlename': normalizedNewRegistrant.middleName ? 
        new RegExp(`^${normalizedNewRegistrant.middleName}$`, 'i') : 
        { $in: [null, "", normalizedNewRegistrant.middleName] }
    });

    // New registrant (no name matches)
    if (nameMatches.length === 0) {
      // Generate ID and check user limit
      const registrantId = await generateNextRegistrantId();
      
      // Check if user limit is reached
      if (registrantId === null) {
        return res.status(200).send({
          message: "OMSIAP_USER_LIMIT_REACHED",
          details: {
            status: "Registration Temporarily Paused",
            reason: "First 1000 Users Milestone Reached"
          }
        });
      }

      // Generate omsiapawas credit ID
      const omsiapawasId = await generateOmsiapawasId();
      
      const _hashedpassword = await bcrypt.hash(req.body.$registrant.passwords.account.password, 13);
      const _registeringdate = timestamps.getFormattedDate();
      
      // Set the IDs and pending documents status
      req.body.$registrant.id = registrantId;
      req.body.$registrant.credits = req.body.$registrant.credits || {};
      req.body.$registrant.credits.omsiapawas = req.body.$registrant.credits.omsiapawas || {};
      req.body.$registrant.credits.omsiapawas.id = omsiapawasId;
      req.body.$registrant.credits.omsiapawas.amount = 0;
      req.body.$registrant.registrationstatusesandlogs.indication = "unverified";
      
      // Create registration detail with proper structure
      req.body.$registrant.registrationstatusesandlogs.registrationlog.push({
        date: _registeringdate,
        type: "Registration",
        indication: "First Registration",
        messages: [
          { message: "Attempting for registering for the MFATIP PROGRAM" },
          { message: "STATUS REGISTERED" }
        ]
      });

      req.body.$registrant.passwords.account.password = _hashedpassword;
      
      // Create a new document using the imported model
      const newRegistrant = new RegistrantDataModel(req.body.$registrant);
      await newRegistrant.save();
      
      console.log(`Registrant registered: ${req.body.$registrant.name.firstname}, ${req.body.$registrant.name.middlename}, ${req.body.$registrant.name.lastname}. ID: ${req.body.$registrant.id}, OMSAW ID: ${omsiapawasId}`);

      res.status(200).send({
        message: "Registrant registered"
      });
    } 

    // Existing user name found - handle password scenario
    else {

      let passwordMatchFound = false;

      for (const user of nameMatches) {
        const passwordMatches = await bcrypt.compare(normalizedNewRegistrant.password, user.passwords.account.password);
        if (passwordMatches) {
          passwordMatchFound = true;
          break;
        }
      }

      // Existing user with same password
      if (passwordMatchFound) {
        res.status(200).send({
          message: "Same passwords"
        });
      } 

      // Name matches but different password - register as new
      else {
        // Generate ID and check user limit
        const registrantId = await generateNextRegistrantId();
        
        // Check if user limit is reached
        if (registrantId === null) {
          return res.status(200).send({
            message: "OMSIAP_USER_LIMIT_REACHED",
            details: {
              status: "Registration Temporarily Paused",
              reason: "First 1000 Users Milestone Reached"
            }
          });
        }

        // Generate omsiapawas credit ID
        const omsiapawasId = await generateOmsiapawasId();
        
        const _hashedpassword = await bcrypt.hash(req.body.$registrant.passwords.account.password, 13);
        const _registeringdate = timestamps.getFormattedDate();
        
        // Set the IDs and pending documents status
        req.body.$registrant.id = registrantId;
        req.body.$registrant.credits = req.body.$registrant.credits || {};
        req.body.$registrant.credits.omsiapawas = req.body.$registrant.credits.omsiapawas || {};
        req.body.$registrant.credits.omsiapawas.id = omsiapawasId;
        req.body.$registrant.credits.omsiapawas.amount = 0;
        req.body.$registrant.registrationstatusesandlogs.indication = "unverified";
                         
        // Create registration detail with proper structure
        req.body.$registrant.registrationstatusesandlogs.registrationlog.push({
          date: _registeringdate,
          type: "Registration",
          indication: "First Registration",
          messages: [
            { message: "Attempting for registering for the MFATIP PROGRAM" },
            { message: "STATUS REGISTERED" }
          ]
        });

        req.body.$registrant.passwords.account.password = _hashedpassword;
        
        // Create a new document using the imported model
        const newRegistrant = new RegistrantDataModel(req.body.$registrant);
        await newRegistrant.save();
        
        console.log(`Registrant registered: ${req.body.$registrant.name.firstname}, ${req.body.$registrant.name.middlename}, ${req.body.$registrant.name.lastname}. ID: ${req.body.$registrant.id}, OMSAW ID: ${omsiapawasId}`);

        res.status(200).send({
          message: "Registrant registered"
        });
      }
    }
  } catch (err) {
    console.error(`Registration error: ${err}`);

    // Specific error handling
    if (err.message === "Maximum registrant limit reached") {
      return res.status(400).send({
        message: "Registration limit reached. Cannot add more registrants.",
        error: true
      });
    }

    // Generic server error handling
    res.status(500).send({ 
      message: `Registration failed: ${err.message}`,
      error: true
    });
  }
});

Router.route("/login").post( async (req, res) => {

  try {
    // Log the incoming request data for debugging
    console.log("Login request received:", {
      firstName: req.body.$firstname,
      middleName: req.body.$middlename,
      lastName: req.body.$lastname
    });
    
    // Normalize case for comparison (strict trimming of whitespace)
    const normalizedLoginDetails = {
      firstName: req.body.$firstname?.trim() || '',
      middleName: req.body.$middlename?.trim() || '',
      lastName: req.body.$lastname?.trim() || '',
      password: req.body.$password || ''
    };
    
    {/*
    // First, try to find ALL users to check what's in the database
    // This is for debugging only - remove in production
    const allUsers = await RegistrantDataModel.find({}, 'name');
    console.log("Available users in DB:", allUsers.map(u => ({ 
      _id: u._id, 
      name: u.name 
    })));
    */}

    // First, try a more permissive search - just by firstName and lastName
    const initialQuery = await RegistrantDataModel.find({
      'name.firstname': normalizedLoginDetails.firstName,
      'name.lastname': normalizedLoginDetails.lastName
    });
    
    console.log(`Found ${initialQuery.length} users with matching first and last name`);
    
    if (initialQuery.length > 0) {
      console.log("Initial matches:", initialQuery.map(u => ({
        _id: u._id,
        name: u.name
      })));
    }
    
    // Now try the exact match including middle name
    const exactQuery = await RegistrantDataModel.find({
      'name.firstname': normalizedLoginDetails.firstName,
      'name.middlename': normalizedLoginDetails.middleName,
      'name.lastname': normalizedLoginDetails.lastName
    });
    
    console.log(`Found ${exactQuery.length} users with exact name match including middle name`);
    
    // If we still don't have matches, try a more flexible approach
    let matchingUsers = exactQuery;
    
    if (matchingUsers.length === 0) {
      // Try a more flexible search with case-insensitive plain text match
      matchingUsers = await RegistrantDataModel.find({
        'name.firstname': { $regex: normalizedLoginDetails.firstName, $options: 'i' },
        'name.lastname': { $regex: normalizedLoginDetails.lastName, $options: 'i' }
      });
      
      // Filter middle name manually for more control
      if (normalizedLoginDetails.middleName) {
        matchingUsers = matchingUsers.filter(user => {
          const dbMiddleName = user.name.middlename ? user.name.middlename.trim() : '';
          // Very permissive matching - just check if the strings are the same when lowercased
          return dbMiddleName.toLowerCase() === normalizedLoginDetails.middleName.toLowerCase();
        });
      }
      
      console.log(`Found ${matchingUsers.length} users with flexible name matching`);
    }
    
    // If no matching users found
    if (matchingUsers.length === 0) {
      return res.status(200).json({
        message: "No user found with the provided name details"
      });
    }
    
    // Check passwords
    for (const user of matchingUsers) {
      // Make sure the passwords.account.password path exists
      if (user.passwords && user.passwords.account && user.passwords.account.password) {
        const passwordMatches = await bcrypt.compare(
          normalizedLoginDetails.password, 
          user.passwords.account.password
        );
        
        if (passwordMatches) {
          // Update the device login status to "logged in"
          await RegistrantDataModel.findByIdAndUpdate(
            user._id,
            { 'registrationstatusesandlogs.deviceloginstatus': 'logged in' }
          );
          
          // Get the updated user document
          const updatedUser = await RegistrantDataModel.findById(user._id);
          
          // Return the actual MongoDB _id of the user with updated status
          return res.status(200).json({
            registrant: {
              ...updatedUser._doc,
              objectId: updatedUser._id // Explicitly send the MongoDB ObjectId
            },
            message: "Login successful"
          });
        }
      }
    }
    
    // If no password matches
    return res.status(200).json({
      message: "Incorrect password"
    });
  } catch (err) {
    console.error('Login route error:', err);
    
    // More specific error handling
    if (err.name === 'MongoNetworkError' || err.name === 'MongoTimeoutError') {
      return res.status(503).json({
        message: "Database connection error. Please try again later."
      });
    } else if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: "Invalid input data",
        error: err.message
      });
    } else {
      // Send a generic error response
      return res.status(500).json({
        message: "Internal server error",
        error: err.message
      });
    }
  }
});

Router.route("/logout").post(async (req, res) => {
  
  try {
    // Get the user ID from the request body
    const userId = req.body.$userid;
    
    // Validate if user ID exists
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required for logout",
        redirectTo: null
      });
    }
    
    console.log(`Attempting to log out user with ID: ${userId}`);
    
    // First, check if the user exists by ID
    const user = await RegistrantDataModel.findOne({ id: userId });
    
    if (!user) {
      console.log(`No user found with ID: ${userId}. Trying with MongoDB ObjectId.`);
      
      // Try looking up by MongoDB's internal _id if it's a valid ObjectId
      let objectIdUser = null;
      
      // Check if the ID might be a valid MongoDB ObjectId
      if (mongoose.Types.ObjectId.isValid(userId)) {
        objectIdUser = await RegistrantDataModel.findById(userId);
      }
      
      if (!objectIdUser) {
        console.log(`User not found with either ID format: ${userId}`);
        return res.status(404).json({
          success: false,
          message: "User not found with the provided ID",
          redirectTo: null
        });
      }
      
      // Use the found user by ObjectId
      console.log(`Found user by ObjectId: ${objectIdUser.id}`);
      
      // Update the user's device login status
      objectIdUser.registrationstatusesandlogs.deviceloginstatus = 'logged out';
      await objectIdUser.save();
      
      return res.status(200).json({
        success: true,
        message: "Logout successful",
        redirectTo: "/mfatip/loginregister"
      });
    }
    
    // Update the user's device login status
    user.registrationstatusesandlogs.deviceloginstatus = 'logged out';
    await user.save();
    
    console.log(`User logged out successfully: ${userId}`);
    
    // Return success response with redirect URL
    return res.status(200).json({
      success: true,
      message: "Logout successful",
      redirectTo: "/mfatip/loginregister"
    });
    
  } catch (err) {
    console.error('Logout route error:', err);
    
    // Send an error response
    return res.status(500).json({
      success: false,
      message: "Logout failed: " + err.message,
      redirectTo: null
    });
  }
});

Router.route('/getregistrant').post(async (req, res) => {
  
  try {
    // Validate input
    if (!req.body.$userid) {
      return res.status(400).json({
        message: "USER_ID_REQUIRED",
        description: "User ID is required for registration lookup"
      });
    }
    
    // Find registrant by ObjectId using the imported model
    const registrant = await RegistrantDataModel.findById(req.body.$userid);
    
    if (!registrant) {
      return res.status(404).json({
        message: "NO_REGISTRANT_FOUND",
        description: "No registrant found with the given user ID"
      });
    }

    // Create a copy of the registrant object to modify
    const foundRegistrant = {...registrant.toObject()};
    
    // Map _id to id for frontend consistency
    // foundRegistrant.id = foundRegistrant._id.toString();
    
    // Remove password before sending
    if (foundRegistrant.passwords && foundRegistrant.passwords.account) {
      delete foundRegistrant.passwords.account.password;
    }
    
    // Update login status
    // registrant.registrationstatusesandlogs.deviceloginstatus = "logged in";
    await registrant.save();
    
    {/*
    // Additional checks if needed
    if (foundRegistrant.registrationstatusesandlogs.indication === 'inactive') {
      return res.status(403).json({
        message: "USER_INACTIVE",
        description: "This user account is currently inactive"
      });
    }
    */}

    // Successful response
    res.status(200).json({
      message: "REGISTRANT_FOUND",
      registrant: foundRegistrant
    });
  } catch (err) {
    // Handle specific errors
    if (err.name === 'CastError') {
      return res.status(400).json({
        message: "INVALID_USER_ID",
        description: "The provided user ID format is invalid"
      });
    }
    
    // Catch any unexpected errors
    console.error('Route Error:', err);
    res.status(500).json({
      message: "SERVER_ERROR",
      description: "An unexpected server error occurred"
    });
  }
});

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