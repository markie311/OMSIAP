const express = require('express');
const Router = require('express').Router();

const mongoose = require('mongoose');

const mongodb = require('../../lib/mongodb/database.js');

const RegistrantDataModel = require('../../models/people/registrantdatascheme.js')

const MerchandiseTransactionDataModel = require('../../models/transactions/merchandisetransactiondatascheme.js')
const CurrencyExchangeTransactionDataModel = require('../../models/transactions/currencyexchangetransactiondatascheme.js')
const WidthdrawalTransactionDataModel = require('../../models/transactions/withdrawaltransactiondatascheme.js')


const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { v4: uuidv4 } = require('uuid');

const timestamps = require('../../lib/timestamps/timestamps');

const bcrypt = require('bcrypt');

// Server-side route handler
Router.route("/getomsiapdata").get(async (req, res) => {
  try {
    // Fetch registrants data
    const registrants = await RegistrantDataModel.find({}, { 
      'passwords.account.password': 0 // Exclude password fields
    });

    // Process registrants for status categorization
    const people = registrants.map(person => {
      const personObj = person.toObject();
      return {
        ...personObj,
        status: {
          type: personObj.registrationstatusesandlogs?.type || 'unknown',
          indication: personObj.registrationstatusesandlogs?.indication || 'unknown'
        }
      };
    });

    // Fetch merchandise transactions
    const merchandiseTransactions = await MerchandiseTransactionDataModel.find({});
    
    // Categorize merchandise transactions by status
    const orders = {
      total: merchandiseTransactions,
      pending: merchandiseTransactions.filter(tx => tx.statusesandlogs?.status === 'pending'),
      accepted: merchandiseTransactions.filter(tx => tx.statusesandlogs?.status === 'accepted'),
      rejected: merchandiseTransactions.filter(tx => tx.statusesandlogs?.status === 'rejected')
    };

    // Fetch currency exchange transactions
    const currencyExchangeTransactions = await CurrencyExchangeTransactionDataModel.find({});
    
    // Categorize currency exchange transactions
    const currencyexchange = {
      total: currencyExchangeTransactions,
      pending: currencyExchangeTransactions.filter(tx => tx.statusesandlogs?.status === 'pending'),
      successful: currencyExchangeTransactions.filter(tx => tx.statusesandlogs?.status === 'successful'),
      rejected: currencyExchangeTransactions.filter(tx => tx.statusesandlogs?.status === 'rejected')
    };

    // Fetch withdrawal transactions
    const withdrawalTransactions = await WidthdrawalTransactionDataModel.find({});
    
    // Categorize withdrawal transactions
    const withdrawals = {
      total: withdrawalTransactions,
      pending: withdrawalTransactions.filter(tx => tx.statusesandlogs?.status === 'pending'),
      successful: withdrawalTransactions.filter(tx => tx.statusesandlogs?.status === 'successful'),
      rejected: withdrawalTransactions.filter(tx => tx.statusesandlogs?.status === 'rejected')
    };

    // Construct response object
    const responseData = {
      people,
      transactions: {
        orders,
        currencyexchange,
        withdrawals
      }
    };

    res.status(200).json(responseData);
  } catch (err) {
    console.error('Error fetching OMSIAP data:', err);
    res.status(500).json({
      message: 'Error retrieving OMSIAP data',
      error: err.message
    });
  }
});


Router.route('/acceptorder').post(async (req, res) => {

  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb+srv://ofmackysinkandpaper:38NJaxXX2AF9Mpmp@cluster0.djai0.mongodb.net/omsiap", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'omsiap',
      autoCreate: false
    });

    // Define the model
    const OmsiapData = mongoose.model('datas', omsiapdatascheme);

    // Fetch the specific document
    const omsiapDocument = await OmsiapData.findById("Code-113-1143");

    if (!omsiapDocument) {
      return res.status(404).json({ 
        message: "OMSIAP document not found",
        status: "error",
        errorCode: "DOCUMENT_NOT_FOUND"
      });
    }

    // Find the order in pending orders
    const pendingOrderIndex = omsiapDocument.transactions.orders.pending.findIndex(
      order => order.id === req.body.id
    );

    if (pendingOrderIndex === -1) {
      return res.status(404).json({ 
        message: "Order not found in pending orders",
        status: "error",
        errorCode: "ORDER_NOT_FOUND"
      });
    }

    // Extract the order to be accepted
    const orderToAccept = omsiapDocument.transactions.orders.pending[pendingOrderIndex];

    // Check if order is already in an invalid state
    if (orderToAccept.status === 'accepted') {
      return res.status(400).json({
        message: `Order ${req.body.id} is already accepted`,
        status: "warning",
        errorCode: "ORDER_ALREADY_ACCEPTED"
      });
    }

    // Update the order's status before moving
    orderToAccept.status = 'accepted';

    // Remove from pending orders
    omsiapDocument.transactions.orders.pending.splice(pendingOrderIndex, 1);

    // Add to accepted orders
    omsiapDocument.transactions.orders.accepted.push(orderToAccept);

    // Update the order's status in the total orders array
    const totalOrderIndex = omsiapDocument.transactions.orders.total.findIndex(
      order => order.id === req.body.id
    );

    if (totalOrderIndex !== -1) {
      // Update status in total orders, but keep the order in the total array
      omsiapDocument.transactions.orders.total[totalOrderIndex].status = 'accepted';
    }

    // Save the updated document
    await omsiapDocument.save();

    // Respond with success and additional details
    res.status(200).json({
      message: `Order ${req.body.id} has been accepted successfully`,
      status: "success",
      orderId: req.body.id,
      acceptedAt: new Date().toISOString()
    });

  } catch (err) {
    console.error('Error accepting order:', err);
    
    // Determine the appropriate error response
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: "Validation error occurred",
        status: "error",
        errorCode: "VALIDATION_ERROR",
        details: err.errors
      });
    }

    if (err.name === 'MongoError' || err.name === 'MongooseError') {
      return res.status(500).json({
        message: "Database operation failed",
        status: "error",
        errorCode: "DATABASE_ERROR",
        details: err.message
      });
    }

    // Generic server error
    res.status(500).json({
      message: "Error processing order acceptance",
      status: "error",
      errorCode: "INTERNAL_SERVER_ERROR",
      details: err.message
    });
  }
});
// Define path for transaction images
const UPLOAD_PATH = path.join(__dirname, '../../../view/public/images/currencyexchange');

// Ensure directory exists
if (!fs.existsSync(UPLOAD_PATH)) {
  fs.mkdirSync(UPLOAD_PATH, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, UPLOAD_PATH);
  },
  filename: function(req, file, cb) {
    // Create filename with date prefix for easier management
    const now = new Date();
    const datePrefix = now.getFullYear() + 
                      ('0' + (now.getMonth() + 1)).slice(-2) + 
                      ('0' + now.getDate()).slice(-2);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${datePrefix}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// File filter to only accept images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Initialize multer with configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter
});

// Manual cleanup function for files older than a specified time period
function cleanupOldFiles(monthsOld = 1) {
  console.log(`Running cleanup of transaction images older than ${monthsOld} month(s)...`);
  
  return new Promise((resolve, reject) => {
    fs.readdir(UPLOAD_PATH, (err, files) => {
      if (err) {
        console.error('Error reading directory for cleanup:', err);
        reject(`Error reading directory: ${err.message}`);
        return;
      }
      
      if (files.length === 0) {
        console.log('No files found in directory');
        resolve({ message: 'No files found to clean up', deletedCount: 0 });
        return;
      }
      
      const currentDate = new Date();
      const cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() - monthsOld);
      
      let processedCount = 0;
      let deletedCount = 0;
      let errors = [];
      
      files.forEach(file => {
        const filePath = path.join(UPLOAD_PATH, file);
        
        // Get file stats to check last modified date
        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.error(`Error getting stats for file ${file}:`, err);
            errors.push(`Error getting stats for file ${file}: ${err.message}`);
            processedCount++;
            
            if (processedCount === files.length) {
              finishCleanup();
            }
            return;
          }
          
          // Check if file is older than specified months based on filename date prefix
          const dateMatch = file.match(/^(\d{8})-/);
          let fileDate;
          let shouldDelete = false;
          
          if (dateMatch) {
            const fileYear = parseInt(dateMatch[1].substring(0, 4));
            const fileMonth = parseInt(dateMatch[1].substring(4, 6)) - 1;
            const fileDay = parseInt(dateMatch[1].substring(6, 8));
            fileDate = new Date(fileYear, fileMonth, fileDay);
            shouldDelete = fileDate < cutoffDate;
          } 
          // Fallback to file modification time
          else {
            fileDate = stats.mtime;
            shouldDelete = fileDate < cutoffDate;
          }
          
          if (shouldDelete) {
            fs.unlink(filePath, err => {
              if (err) {
                console.error(`Error deleting old file ${file}:`, err);
                errors.push(`Error deleting file ${file}: ${err.message}`);
              } else {
                console.log(`Deleted old file ${file} (from ${fileDate.toDateString()})`);
                deletedCount++;
              }
              
              processedCount++;
              if (processedCount === files.length) {
                finishCleanup();
              }
            });
          } else {
            processedCount++;
            if (processedCount === files.length) {
              finishCleanup();
            }
          }
        });
      });
      
      function finishCleanup() {
        const result = {
          message: `Cleanup completed. Deleted ${deletedCount} of ${files.length} files.`,
          deletedCount,
          totalFiles: files.length,
          errors: errors.length > 0 ? errors : undefined
        };
        
        console.log(result.message);
        resolve(result);
      }
    });
  });
}

// Expose a route to manually trigger the cleanup
Router.route('/currencyexchange/cleanup').post(async (req, res) => {
  try {
    // Get months parameter - default to 1 month if not specified
    const months = req.body.months ? parseInt(req.body.months) : 1;
    
    if (isNaN(months) || months < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid months parameter. Must be a positive number.'
      });
    }
    
    // Run the cleanup
    const result = await cleanupOldFiles(months);
    
    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error during manual cleanup:', error);
    return res.status(500).json({
      success: false,
      message: 'Error during cleanup process',
      error: error.message
    });
  }
});

// Currency Exchange Route
Router.route('/currencyexchange').post(upload.single('transactionImage'), async (req, res) => {

  try {
    // Get request data
    const {
      transactionmadeby,
      exchangeamount,
      referenceNumber,
      phpAmount
    } = req.body;
    
    // Validate required fields
    if (!exchangeamount || !referenceNumber || !req.file) {
      console.log("Missing required fields");
      
      // Delete uploaded file if validation fails
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      
      return res.status(400).json({
        success: false,
        status: 'MISSING_FIELDS',
        message: 'Please provide all required fields'
      });
    }
    
    // Validate exchange amount
    const exchangeAmountFloat = parseFloat(exchangeamount);
    if (isNaN(exchangeAmountFloat) || exchangeAmountFloat <= 0) {
      // Delete uploaded file
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      
      return res.status(400).json({
        success: false,
        status: 'INVALID_AMOUNT',
        message: 'Invalid exchange amount'
      });
    }
    
    // Validate PHP amount
    const phpAmountFloat = parseFloat(phpAmount);
    if (isNaN(phpAmountFloat) || phpAmountFloat < 210 || phpAmountFloat > 5250) {
      // Delete uploaded file
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      
      return res.status(400).json({
        success: false,
        status: 'INVALID_AMOUNT',
        message: 'PHP amount must be between ₱210 and ₱5,250'
      });
    }
    
    // Get image path relative to public directory
    const imageFilename = req.file.filename;
    const imagePath = `/images/currencyexchange/${imageFilename}`;
    
    // Parse user data
    let userDataObj;

    try {
      userDataObj = typeof transactionmadeby === 'string' 
        ? JSON.parse(transactionmadeby) 
        : transactionmadeby;
    } catch (error) {

      console.error('Error parsing user data:', error);
      
      // Delete uploaded file
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      
      return res.status(400).json({
        success: false,
        status: 'INVALID_USER_DATA',
        message: 'Invalid user data format'
      });
    }
    
    // Check for existing transaction with same reference number
    const existingTransaction = await CurrencyExchangeTransactionDataModel.findOne({
      'details.referrence.number': referenceNumber
    });
    
    if (existingTransaction) {
      // Delete uploaded file
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      
      return res.status(400).json({
        success: false,
        status: 'DUPLICATE_REFERENCE',
        message: 'This reference number has already been used for another transaction'
      });
    }

    // Get user ID
    const userId = userDataObj._id || userDataObj.id;
    
    // Check if registrant exists
    const registrantExists = await RegistrantDataModel.findById(userId);
    
    if (!registrantExists) {
      // Delete uploaded file
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      
      return res.status(400).json({
        success: false,
        status: 'REGISTRANT_NOT_FOUND',
        message: 'User account not found. Please check your account details or register first.'
      });
    }

    // Generate transaction ID
    const transactionId = uuidv4();
    
    // Get formatted date
    const formattedDate = timestamps.getFormattedDate();
    
    // Create new transaction object
    const newTransaction = {
      id: transactionId,
      intent: 'currency exchange',
      statusesandlogs: {
        status: 'pending',
        indication: 'waiting for approval',
        logs: [
          {
            date: formattedDate,
            type: 'pending',
            indication: 'first log, waiting for approval',
            messages: [
              { message: 'Your exchange request has been submitted and is pending approval.' }
            ]
          }
        ]
      },
      details: {
        paymentmethod: 'GCASH',
        thistransactionismadeby: {
          id: userDataObj.id,
          name: {
            firstname: userDataObj.name.firstname,
            middlename: userDataObj.name.middlename || '',
            lastname: userDataObj.name.lastname,
            nickname: userDataObj.name.nickname || ''
          },
          contact: {
            phonenumber: userDataObj.contact.phonenumber,
            emailaddress: userDataObj.contact.emailaddress,
            address: {
              street: userDataObj.contact.address?.street || '',
              trademark: userDataObj.contact.address?.trademark || '',
              baranggay: userDataObj.contact.address?.baranggay || '',
              city: userDataObj.contact.address?.city || '',
              province: userDataObj.contact.address?.province || '',
              postal_zip_code: userDataObj.contact.address?.postal_zip_code || '',
              country: userDataObj.contact.address?.country || ''
            }
          }
        },
        thistransactionismainlyintendedto: {
          id: 'system',
          name: {
            firstname: 'OMSIAP',
            middlename: '',
            lastname: 'System',
            nickname: ''
          },
          contact: {
            phonenumber: '',
            emailaddress: '',
            address: {
              street: '',
              trademark: '',
              baranggay: '',
              city: '',
              province: '',
              postal_zip_code: '',
              country: ''
            }
          }
        },
        amounts: {
          intent: exchangeAmountFloat,
          phppurchaseorexchangeamount: phpAmountFloat,
          deductions: {
            successfulprocessing: {
              amount: 0,
              reasons: ''
            },
            rejectionprocessing: {
              amount: 0,
              reasons: ''
            }
          },
          profit: 0,
          omsiapawasamounttorecieve: exchangeAmountFloat
        },
        referrence: {
          number: referenceNumber,
          gcashtransactionrecieptimage: imagePath
        }
      }
    };
    
    // Save transaction to database
    const savedTransaction = await CurrencyExchangeTransactionDataModel.create(newTransaction);
    
    // Update user's credits.transactions.currencyexchange
    await RegistrantDataModel.findByIdAndUpdate(
      userId,
      {
        $push: {
          'credits.omsiapawas.transactions.currencyexchange': newTransaction
        }
      },
      { new: true }
    );
    
    // Return success response
    return res.status(200).json({
      success: true,
      status: 'EXCHANGE_PENDING',
      message: 'Your exchange request has been submitted and is pending approval.',
      transaction: {
        id: transactionId,
        date: formattedDate,
        amount: exchangeAmountFloat,
        status: 'pending',
        phpAmount: phpAmountFloat
      }
    });
    
  } catch (error) {
    console.error('Currency exchange error:', error);
    
    // Delete the uploaded file if any error occurs
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    
    console.log("Error" + " " + error)

    return res.status(500).json({
      success: false,
      status: 'SERVER_ERROR',
      message: 'An error occurred while processing your request.'
    });
  }
});

Router.route('/widthdrawal').post(async(req, res) => {
  try {
    const { firstName, middleName, lastName, phoneNumber, amount, password, userId } = req.body;
    
    // Basic validation
    if (!firstName || !lastName || !phoneNumber || !amount || !password || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    // Convert string ID to MongoDB ObjectId
    let objectId;
    try {
      objectId = new mongoose.Types.ObjectId(userId);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }
    
    // Find user by ObjectId
    const user = await RegistrantDataModel.findOne({ _id: objectId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Verify password using bcrypt
    const storedHashedPassword = user.passwords?.account?.password;
    if (!storedHashedPassword) {
      return res.status(401).json({
        success: false,
        message: 'Password information not found'
      });
    }

    // Compare plain password with hashed password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, storedHashedPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }
    
    // Check for sufficient balance
    const userBalance = user.credits?.omsiapawas?.amount || 0;
    if (userBalance < parseFloat(amount)) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }
    
    // Calculate deductions and final amount
    const processingFee = parseFloat(amount) * 0.025; // Example: 2.5% processing fee
    const finalAmount = parseFloat(amount) - processingFee;
    
    // Create a new withdrawal transaction record
    const withdrawalTransaction = new WidthdrawalTransactionDataModel({
      id: uuidv4(),
      intent: 'withdrawal',
      statusesandlogs: {
        status: 'pending',
        indication: 'waiting for approval',
        logs: [{
          date: timestamps.getFormattedDate(),
          type: 'first submission',
          indication: 'first log, waiting for approval',
          messages: [{ message: 'Withdrawal request received' }]
        }]
      },
      details: {
        paymentmethod: 'gcash', // Assuming GCash as payment method
        thistransactionismadeby: {
          id: userId,
          name: {
            firstname: firstName,
            middlename: middleName || '',
            lastname: lastName,
            nickname: user.name?.nickname || ''
          },
          contact: {
            phonenumber: phoneNumber,
            emailaddress: user.contact?.emailaddress || '',
            address: {
              street: user.contact?.address?.street || '',
              trademark: user.contact?.address?.trademark || '',
              baranggay: user.contact?.address?.baranggay || '',
              city: user.contact?.address?.city || '',
              province: user.contact?.address?.province || '',
              postal_zip_code: user.contact?.address?.postal_zip_code || '',
              country: user.contact?.address?.country || 'Philippines'
            }
          }
        },
        thistransactionismainlyintendedto: {
          id: 'system_account',
          name: {
            firstname: 'System',
            middlename: '',
            lastname: 'Account',
            nickname: 'SysAccount'
          },
          contact: {
            phonenumber: '12345678900',
            emailaddress: 'system@example.com',
            address: {
              street: '',
              trademark: 'Company HQ',
              baranggay: '',
              city: 'Metro Manila',
              province: '',
              postal_zip_code: '',
              country: 'Philippines'
            }
          }
        },
        amounts: {
          intent: parseFloat(amount),
          deductions: {
            successfulprocessing: {
              amount: processingFee,
              reasons: 'Processing fee'
            },
            rejectionprocessing: {
              amount: 0,
              reasons: ''
            }
          },
          profit: processingFee,
          phpamounttorecieve: finalAmount
        },
        referrence: {
          gcashphonenumber: phoneNumber
        }
      }
    });
    
    // Save the transaction to database
    const savedTransaction = await withdrawalTransaction.save();
    
    // Update user's balance and add transaction to their widthdrawals array
    if (!user.credits) {
      user.credits = { omsiapawas: { amount: 0, transactions: { widthdrawals: [] } } };
    }
    if (!user.credits.omsiapawas) {
      user.credits.omsiapawas = { amount: 0, transactions: { widthdrawals: [] } };
    }
    if (!user.credits.omsiapawas.transactions) {
      user.credits.omsiapawas.transactions = { widthdrawals: [] };
    }
    if (!user.credits.omsiapawas.transactions.widthdrawals) {
      user.credits.omsiapawas.transactions.widthdrawals = [];
    }
    
    // Deduct the withdrawal amount from user's balance
    // user.credits.omsiapawas.amount -= parseFloat(amount);
    
    // Push the withdrawal transaction to user's widthdrawals array
    user.credits.omsiapawas.transactions.widthdrawals.push(savedTransaction);
    
    // Save the updated user document
    await user.save();
    
    // Respond with success
    return res.status(200).json({
      success: true,
      message: 'Withdrawal request has been submitted successfully',
      transactionId: withdrawalTransaction.id,
      amount: finalAmount,
      status: 'pending',
      estimatedCompletionTime: '24-48 hours',
      remainingBalance: user.credits.omsiapawas.amount
    });
    
  } catch (err) {
    console.error('Withdrawal error:', err);
    
    // Handle different types of errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + err.message
      });
    } else if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate transaction detected'
      });
    } else if (err.name === 'MongooseServerSelectionError') {
      return res.status(503).json({
        success: false,
        message: 'Database connection error. Please try again later.'
      });
    } else {
      // General server error
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing your withdrawal request'
      });
    }
  }
});

// Export the cleanupOldFiles function so it can be used elsewhere in your application
module.exports = Router;