const express = require('express');
const Router = require('express').Router();

const mongoose = require('mongoose');

const mongodb = require('../../lib/mongodb/database.js')

const RegistrantDataModel = require('../../models/people/registrantdatascheme.js')

const timestamps = require('../../lib/timestamps/timestamps');

const bcrypt = require('bcryptjs');

const multer = require('multer');
const path = require('path');
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


Router.route("/registration").post(uploadFields, async (req, res) => {

  try {

    // 🔍 DEBUG: Log incoming request
    console.log("\n=== BACKEND REGISTRATION DEBUG ===");
    console.log("Request received at:", new Date().toISOString());
    console.log("Request body keys:", Object.keys(req.body));
    console.log("Request files:", req.files ? Object.keys(req.files) : 'No files');
    
    // Log file details
    if (req.files) {
      Object.keys(req.files).forEach(fieldName => {
        const files = req.files[fieldName];
        files.forEach(file => {
          console.log(`File ${fieldName}:`, {
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            bufferSize: file.buffer.length
          });
        });
      });
    }
    
    // ✅ Parse the registrant data from JSON string sent by frontend
    let registrantData;
    try {
      registrantData = JSON.parse(req.body.registrantData);
      console.log("✅ Registrant data parsed successfully");
      console.log("bRen number:", registrantData.personaldata?.birthcertificate?.birthcertificatereferencenumber);
      console.log("Phone number:", registrantData.contact?.phonenumber);
    } catch (parseError) {
      console.error("❌ Error parsing registrant data:", parseError);
      return res.status(400).send({
        message: "Invalid registrant data format"
      });
    }

    // Generate next sequential ID for registrant
    const generateNextRegistrantId = async () => {
      const registrantCount = await RegistrantDataModel.countDocuments();
      
      if (registrantCount >= 1000) {
        return null;
      }
      
      const paddedCount = registrantCount.toString().padStart(4, '0');
      return `1000-${paddedCount}-A-1`;
    };

    // Generate unique ID for omsiapawas credits
    const generateOmsiapawasId = async () => {
      const currentDate = new Date();
      const year = currentDate.getFullYear().toString();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const day = currentDate.getDate().toString().padStart(2, '0');
      
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      
      const todayRegistrantCount = await RegistrantDataModel.countDocuments({
        'registrationstatusesandlogs.registrationlog.date': {
          $regex: `^${year}-${month}-${day}`
        }
      });
      
      const sequentialNum = (todayRegistrantCount + 1).toString().padStart(3, '0');
      
      return `OMSAW-${year}${month}${day}-${sequentialNum}`;
    };

    // ✅ Function to save image buffer to file (using multer buffer instead of base64 string)
    const saveImageBufferToFile = (buffer, registrantId, imageType, mimetype) => {

      try {
        console.log("\n🔍 Saving image buffer to file...");
        console.log("Registrant ID:", registrantId);
        console.log("Image type:", imageType);
        console.log("Buffer length:", buffer.length);
        console.log("Mimetype:", mimetype);
        
        // Create filename with registrant ID and timestamp
        const timestamp = Date.now();
        
        // Get file extension from mimetype
        const extension = mimetype.split('/')[1] || 'jpg';
        const filename = `${registrantId}_${imageType}_${timestamp}.${extension}`;
        
        // Create the full path to save the image
        const imagePath = path.join(__dirname, '../../../view/public/images/registration', filename);
        
        console.log("Full path:", imagePath);
        
        // Ensure the directory exists
        const dir = path.dirname(imagePath);
        if (!fs.existsSync(dir)) {
          console.log("Creating directory:", dir);
          fs.mkdirSync(dir, { recursive: true });
        }
        
        // ✅ Save the buffer directly as a file
        fs.writeFileSync(imagePath, buffer);
        
        console.log("✅ Image saved successfully!");
        
        // Return the relative path to store in database
        return `../images/registration/${filename}`;
      } catch (error) {
        console.error('❌ Error saving image:', error);
        throw new Error('Failed to save image: ' + error.message);
      }
    };

    // Check for duplicate birth certificate reference number
    const bRenNumber = registrantData.personaldata.birthcertificate.birthcertificatereferencenumber;
    
    console.log("\n🔍 Checking for duplicate bRen number:", bRenNumber);
    
    const existingRegistrantWithBRen = await RegistrantDataModel.findOne({
      'personaldata.birthcertificate.birthcertificatereferencenumber': bRenNumber
    });

    if (existingRegistrantWithBRen) {
      console.log("❌ Duplicate bRen number found!");
      return res.status(200).send({
        message: "Duplicate bRen number"
      });
    }
    
    console.log("✅ No duplicate bRen number found");

    // Generate ID and check user limit
    const registrantId = await generateNextRegistrantId();
    console.log("Generated registrant ID:", registrantId);
    
    if (registrantId === null) {
      console.log("❌ User limit reached!");
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
    console.log("Generated OMSAW ID:", omsiapawasId);
    
    const _hashedpassword = await bcrypt.hash(registrantData.passwords.account.password, 13);
    const _registeringdate = timestamps.getFormattedDate();
    
    // ✅ Save the birth certificate image as a file and get the path
    let birthCertificateImagePath = "";
    if (req.files && req.files.birthcertificate_front && req.files.birthcertificate_front[0]) {
      const file = req.files.birthcertificate_front[0];
      console.log("\n🔍 Processing birth certificate front image...");
      
      birthCertificateImagePath = saveImageBufferToFile(
        file.buffer,
        registrantId,
        'birthcert_front',
        file.mimetype
      );
      
      console.log("Birth certificate image path:", birthCertificateImagePath);
    } else {
      console.log("⚠️ No birth certificate front image found in request!");
    }
    
    // ✅ Process birth certificate back image if uploaded
    let birthCertificateBackImagePath = "";
    if (req.files && req.files.birthcertificate_back && req.files.birthcertificate_back[0]) {
      const file = req.files.birthcertificate_back[0];
      console.log("\n🔍 Processing birth certificate back image...");
      
      birthCertificateBackImagePath = saveImageBufferToFile(
        file.buffer,
        registrantId,
        'birthcert_back',
        file.mimetype
      );
      
      console.log("Birth certificate back image path:", birthCertificateBackImagePath);
    }
    
    // ✅ Process government ID front image if uploaded
    let govIdFrontImagePath = "";
    if (req.files && req.files.governmentid_front && req.files.governmentid_front[0]) {
      const file = req.files.governmentid_front[0];
      console.log("\n🔍 Processing government ID front image...");
      
      govIdFrontImagePath = saveImageBufferToFile(
        file.buffer,
        registrantId,
        'govid_front',
        file.mimetype
      );
      
      console.log("Government ID front image path:", govIdFrontImagePath);
    }
    
    // ✅ Process government ID back image if uploaded
    let govIdBackImagePath = "";
    if (req.files && req.files.governmentid_back && req.files.governmentid_back[0]) {
      const file = req.files.governmentid_back[0];
      console.log("\n🔍 Processing government ID back image...");
      
      govIdBackImagePath = saveImageBufferToFile(
        file.buffer,
        registrantId,
        'govid_back',
        file.mimetype
      );
      
      console.log("Government ID back image path:", govIdBackImagePath);
    }
    
    // Set the IDs
    registrantData.id = registrantId;
    registrantData.credits = registrantData.credits || {};
    registrantData.credits.omsiapawas = registrantData.credits.omsiapawas || {};
    registrantData.credits.omsiapawas.id = omsiapawasId;
    registrantData.credits.omsiapawas.amount = 0;
    registrantData.registrationstatusesandlogs.indication = "unverified";
    
    // ✅ Update the image fields to store the file paths instead of base64
    registrantData.personaldata.birthcertificate.frontphoto.image = birthCertificateImagePath;
    
    if (birthCertificateBackImagePath) {
      registrantData.personaldata.birthcertificate.backphoto.image = birthCertificateBackImagePath;
    }
    
    if (govIdFrontImagePath) {
      registrantData.personaldata.government_issued_identification.frontphoto.image = govIdFrontImagePath;
    }
    
    if (govIdBackImagePath) {
      registrantData.personaldata.government_issued_identification.backphoto.image = govIdBackImagePath;
    }
    
    // Create registration log entry
    registrantData.registrationstatusesandlogs.registrationlog.push({
      date: _registeringdate,
      type: "Registration",
      indication: "First Registration",
      messages: [
        { message: "Attempting for registering for the MFATIP PROGRAM" },
        { message: "STATUS REGISTERED" }
      ]
    });

    // Set hashed password
    registrantData.passwords.account.password = _hashedpassword;
    
    console.log("\n🔍 Creating new registrant document...");
    
    // ✅ Create and save the new registrant to MongoDB
    const newRegistrant = new RegistrantDataModel(registrantData);
    await newRegistrant.save();
    
    console.log(`✅ Registrant registered with ID: ${registrantData.id}, OMSAW ID: ${omsiapawasId}, bRen: ${bRenNumber}`);
    console.log(`✅ Birth certificate image saved to: ${birthCertificateImagePath}`);
    console.log("=== END BACKEND DEBUG ===\n");

    res.status(200).send({
      message: "Registrant registered"
    });

  } catch (err) {

    console.error("❌ Registration error:", err);
    console.error("Error stack:", err.stack);
    console.log("=== END BACKEND DEBUG (ERROR) ===\n");

    // Specific error handling
    if (err.message === "Maximum registrant limit reached") {
      return res.status(400).send({
        message: "Registration limit reached. Cannot add more registrants.",
        error: true
      });
    }

    // Handle multer errors
    if (err.message === "Only image files are allowed!") {
      return res.status(400).send({
        message: "Only image files are allowed for upload",
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

    // ===== CHECK CITIZENSHIP EXPIRATION =====
    const currentType = registrant.registrationstatusesandlogs?.type;
    const purchaseDate = registrant.registrationstatusesandlogs?.citizenshippurchasedate;
    
    // Only check expiration for Public and Private Citizenship
    if (purchaseDate && 
        (currentType === "Public Citizenship" || currentType === "Private Citizenship")) {
      
      const purchaseDateObj = new Date(purchaseDate);
      const currentDate = new Date();
      
      // Calculate difference in months
      const monthsDifference = (currentDate.getFullYear() - purchaseDateObj.getFullYear()) * 12 
                              + (currentDate.getMonth() - purchaseDateObj.getMonth());
      
      // Check if more than 3 months have passed
      if (monthsDifference >= 3) {
        // Reset to MFATIP
        registrant.registrationstatusesandlogs.type = "Monthly Financial Allocation To Individual People ( MFATIP )";
        
        // Create expiration log
        const expirationLog = {
          date: timestamp.getFormattedDate(),
          description: `${currentType} has expired after 3 months. Account automatically reverted to MFATIP status.`
        };
        
        // Add log to registrationstatusesandlogs.logs array
        if (!registrant.registrationstatusesandlogs.logs) {
          registrant.registrationstatusesandlogs.logs = [];
        }
        registrant.registrationstatusesandlogs.logs.push(expirationLog);
        
        // Optional: Clear the purchase date since citizenship expired
        registrant.registrationstatusesandlogs.citizenshippurchasedate = null;
        
        // Save the changes
        await registrant.save();
      }
    }
    // ===== END CITIZENSHIP EXPIRATION CHECK =====

    // Create a copy of the registrant object to modify
    const foundRegistrant = {...registrant.toObject()};
    
    // Map _id to id for frontend consistency
    // foundRegistrant.id = foundRegistrant._id.toString();
    
    // Remove password before sending
    if (foundRegistrant.passwords && foundRegistrant.passwords.account) {
      delete foundRegistrant.passwords.account.password;
    }
    
    // Update login status (this was already commented)
    // registrant.registrationstatusesandlogs.deviceloginstatus = "logged in";
    // Note: No need to save again here since we already saved above if needed
    
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

// Utility: Format date like “Sat. October 11, 2025 at 7:38 PM”
function formatDate(date) {
  const options = {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleString("en-US", options).replace(",", " at");
}

// Utility: Compute month difference
function monthsDifference(date1, date2) {
  const years = date2.getFullYear() - date1.getFullYear();
  const months = date2.getMonth() - date1.getMonth();
  return years * 12 + months;
}

Router.post("/purchasecitizenship", async (req, res) => {

  try {

    const { type, name, birthcertificatenumber } = req.body;

    // 1️⃣ Validate incoming data
    if (!type || !name || !birthcertificatenumber ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: type, name, or birth certificate number.",
      });
    }

    // 2️⃣ Validate citizenship type
    const validTypes = ["Public Citizenship", "Private Citizenship"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid citizenship type. Must be either 'Public Citizenship' or 'Private Citizenship'.",
      });
    }

    // 3️⃣ Find registrant quickly via birth certificate number
    const registrant = await RegistrantDataModel.findOne({
      "personaldata.birthcertificate.birthcertificatereferencenumber": birthcertificatenumber,
    });

    if (!registrant) {
      return res.status(404).json({
        success: false,
        message: "Registrant not found. Please verify your information.",
      });
    }

    // 4️⃣ Check existing citizenship and purchase date
    const now = new Date();
    const currentCitizenship = registrant.personaldata?.citizenship || "None";
    const lastPurchaseDateStr = registrant.registrationstatusesandlogs?.citizenshippurchasedate;

    // If already purchased same citizenship type less than 3 months ago, block
    if (lastPurchaseDateStr) {
      const lastPurchaseDate = new Date(lastPurchaseDateStr);
      const diffMonths = monthsDifference(lastPurchaseDate, now);

      if (diffMonths < 3) {
        return res.status(403).json({
          success: false,
          message: `You have already purchased a ${currentCitizenship} on ${lastPurchaseDateStr}. You can only purchase another citizenship after 3 months.`,
        });
      }
    }

    // 5️⃣ Handle conflicts between Public and Private
    if (
      (currentCitizenship === "Public Citizenship" && type === "Private Citizenship") ||
      (currentCitizenship === "Private Citizenship" && type === "Public Citizenship")
    ) {
      return res.status(409).json({
        success: false,
        message: `You currently hold a ${currentCitizenship}. Switching to ${type} requires administrative approval.`,
      });
    }

    // 6️⃣ Continue purchase and update registrant
    const newPurchaseDate = formatDate(now);

    registrant.registrationstatusesandlogs.citizenshippurchasedate = newPurchaseDate;
    registrant.registrationstatusesandlogs.type = type;

    // 7️⃣ Append detailed log
    registrant.registrationstatusesandlogs.registrationlog.push({
      date: newPurchaseDate,
      type: `Purchase - ${type}`,
      indication: "success",
      messages: [
        {
          message: `Registrant successfully purchased ${type} on ${newPurchaseDate}.`,
        },
      ],
    });

    await registrant.save();

    // 8️⃣ Respond success
    return res.status(200).json({
      success: true,
      message: `Successfully purchased ${type}. Citizenship updated.`,
      newPurchaseDate,
      type,
    });
  } catch (err) {
    console.error("Error in /citizenship route:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error while processing citizenship purchase.",
      error: err.message,
    });
  }

});

// GET route to find registrant by BREN
Router.get('/registrants/find/:bren', async (req, res) => {

  console.log("Synced")

  try {
    const { bren } = req.params;

    // Validate BREN parameter
    if (!bren || bren.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Birth Certificate Reference Number (BREN) is required'
      });
    }

    // Query database for registrant with matching BREN
    const registrant = await RegistrantDataModel.findOne({
      'personaldata.birthcertificate.birthcertificatereferencenumber': bren.trim()
    }).select('-passwords'); // Exclude passwords from response for security

    // Check if registrant exists
    if (!registrant) {
      return res.status(404).json({
        success: false,
        message: 'No registrant found with the provided BREN'
      });
    }

    // Return registrant data
    return res.status(200).json({
      success: true,
      message: 'Registrant found successfully',
      data: {
        id: registrant.id,
        fullName: `${registrant.name.firstname} ${registrant.name.middlename ? registrant.name.middlename + ' ' : ''}${registrant.name.lastname}`,
        nickname: registrant.name.nickname,
        phoneNumber: registrant.contact.phonenumber,
        emailAddress: registrant.contact.emailaddress,
        bren: registrant.personaldata.birthcertificate.birthcertificatereferencenumber,
        address: registrant.contact.address,
        registrationStatus: registrant.registrationstatusesandlogs.indication,
        citizenship: registrant.personaldata.citizenship
      }
    });

  } catch (error) {
    console.error('Error finding registrant by BREN:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while searching for registrant',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});


// PUT route to update registrant password
Router.put('/registrants/update-password', async (req, res) => {
  try {
    const { bren, newPassword } = req.body;

    // Validate required fields
    if (!bren || bren.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Birth Certificate Reference Number (BREN) is required'
      });
    }

    if (!newPassword || newPassword.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'New password is required'
      });
    }

    // Validate password length
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    // Find registrant by BREN
    const registrant = await RegistrantDataModel.findOne({
      'personaldata.birthcertificate.birthcertificatereferencenumber': bren.trim()
    });

    if (!registrant) {
      return res.status(404).json({
        success: false,
        message: 'No registrant found with the provided BREN'
      });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the password in the database
    registrant.passwords.account.password = hashedPassword;
    await registrant.save();

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Error updating password:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating password',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
  
});

module.exports = Router;