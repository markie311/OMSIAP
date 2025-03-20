const express = require('express');
const Router = require('express').Router();

const mongoose = require('mongoose');
const Decimal128 = mongoose.Types.Decimal128;

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const mongodb = require('../../lib/mongodb/database.js');

const omsiapdatascheme = require('../../models/omsiap/omsiapdatascheme.js');
const productdatascheme = require('../../models/products/productsdatascheme.js')

// Configure multer storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // Create a path from the server directory to the React app's public folder
    const uploadDir = path.join(__dirname, '../../../view/public/images/market/products');
    
    // Ensure the directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    // Get the product name from the request body
    const productName = req.body.name || 'product';
    
    // Clean the product name to make it filename-friendly
    const cleanProductName = productName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '') // Remove special characters
      .trim();
    
    // Get the file count to determine image number
    const fileCount = req.fileCount = (req.fileCount || 0) + 1;
    
    // Create filename in format: productname-image1.jpg
    const filename = `${cleanProductName}-image${fileCount}${path.extname(file.originalname)}`;
    
    cb(null, filename);
  }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Initialize multer upload
const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});


Router.route("/addproduct").post(upload.array('images', 10), async (req, res) => {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb+srv://ofmackysinkandpaper:38NJaxXX2AF9Mpmp@cluster0.djai0.mongodb.net/omsiap", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'omsiap',
      autoCreate: false
    });

    // Check if database info exists
    const OmsiapData = mongoose.model('datas', omsiapdatascheme);
    const omsiapdata = await OmsiapData.findById("Code-113-1143");
    
    if (!omsiapdata) {
      return res.status(404).json({ message: "Data not found" });
    }

    // Parse specifications and features as simple string arrays
    let specifications = [];
    let features = [];
    
    try {
      if (req.body.specifications) {
        specifications = JSON.parse(req.body.specifications);
        // Convert each string to specification object format required by schema
        specifications = specifications.map(spec => ({ name: spec }));
      }
      
      if (req.body.features) {
        features = JSON.parse(req.body.features);
        // Convert each string to feature object format required by schema
        features = features.map(feature => ({ name: feature }));
      }
    } catch (error) {
      return res.status(400).json({ 
        message: "Invalid specifications or features format",
        error: error.message
      });
    }

    // Process uploaded images
    const imageFiles = req.files || [];
    
    // Convert image paths to objects with 'url' property
    const images = imageFiles.map(file => ({ url: file.path }));
    
    // Create product ID
    const productId = `PROD-${uuidv4().substring(0, 8)}`;
    
    // Create product object (but don't save it as a separate document)
    const newProduct = {
      id: productId,
      name: req.body.name,
      price: parseFloat(req.body.price) || 0,
      category: req.body.category,
      description: req.body.description,
      weightingrams: parseFloat(req.body.weightingrams) || 0,
      images: images,
      stock: parseFloat(req.body.stock) || 0,
      rating: 0,
      reviews: 0,
      specifications: specifications,
      videoUrl: req.body.videoUrl || "",
      features: features,
      warranty: req.body.warranty || "",
      quantity: parseFloat(req.body.quantity) || 1,
      focuseddata: {
        price: {
          price: parseFloat(req.body.price) || 0,
          capital: parseFloat(req.body.capital) || 0,
          transactiongiveaway: parseFloat(req.body.transactiongiveaway) || 0,
          omsiapprofit: parseFloat(req.body.omsiapprofit) || 0
        }
      },
      orderdetails: {
        quantity: parseFloat(req.body.quantity) || 1,
        product: {
          price: parseFloat(req.body.price) || 0,
          capital: parseFloat(req.body.capital) || 0,
          transactiongiveaway: parseFloat(req.body.transactiongiveaway) || 0,
          omsiapprofit: parseFloat(req.body.omsiapprofit) || 0
        },
        shipment: {
          totalkilos: parseFloat(req.body.weightingrams) / 1000 || 0,
          totalshipmentfee: parseFloat(req.body.shipmentfee) || 0
        }
      }
    };
    
    // Update OMSIAP data to include the new product
    await OmsiapData.updateOne(
      { _id: "Code-113-1143" },
      { $push: { products: newProduct } }
    );
    
    // Return success response
    res.status(201).json({
      message: "Product added successfully",
      productId: productId
    });
    
  } catch (error) {
    console.warn("Error adding product:", error);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message
    });
  }
});

Router.route("/getproducttobeviewed").post(async(req, res) => {

  try {
    const id = req.body.id;
    
    await mongodb.connect("mongodb+srv://ofmackysinkandpaper:38NJaxXX2AF9Mpmp@cluster0.djai0.mongodb.net/omsiap", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'omsiap',
      autoCreate: false
    });
    
    const OmsiapData = mongoose.model('datas', omsiapdatascheme);
    
    // Find the document that contains your products
    const omsiapdata = await OmsiapData.findById("Code-113-1143");
  
    
    if (!omsiapdata) {
      return res.status(404).json({ message: "Database not found" });
    }
    
    // Find the product with the matching _id or id
    let product = null;
    
    // Try to find by ObjectId if it's a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = omsiapdata.products.find(product => 
        product._id.toString() === id
      );
    }
    
    // If not found by ObjectId, try to find by the id field
    if (!product) {
      product = omsiapdata.products.find(product => product.id === id);
    }
    
    if (product) {
      return res.status(200).json({ message: "Product found", data: product });
    } else {
      return res.status(200).json({ message: "Product not found" });
    }
    
  } catch(err) {
    console.error("Error fetching product:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

Router.route("/getproducttobeupdated").post(async(req, res) => {
  try {
    const id = req.body.id;
    
    await mongodb.connect("mongodb+srv://ofmackysinkandpaper:38NJaxXX2AF9Mpmp@cluster0.djai0.mongodb.net/omsiap", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'omsiap',
      autoCreate: false
    });
    
    const OmsiapData = mongoose.model('datas', omsiapdatascheme);
    
    // Find the document that contains your products
    const omsiapdata = await OmsiapData.findById("Code-113-1143");
        
    if (!omsiapdata) {
      return res.status(404).json({ message: "Database not found" });
    }
    
    // Find the product with the matching _id or id
    let product = null;
    
    // Try to find by ObjectId if it's a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = omsiapdata.products.find(product => 
        product._id.toString() === id
      );
    }

    
    // If not found by ObjectId, try to find by the id field
    if (!product) {
      product = omsiapdata.products.find(product => product.id === id);
    }
    
    if (product) {
      return res.status(200).json({ message: "Product found", data: product });
    } else {
      return res.status(200).json({ message: "Product not found" });
    }
    
  } catch(err) {
    console.error("Error fetching product:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

Router.route("/updateproduct").put(upload.array('newImages', 10), async (req, res) => {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb+srv://ofmackysinkandpaper:38NJaxXX2AF9Mpmp@cluster0.djai0.mongodb.net/omsiap", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'omsiap',
      autoCreate: false
    });
    
    // Get the product ID to update
    const productId = req.body.productId;
    
    // Check if database info exists
    const OmsiapData = mongoose.model('datas', omsiapdatascheme);
    const omsiapdata = await OmsiapData.findById("Code-113-1143");
    
    if (!omsiapdata) {
      return res.status(404).json({ message: "Data not found" });
    }
    
    // Find the product in the products array
    const productIndex = omsiapdata.products.findIndex(p => p._id.toString() === productId);
    
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    // Parse the data from form
    const specifications = JSON.parse(req.body.specifications || '[]');
    const features = JSON.parse(req.body.features || '[]');
    const imagesToDelete = JSON.parse(req.body.imagesToDelete || '[]');
    const focuseddata = JSON.parse(req.body.focuseddata || '{}');
    const orderdetails = JSON.parse(req.body.orderdetails || '{}');
    
    // Process new uploaded images
    const newImageFiles = req.files || [];
    const newImages = newImageFiles.map(file => {
      // Extract just the filename from the path and convert to proper format
      const fullPath = file.path;
      const filename = fullPath.split('\\').pop().split('/').pop();
      return { url: `../images/market/products/${filename}` };
    });
    
    // Filter out images to delete
    let currentImages = omsiapdata.products[productIndex].images.filter(img => {
      return !imagesToDelete.some(deleteId => {
        // Check if the deleteId matches the image._id or the image.url
        return img._id.toString() === deleteId || img.url === deleteId;
      });
    });
    
    // Combine with new images
    const updatedImages = [...currentImages, ...newImages];
    
    // Update product data
    omsiapdata.products[productIndex].name = req.body.name;
    omsiapdata.products[productIndex].price = parseFloat(req.body.price) || 0;
    omsiapdata.products[productIndex].stock = parseFloat(req.body.stock) || 0;
    omsiapdata.products[productIndex].category = req.body.category;
    omsiapdata.products[productIndex].weightingrams = parseFloat(req.body.weightingrams) || 0;
    omsiapdata.products[productIndex].description = req.body.description;
    omsiapdata.products[productIndex].warranty = req.body.warranty || "";
    omsiapdata.products[productIndex].videoUrl = req.body.videoUrl || "";
    omsiapdata.products[productIndex].images = updatedImages;
    omsiapdata.products[productIndex].specifications = specifications;
    omsiapdata.products[productIndex].features = features;
    omsiapdata.products[productIndex].focuseddata = focuseddata;
    omsiapdata.products[productIndex].orderdetails = orderdetails;
    
    // Save the updated document
    await omsiapdata.save();
    
    // Return success response
    res.status(200).json({
      message: "Product updated successfully"
    });
    
  } catch (error) {
    console.warn("Error updating product:", error);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message
    });
  }
});

Router.route("/getproducttobedeleted").post(async(req, res) => {

  try {
    const id = req.body.id;
    
    await mongodb.connect("mongodb+srv://ofmackysinkandpaper:38NJaxXX2AF9Mpmp@cluster0.djai0.mongodb.net/omsiap", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'omsiap',
      autoCreate: false
    });
    
    const OmsiapData = mongoose.model('datas', omsiapdatascheme);
    
    // Find the document that contains your products
    const omsiapdata = await OmsiapData.findById("Code-113-1143");
  
    
    if (!omsiapdata) {
      return res.status(404).json({ message: "Database not found" });
    }
    
    // Find the product with the matching _id or id
    let product = null;
    
    // Try to find by ObjectId if it's a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = omsiapdata.products.find(product => 
        product._id.toString() === id
      );
    }
    
    // If not found by ObjectId, try to find by the id field
    if (!product) {
      product = omsiapdata.products.find(product => product.id === id);
    }
    
    if (product) {
      return res.status(200).json({ message: "Product found", data: product });
    } else {
      return res.status(200).json({ message: "Product not found" });
    }
    
  } catch(err) {
    console.error("Error fetching product:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

Router.route("/deleteproduct").post(async (req, res) => {
  try {
    await mongodb.connect("mongodb+srv://ofmackysinkandpaper:38NJaxXX2AF9Mpmp@cluster0.djai0.mongodb.net/omsiap", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'omsiap',
      autoCreate: false
    });
    
    const OmsiapData = mongoose.model('datas', omsiapdatascheme);
    
    // Get the product ID from the request body
    const productId = req.body.id;
    
    // Find the document that contains your products
    const omsiapdata = await OmsiapData.findById("Code-113-1143");
    
    if (!omsiapdata) {
      return res.status(404).json({ success: false, message: "OMSIAP data not found" });
    }
    
    // Filter out the product with the matching ID
    omsiapdata.products = omsiapdata.products.filter(product => product.id !== productId);
    
    // Save the updated document
    await omsiapdata.save();
    
    return res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// Helper function to create a transaction record
function createTransactionRecord(orderData) {
  const transactionId = generateTransactionId();
  
  return {
    id: transactionId,
    date: new Date().toISOString(),
    type: "purchase",
    status: "completed",
    amount: parseFloat(orderData.paymentInfo.amount),
    paymentmethod: orderData.paymentInfo.method,
    details: {
      products: orderData.products.map(product => ({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        quantity: parseInt(product.quantity, 10)
      })),
      shippingInfo: {
        address: orderData.personalInfo.address,
        city: orderData.personalInfo.city,
        state: orderData.personalInfo.state,
        zipCode: orderData.personalInfo.zipCode,
        country: orderData.personalInfo.country
      },
      orderSummary: {
        merchandiseTotal: parseFloat(orderData.orderSummary.merchandiseTotal),
        shippingTotal: parseFloat(orderData.orderSummary.shippingTotal),
        totalTransactionGiveaway: parseFloat(orderData.orderSummary.totalTransactionGiveaway),
        totalOmsiaProfit: parseFloat(orderData.orderSummary.totalOmsiaProfit),
        totalCapital: parseFloat(orderData.orderSummary.totalCapital),
        totalItems: parseInt(orderData.orderSummary.totalItems, 10),
        totalProducts: parseInt(orderData.orderSummary.totalProducts, 10),
        totalWeightGrams: parseFloat(orderData.orderSummary.totalWeightGrams),
        totalWeightKilos: parseFloat(orderData.orderSummary.totalWeightKilos),
        total: parseFloat(orderData.orderSummary.total)
      }
    }
  };
}

// Helper function to generate a transaction ID
function generateTransactionId() {
  return 'TXN-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}

// Helper function for precise decimal operations
function precise(operation, num1, num2, precision = 10) {
  // Convert to integers by multiplying by 10^precision to avoid floating-point errors
  const factor = Math.pow(10, precision);
  
  // Convert to integers, perform operation, then convert back to decimal
  const intNum1 = Math.round(parseFloat(num1) * factor);
  const intNum2 = Math.round(parseFloat(num2) * factor);
  
  let result;
  switch(operation) {
    case 'add':
      result = (intNum1 + intNum2) / factor;
      break;
    case 'sub':
      result = (intNum1 - intNum2) / factor;
      break;
    case 'mul':
      result = (intNum1 * intNum2) / (factor * factor);
      break;
    case 'div':
      result = (intNum1 / intNum2);
      break;
    default:
      throw new Error('Unknown operation');
  }
  
  return parseFloat(result.toFixed(precision));
}

// Simplified helper functions for common operations
function preciseAdd(num1, num2) {
  return precise('add', num1, num2);
}

function preciseSub(num1, num2) {
  return precise('sub', num1, num2);
}

function preciseMul(num1, num2) {
  return precise('mul', num1, num2);
}

// Helper function to ensure credits structure exists
function ensureCreditsStructure(user) {
  if (!user.credits) {
    user.credits = {};
  }
  
  if (!user.credits.omsiapawasto) {
    user.credits.omsiapawasto = {
      amount: 0,
      transactions: {
        successful_deposits: [],
        successful_withdrawals: [],
        failed_deposits: [],
        failed_withdrawals: []
      }
    };
  }
  
  if (!user.credits.omsiapawasto.transactions) {
    user.credits.omsiapawasto.transactions = {
      successful_deposits: [],
      successful_withdrawals: [],
      failed_deposits: [],
      failed_withdrawals: []
    };
  }
  
  // Ensure amount is a number
  user.credits.omsiapawasto.amount = parseFloat(user.credits.omsiapawasto.amount || 0);
  
  return user;
}

// Helper function to create a deposit record
function createDepositRecord(type, amount) {
  return {
    id: 'DEP-' + type + '-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    type: type,
    amount: parseFloat(amount),
    timestamp: new Date(),
    status: "completed"
  };
}

function distributeTransactionGiveaway(omsiapdata, currentRegistrant, totalGiveaway) {
  
  // Ensure data structures exist
  ensureCreditsStructure(currentRegistrant);
  
  // Ensure totalGiveaway is a properly parsed float
  totalGiveaway = parseFloat(totalGiveaway);
  
  if (isNaN(totalGiveaway) || totalGiveaway <= 0) {
    console.log("Invalid giveaway amount:", totalGiveaway);
    return; // Skip distribution for invalid amounts
  }
  
  // 60% goes to the current registrant - using precise multiplication
  const currentRegistrantShare = preciseMul(totalGiveaway, 0.6);
  
  // Update current registrant's omsiapawasto amount with precise addition
  currentRegistrant.credits.omsiapawasto.amount = preciseAdd(
    currentRegistrant.credits.omsiapawasto.amount, 
    currentRegistrantShare
  );
  
  // Add to successful deposits
  const deposit = createDepositRecord("order_reward", currentRegistrantShare);
  currentRegistrant.credits.omsiapawasto.transactions.successful_deposits.push(deposit);
  
  // 40% for distribution based on registrant status type
  const distributionShare = preciseMul(totalGiveaway, 0.4);
  
  // Determine which users to distribute to based on the registrant's status type
  const registrantStatusType = currentRegistrant.status.type;
  
  // Define eligible recipients based on registrant status
  let eligibleRecipients = [];
  
  if (registrantStatusType === "MFATIP") {
    // Distribute to Public and Private citizens
    eligibleRecipients = omsiapdata.people.filter(user => 
      user.status.type === "Public citizen" || user.status.type === "Private citizen"
    );
  } else if (registrantStatusType === "Public citizen") {
    // Distribute only to Private citizens
    eligibleRecipients = omsiapdata.people.filter(user => 
      user.status.type === "Private citizen"
    );
  } else if (registrantStatusType === "Private citizen") {
    // Distribute only to Private citizens
    eligibleRecipients = omsiapdata.people.filter(user => 
      user.status.type === "Private citizen"
    );
  } else {
    // Unknown status type, default to all users
    console.log("Unknown registrant status type:", registrantStatusType);
    eligibleRecipients = omsiapdata.people;
  }
  
  // Check if there are eligible recipients
  if (eligibleRecipients.length === 0) {
    console.log("No eligible recipients found for distribution");
    // Store the funds for future distribution
    omsiapdata.pendingfunds = preciseAdd(omsiapdata.pendingfunds || 0, distributionShare);
    return;
  }
  
  // Calculate per-user share
  const perUserShare = preciseMul(distributionShare, 1/eligibleRecipients.length);
  
  // Check if the amount per user meets the minimum threshold (1)
  if (perUserShare >= 1) {
    // If each user gets at least 1, distribute to eligible recipients
    distributeToEligibleUsers(eligibleRecipients, distributionShare);
  } else {
    // Otherwise, add to pending funds for future distribution
    omsiapdata.pendingfunds = preciseAdd(omsiapdata.pendingfunds || 0, distributionShare);
    console.log(`Added ${distributionShare} to pending funds. New total: ${omsiapdata.pendingfunds}`);
  }
}

// Helper function to distribute funds to eligible users
function distributeToEligibleUsers(eligibleUsers, totalAmount) {
  // Get total eligible users count
  const totalUsers = eligibleUsers.length;
  
  if (totalUsers === 0) {
    console.log("No eligible users found to distribute funds to");
    return;
  }
  
  // Calculate per-user share with high precision
  let perUserShare = preciseMul(totalAmount, 1/totalUsers);
  
  // Track the total actually distributed to ensure no money is lost
  let totalDistributed = 0;
  
  // Distribute to all eligible users except the last one
  for (let i = 0; i < eligibleUsers.length - 1; i++) {
    let user = eligibleUsers[i];
    
    // Ensure credits structure exists
    ensureCreditsStructure(user);
    
    // Update user's balance with precise addition
    user.credits.omsiapawasto.amount = preciseAdd(
      user.credits.omsiapawasto.amount, 
      perUserShare
    );
    
    // Track the running total of distributions
    totalDistributed = preciseAdd(totalDistributed, perUserShare);
    
    // Add to successful deposits for each user
    const userDeposit = createDepositRecord("community_share", perUserShare);
    user.credits.omsiapawasto.transactions.successful_deposits.push(userDeposit);
  }
  
  // For the last user, add the remainder to ensure the total is exactly correct
  // This prevents any tiny fractions from being lost in the distribution
  if (eligibleUsers.length > 0) {
    let lastUser = eligibleUsers[eligibleUsers.length - 1];
    
    // Ensure credits structure exists
    ensureCreditsStructure(lastUser);
    
    let lastUserShare = preciseSub(totalAmount, totalDistributed);
    
    // Update last user's balance with precise addition
    lastUser.credits.omsiapawasto.amount = preciseAdd(
      lastUser.credits.omsiapawasto.amount, 
      lastUserShare
    );
    
    // Add to successful deposits for the last user
    const lastUserDeposit = createDepositRecord("community_share", lastUserShare);
    lastUser.credits.omsiapawasto.transactions.successful_deposits.push(lastUserDeposit);
  }
  
  console.log(`Distributed ${totalAmount} to eligible users. Each received approximately ${perUserShare}`);
}

// Helper function to check and distribute pending funds if threshold is met
function checkAndDistributePendingFunds(omsiapdata, currentRegistrant) {
  // Ensure pendingfunds exists and is a number
  omsiapdata.pendingfunds = parseFloat(omsiapdata.pendingfunds || 0);
  
  // Determine which users to distribute to based on the registrant's status type
  const registrantStatusType = currentRegistrant.status.type;
  
  // Define eligible recipients based on registrant status
  let eligibleRecipients = [];
  
  if (registrantStatusType === "MFATIP") {
    // Distribute to Public and Private citizens
    eligibleRecipients = omsiapdata.people.filter(user => 
      user.status.type === "Public citizen" || user.status.type === "Private citizen"
    );
  } else if (registrantStatusType === "Public citizen") {
    // Distribute only to Private citizens
    eligibleRecipients = omsiapdata.people.filter(user => 
      user.status.type === "Private citizen"
    );
  } else if (registrantStatusType === "Private citizen") {
    // Distribute only to Private citizens
    eligibleRecipients = omsiapdata.people.filter(user => 
      user.status.type === "Private citizen"
    );
  } else {
    // Unknown status type, default to all users
    console.log("Unknown registrant status type:", registrantStatusType);
    eligibleRecipients = omsiapdata.people;
  }
  
  if (eligibleRecipients.length === 0) {
    console.log("No eligible recipients found to distribute pending funds to");
    return;
  }
  
  // Calculate the per-user amount if we were to distribute pending funds
  const perUserAmount = preciseMul(omsiapdata.pendingfunds, 1/eligibleRecipients.length);
  
  // Only distribute if each user would receive at least 1
  if (perUserAmount >= 1) {
    console.log(`Pending funds can now be distributed. Amount per user: ${perUserAmount}`);
    
    // Distribute the pending funds
    const amountToDistribute = omsiapdata.pendingfunds;
    distributeToEligibleUsers(eligibleRecipients, amountToDistribute);
    
    // Reset pending funds to zero
    omsiapdata.pendingfunds = 0;
  } else {
    console.log(`Pending funds (${omsiapdata.pendingfunds}) not yet sufficient to distribute. Need ${eligibleRecipients.length} to give 1 to each eligible user.`);
  }
}

// Helper function to distribute funds to all users
function distributeToAllUsers(omsiapdata, totalAmount) {
  // Get total users count
  const totalUsers = omsiapdata.people.length;
  
  if (totalUsers === 0) {
    console.log("No users found to distribute funds to");
    return;
  }
  
  // Calculate per-user share with high precision
  let perUserShare = preciseMul(totalAmount, 1/totalUsers);
  
  // Track the total actually distributed to ensure no money is lost
  let totalDistributed = 0;
  
  // Distribute to all users except the last one
  for (let i = 0; i < omsiapdata.people.length - 1; i++) {
    let user = omsiapdata.people[i];
    
    // Ensure credits structure exists
    ensureCreditsStructure(user);
    
    // Update user's balance with precise addition
    user.credits.omsiapawasto.amount = preciseAdd(
      user.credits.omsiapawasto.amount, 
      perUserShare
    );
    
    // Track the running total of distributions
    totalDistributed = preciseAdd(totalDistributed, perUserShare);
    
    // Add to successful deposits for each user
    const userDeposit = createDepositRecord("community_share", perUserShare);
    user.credits.omsiapawasto.transactions.successful_deposits.push(userDeposit);
  }
  
  // For the last user, add the remainder to ensure the total is exactly correct
  // This prevents any tiny fractions from being lost in the distribution
  if (omsiapdata.people.length > 0) {
    let lastUser = omsiapdata.people[omsiapdata.people.length - 1];
    
    // Ensure credits structure exists
    ensureCreditsStructure(lastUser);
    
    let lastUserShare = preciseSub(totalAmount, totalDistributed);
    
    // Update last user's balance with precise addition
    lastUser.credits.omsiapawasto.amount = preciseAdd(
      lastUser.credits.omsiapawasto.amount, 
      lastUserShare
    );
    
    // Add to successful deposits for the last user
    const lastUserDeposit = createDepositRecord("community_share", lastUserShare);
    lastUser.credits.omsiapawasto.transactions.successful_deposits.push(lastUserDeposit);
  }
  
  console.log(`Distributed ${totalAmount} to all users. Each received approximately ${perUserShare}`);
}

// Helper function to check and distribute pending funds if threshold is met
function checkAndDistributePendingFunds(omsiapdata) {
  // Ensure pendingfunds exists and is a number
  omsiapdata.pendingfunds = parseFloat(omsiapdata.pendingfunds || 0);
  
  // Calculate the per-user amount if we were to distribute pending funds
  const totalUsers = omsiapdata.people.length;
  
  if (totalUsers === 0) {
    console.log("No users found to distribute pending funds to");
    return;
  }
  
  const perUserAmount = preciseMul(omsiapdata.pendingfunds, 1/totalUsers);
  
  // Only distribute if each user would receive at least 1
  if (perUserAmount >= 1) {
    console.log(`Pending funds can now be distributed. Amount per user: ${perUserAmount}`);
    
    // Distribute the pending funds
    const amountToDistribute = omsiapdata.pendingfunds;
    distributeToAllUsers(omsiapdata, amountToDistribute);
    
    // Reset pending funds to zero
    omsiapdata.pendingfunds = 0;
  } else {
    console.log(`Pending funds (${omsiapdata.pendingfunds}) not yet sufficient to distribute. Need ${totalUsers} to give 1 to each user.`);
  }
}

// Main function to process the order
async function processOrder(req, res) {
  try {
    // Validate input
    if (!req.body || !req.body.$order) {
      return res.status(400).json({ error: "Invalid order data" });
    }
    
    const orderData = req.body.$order;
    
    // Validate required fields
    if (!orderData.registrantid || !orderData.products || !orderData.personalInfo || 
        !orderData.paymentInfo || !orderData.orderSummary) {
      return res.status(400).json({ error: "Missing required order information" });
    }

    // Log order data for debugging
    console.log("Registrant id:", orderData.registrantid);
    console.log("Products:", orderData.products);
    console.log("Personal info:", orderData.personalInfo);
    console.log("Payment info method:", orderData.paymentInfo.method);
    console.log("Payment info amount:", orderData.paymentInfo.amount);
    console.log("Order summary:", orderData.orderSummary);

    // Connect to MongoDB using the same approach as in the original code
    await mongodb.connect("mongodb+srv://ofmackysinkandpaper:38NJaxXX2AF9Mpmp@cluster0.djai0.mongodb.net/omsiap", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'omsiap',
      autoCreate: false
    });
    
    const OmsiapData = mongoose.model('datas', omsiapdatascheme);
    const omsiapdata = await OmsiapData.findById("Code-113-1143");
    
    if (!omsiapdata) {
      return res.status(404).json({ error: "Database record not found" });
    }
    
    // Find the registrant
    const registrant = omsiapdata.people.find((user) => user.id === orderData.registrantid);
    
    // Check if registrant exists
    if (!registrant) {
      console.log("No registrant found with ID:", orderData.registrantid);
      return res.status(404).json({ error: "Registrant not found" });
    }
    
    // (1.) Save the transaction to the user or to the current registrant who is ordering
    const newTransaction = createTransactionRecord(orderData);
    
    // Ensure transactions array exists
    if (!registrant.transactions) {
      registrant.transactions = [];
    }
    
    registrant.transactions.push(newTransaction);
    
    // (2.) Calculate the transaction give away
    // 60% to the current registrant who is ordering and 40% to eligible users based on status type
    const transactionGiveaway = parseFloat(orderData.orderSummary.totalTransactionGiveaway);
    
    if (!isNaN(transactionGiveaway)) {
      if (transactionGiveaway < 0) {
        // If negative, store the new pending funds on omsiapadata.pendingfunds
        omsiapdata.pendingfunds = preciseAdd(omsiapdata.pendingfunds || 0, Math.abs(transactionGiveaway));
      } else {
        // If not negative, process distribution
        distributeTransactionGiveaway(omsiapdata, registrant, transactionGiveaway);
      }
      
      // (5.) Check if accumulated pending funds can be distributed
      checkAndDistributePendingFunds(omsiapdata, registrant);
    } else {
      console.log("Invalid transaction giveaway value:", orderData.orderSummary.totalTransactionGiveaway);
    }
    
    // (6.) Save all changes to the database
    await omsiapdata.save().then(() => {
      console.log("Saved");
    });
    
    return res.status(200).json({ 
      success: true, 
      message: "Order processed successfully",
      transactionId: newTransaction.id
    });
    
  } catch (error) {
    console.error("Error processing order:", error);
    return res.status(500).json({ error: "Failed to process order", details: error.message });
  }
}

// Define the router endpoint using the processOrder function
Router.route("/order").post(processOrder);



module.exports = Router;