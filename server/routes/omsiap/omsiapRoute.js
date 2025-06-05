const express = require('express');
const Router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// Import models - consolidated at the top
const RegistrantDataModel = require('../../models/people/registrantdatascheme.js');
const MerchandiseTransactionDataModel = require('../../models/transactions/merchandisetransactiondatascheme.js');
const CurrencyExchangeTransactionDataModel = require('../../models/transactions/currencyexchangetransactiondatascheme.js');
const WidthdrawalTransactionDataModel = require('../../models/transactions/withdrawaltransactiondatascheme.js');

// Import utilities
const timestamps = require('../../lib/timestamps/timestamps');

// Define all upload paths in one place to avoid duplication
const UPLOAD_PATHS = {
  CURRENCY_EXCHANGE: path.join(__dirname, '../../../view/public/images/currencyexchange'),
  WITHDRAWALS: path.join(__dirname, '../../../view/public/images/withdrawals'),
  DOCUMENTS: path.join(__dirname, '../../../view/public/images/documents')
};

// Ensure all directories exist
Object.values(UPLOAD_PATHS).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Common file filter for images
const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create storage factory function to avoid duplication
const createStorage = (uploadPath) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const now = new Date();
      const datePrefix = now.getFullYear() + 
                        ('0' + (now.getMonth() + 1)).slice(-2) + 
                        ('0' + now.getDate()).slice(-2);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `${datePrefix}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
  });
};

// Create multer instances for different upload types
const multerInstances = {
  currencyExchange: multer({
    storage: createStorage(UPLOAD_PATHS.CURRENCY_EXCHANGE),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: imageFileFilter
  }),
  withdrawals: multer({
    storage: createStorage(UPLOAD_PATHS.WITHDRAWALS),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: imageFileFilter
  }),
  documents: multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, UPLOAD_PATHS.DOCUMENTS);
      },
      filename: (req, file, cb) => {
        // Generate unique filename with user ID, document type and timestamp
        const userId = req.user ? req.user.id : 'unknown';
        const timestamp = Date.now();
        const fileExt = path.extname(file.originalname);
        cb(null, `${userId}-${file.fieldname}-${timestamp}${fileExt}`);
      }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: imageFileFilter
  })
};

// Document fields for profile update
const documentFields = [
  { name: 'birthCertificateFront', maxCount: 1 },
  { name: 'birthCertificateBack', maxCount: 1 },
  { name: 'governmentIdFront', maxCount: 1 },
  { name: 'governmentIdBack', maxCount: 1 }
];

// Helper function to remove old documents
const removeOldDocument = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting old document:', err);
    });
  }
};

// Generic cleanup function that can be used for any directory
const cleanupOldFiles = (uploadPath, monthsOld = 1) => {
  console.log(`Running cleanup of files in ${uploadPath} older than ${monthsOld} month(s)...`);
  
  return new Promise((resolve, reject) => {
    fs.readdir(uploadPath, (err, files) => {
      if (err) {
        console.error(`Error reading directory for cleanup: ${err}`);
        reject(`Error reading directory: ${err.message}`);
        return;
      }
      
      if (files.length === 0) {
        console.log('No files found in directory');
        resolve({ message: 'No files found to clean up', deletedCount: 0 });
        return;
      }
      
      const cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() - monthsOld);
      
      let processedCount = 0;
      let deletedCount = 0;
      let errors = [];
      
      files.forEach(file => {
        const filePath = path.join(uploadPath, file);
        
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
};

// ===== ROUTES =====

// Get OMSIAP data route
Router.get("/getomsiapdata", async (req, res) => {
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
      confirmed: merchandiseTransactions.filter(tx => tx.statusesandlogs?.status === 'confirmed'),
      rejected: merchandiseTransactions.filter(tx => tx.statusesandlogs?.status === 'rejected'),
      forshipping: merchandiseTransactions.filter(tx => tx.statusesandlogs?.status === 'forshipping'),
      shipped: merchandiseTransactions.filter(tx => tx.statusesandlogs?.status === 'shipped'),
      successful: merchandiseTransactions.filter(tx => tx.statusesandlogs?.status === 'successful')
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

// Confirm Order Route
Router.post('/confirmorder', async (req, res) => {
  try {
    const { _id } = req.body;
    
    // Input validation
    if (!_id) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    // Find the merchandise transaction by ID
    const merchandiseTransaction = await MerchandiseTransactionDataModel.findById(_id);
    
    // Check if transaction exists
    if (!merchandiseTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Order not found. Please refresh and try again.'
      });
    }

    // Check if transaction is already confirmed
    if (merchandiseTransaction.statusesandlogs.status === 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'This order has already been confirmed'
      });
    }

    // Check if transaction is in pending status
    if (merchandiseTransaction.statusesandlogs.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot confirm order in ${merchandiseTransaction.statusesandlogs.status} status`
      });
    }

    // Generate timestamp for the confirmation
    const formattedDate = timestamps.getFormattedDate();
    
    // Update the statusesandlogs
    merchandiseTransaction.statusesandlogs.status = 'confirmed';
    merchandiseTransaction.statusesandlogs.indication = 'confirmed and processing';
    merchandiseTransaction.statusesandlogs.date = formattedDate;
    
    // Add a new log entry
    merchandiseTransaction.statusesandlogs.logs.push({
      date: formattedDate,
      type: 'confirmed',
      indication: 'Order has been confirmed and is now being processed',
      messages: [
        { message: 'Order has been confirmed by administrator' },
        { message: 'Your order is being prepared for shipping' }
      ]
    });

    // Save the updated transaction
    await merchandiseTransaction.save();

    // Return success response
    return res.status(200).json({
      success: true,
      message: `Order ${_id} has been confirmed successfully`,
      updatedTransaction: merchandiseTransaction
    });
    
  } catch (err) {
    console.error('Error confirming order:', err);
    
    // Handle specific MongoDB errors
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }
    
    // Handle other errors
    return res.status(500).json({
      success: false,
      message: 'Server error occurred while confirming order'
    });
  }
});

// Order For Shipping Route
Router.post('/orderforshipping', async (req, res) => {
  try {
    const { _id } = req.body;
    
    // Input validation
    if (!_id) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    // Find the merchandise transaction by ID
    const merchandiseTransaction = await MerchandiseTransactionDataModel.findById(_id);
    
    // Check if transaction exists
    if (!merchandiseTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Order not found. Please refresh and try again.'
      });
    }
    
    // Check if transaction is already for shipping
    if (merchandiseTransaction.statusesandlogs.status === 'forshipping') {
      return res.status(400).json({
        success: false,
        message: 'This order is already marked for shipping'
      });
    }
    
    // Check if transaction is in confirmed status
    if (merchandiseTransaction.statusesandlogs.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: `Cannot mark order for shipping when in ${merchandiseTransaction.statusesandlogs.status} status. Order must be confirmed first.`
      });
    }
    
    // Generate timestamp for the status update
    const formattedDate = timestamps.getFormattedDate();
    
    // Update the statusesandlogs
    merchandiseTransaction.statusesandlogs.status = 'forshipping';
    merchandiseTransaction.statusesandlogs.indication = 'ready for shipping';
    merchandiseTransaction.statusesandlogs.date = formattedDate;
    
    // Add a new log entry
    merchandiseTransaction.statusesandlogs.logs.push({
      date: formattedDate,
      type: 'forshipping',
      indication: 'Order has been marked for shipping',
      messages: [
        { message: 'Order has been prepared and is ready for shipping' },
        { message: 'Your order will be dispatched soon' }
      ]
    });

    // Save the updated transaction
    await merchandiseTransaction.save();

    // Return success response
    return res.status(200).json({
      success: true,
      message: `Order ${_id} has been marked for shipping successfully`,
      updatedTransaction: merchandiseTransaction
    });
    
  } catch (err) {
    console.error('Error marking order for shipping:', err);
    
    // Handle specific MongoDB errors
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }
    
    // Handle other errors
    return res.status(500).json({
      success: false,
      message: 'Server error occurred while marking order for shipping'
    });
  }
});

// Order Shipped Route
Router.post('/ordershipped', async (req, res) => {
  try {
    const { _id } = req.body;
    
    // Input validation
    if (!_id) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    // Find the merchandise transaction by ID
    const merchandiseTransaction = await MerchandiseTransactionDataModel.findById(_id);
    
    // Check if transaction exists
    if (!merchandiseTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Order not found. Please refresh and try again.'
      });
    }
    
    // Check if transaction is already shipped
    if (merchandiseTransaction.statusesandlogs.status === 'shipped') {
      return res.status(400).json({
        success: false,
        message: 'This order has already been marked as shipped'
      });
    }
    
    // Check if transaction is in forshipping status
    if (merchandiseTransaction.statusesandlogs.status !== 'forshipping') {
      return res.status(400).json({
        success: false,
        message: `Cannot mark order as shipped when in ${merchandiseTransaction.statusesandlogs.status} status. Order must be prepared for shipping first.`
      });
    }
    
    // Generate timestamp for the status update
    const formattedDate = timestamps.getFormattedDate();
    
    // Update the statusesandlogs
    merchandiseTransaction.statusesandlogs.status = 'shipped';
    merchandiseTransaction.statusesandlogs.indication = 'shipped to customer';
    merchandiseTransaction.statusesandlogs.date = formattedDate;
    
    // Add a new log entry
    merchandiseTransaction.statusesandlogs.logs.push({
      date: formattedDate,
      type: 'shipped',
      indication: 'Order has been shipped',
      messages: [
        { message: 'Order has been dispatched to shipping carrier' },
        { message: 'Your order is on its way to you' },
        { message: "Don't forget to set your shipped order into accepted once order was recieved to update the status of the order into successful" }
      ]
    });

    // Save the updated transaction
    await merchandiseTransaction.save();

    // Return success response
    return res.status(200).json({
      success: true,
      message: `Order ${_id} has been marked as shipped successfully`,
      updatedTransaction: merchandiseTransaction
    });
    
  } catch (err) {
    console.error('Error marking order as shipped:', err);
    
    // Handle specific MongoDB errors
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }
    
    // Handle other errors
    return res.status(500).json({
      success: false,
      message: 'Server error occurred while marking order as shipped'
    });
  }
});

// Accept Order Route
Router.post('/acceptorder', async (req, res) => {
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

// Cleanup routes
Router.post('/currencyexchange/cleanup', async (req, res) => {
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
    const result = await cleanupOldFiles(UPLOAD_PATHS.CURRENCY_EXCHANGE, months);
    
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

Router.post('/withdrawals/cleanup', async (req, res) => {
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
    const result = await cleanupOldFiles(UPLOAD_PATHS.WITHDRAWALS, months);
    
    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error during withdrawal images cleanup:', error);
    return res.status(500).json({
      success: false,
      message: 'Error during cleanup process',
      error: error.message
    });
  }
});

// Currency Exchange Route
Router.post('/currencyexchange', multerInstances.currencyExchange.single('transactionImage'), async (req, res) => {
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
    
    console.log("Error" + " " + error);

    return res.status(500).json({
      success: false,
      status: 'SERVER_ERROR',
      message: 'An error occurred while processing your request.'
    });
  }
});

// Approve currency exchange route
Router.post('/approvecurrencyexchange', async (req, res) => {
  try {
    const {
      id,
      phpAmountVerification,
      omsiapAmountVerification,
      successfulDeductionAmount,
      rejectedDeductionAmount
    } = req.body;

    // Validate request data
    if (!id) {
      return res.status(400).json({ success: false, message: 'Transaction ID is required' });
    }

    if (!phpAmountVerification || !omsiapAmountVerification || !successfulDeductionAmount) {
      return res.status(400).json({ success: false, message: 'All verification amounts are required' });
    }

    // Find the transaction
    const transaction = await CurrencyExchangeTransactionDataModel.findOne({ _id: id });
    
    // Check if transaction exists
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // Check if transaction is already approved
    if (transaction.statusesandlogs.status === 'approved') {
      return res.status(409).json({ success: false, message: 'Transaction has already been approved' });
    }
    
    // Update transaction status and details
    const newStatusLog = {
      date: timestamps.getFormattedDate(),
      type: 'approval',
      indication: 'positive',
      messages: [{ message: 'Transaction approved by administrator' }]
    };

    // Update the transaction
    const updatedTransaction = await CurrencyExchangeTransactionDataModel.findByIdAndUpdate(
      id,
      {
        $set: {
          'statusesandlogs.status': 'successful',
          'statusesandlogs.indication': 'The currency exchange has been approved and converted the sent PHP currency into OMSIAPAWASTO',
          'details.amounts.deductions.successfulprocessing.amount': successfulDeductionAmount,
          'details.amounts.deductions.rejectionprocessing.amount': rejectedDeductionAmount || 0,
          'details.amounts.phppurchaseorexchangeamount': phpAmountVerification,
          'details.amounts.omsiapawasamounttorecieve': omsiapAmountVerification
        },
        $push: {
          'statusesandlogs.logs': newStatusLog
        }
      },
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(500).json({ success: false, message: 'Failed to update transaction' });
    }

    // Return success response with formatted date
    return res.status(200).json({
      success: true,
      message: 'Currency exchange transaction approved successfully',
      approvedAt: timestamps.getFormattedDate(),
      transaction: {
        id: updatedTransaction._id,
        status: updatedTransaction.statusesandlogs.status,
        indication: updatedTransaction.statusesandlogs.indication
      }
    });
  } catch (error) {
    console.error('Error approving currency exchange:', error);
    
    // Handle specific error types
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ success: false, message: 'Invalid transaction ID format' });
    }
    
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
    }
    
    return res.status(500).json({ success: false, message: 'Server error while processing approval' });
  }
});

// Reject currency exchange route
Router.post('/rejectcurrencyexchange', async (req, res) => {
  try {
    const {
      id,
      phpAmountVerification,
      omsiapAmountVerification,
      successfulDeductionAmount,
      rejectedDeductionAmount,
      reason
    } = req.body;

    // Validate request data
    if (!id) {
      return res.status(400).json({ success: false, message: 'Transaction ID is required' });
    }

    if (!rejectedDeductionAmount) {
      return res.status(400).json({ success: false, message: 'Rejected deduction amount is required' });
    }
    
    if (!reason || reason.trim() === '') {
      return res.status(400).json({ success: false, message: 'Rejection reason is required' });
    }

    // Find the transaction
    const transaction = await CurrencyExchangeTransactionDataModel.findOne({ _id: id });
    
    // Check if transaction exists
    if (!transaction) {
      return res.status(404).json({ 
        success: false, 
        message: 'Transaction not found' 
      });
    }

    // Check if transaction is already processed
    if (transaction.statusesandlogs.status === 'approved') {
      return res.status(409).json({ 
        success: false, 
        message: 'Transaction has already been approved and cannot be rejected',
        status: 'approved'
      });
    }
    
    if (transaction.statusesandlogs.status === 'rejected') {
      return res.status(409).json({ 
        success: false, 
        message: 'Transaction has already been rejected',
        status: 'rejected'
      });
    }

    // Create new status log entry
    const newStatusLog = {
      date: timestamps.getFormattedDate(),
      type: 'rejection',
      indication: 'negative',
      messages: [{ message: `Transaction rejected: ${reason}` }]
    };

    // Update the transaction with all verification fields and rejection info
    const updatedTransaction = await CurrencyExchangeTransactionDataModel.findByIdAndUpdate(
      id,
      {
        $set: {
          'statusesandlogs.status': 'rejected',
          'statusesandlogs.indication': reason, // Using the rejection reason for the status indication
          'details.amounts.deductions.successfulprocessing.amount': successfulDeductionAmount || 0,
          'details.amounts.deductions.rejectionprocessing.amount': rejectedDeductionAmount,
          'details.amounts.deductions.rejectionprocessing.reasons': reason,
          // Update verification fields if provided
          ...(phpAmountVerification !== undefined ? { 'details.amounts.phppurchaseorexchangeamount': phpAmountVerification } : {}),
          ...(omsiapAmountVerification !== undefined ? { 'details.amounts.omsiapawasamounttorecieve': omsiapAmountVerification } : {})
        },
        $push: {
          'statusesandlogs.logs': newStatusLog
        }
      },
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(500).json({ success: false, message: 'Failed to update transaction' });
    }

    // Return success response with formatted date and transaction details
    return res.status(200).json({
      success: true,
      message: 'Currency exchange transaction has been rejected',
      rejectedAt: timestamps.getFormattedDate(),
      transaction: {
        id: updatedTransaction._id,
        status: updatedTransaction.statusesandlogs.status,
        indication: updatedTransaction.statusesandlogs.indication,
        reason: reason
      }
    });
    
  } catch (error) {
    console.error('Error rejecting currency exchange:', error);
    
    // Handle specific error types
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid transaction ID format' 
      });
    }
    
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while processing rejection' 
    });
  }
});

// Withdrawal route
Router.post('/widthdrawal', async(req, res) => {

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
          number: phoneNumber,
          gcashtransactionrecieptimage: ''
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

// Approve withdrawal route
Router.post("/approvewithdrawal", multerInstances.withdrawals.single('receipt'), async (req, res) => {
  try {
    const { transactionId, successfulProcessingDeduction, intent, phpAmountToReceive } = req.body;
    
    // Validate required fields
    if (!transactionId || !successfulProcessingDeduction) {
      // Delete uploaded file if validation fails
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    // Find the withdrawal transaction
    const withdrawalTransaction = await WidthdrawalTransactionDataModel.findById(transactionId);
    
    if (!withdrawalTransaction) {
      // Delete uploaded file if transaction not found
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      
      return res.status(404).json({
        success: false,
        message: 'Withdrawal transaction not found'
      });
    }
    
    // Check if already processed
    if (withdrawalTransaction.statusesandlogs.status === 'successful' || 
        withdrawalTransaction.statusesandlogs.status === 'rejected') {
      // Delete uploaded file if transaction already processed
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      
      return res.status(409).json({
        success: false,
        message: 'This withdrawal has already been processed'
      });
    }
    
    // Create new log entry
    const formattedDate = timestamps.getFormattedDate();
    const newLogEntry = {
      date: formattedDate,
      type: 'approval',
      indication: 'success',
      messages: [{ message: 'Withdrawal approved and processed' }]
    };
    
    // Update transaction data
    withdrawalTransaction.statusesandlogs.status = 'successful';
    withdrawalTransaction.statusesandlogs.indication = 'The withdrawal has been approved and processed';
    withdrawalTransaction.statusesandlogs.date = formattedDate;
    
    // Add new log entry
    if (!withdrawalTransaction.statusesandlogs.logs) {
      withdrawalTransaction.statusesandlogs.logs = [];
    }
    withdrawalTransaction.statusesandlogs.logs.push(newLogEntry);
    
    // Update deduction amount
    if (!withdrawalTransaction.details.amounts.deductions) {
      withdrawalTransaction.details.amounts.deductions = {};
    }
    
    withdrawalTransaction.details.amounts.deductions.successfulprocessing = {
      amount: parseFloat(successfulProcessingDeduction),
      reasons: 'Withdrawal processing fee'
    };
    
    // Calculate profit
    withdrawalTransaction.details.amounts.profit = parseFloat(successfulProcessingDeduction);
    
    // Update receipt image path if uploaded
    if (req.file) {
      const imageFilename = req.file.filename;
      const relativePath = `/images/withdrawals/${imageFilename}`;
      
      if (!withdrawalTransaction.details.referrence) {
        withdrawalTransaction.details.referrence = {};
      }
      
      withdrawalTransaction.details.referrence.gcashtransactionrecieptimage = relativePath;
    }
    
    // Find the user who made the withdrawal
    const userId = withdrawalTransaction.details.thistransactionismadeby.id;
    const user = await RegistrantDataModel.findById(userId);
    
    if (!user) {
      console.warn(`User with ID ${userId} not found when approving withdrawal ${transactionId}`);
    } else {
      // Update user's withdrawal transactions
      const userWithdrawalIndex = user.credits?.omsiapawas?.transactions?.widthdrawals?.findIndex(
        tx => tx._id.toString() === transactionId.toString() || tx.id === transactionId
      );
      
      if (userWithdrawalIndex !== -1 && userWithdrawalIndex !== undefined) {
        user.credits.omsiapawas.transactions.widthdrawals[userWithdrawalIndex] = withdrawalTransaction;
        await user.save();
      }
    }
    
    // Save the updated transaction
    await withdrawalTransaction.save();
    
    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Withdrawal approved successfully',
      transactionId: withdrawalTransaction._id,
      processingDate: formattedDate
    });
    
  } catch (error) {
    console.error('Error approving withdrawal:', error);
    
    // Delete uploaded file if error occurs
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file after approval failure:', unlinkError);
      }
    }
    
    // Handle specific error types
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction ID format'
      });
    }
    
    // Return error response
    return res.status(500).json({
      success: false,
      message: 'Server error while approving withdrawal',
      error: error.message
    });
  }
});

// Reject withdrawal route
Router.post("/rejectwithdrawal", async (req, res) => {
  try {
    // Extract data from request body
    const { 
      transactionId, 
      rejectionProcessingDeduction, 
      rejectionReason, 
      intent 
    } = req.body;

    console.log("Transaction ID:", transactionId);
    console.log("Rejection Deduction:", rejectionProcessingDeduction);
    console.log("Rejection Reason:", rejectionReason);

    // Validate required fields
    if (!transactionId || !rejectionProcessingDeduction || !rejectionReason) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: transactionId, rejectionProcessingDeduction, and rejectionReason are required'
      });
    }
    
    // Validate that rejection processing deduction is a number
    const deductionAmount = parseFloat(rejectionProcessingDeduction);
    if (isNaN(deductionAmount) || deductionAmount < 0) {
      return res.status(400).json({
        success: false,
        message: 'Rejection processing deduction must be a valid positive number'
      });
    }

    // Find the withdrawal transaction
    const withdrawalTransaction = await WidthdrawalTransactionDataModel.findById(transactionId);
    
    if (!withdrawalTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal transaction not found'
      });
    }

    // Check if already processed
    if (withdrawalTransaction.statusesandlogs.status === 'successful' || 
        withdrawalTransaction.statusesandlogs.status === 'rejected') {
      return res.status(409).json({
        success: false,
        message: 'This withdrawal has already been processed'
      });
    }

    // Get formatted date for logs
    const formattedDate = timestamps.getFormattedDate();
    
    // Create new log entry
    const newLogEntry = {
      date: formattedDate,
      type: 'rejection',
      indication: 'rejected',
      messages: [{ message: rejectionReason }]
    };
    
    // Update transaction data
    withdrawalTransaction.statusesandlogs.status = 'rejected';
    withdrawalTransaction.statusesandlogs.indication = rejectionReason;
    withdrawalTransaction.statusesandlogs.date = formattedDate;
    
    // Add new log entry
    if (!withdrawalTransaction.statusesandlogs.logs) {
      withdrawalTransaction.statusesandlogs.logs = [];
    }
    withdrawalTransaction.statusesandlogs.logs.push(newLogEntry);
    
    // Update deduction amount
    if (!withdrawalTransaction.details.amounts.deductions) {
      withdrawalTransaction.details.amounts.deductions = {};
    }
    
    withdrawalTransaction.details.amounts.deductions.rejectionprocessing = {
      amount: deductionAmount,
      reasons: rejectionReason
    };
    
    // Find the user who made the withdrawal
    const userId = withdrawalTransaction.details.thistransactionismadeby.id;
    const user = await RegistrantDataModel.findById(userId);
    
    if (!user) {
      console.warn(`User with ID ${userId} not found when rejecting withdrawal ${transactionId}`);
    } else {
      // Update user's withdrawal transactions
      const userWithdrawalIndex = user.credits?.omsiapawas?.transactions?.widthdrawals?.findIndex(
        tx => tx._id.toString() === transactionId.toString() || tx.id === transactionId
      );
      
      if (userWithdrawalIndex !== -1 && userWithdrawalIndex !== undefined) {
        user.credits.omsiapawas.transactions.widthdrawals[userWithdrawalIndex] = withdrawalTransaction;
        await user.save();
      }
    }
    
    // Save the updated transaction
    await withdrawalTransaction.save();
    
    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Withdrawal rejected successfully',
      transactionId: withdrawalTransaction._id,
      processingDate: formattedDate
    });
    
  } catch (error) {
    console.error('Error rejecting withdrawal:', error);
    
    // Handle specific error types
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction ID format'
      });
    }
    
    // Return error response
    return res.status(500).json({
      success: false,
      message: 'Server error while rejecting withdrawal',
      error: error.message
    });
  }
});


Router.put('/profile/update', (req, res, next) => {
  // Use multer fields to handle multiple file uploads
  const uploadHandler = multerInstances.documents.fields(documentFields);
  
  // Add timeout handling for large file uploads
  const requestTimeout = setTimeout(() => {
    return res.status(408).json({
      success: false,
      message: 'Request timeout. Please try again with smaller files or a better connection.'
    });
  }, 120000); // 2 minute timeout for file uploads
  
  uploadHandler(req, res, async (err) => {
    // Clear the timeout once handler is executing
    clearTimeout(requestTimeout);
    
    if (err instanceof multer.MulterError) {
      // Specific multer file upload errors
      let errorMessage = 'File upload error';
      
      if (err.code === 'LIMIT_FILE_SIZE') {
        errorMessage = 'File too large. Maximum file size is 5MB.';
      } else if (err.code === 'LIMIT_FILE_COUNT') {
        errorMessage = 'Too many files uploaded. Please try again.';
      } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        errorMessage = `Unexpected file field: ${err.field}. Please use the correct form fields.`;
      } else {
        errorMessage = `${err.message}`;
      }
      
      return res.status(400).json({ 
        success: false, 
        message: errorMessage
      });
    } else if (err) {
      return res.status(400).json({ 
        success: false, 
        message: `Error: ${err.message}` 
      });
    }
    
    try {
      // Validate required fields
      const { firstName, lastName, userId } = req.body;
      
      if (!firstName || !lastName) {
        return res.status(400).json({
          success: false,
          message: 'First name and last name are required'
        });
      }
      
      // Validate userId is provided
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }
      
      // Get current user from database using the provided userId
      const user = await RegistrantDataModel.findById(userId);
      
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      // Optional: Implement additional authorization check if needed
      // For example, check if the requester is allowed to update this user
      // This could be based on a token, API key, or other authentication method
      
      // Process text fields for profile update
      const { middleName, phoneNumber } = req.body;
      
      // Update user profile information
      user.name.firstname = firstName;
      user.name.middlename = middleName !== undefined ? middleName : user.name.middlename;
      user.name.lastname = lastName;
      
      if (phoneNumber) {
        // Basic phone validation
        const phoneRegex = /^\+?[0-9\s\-()]{8,20}$/;
        if (!phoneRegex.test(phoneNumber)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid phone number format'
          });
        }
        user.contact.phonenumber = phoneNumber;
      }
      
      // Process uploaded documents (if any)
      // Initialize personaldata if it doesn't exist
      if (!user.personaldata) {
        user.personaldata = {};
      }
      
      // Initialize government ID and birth certificate structures if they don't exist
      if (!user.personaldata.government_issued_identification) {
        user.personaldata.government_issued_identification = {
          frontphoto: {},
          backphoto: {}
        };
      }
      
      if (!user.personaldata.birthcertificate) {
        user.personaldata.birthcertificate = {
          frontphoto: {},
          backphoto: {}
        };
      }
      
      // Flag to track if any document was uploaded
      let documentUploaded = false;
      
      // Check which files were uploaded in this request
      if (req.files) {
        const formattedDate = timestamps.getFormattedDate();
        
        // Process birth certificate front if uploaded
        if (req.files.birthCertificateFront) {
          documentUploaded = true;
          const file = req.files.birthCertificateFront[0];
          const newFilePath = `/images/documents/${file.filename}`;
          
          // If there was a previous document, mark it for deletion
          if (user.personaldata.birthcertificate && 
              user.personaldata.birthcertificate.frontphoto && 
              user.personaldata.birthcertificate.frontphoto.image) {
            const oldPath = path.join(__dirname, '../../../view/public', user.personaldata.birthcertificate.frontphoto.image);
            removeOldDocument(oldPath);
          }
          
          // Update with new document info
          user.personaldata.birthcertificate.frontphoto = {
            name: 'Birth Certificate (Front)',
            description: 'Front side of birth certificate',
            image: newFilePath,
            uploaddate: formattedDate
          };
        }
        
        // Process birth certificate back if uploaded
        if (req.files.birthCertificateBack) {
          documentUploaded = true;
          const file = req.files.birthCertificateBack[0];
          const newFilePath = `/images/documents/${file.filename}`;
          
          if (user.personaldata.birthcertificate && 
              user.personaldata.birthcertificate.backphoto && 
              user.personaldata.birthcertificate.backphoto.image) {
            const oldPath = path.join(__dirname, '../../../view/public', user.personaldata.birthcertificate.backphoto.image);
            removeOldDocument(oldPath);
          }
          
          user.personaldata.birthcertificate.backphoto = {
            name: 'Birth Certificate (Back)',
            description: 'Back side of birth certificate',
            image: newFilePath,
            uploaddate: formattedDate
          };
        }
        
        // Process government ID front if uploaded
        if (req.files.governmentIdFront) {
          documentUploaded = true;
          const file = req.files.governmentIdFront[0];
          const newFilePath = `/images/documents/${file.filename}`;
          
          if (user.personaldata.government_issued_identification && 
              user.personaldata.government_issued_identification.frontphoto && 
              user.personaldata.government_issued_identification.frontphoto.image) {
            const oldPath = path.join(__dirname, '../../../view/public', user.personaldata.government_issued_identification.frontphoto.image);
            removeOldDocument(oldPath);
          }
          
          user.personaldata.government_issued_identification.frontphoto = {
            name: 'Government ID (Front)',
            description: 'Front side of government ID',
            image: newFilePath,
            uploaddate: formattedDate
          };
        }
        
        // Process government ID back if uploaded
        if (req.files.governmentIdBack) {
          documentUploaded = true;
          const file = req.files.governmentIdBack[0];
          const newFilePath = `/images/documents/${file.filename}`;
          
          if (user.personaldata.government_issued_identification && 
              user.personaldata.government_issued_identification.backphoto && 
              user.personaldata.government_issued_identification.backphoto.image) {
            const oldPath = path.join(__dirname, '../../../view/public', user.personaldata.government_issued_identification.backphoto.image);
            removeOldDocument(oldPath);
          }
          
          user.personaldata.government_issued_identification.backphoto = {
            name: 'Government ID (Back)',
            description: 'Back side of government ID',
            image: newFilePath,
            uploaddate: formattedDate
          };
        }
      }

      // Check if any documents were specifically removed
      try {
        const documentsToRemove = req.body.removedDocuments 
          ? JSON.parse(req.body.removedDocuments) 
          : [];
          
        if (documentsToRemove.length > 0) {
          documentsToRemove.forEach(docField => {
            // Handle government ID removal
            if (docField === 'governmentIdFront' && 
                user.personaldata.government_issued_identification && 
                user.personaldata.government_issued_identification.frontphoto && 
                user.personaldata.government_issued_identification.frontphoto.image) {
              const oldPath = path.join(__dirname, '../../../view/public', user.personaldata.government_issued_identification.frontphoto.image);
              removeOldDocument(oldPath);
              user.personaldata.government_issued_identification.frontphoto = {};
            }
            
            if (docField === 'governmentIdBack' && 
                user.personaldata.government_issued_identification && 
                user.personaldata.government_issued_identification.backphoto && 
                user.personaldata.government_issued_identification.backphoto.image) {
              const oldPath = path.join(__dirname, '../../../view/public', user.personaldata.government_issued_identification.backphoto.image);
              removeOldDocument(oldPath);
              user.personaldata.government_issued_identification.backphoto = {};
            }
            
            // Handle birth certificate removal
            if (docField === 'birthCertificateFront' && 
                user.personaldata.birthcertificate && 
                user.personaldata.birthcertificate.frontphoto && 
                user.personaldata.birthcertificate.frontphoto.image) {
              const oldPath = path.join(__dirname, '../../../view/public', user.personaldata.birthcertificate.frontphoto.image);
              removeOldDocument(oldPath);
              user.personaldata.birthcertificate.frontphoto = {};
            }
            
            if (docField === 'birthCertificateBack' && 
                user.personaldata.birthcertificate && 
                user.personaldata.birthcertificate.backphoto && 
                user.personaldata.birthcertificate.backphoto.image) {
              const oldPath = path.join(__dirname, '../../../view/public', user.personaldata.birthcertificate.backphoto.image);
              removeOldDocument(oldPath);
              user.personaldata.birthcertificate.backphoto = {};
            }
          });
        }
      } catch (parseError) {
        console.error('Error parsing removedDocuments:', parseError);
        // Continue execution even if there's an error parsing removedDocuments
      }
      
      // Update registration status indication if documents were uploaded
      if (documentUploaded) {
        // Initialize registrationstatusesandlogs if it doesn't exist
        if (!user.registrationstatusesandlogs) {
          user.registrationstatusesandlogs = {
            type: "registration",
            indication: "Pending Documents",
            deviceloginstatus: user.registrationstatusesandlogs?.deviceloginstatus || "active",
            registrationlog: []
          };
        } else {
          // Update the indication only
          user.registrationstatusesandlogs.indication = "Pending Documents";
        }
        
        // Add a new log entry for this status change
        const logEntry = {
          date: timestamps.getFormattedDate(),
          type: "document_upload",
          indication: "Pending Documents",
          messages: [
            { message: "User uploaded new document(s). Verification pending." }
          ]
        };
        
        // Add the log entry to registrationLog array
        if (!user.registrationstatusesandlogs.registrationlog) {
          user.registrationstatusesandlogs.registrationlog = [logEntry];
        } else {
          user.registrationstatusesandlogs.registrationlog.push(logEntry);
        }
      }
      
      // Save the updated user profile
      await user.save();
      
      // Prepare document information for response
      const documentInfo = {
        governmentIdFront: user.personaldata.government_issued_identification?.frontphoto?.image || null,
        governmentIdBack: user.personaldata.government_issued_identification?.backphoto?.image || null,
        birthCertificateFront: user.personaldata.birthcertificate?.frontphoto?.image || null,
        birthCertificateBack: user.personaldata.birthcertificate?.backphoto?.image || null
      };
      
      // Return success response
      return res.status(200).json({
        success: true,
        message: documentUploaded ? 
          'Profile updated successfully. Document verification pending.' : 
          'Profile updated successfully',
        data: {
          firstName: user.name.firstname,
          middleName: user.name.middlename,
          lastName: user.name.lastname,
          phoneNumber: user.contact.phonenumber,
          documents: documentInfo,
          registrationStatus: user.registrationstatusesandlogs?.indication || null
        }
      });
      
    } catch (error) {
      console.error('Profile update error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while updating profile. Please try again later.'
      });
    }
  });
});


Router.post('/verifymfatipregistrant', async (req, res) => {
  try {
    const { id } = req.body;
    
    // Validate input
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Registrant ID is required'
      });
    }
    
    // Find the registrant
    const user = await RegistrantDataModel.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Registrant not found'
      });
    }
    
    // Check if already verified
    if (user.registrationstatusesandlogs.indication === 'Verified') {
      return res.status(409).json({
        success: false,
        message: 'Registrant is already verified'
      });
    }
    
    // Create verification log entry using custom timestamps
    const verificationLogEntry = {
      date: timestamps.getFormattedDate(),
      type: 'verification',
      indication: 'Verified',
      messages: [{
        message: 'Account verified by administrator'
      }]
    };
    
    // Update registrant status
    const updatedUser = await RegistrantDataModel.findByIdAndUpdate(
      id,
      {
        $set: {
          'registrationstatusesandlogs.indication': 'Verified',
          'registrationstatusesandlogs.type': 'Month Financial Allocation To Individual People ( MFATIP )'
        },
        $push: {
          'registrationstatusesandlogs.registrationlog': verificationLogEntry
        }
      },
      { 
        new: true, // Return updated document
        runValidators: true // Run schema validators
      }
    );
    
    if (!updatedUser) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update registrant status'
      });
    }
    
    // Success response
    res.status(200).json({
      success: true,
      message: 'Registrant verified successfully',
      registrant: {
        _id: updatedUser._id,
        registrationstatusesandlogs: updatedUser.registrationstatusesandlogs,
        name: updatedUser.name
      }
    });
    
  } catch (error) {
    console.error('Error verifying MFATIP registrant:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid registrant ID format'
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + error.message
      });
    }
    
    // Generic server error
    res.status(500).json({
      success: false,
      message: 'Internal server error occurred while verifying registrant'
    });
  }
});

// Backend: /rejectmfatipregistrant route
Router.post('/rejectmfatipregistrant', async (req, res) => {
  try {
    const { id } = req.body;
    
    // Validate input
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Registrant ID is required'
      });
    }
    
    // Find the registrant
    const user = await RegistrantDataModel.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Registrant not found'
      });
    }
    
    // Check if already rejected
    if (user.registrationstatusesandlogs.indication === 'Rejected') {
      return res.status(409).json({
        success: false,
        message: 'Registrant is already rejected'
      });
    }
    
    // Create rejection log entry using custom timestamps
    const rejectionLogEntry = {
      date: timestamps.getFormattedDate(),
      type: 'rejection',
      indication: 'Rejected',
      messages: [{
        message: 'Account rejected by administrator'
      }]
    };
    
    // Update registrant status
    const updatedUser = await RegistrantDataModel.findByIdAndUpdate(
      id,
      {
        $set: {
          'registrationstatusesandlogs.indication': 'Rejected Documents',
          'registrationstatusesandlogs.type': 'Month Financial Allocation To Individual People ( MFATIP )'
        },
        $push: {
          'registrationstatusesandlogs.registrationlog': rejectionLogEntry
        }
      },
      { 
        new: true, // Return updated document
        runValidators: true // Run schema validators
      }
    );
    
    if (!updatedUser) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update registrant status'
      });
    }
    
    // Success response
    res.status(200).json({
      success: true,
      message: 'Registrant rejected successfully',
      registrant: {
        _id: updatedUser._id,
        registrationstatusesandlogs: updatedUser.registrationstatusesandlogs,
        name: updatedUser.name
      }
    });
    
  } catch (error) {
    console.error('Error rejecting MFATIP registrant:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid registrant ID format'
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + error.message
      });
    }
    
    // Generic server error
    res.status(500).json({
      success: false,
      message: 'Internal server error occurred while rejecting registrant'
    });
  }
});

module.exports = Router;