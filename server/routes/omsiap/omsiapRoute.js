const express = require('express');
const Router = require('express').Router();

const mongoose = require('mongoose');

const mongodb = require('../../lib/mongodb/database.js');

const omsiapdatascheme = require('../../models/omsiap/omsiapdatascheme.js');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { v4: uuidv4 } = require('uuid');

const timestamps = require('../../lib/timestamps/timestamps');

const bcrypt = require('bcrypt');


Router.route("/getomsiapdata").get( async(req, res)=> {

    try {
        // Connect to MongoDB
        await mongoose.connect("mongodb+srv://ofmackysinkandpaper:38NJaxXX2AF9Mpmp@cluster0.djai0.mongodb.net/omsiap", {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          dbName: 'omsiap',
          autoCreate: false
        });
    
        // Define the model (assuming you have an existing schema)
        const OmsiapData = mongoose.model('datas', omsiapdatascheme);
    
        // Fetch the specific document
        const omsiapdata = await OmsiapData.findById("Code-113-1143");
    
        // Remove passwords from people data
        if (omsiapdata && omsiapdata.people) {
          omsiapdata.people = omsiapdata.people.map(person => {
            const { password, ...personWithoutPassword } = person.toObject();
            return personWithoutPassword;
          });
        }
    
        // Send the processed data
        res.status(200).json(omsiapdata);
    
      } catch (err) {
        console.error('Error fetching OMSIAP data:', err);
        res.status(500).json({ 
          message: 'Error retrieving OMSIAP data', 
          error: err.message 
        });
      }
})


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

// Define paths for different transaction states
const UPLOAD_PATHS = {
  TEMP: path.join(__dirname, '../../../tmp/uploads'),
  PENDING: path.join(__dirname, '../../../view/public/images/currencyexchange/pending'),
  SUCCESSFUL: path.join(__dirname, '../../../view/public/images/currencyexchange/successful'),
  REJECTED: path.join(__dirname, '../../../view/public/images/currencyexchange/rejected'),
  TOTAL: path.join(__dirname, '../../../view/public/images/currencyexchange/total')
};

// Ensure all directories exist
Object.values(UPLOAD_PATHS).forEach(dirPath => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Configure multer storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // Store initially in temporary directory
    cb(null, UPLOAD_PATHS.TEMP);
  },
  filename: function(req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to only accept images
const fileFilter = (req, file, cb) => {
  // Check if file is an image
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

// Helper functions for file management
const fileManager = {
  // Move file from temp to pending directory
  moveToPending: function(tempFilePath) {
    const fileName = path.basename(tempFilePath);
    const targetPath = path.join(UPLOAD_PATHS.PENDING, fileName);
    
    fs.copyFileSync(tempFilePath, targetPath);
    fs.unlinkSync(tempFilePath); // Remove the original file
    
    return `/images/currencyexchange/pending/${fileName}`;

  },
  
  // Move file from pending to successful directory
  moveToSuccessful: function(pendingFilePath) {
    const fileName = path.basename(pendingFilePath);
    const sourcePath = path.join(__dirname, '../../../view/public', pendingFilePath);
    const targetPath = path.join(UPLOAD_PATHS.SUCCESSFUL, fileName);
    
    fs.copyFileSync(sourcePath, targetPath);
    fs.unlinkSync(sourcePath); // Remove from pending
    
    return `/images/currencyexchange/successful/${fileName}`;
  },
  
  // Move file from pending to rejected directory
  moveToRejected: function(pendingFilePath) {
    const fileName = path.basename(pendingFilePath);
    const sourcePath = path.join(__dirname, '../../../view/public', pendingFilePath);
    const targetPath = path.join(UPLOAD_PATHS.REJECTED, fileName);
    
    fs.copyFileSync(sourcePath, targetPath);
    fs.unlinkSync(sourcePath); // Remove from pending
    
    return `/images/currencyexchange/rejected/${fileName}`;
  },
  
  // Move file from pending to total directory
  moveToTotal: function(pendingFilePath) {
    const fileName = path.basename(pendingFilePath);
    const sourcePath = path.join(__dirname, '../../../view/public', pendingFilePath);
    const targetPath = path.join(UPLOAD_PATHS.TOTAL, fileName);
    
    fs.copyFileSync(sourcePath, targetPath);
    fs.unlinkSync(sourcePath); // Remove from pending
    
    return `/images/currencyexchange/total/${fileName}`;
  },
  
  // Delete file from any directory
  deleteFile: function(filePath) {
    try {
      const fullPath = path.join(__dirname, '../../../view/public', filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

};

// Currency Exchange Route
Router.route('/currencyexchange').post(upload.single('transactionImage'), async (req, res) => {

  try {
    // Define the model (only need OmsiapData now)
    const OmsiapData = mongoose.model('datas', omsiapdatascheme);
    
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
    
    // Move file from temp to pending directory
    const imagePath = fileManager.moveToPending(req.file.path);
    
    // Fetch the omsiap document to update
    const omsiapDocument = await OmsiapData.findById("Code-113-1143");
    
    if (!omsiapDocument) {
      // Delete uploaded file
      fileManager.deleteFile(imagePath);
      
      return res.status(404).json({
        success: false,
        status: 'NOT_FOUND',
        message: 'OMSIAP data document not found'
      });
    }
    
    // Check for duplicate reference number in all transaction arrays
    const allTransactions = [
      ...(omsiapDocument.transactions?.currencyexchange?.total || [])
    ];
    
    const duplicateTransaction = allTransactions.find(transaction => 
      transaction.details?.reference?.referencenumber === referenceNumber && 
      transaction.type === 'currency exchange'
    );
    
    if (duplicateTransaction) {
      // Delete uploaded file
      fileManager.deleteFile(imagePath);
      
      return res.status(400).json({
        success: false,
        status: 'DUPLICATE_REFERENCE',
        message: 'This reference number has already been used for another transaction'
      });
    }
    
    // Parse user data
    let userDataObj;

    try {
      userDataObj = typeof transactionmadeby === 'string' 
        ? JSON.parse(transactionmadeby) 
        : transactionmadeby;
    } catch (error) {

      console.error('Error parsing user data:', error);
      
      // Delete uploaded file
      fileManager.deleteFile(imagePath);
      
      return res.status(400).json({
        success: false,
        status: 'INVALID_USER_DATA',
        message: 'Invalid user data format'
      });

    }
    
    // Use the timestamps library for formatted date
    const formattedDate = timestamps.getFormattedDate();
    
    // Create new transaction object
    const newTransaction = {
      id: uuidv4(),
      date: formattedDate,
      type: 'currency exchange',
      amount: exchangeAmountFloat,
      status: 'pending',
      paymentmethod: 'GCASH',
      details: {
        transactionmadeby: userDataObj,
        to: {
          id: "system",
          name: {
            firstname: "OMSIAP",
            middlename: "",
            lastname: "System"
          }
        },
        phpAmount: phpAmountFloat,
        reference: {
          referencenumber: referenceNumber,
          transactionimage: imagePath
        },
        statuses: [
          {
            type: 'pending',
            indication: 'info',
            date: formattedDate,
            message: 'Your exchange request has been submitted and is pending approval.'
          }
        ]
      }
    };
    
    // Initialize arrays if they don't exist
    if (!omsiapDocument.transactions) {
      omsiapDocument.transactions = {};
    }
    
    if (!omsiapDocument.transactions.currencyexchange) {
      omsiapDocument.transactions.currencyexchange = {
        total: [],
        pending: [],
        successful: [],
        rejected: []
      };
    }
    
    // Add transaction directly to the arrays
    omsiapDocument.transactions.currencyexchange.total.push(newTransaction);
    omsiapDocument.transactions.currencyexchange.pending.push(newTransaction);
    
    // Save the updated omsiap document
    await omsiapDocument.save();
    
    // Return success response
    return res.status(200).json({
      success: true,
      status: 'EXCHANGE_PENDING',
      message: 'Your exchange request has been submitted and is pending approval.',
      transaction: {
        id: newTransaction.id,
        date: newTransaction.date,
        amount: newTransaction.amount,
        status: newTransaction.status,
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
    
    return res.status(500).json({
      success: false,
      status: 'SERVER_ERROR',
      message: 'An error occurred while processing your request.'
    });

  }
});

// Route for approving currency exchange requests
Router.route('/acceptcurrencyexchange/accept').post(async (req, res) => {

  try {
    const { id } = req.body; // Get transaction ID from request body
    const OmsiapData = mongoose.model('datas', omsiapdatascheme);
    
    // Fetch the omsiap document
    const omsiapDocument = await OmsiapData.findById("Code-113-1143");
    
    if (!omsiapDocument) {
      return res.status(404).json({
        success: false,
        status: 'NOT_FOUND',
        message: 'OMSIAP data document not found'
      });
    }
    
    // Find the transaction in the pending array
    const pendingTransactionIndex = omsiapDocument.transactions?.currencyexchange?.pending?.findIndex(
      transaction => transaction.id === id
    );
    
    if (pendingTransactionIndex === -1 || pendingTransactionIndex === undefined) {
      return res.status(404).json({
        success: false,
        status: 'TRANSACTION_NOT_FOUND',
        message: 'Transaction not found in pending transactions'
      });
    }
    
    // Get the transaction
    const transaction = omsiapDocument.transactions.currencyexchange.pending[pendingTransactionIndex];
    
    // Update transaction status
    transaction.status = 'successful';
    
    // Add status to the statuses array
    const formattedDate = timestamps.getFormattedDate();
    transaction.details.statuses.push({
      type: 'successful',
      indication: 'success',
      date: formattedDate,
      message: 'Your exchange request has been approved and processed successfully.'
    });
    
    // Move the transaction image to the successful directory
    if (transaction.details.reference.transactionimage) {
      const newImagePath = fileManager.moveToSuccessful(transaction.details.reference.transactionimage);
      transaction.details.reference.transactionimage = newImagePath;
    }
    
    // Move transaction from pending to successful array
    omsiapDocument.transactions.currencyexchange.successful.push(transaction);
    omsiapDocument.transactions.currencyexchange.pending.splice(pendingTransactionIndex, 1);
    
    // Update the status in the total array as well
    const totalTransactionIndex = omsiapDocument.transactions?.currencyexchange?.total?.findIndex(
      totalTransaction => totalTransaction.id === id
    );
    
    if (totalTransactionIndex !== -1 && totalTransactionIndex !== undefined) {
      omsiapDocument.transactions.currencyexchange.total[totalTransactionIndex].status = 'successful';
      
      // Update statuses in total array as well
      omsiapDocument.transactions.currencyexchange.total[totalTransactionIndex].details.statuses.push({
        type: 'successful',
        indication: 'success',
        date: formattedDate,
        message: 'Your exchange request has been approved and processed successfully.'
      });
      
      // Update the image path in total array as well
      if (transaction.details.reference.transactionimage) {
        omsiapDocument.transactions.currencyexchange.total[totalTransactionIndex].details.reference.transactionimage = 
          transaction.details.reference.transactionimage;
      }
    }
    
    // Update funds (if the transaction is being approved, remove from pending funds)
    if (omsiapDocument.pendingfunds !== undefined && transaction.amount) {
      omsiapDocument.pendingfunds -= transaction.amount;
    }
    
    // Save the updated document
    await omsiapDocument.save();
    
    return res.status(200).json({
      success: true,
      status: 'EXCHANGE_APPROVED',
      message: 'Exchange request has been approved successfully.',
      transaction: {
        id: transaction.id,
        date: transaction.date,
        amount: transaction.amount,
        status: transaction.status
      }
    });
    
  } catch (error) {
    console.error('Error approving currency exchange:', error);
    
    return res.status(500).json({
      success: false,
      status: 'SERVER_ERROR',
      message: 'An error occurred while processing your request.'
    });
  }
});


// Route for rejecting currency exchange requests
Router.route('/currencyexchange/reject/:transactionId').post(async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { rejectionReason } = req.body;
    
    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        status: 'MISSING_REASON',
        message: 'Rejection reason is required'
      });
    }
    
    const OmsiapData = mongoose.model('datas', omsiapdatascheme);
    
    // Fetch the omsiap document
    const omsiapDocument = await OmsiapData.findById("Code-113-1143");
    
    if (!omsiapDocument) {
      return res.status(404).json({
        success: false,
        status: 'NOT_FOUND',
        message: 'OMSIAP data document not found'
      });
    }
    
    // Find the transaction in the pending array
    const pendingTransactionIndex = omsiapDocument.transactions?.currencyexchange?.pending?.findIndex(
      transaction => transaction.id === transactionId
    );
    
    if (pendingTransactionIndex === -1 || pendingTransactionIndex === undefined) {
      return res.status(404).json({
        success: false,
        status: 'TRANSACTION_NOT_FOUND',
        message: 'Transaction not found in pending transactions'
      });
    }
    
    // Get the transaction
    const transaction = omsiapDocument.transactions.currencyexchange.pending[pendingTransactionIndex];
    
    // Update transaction status
    transaction.status = 'REJECTED';
    
    // Add status to the statuses array
    const formattedDate = timestamps.getFormattedDate();
    transaction.details.statuses.push({
      type: 'REJECTED',
      indication: 'error',
      date: formattedDate,
      message: `Your exchange request has been rejected: ${rejectionReason}`
    });
    
    // Move the transaction image to the rejected directory
    if (transaction.details.reference.transactionimage) {
      const newImagePath = fileManager.moveToRejected(transaction.details.reference.transactionimage);
      transaction.details.reference.transactionimage = newImagePath;
    }
    
    // Move transaction from pending to rejected array
    omsiapDocument.transactions.currencyexchange.rejected.push(transaction);
    omsiapDocument.transactions.currencyexchange.pending.splice(pendingTransactionIndex, 1);
    
    // Update funds
    if (omsiapDocument.pendingfunds !== undefined) {
      omsiapDocument.pendingfunds -= transaction.amount;
    }
    
    // Save the updated document
    await omsiapDocument.save();
    
    return res.status(200).json({
      success: true,
      status: 'EXCHANGE_REJECTED',
      message: 'Exchange request has been rejected.',
      transaction: {
        id: transaction.id,
        date: transaction.date,
        amount: transaction.amount,
        status: transaction.status
      }
    });
    
  } catch (error) {
    console.error('Error rejecting currency exchange:', error);
    
    return res.status(500).json({
      success: false,
      status: 'SERVER_ERROR',
      message: 'An error occurred while processing your request.'
    });
  }
});





module.exports = Router;