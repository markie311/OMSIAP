const express = require('express');
const Router = require('express').Router();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Decimal128 = mongoose.Types.Decimal128;

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const mongodb = require('../../lib/mongodb/database.js');

const RegistrantDataModel = require('../../models/people/registrantdatascheme.js')
const ProductDataModel = require('../../models/products/productsdatascheme.js')
const MerchandiseTransactionDataModel = require('../../models/transactions/merchandisetransactiondatascheme.js')
const PendingFundsDataModel = require('../../models/pendingfunds/pendingfundsdatascheme.js')

const timestamps = require('../../lib/timestamps/timestamps');

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
    // Generate a unique filename with timestamp and random string
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substr(2, 9);
    const extension = path.extname(file.originalname);
    
    // Create filename based on field name
    let filename;
    if (file.fieldname === 'images') {
      filename = `product-${timestamp}-${randomString}${extension}`;
    } else if (file.fieldname.startsWith('specImages_')) {
      filename = `spec-${timestamp}-${randomString}${extension}`;
    } else {
      filename = `upload-${timestamp}-${randomString}${extension}`;
    }
    
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

// Initialize multer upload with support for any field name
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Get all products route handler
Router.route("/getallproducts").get(async (req, res) => {
  try {
    // Extract query parameters for filtering, sorting, and pagination
    const {
      category,
      minPrice,
      maxPrice,
      producttype,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 50,
      search
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (category) {
      filter['details.category'] = { $regex: category, $options: 'i' };
    }
    
    if (minPrice || maxPrice) {
      filter['details.price.amount'] = {};
      if (minPrice) filter['details.price.amount'].$gte = parseFloat(minPrice);
      if (maxPrice) filter['details.price.amount'].$lte = parseFloat(maxPrice);
    }
    
    if (producttype) {
      filter['authentications.producttype'] = producttype;
    }
    
    if (search) {
      filter.$or = [
        { 'details.productname': { $regex: search, $options: 'i' } },
        { 'details.description': { $regex: search, $options: 'i' } },
        { 'details.category': { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    const validSortFields = ['createdAt', 'details.price.amount', 'details.productname', 'customerfeedback.rating'];
    
    if (validSortFields.includes(sortBy)) {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort['createdAt'] = -1; // Default sort
    }

    // Calculate pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // Cap at 100 items per page
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination info
    const totalProducts = await ProductDataModel.countDocuments(filter);
    
    // Fetch products with filters, sorting, and pagination
    const products = await ProductDataModel
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .select('-system.purchases') // Exclude sensitive purchase data but keep stocks
      .lean(); // Use lean() for better performance

    // Check if products exist
    if (!products || products.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No products found",
        products: [],
        pagination: {
          currentPage: pageNum,
          totalPages: 0,
          totalProducts: 0,
          hasNextPage: false,
          hasPrevPage: false,
          limit: limitNum
        },
        filters: {
          category,
          minPrice,
          maxPrice,
          producttype,
          search
        }
      });
    }

    // Keep original product structure for frontend
    const productsForFrontend = products;

    // Calculate pagination info
    const totalPages = Math.ceil(totalProducts / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    // Return successful response
    res.status(200).json({
      success: true,
      message: `Found ${productsForFrontend.length} products`,
      products: productsForFrontend,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalProducts,
        hasNextPage,
        hasPrevPage,
        limit: limitNum,
        resultsPerPage: productsForFrontend.length
      },
      filters: {
        category,
        minPrice,
        maxPrice,
        producttype,
        search,
        sortBy,
        sortOrder
      }
    });

  } catch (error) {
    console.error("Error fetching products:", error);
    
    // Handle different types of errors
    let statusCode = 500;
    let errorMessage = "Failed to fetch products";
    
    if (error.name === 'CastError') {
      statusCode = 400;
      errorMessage = "Invalid query parameters";
    } else if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      statusCode = 503;
      errorMessage = "Database connection failed";
    } else if (error.name === 'MongooseError') {
      statusCode = 500;
      errorMessage = "Database query failed";
    }
    
    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      products: [],
      error: process.env.NODE_ENV === 'development' ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : undefined
    });
  }
});

// Updated route handler
Router.route("/addproduct").post(upload.any(), async (req, res) => {
  try {
    // Parse the structured product data
    let productData;
    
    try {
      productData = JSON.parse(req.body.productData);
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        message: "Invalid product data format. Must be valid JSON.",
        error: parseError.message
      });
    }

    // Validate required fields from the parsed data
    const { authentications, details } = productData;
    
    if (!details.productname || !details.price.amount || !details.category || !details.description) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: productname, price.amount, category, and description are required"
      });
    }

    // Validate numeric fields
    if (isNaN(details.price.amount) || details.price.amount < 0) {
      return res.status(400).json({
        success: false,
        message: "Price amount must be a valid positive number"
      });
    }

    // Process uploaded files
    const uploadedFiles = req.files || [];
    
    // Separate main product images from specification images
    const mainImages = uploadedFiles
      .filter(file => file.fieldname === 'images')
      .map(file => ({ 
        url: `/images/market/products/${file.filename}` // Store relative path for frontend
      }));

    // Process specification images
    const specImageFiles = uploadedFiles.filter(file => file.fieldname.startsWith('specImages_'));
    const specImagesByIndex = {};
    
    specImageFiles.forEach(file => {
      const matches = file.fieldname.match(/specImages_(\d+)_(\d+)/);
      if (matches) {
        const specIndex = parseInt(matches[1]);
        const imgIndex = parseInt(matches[2]);
        
        if (!specImagesByIndex[specIndex]) {
          specImagesByIndex[specIndex] = [];
        }
        
        specImagesByIndex[specIndex][imgIndex] = { 
          url: `/images/market/products/${file.filename}` // Store relative path
        };
      }
    });

    // Update product data with processed images
    productData.images = mainImages;

    // Update specification images
    if (productData.details.specifications && productData.details.specifications.length > 0) {
      productData.details.specifications.forEach((spec, index) => {
        if (specImagesByIndex[index]) {
          spec.images = specImagesByIndex[index].filter(img => img); // Filter out undefined entries
        }
      });
    }

    // Get the main product shipping cost to ensure it's applied to all specifications
    const mainShippingCost = details.price.shipping || 0;

    // Ensure all required schema fields are present with proper defaults
    const finalProductData = {
      authentications: {
        producttype: authentications.producttype,
        id: authentications.id
      },
      details: {
        productname: details.productname,
        category: details.category,
        description: details.description,
        features: details.features || [],
        weightingrams: details.weightingrams || 0,
        webaddress: details.webaddress || "",
        warranty: details.warranty || "",
        price: {
          amount: details.price.amount,
          capital: details.price.capital || 0,
          shipping: mainShippingCost,
          transactiongiveaway: details.price.transactiongiveaway || 0,
          profit: details.price.profit || 0
        },
        specifications: (details.specifications || []).map(spec => ({
          authentications: {
            producttype: spec.authentications?.producttype || "",
            id: spec.authentications?.id || ""
          },
          details: {
            productname: spec.details?.productname || "",
            category: spec.details?.category || "",
            description: spec.details?.description || "",
            features: spec.details?.features || [],
            weightingrams: spec.details?.weightingrams || 0,
            webaddress: spec.details?.webaddress || details.webaddress || "", // Apply main webaddress to specifications
            warranty: spec.details?.warranty || "",
            for: {
              age: spec.details?.for?.age || "",
              part: spec.details?.for?.part || "",
              gender: spec.details?.for?.gender || "",
              reminder: spec.details?.for?.reminder || ""
            },
            price: {
              amount: spec.details?.price?.amount || 0,
              capital: spec.details?.price?.capital || 0,
              shipping: Number(mainShippingCost), // Apply main product shipping cost to specification
              transactiongiveaway: spec.details?.price?.transactiongiveaway || 0,
              profit: spec.details?.price?.profit || 0
            },
            specifications: []
          },
          images: spec.images || [],
          videos: spec.videos || [],
          customerfeedback: {
            rating: spec.customerfeedback?.rating || 0,
            reviews: spec.customerfeedback?.reviews || 0
          },
          system: {
            stocks: spec.system?.stocks || 0
          }
        }))
      },
      images: productData.images,
      videos: productData.videos || [],
      customerfeedback: {
        rating: productData.customerfeedback?.rating || 0,
        reviews: productData.customerfeedback?.reviews || 0
      },
      system: {
        purchases: {
          total: [],
          pending: [],
          accepted: [],
          rejected: []
        }
      }
    };

    // Save the product to database
    const savedProduct = await ProductDataModel.create(finalProductData);

    if (!savedProduct) {
      return res.status(400).json({
        success: false,
        message: "Failed to add product to database"
      });
    }

    // Return success response
    res.status(201).json({
      success: true,
      message: "Product added successfully",
      productId: authentications.id,
      data: {
        id: authentications.id,
        name: details.productname,
        category: details.category,
        price: details.price.amount,
        shipping: mainShippingCost, // Include shipping cost in response
        images: mainImages.length,
        specifications: details.specifications.length,
        features: details.features.length
      }
    });

  } catch (error) {
    console.error("Error adding product:", error);
    
    // Handle different types of errors
    let statusCode = 500;
    let errorMessage = "Something went wrong while adding the product";
    
    if (error.name === 'ValidationError') {
      statusCode = 400;
      errorMessage = "Product data validation failed: " + error.message;
    } else if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      statusCode = 503;
      errorMessage = "Database operation failed";
    } else if (error.name === 'SyntaxError') {
      statusCode = 400;
      errorMessage = "Invalid JSON format in request";
    } else if (error.code === 11000) {
      statusCode = 409;
      errorMessage = "Product with this ID already exists";
    }
    
    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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

// Updated Helper function to create a transaction record with proper dates
function createTransactionRecord(orderData, registrant) {
  // Generate a unique transaction ID
  const transactionId = generateUniqueTransactionId();
  
  // Get current formatted date
  const currentDate = timestamps.getFormattedDate();
  
  // Process products from the order data
  const productList = orderData.products.map(product => {
    let productRecord;
    
    // If the product already has full details, use them
    if (product.authentications && product.details) {
      productRecord = product;
    } else {
      // Otherwise find full product details for each product in the order
      productRecord = findFullProductDetails(product.id);
    }
    
    // Ensure quantity is set according to the schema location
    productRecord.quantity = product.quantity || 1;
    
    return productRecord;
  });
  
  // Calculate total quantity for the transaction
  const totalQuantity = productList.reduce((total, product) => total + (product.quantity || 0), 0);
  
  // Create the transaction record following the merchandisetransactiondatascheme
  return {
    id: transactionId,
    // DO NOT add _id field - let MongoDB handle it automatically
    date: currentDate, // Add main transaction date
    intent: "Purchase merchandise",
    statusesandlogs: {
      status: "pending",
      indication: "Processing",
      date: currentDate, // Add date to status
      logs: [
        {
          date: currentDate, // Add date to log entry
          type: "Order submitted",
          indication: "Processing",
          messages: [
            { message: "Order received and is being processed" }
          ]
        }
      ]
    },
    details: {
      merchandise: {
        list: productList // Each product in this list now has the quantity field set
      },
      paymentmethod: orderData.paymentInfo.method || "N/A"
    },
    system: {
      thistransactionismadeby: {
        id: registrant._id.toString() || registrant.id,
        name: {
          firstname: registrant.name?.firstname || "",
          middlename: registrant.name?.middlename || "",
          lastname: registrant.name?.lastname || ""
        },
        address: registrant.contact?.address || {
          street: "",
          trademark: "",
          baranggay: "",
          city: "",
          province: "",
          postal_zip_code: "",
          country: ""
        }
      },
      thistransactionismainlyintendedto: {
        id: registrant._id.toString() || registrant.id,
        name: {
          firstname: orderData.personalInfo?.firstName || registrant.name?.firstname || "",
          middlename: orderData.personalInfo?.middleName || registrant.name?.middlename || "",
          lastname: orderData.personalInfo?.lastName || registrant.name?.lastname || ""
        },
        address: {
          street: orderData.personalInfo?.street || "",
          trademark: orderData.personalInfo?.trademark || "",
          baranggay: orderData.personalInfo?.baranggay || "",
          city: orderData.personalInfo?.city || "",
          province: orderData.personalInfo?.province || "",
          postal_zip_code: orderData.personalInfo?.zipCode || "",
          country: orderData.personalInfo?.country || ""
        }
      },
      ordersummary: {
        merchandisetotal: parseFloat(orderData.orderSummary?.merchandiseTotal || 0),
        shippingtotal: parseFloat(orderData.orderSummary?.shippingTotal || 0),
        processingfee: parseFloat(orderData.orderSummary?.paymentProcessingFee || 0),
        totalcapital: parseFloat(orderData.orderSummary?.totalCapital || 0),
        totaltransactiongiveaway: parseFloat(orderData.orderSummary?.totalTransactionGiveaway || 0),
        totalprofit: parseFloat(orderData.orderSummary?.totalOmsiaProfit || 0),
        totalitems: orderData.orderSummary?.totalItems || totalQuantity,
        totalweightgrams: parseFloat(orderData.orderSummary?.totalWeightGrams || 0),
        totalweightkilos: parseFloat(orderData.orderSummary?.totalWeightKilos || 0)
      },
      shippinginfo: {
        street: orderData.personalInfo?.street || "",
        trademark: orderData.personalInfo?.trademark || "",
        baranggay: orderData.personalInfo?.baranggay || "",
        city: orderData.personalInfo?.city || "",
        province: orderData.personalInfo?.province || "",
        zipcode: orderData.personalInfo?.zipCode || "",
        country: orderData.personalInfo?.country || ""
      }
    }
  };
}

// Fixed processOrder function with proper async/await handling
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
    
    // Try to find the registrant by MongoDB ObjectID first
    let registrant;

    try {
      // First try to use it as an ObjectID
      registrant = await RegistrantDataModel.findById(orderData.registrantid);
    } catch (e) {
      // If that fails (not a valid ObjectID), try as a string ID
      console.log("Not a valid ObjectID, trying as string ID");
    }
    
    // If not found by ObjectID, try using the custom id field
    if (!registrant) {
      registrant = await RegistrantDataModel.findOne({ _id: new mongoose.Types.ObjectId(orderData.registrantid) });
    }
    
    // Check if registrant exists
    if (!registrant) {
      console.log("No registrant found with ID:", orderData.registrantid);
      return res.status(404).json({ error: "Registrant not found" });
    }
    
    // Ensure credits structure exists
    registrant = ensureCreditsStructure(registrant);
    
    // Calculate total payment amount
    const totalPayment = calculateTotalPayment(orderData.orderSummary);
    
    // Check if registrant has sufficient balance
    if (registrant.credits.omsiapawas.amount < totalPayment) {
      return res.status(400).json({ 
        error: "Insufficient balance", 
        required: totalPayment,
        available: registrant.credits.omsiapawas.amount
      });
    }
    
    // IMPORTANT: Await the createTransactionRecord function since it's now async
    const newTransaction = await createTransactionRecord(orderData, registrant);
    
    // Save the transaction to the MerchandiseTransaction collection
    const merchandiseTransaction = new MerchandiseTransactionDataModel(newTransaction);
    await merchandiseTransaction.save();
    
    // Ensure the transactions structure exists in the registrant
    if (!registrant.transactions) {
      registrant.transactions = { merchandise: [] };
    }
    if (!registrant.transactions.merchandise) {
      registrant.transactions.merchandise = [];
    }
    
    // Add transaction to registrant's transactions with the actual data (not the Promise)
    registrant.transactions.merchandise.push(newTransaction);
    
    // Deduct the total payment from registrant's omsiapawas amount using precise subtraction
    registrant.credits.omsiapawas.amount = preciseSub(registrant.credits.omsiapawas.amount, totalPayment);
    
    // Save the updated registrant
    await registrant.save();
    
    // Log the transaction and payment deduction
    console.log("Order processed successfully. Product quantities:");
    newTransaction.details.merchandise.list.forEach((product, index) => {
      console.log(`Product ${index + 1}: ID=${product.authentications.id}, Quantity=${product.quantity}`);
    });
    console.log(`Payment deducted: ${totalPayment}, Remaining balance: ${registrant.credits.omsiapawas.amount}`);
    console.log(`Transaction date: ${newTransaction.date}`);
    
    return res.status(200).json({ 
      success: true, 
      message: "Order processed successfully",
      transactionId: newTransaction.id,
      transactionDate: newTransaction.date,
      totalQuantity: newTransaction.details.merchandise.list.reduce((total, product) => total + (product.quantity || 0), 0),
      totalPayment: totalPayment,
      remainingBalance: registrant.credits.omsiapawas.amount
    });
    
  } catch (error) {
    console.error("Error processing order:", error);
    return res.status(500).json({ error: "Failed to process order", details: error.message });
  }
}

// Alternative approach: Make createTransactionRecord synchronous and generateUniqueTransactionId async
function createTransactionRecordSync(orderData, registrant, transactionId) {
  // Get current formatted date
  const currentDate = timestamps.getFormattedDate();
  
  // Process products from the order data
  const productList = orderData.products.map(product => {
    let productRecord;
    
    // If the product already has full details, use them
    if (product.authentications && product.details) {
      productRecord = product;
    } else {
      // Otherwise find full product details for each product in the order
      productRecord = findFullProductDetails(product.id);
    }
    
    // Ensure quantity is set according to the schema location
    productRecord.quantity = product.quantity || 1;
    
    return productRecord;
  });
  
  // Calculate total quantity for the transaction
  const totalQuantity = productList.reduce((total, product) => total + (product.quantity || 0), 0);
  
  // Create the transaction record following the merchandisetransactiondatascheme
  return {
    id: transactionId, // Use the pre-generated transaction ID
    // DO NOT add _id field - let MongoDB handle it automatically
    date: currentDate, // Add main transaction date
    intent: "Purchase merchandise",
    statusesandlogs: {
      status: "pending",
      indication: "Processing",
      date: currentDate, // Add date to status
      logs: [
        {
          date: currentDate, // Add date to log entry
          type: "Order submitted",
          indication: "Processing",
          messages: [
            { message: "Order received and is being processed" }
          ]
        }
      ]
    },
    details: {
      merchandise: {
        list: productList // Each product in this list now has the quantity field set
      },
      paymentmethod: orderData.paymentInfo.method || "N/A"
    },
    system: {
      thistransactionismadeby: {
        id: registrant._id.toString() || registrant.id,
        name: {
          firstname: registrant.name?.firstname || "",
          middlename: registrant.name?.middlename || "",
          lastname: registrant.name?.lastname || ""
        },
        address: registrant.contact?.address || {
          street: "",
          trademark: "",
          baranggay: "",
          city: "",
          province: "",
          postal_zip_code: "",
          country: ""
        }
      },
      thistransactionismainlyintendedto: {
        id: registrant._id.toString() || registrant.id,
        name: {
          firstname: orderData.personalInfo?.firstName || registrant.name?.firstname || "",
          middlename: orderData.personalInfo?.middleName || registrant.name?.middlename || "",
          lastname: orderData.personalInfo?.lastName || registrant.name?.lastname || ""
        },
        address: {
          street: orderData.personalInfo?.street || "",
          trademark: orderData.personalInfo?.trademark || "",
          baranggay: orderData.personalInfo?.baranggay || "",
          city: orderData.personalInfo?.city || "",
          province: orderData.personalInfo?.province || "",
          postal_zip_code: orderData.personalInfo?.zipCode || "",
          country: orderData.personalInfo?.country || ""
        }
      },
      ordersummary: {
        merchandisetotal: parseFloat(orderData.orderSummary?.merchandiseTotal || 0),
        shippingtotal: parseFloat(orderData.orderSummary?.shippingTotal || 0),
        processingfee: parseFloat(orderData.orderSummary?.paymentProcessingFee || 0),
        totalcapital: parseFloat(orderData.orderSummary?.totalCapital || 0),
        totaltransactiongiveaway: parseFloat(orderData.orderSummary?.totalTransactionGiveaway || 0),
        totalprofit: parseFloat(orderData.orderSummary?.totalOmsiaProfit || 0),
        totalitems: orderData.orderSummary?.totalItems || totalQuantity,
        totalweightgrams: parseFloat(orderData.orderSummary?.totalWeightGrams || 0),
        totalweightkilos: parseFloat(orderData.orderSummary?.totalWeightKilos || 0)
      },
      shippinginfo: {
        street: orderData.personalInfo?.street || "",
        trademark: orderData.personalInfo?.trademark || "",
        baranggay: orderData.personalInfo?.baranggay || "",
        city: orderData.personalInfo?.city || "",
        province: orderData.personalInfo?.province || "",
        zipcode: orderData.personalInfo?.zipCode || "",
        country: orderData.personalInfo?.country || ""
      }
    }
  };
}

// Alternative processOrder using the synchronous approach
async function processOrderAlternative(req, res) {
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
    
    // Try to find the registrant by MongoDB ObjectID first
    let registrant;

    try {
      // First try to use it as an ObjectID
      registrant = await RegistrantDataModel.findById(orderData.registrantid);
    } catch (e) {
      // If that fails (not a valid ObjectID), try as a string ID
      console.log("Not a valid ObjectID, trying as string ID");
    }
    
    // If not found by ObjectID, try using the custom id field
    if (!registrant) {
      registrant = await RegistrantDataModel.findOne({ _id: new mongoose.Types.ObjectId(orderData.registrantid) });
    }
    
    // Check if registrant exists
    if (!registrant) {
      console.log("No registrant found with ID:", orderData.registrantid);
      return res.status(404).json({ error: "Registrant not found" });
    }
    
    // Ensure credits structure exists
    registrant = ensureCreditsStructure(registrant);
    
    // Calculate total payment amount
    const totalPayment = calculateTotalPayment(orderData.orderSummary);
    
    // Check if registrant has sufficient balance
    if (registrant.credits.omsiapawas.amount < totalPayment) {
      return res.status(400).json({ 
        error: "Insufficient balance", 
        required: totalPayment,
        available: registrant.credits.omsiapawas.amount
      });
    }
    
    // Generate unique transaction ID first
    const transactionId = await generateUniqueTransactionId();
    
    // Create the transaction record with the generated ID
    const newTransaction = createTransactionRecordSync(orderData, registrant, transactionId);
    
    // Save the transaction to the MerchandiseTransaction collection
    const merchandiseTransaction = new MerchandiseTransactionDataModel(newTransaction);
    await merchandiseTransaction.save();
    
    // Ensure the transactions structure exists in the registrant
    if (!registrant.transactions) {
      registrant.transactions = { merchandise: [] };
    }
    if (!registrant.transactions.merchandise) {
      registrant.transactions.merchandise = [];
    }
    
    // Add transaction to registrant's transactions
    registrant.transactions.merchandise.push(newTransaction);
    
    // Deduct the total payment from registrant's omsiapawas amount using precise subtraction
    registrant.credits.omsiapawas.amount = preciseSub(registrant.credits.omsiapawas.amount, totalPayment);
    
    // Save the updated registrant
    await registrant.save();
    
    // Log the transaction and payment deduction
    console.log("Order processed successfully. Product quantities:");
    newTransaction.details.merchandise.list.forEach((product, index) => {
      console.log(`Product ${index + 1}: ID=${product.authentications.id}, Quantity=${product.quantity}`);
    });
    console.log(`Payment deducted: ${totalPayment}, Remaining balance: ${registrant.credits.omsiapawas.amount}`);
    console.log(`Transaction date: ${newTransaction.date}`);
    
    return res.status(200).json({ 
      success: true, 
      message: "Order processed successfully",
      transactionId: newTransaction.id,
      transactionDate: newTransaction.date,
      totalQuantity: newTransaction.details.merchandise.list.reduce((total, product) => total + (product.quantity || 0), 0),
      totalPayment: totalPayment,
      remainingBalance: registrant.credits.omsiapawas.amount
    });
    
  } catch (error) {
    console.error("Error processing order:", error);
    return res.status(500).json({ error: "Failed to process order", details: error.message });
  }
}

// Helper function to add status log with date
function addTransactionStatusLog(transaction, type, indication, message) {
  const currentDate = timestamps.getFormattedDate();
  
  // Update main status
  transaction.statusesandlogs.status = indication.toLowerCase();
  transaction.statusesandlogs.indication = indication;
  transaction.statusesandlogs.date = currentDate;
  
  // Add to logs array
  transaction.statusesandlogs.logs.push({
    date: currentDate,
    type: type,
    indication: indication,
    messages: [{ message: message }]
  });
  
  return transaction;
}

// Helper function to update transaction status (example usage)
async function updateTransactionStatus(transactionId, newStatus, indication, message) {
  try {
    const transaction = await MerchandiseTransactionDataModel.findOne({ id: transactionId });
    
    if (!transaction) {
      throw new Error("Transaction not found");
    }
    
    // Add status log with current date
    addTransactionStatusLog(transaction, newStatus, indication, message);
    
    // Save updated transaction
    await transaction.save();
    
    // Also update the transaction in the registrant's record
    const registrant = await RegistrantDataModel.findOne({ 
      "transactions.merchandise.id": transactionId 
    });
    
    if (registrant) {
      const transactionIndex = registrant.transactions.merchandise.findIndex(
        t => t.id === transactionId
      );
      
      if (transactionIndex !== -1) {
        registrant.transactions.merchandise[transactionIndex] = transaction.toObject();
        await registrant.save();
      }
    }
    
    return transaction;
    
  } catch (error) {
    console.error("Error updating transaction status:", error);
    throw error;
  }
}

// Enhanced function to generate unique transaction IDs with database check
async function generateUniqueTransactionId() {
  const maxAttempts = 10;
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    // Create a more robust ID with multiple entropy sources
    const timestamp = Date.now();
    const randomPart = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const processId = process.pid || Math.floor(Math.random() * 10000);
    const counter = (global.transactionCounter || 0) + 1;
    
    // Update global counter
    global.transactionCounter = counter;
    
    // Create the transaction ID
    const transactionId = `TXN-${timestamp}-${randomPart}-${processId}-${counter}`;
    
    try {
      // Check if this ID already exists in the database
      const existingTransaction = await MerchandiseTransactionDataModel.findOne({ 
        id: transactionId 
      });
      
      if (!existingTransaction) {
        // ID is unique, return it
        return transactionId;
      }
      
      // If ID exists, increment attempts and try again
      attempts++;
      console.warn(`Transaction ID collision detected: ${transactionId}. Attempt ${attempts}/${maxAttempts}`);
      
      // Add a small delay to avoid rapid collisions
      await new Promise(resolve => setTimeout(resolve, 10));
      
    } catch (error) {
      console.error("Error checking transaction ID uniqueness:", error);
      // If database check fails, still increment attempts to avoid infinite loop
      attempts++;
    }
  }
  
  // If we've exhausted all attempts, throw an error
  throw new Error(`Failed to generate unique transaction ID after ${maxAttempts} attempts`);
}

// Alternative approach using MongoDB's atomic operations
async function generateUniqueTransactionIdWithAtomic() {
  try {
    // Use MongoDB's atomic findOneAndUpdate to create a counter
    const counterDoc = await mongoose.connection.db.collection('counters').findOneAndUpdate(
      { _id: 'transactionId' },
      { $inc: { sequence: 1 } },
      { 
        upsert: true, 
        returnDocument: 'after' 
      }
    );
    
    const sequence = counterDoc.sequence;
    const timestamp = Date.now();
    const randomPart = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    
    return `TXN-${timestamp}-${sequence.toString().padStart(8, '0')}-${randomPart}`;
    
  } catch (error) {
    console.error("Error generating atomic transaction ID:", error);
    // Fallback to the previous method
    return await generateUniqueTransactionId();
  }
}

// Enhanced function using UUID for maximum uniqueness
const crypto = require('crypto');

function generateUniqueTransactionIdWithUUID() {
  // Generate a UUID v4 for maximum uniqueness
  const uuid = crypto.randomUUID();
  const timestamp = Date.now();
  
  // Create a shorter, more readable format while maintaining uniqueness
  const shortUuid = uuid.replace(/-/g, '').substring(0, 12).toUpperCase();
  
  return `TXN-${timestamp}-${shortUuid}`;
}

// Updated createTransactionRecord function with enhanced ID generation
async function createTransactionRecord(orderData, registrant) {
  // Generate a unique transaction ID with database validation
  const transactionId = await generateUniqueTransactionId();
  
  // Get current formatted date
  const currentDate = timestamps.getFormattedDate();
  
  // Process products from the order data
  const productList = orderData.products.map(product => {
    let productRecord;
    
    // If the product already has full details, use them
    if (product.authentications && product.details) {
      productRecord = product;
    } else {
      // Otherwise find full product details for each product in the order
      productRecord = findFullProductDetails(product.id);
    }
    
    // Ensure quantity is set according to the schema location
    productRecord.quantity = product.quantity || 1;
    
    return productRecord;
  });
  
  // Calculate total quantity for the transaction
  const totalQuantity = productList.reduce((total, product) => total + (product.quantity || 0), 0);
  
  // Create the transaction record following the merchandisetransactiondatascheme
  return {
    id: transactionId,
    // DO NOT add _id field - let MongoDB handle it automatically
    date: currentDate, // Add main transaction date
    intent: "Purchase merchandise",
    statusesandlogs: {
      status: "pending",
      indication: "Processing",
      date: currentDate, // Add date to status
      logs: [
        {
          date: currentDate, // Add date to log entry
          type: "Order submitted",
          indication: "Processing",
          messages: [
            { message: "Order received and is being processed" }
          ]
        }
      ]
    },
    details: {
      merchandise: {
        list: productList // Each product in this list now has the quantity field set
      },
      paymentmethod: orderData.paymentInfo.method || "N/A"
    },
    system: {
      thistransactionismadeby: {
        id: registrant._id.toString() || registrant.id,
        name: {
          firstname: registrant.name?.firstname || "",
          middlename: registrant.name?.middlename || "",
          lastname: registrant.name?.lastname || ""
        },
        address: registrant.contact?.address || {
          street: "",
          trademark: "",
          baranggay: "",
          city: "",
          province: "",
          postal_zip_code: "",
          country: ""
        }
      },
      thistransactionismainlyintendedto: {
        id: registrant._id.toString() || registrant.id,
        name: {
          firstname: orderData.personalInfo?.firstName || registrant.name?.firstname || "",
          middlename: orderData.personalInfo?.middleName || registrant.name?.middlename || "",
          lastname: orderData.personalInfo?.lastName || registrant.name?.lastname || ""
        },
        address: {
          street: orderData.personalInfo?.street || "",
          trademark: orderData.personalInfo?.trademark || "",
          baranggay: orderData.personalInfo?.baranggay || "",
          city: orderData.personalInfo?.city || "",
          province: orderData.personalInfo?.province || "",
          postal_zip_code: orderData.personalInfo?.zipCode || "",
          country: orderData.personalInfo?.country || ""
        }
      },
      ordersummary: {
        merchandisetotal: parseFloat(orderData.orderSummary?.merchandiseTotal || 0),
        shippingtotal: parseFloat(orderData.orderSummary?.shippingTotal || 0),
        processingfee: parseFloat(orderData.orderSummary?.paymentProcessingFee || 0),
        totalcapital: parseFloat(orderData.orderSummary?.totalCapital || 0),
        totaltransactiongiveaway: parseFloat(orderData.orderSummary?.totalTransactionGiveaway || 0),
        totalprofit: parseFloat(orderData.orderSummary?.totalOmsiaProfit || 0),
        totalitems: orderData.orderSummary?.totalItems || totalQuantity,
        totalweightgrams: parseFloat(orderData.orderSummary?.totalWeightGrams || 0),
        totalweightkilos: parseFloat(orderData.orderSummary?.totalWeightKilos || 0)
      },
      shippinginfo: {
        street: orderData.personalInfo?.street || "",
        trademark: orderData.personalInfo?.trademark || "",
        baranggay: orderData.personalInfo?.baranggay || "",
        city: orderData.personalInfo?.city || "",
        province: orderData.personalInfo?.province || "",
        zipcode: orderData.personalInfo?.zipCode || "",
        country: orderData.personalInfo?.country || ""
      }
    }
  };
}

// Database index creation function to ensure uniqueness at database level
async function createTransactionIdIndex() {
  try {
    // Create a unique index on the 'id' field in the MerchandiseTransaction collection
    await MerchandiseTransactionDataModel.collection.createIndex(
      { id: 1 }, 
      { 
        unique: true, 
        background: true,
        name: 'transaction_id_unique_index'
      }
    );
    
    console.log("Unique index created for transaction IDs");
  } catch (error) {
    if (error.code === 11000) {
      console.log("Unique index already exists for transaction IDs");
    } else {
      console.error("Error creating unique index:", error);
    }
  }
}

// Utility function to validate transaction ID uniqueness
async function validateTransactionIdUniqueness(transactionId) {
  try {
    const existingTransaction = await MerchandiseTransactionDataModel.findOne({ 
      id: transactionId 
    });
    
    return !existingTransaction; // Returns true if unique, false if duplicate
  } catch (error) {
    console.error("Error validating transaction ID uniqueness:", error);
    return false;
  }
}

// Initialize the database index when the application starts
// Call this function during your application initialization
async function initializeTransactionSystem() {
  await createTransactionIdIndex();
  
  // Initialize the global counter if it doesn't exist
  if (typeof global.transactionCounter === 'undefined') {
    global.transactionCounter = 0;
  }
  
  console.log("Transaction system initialized");
}

function findFullProductDetails(productId) {
  return {
    authentications: {
      producttype: '',
      id: productId
    },
    details: {
      productname: '',
      category: '',
      description: '',
      features: [],
      weightingrams: 0,
      warranty: '',
      price: {
        amount: 0,
        capital: 0,
        transactiongiveaway: 0,
        profit: 0
      },
      specifications: []
    },
    images: [],
    videos: [],
    customerfeedback: {
      rating: 0,
      reviews: 0
    },
    system: {
      purchases: {
        total: [],
        pending: [],
        accepted: [],
        rejected: []
      }
    },
    quantity: 0
  };
}

function precise(operation, num1, num2, precision = 10) {
  const factor = Math.pow(10, precision);
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

function preciseAdd(num1, num2) {
  return precise('add', num1, num2);
}

function preciseSub(num1, num2) {
  return precise('sub', num1, num2);
}

function preciseMul(num1, num2) {
  return precise('mul', num1, num2);
}

function ensureCreditsStructure(user) {
  if (!user.credits) {
    user.credits = {};
  }
  
  if (!user.credits.omsiapawas) {
    user.credits.omsiapawas = {
      id: `OMSIAPAWAS-${user._id || user.id}`,
      amount: 0,
      transactions: {
        currencyexchange: [],
        widthdrawals: [],
        omsiapawastransfer: []
      }
    };
  }
  
  user.credits.omsiapawas.amount = parseFloat(user.credits.omsiapawas.amount || 0);
  
  return user;
}

function calculateTotalPayment(orderSummary) {
  const merchandiseTotal = parseFloat(orderSummary.merchandiseTotal || 0);
  const shippingTotal = parseFloat(orderSummary.shippingTotal || 0);
  const processingFee = parseFloat(orderSummary.paymentProcessingFee || 0);
  
  let total = preciseAdd(merchandiseTotal, shippingTotal);
  total = preciseAdd(total, processingFee);
  
  return total;
}

// Define the router endpoint
Router.route("/order").post(processOrder);


module.exports = Router