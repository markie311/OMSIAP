const express = require("express")
const Router = express.Router()
const mongoose = require("mongoose")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const { v4: uuidv4 } = require("uuid")
const bcrypt = require("bcryptjs")
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);
const axios = require('axios');

// Import models - consolidated at the top
const RegistrantDataModel = require("../../models/people/registrantdatascheme.js")
const ProductDataModel = require('../../models/products/productsdatascheme.js')
const MerchandiseTransactionDataModel = require("../../models/transactions/merchandisetransactiondatascheme.js")
const CurrencyExchangeTransactionDataModel = require("../../models/transactions/currencyexchangetransactiondatascheme.js")
const WidthdrawalTransactionDataModel = require("../../models/transactions/withdrawaltransactiondatascheme.js")
const PendingFundsDataModel = require("../../models/pendingfunds/pendingfundsdatascheme.js")

// Import utilities
const timestamps = require("../../lib/timestamps/timestamps")

// Import schema for omsiapdatascheme
//const omsiapdatascheme = require("../../models/omsiapscheme/omsiapscheme")

// Define all upload paths in one place to avoid duplication
const UPLOAD_PATHS = {
  CURRENCY_EXCHANGE: path.join(__dirname, "../../../view/public/images/currencyexchange"),
  WITHDRAWALS: path.join(__dirname, "../../../view/public/images/withdrawals"),
  DOCUMENTS: path.join(__dirname, "../../../view/public/images/documents"),
}

// Ensure all directories exist
Object.values(UPLOAD_PATHS).forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
})

// Common file filter for images
const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true)
  } else {
    cb(new Error("Only image files are allowed!"), false)
  }
}

// Create storage factory function to avoid duplication
const createStorage = (uploadPath) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
      const now = new Date()
      const datePrefix = now.getFullYear() + ("0" + (now.getMonth() + 1)).slice(-2) + ("0" + now.getDate()).slice(-2)
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
      cb(null, `${datePrefix}-${uniqueSuffix}${path.extname(file.originalname)}`)
    },
  })
}

// Create multer instances for different upload types
const multerInstances = {
  currencyExchange: multer({
    storage: createStorage(UPLOAD_PATHS.CURRENCY_EXCHANGE),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: imageFileFilter,
  }),
  withdrawals: multer({
    storage: createStorage(UPLOAD_PATHS.WITHDRAWALS),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: imageFileFilter,
  }),
  documents: multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, UPLOAD_PATHS.DOCUMENTS)
      },
      filename: (req, file, cb) => {
        // Generate unique filename with user ID, document type and timestamp
        const userId = req.user ? req.user.id : "unknown"
        const timestamp = Date.now()
        const fileExt = path.extname(file.originalname)
        cb(null, `${userId}-${file.fieldname}-${timestamp}${fileExt}`)
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: imageFileFilter,
  }),
}

// Document fields for profile update
const documentFields = [
  { name: "birthCertificateFront", maxCount: 1 },
  { name: "birthCertificateBack", maxCount: 1 },
  { name: "governmentIdFront", maxCount: 1 },
  { name: "governmentIdBack", maxCount: 1 },
]

// Helper function to remove old documents
const removeOldDocument = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting old document:", err)
    })
  }
}

// Generic cleanup function that can be used for any directory
const cleanupOldFiles = (uploadPath, monthsOld = 1) => {
  console.log(`Running cleanup of files in ${uploadPath} older than ${monthsOld} month(s)...`)

  return new Promise((resolve, reject) => {
    fs.readdir(uploadPath, (err, files) => {
      if (err) {
        console.error(`Error reading directory for cleanup: ${err}`)
        reject(`Error reading directory: ${err.message}`)
        return
      }

      if (files.length === 0) {
        console.log("No files found in directory")
        resolve({ message: "No files found to clean up", deletedCount: 0 })
        return
      }

      const cutoffDate = new Date()
      cutoffDate.setMonth(cutoffDate.getMonth() - monthsOld)

      let processedCount = 0
      let deletedCount = 0
      const errors = []

      files.forEach((file) => {
        const filePath = path.join(uploadPath, file)

        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.error(`Error getting stats for file ${file}:`, err)
            errors.push(`Error getting stats for file ${file}: ${err.message}`)
            processedCount++

            if (processedCount === files.length) {
              finishCleanup()
            }
            return
          }

          // Check if file is older than specified months based on filename date prefix
          const dateMatch = file.match(/^(\d{8})-/)
          let fileDate
          let shouldDelete = false

          if (dateMatch) {
            const fileYear = Number.parseInt(dateMatch[1].substring(0, 4))
            const fileMonth = Number.parseInt(dateMatch[1].substring(4, 6)) - 1
            const fileDay = Number.parseInt(dateMatch[1].substring(6, 8))
            fileDate = new Date(fileYear, fileMonth, fileDay)
            shouldDelete = fileDate < cutoffDate
          }
          // Fallback to file modification time
          else {
            fileDate = stats.mtime
            shouldDelete = fileDate < cutoffDate
          }

          if (shouldDelete) {
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error(`Error deleting old file ${file}:`, err)
                errors.push(`Error deleting file ${file}: ${err.message}`)
              } else {
                console.log(`Deleted old file ${file} (from ${fileDate.toDateString()})`)
                deletedCount++
              }

              processedCount++
              if (processedCount === files.length) {
                finishCleanup()
              }
            })
          } else {
            processedCount++
            if (processedCount === files.length) {
              finishCleanup()
            }
          }
        })
      })

      function finishCleanup() {
        const result = {
          message: `Cleanup completed. Deleted ${deletedCount} of ${files.length} files.`,
          deletedCount,
          totalFiles: files.length,
          errors: errors.length > 0 ? errors : undefined,
        }

        console.log(result.message)
        resolve(result)
      }
    })
  })
}

// ===== ROUTES =====

// Get OMSIAP data route
Router.get("/getomsiapdata", async (req, res) => {
  try {
    // Fetch registrants data
    const registrants = await RegistrantDataModel.find(
      {},
      {
        "passwords.account.password": 0, // Exclude password fields
      },
    )

    // Process registrants for status categorization
    const people = registrants.map((person) => {
      const personObj = person.toObject()
      return {
        ...personObj,
        status: {
          type: personObj.registrationstatusesandlogs?.type || "unknown",
          indication: personObj.registrationstatusesandlogs?.indication || "unknown",
        },
      }
    })

    // Fetch products data
    const products = await ProductDataModel.find({})

    // Fetch merchandise transactions
    const merchandiseTransactions = await MerchandiseTransactionDataModel.find({})

    // Categorize merchandise transactions by status
    const orders = {
      total: merchandiseTransactions,
      pending: merchandiseTransactions.filter((tx) => tx.statusesandlogs?.status === "pending"),
      confirmed: merchandiseTransactions.filter((tx) => tx.statusesandlogs?.status === "confirmed"),
      rejected: merchandiseTransactions.filter((tx) => tx.statusesandlogs?.status === "rejected"),
      forshipping: merchandiseTransactions.filter((tx) => tx.statusesandlogs?.status === "forshipping"),
      shipped: merchandiseTransactions.filter((tx) => tx.statusesandlogs?.status === "shipped"),
      successful: merchandiseTransactions.filter((tx) => tx.statusesandlogs?.status === "completed"),
    }

    // Fetch currency exchange transactions
    const currencyExchangeTransactions = await CurrencyExchangeTransactionDataModel.find({})

    // Categorize currency exchange transactions
    const currencyexchange = {
      total: currencyExchangeTransactions,
      pending: currencyExchangeTransactions.filter((tx) => tx.statusesandlogs?.status === "pending"),
      successful: currencyExchangeTransactions.filter((tx) => tx.statusesandlogs?.status === "successful"),
      rejected: currencyExchangeTransactions.filter((tx) => tx.statusesandlogs?.status === "rejected"),
    }

    // Fetch withdrawal transactions
    const withdrawalTransactions = await WidthdrawalTransactionDataModel.find({})

    // Categorize withdrawal transactions
    const withdrawals = {
      total: withdrawalTransactions,
      pending: withdrawalTransactions.filter((tx) => tx.statusesandlogs?.status === "pending"),
      successful: withdrawalTransactions.filter((tx) => tx.statusesandlogs?.status === "successful"),
      rejected: withdrawalTransactions.filter((tx) => tx.statusesandlogs?.status === "rejected"),
    }

    // Construct response object
    const responseData = {
      people,
      products, // Add products to response
      transactions: {
        orders,
        currencyexchange,
        withdrawals,
      },
    }

    res.status(200).json(responseData)
  } catch (err) {
    console.error("Error fetching OMSIAP data:", err)
    res.status(500).json({
      message: "Error retrieving OMSIAP data",
      error: err.message,
    })
  }
})

// Confirm Order Route
Router.post("/confirmorder", async (req, res) => {
  try {
    const { _id, id } = req.body

    // Input validation
    if (!_id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      })
    }

    // Find the merchandise transaction by ID
    const merchandiseTransaction = await MerchandiseTransactionDataModel.findById(_id)

    // Check if transaction exists
    if (!merchandiseTransaction) {
      return res.status(404).json({
        success: false,
        message: "Order not found. Please refresh and try again.",
      })
    }

    // Check if transaction is already confirmed
    if (merchandiseTransaction.statusesandlogs.status === "confirmed") {
      return res.status(400).json({
        success: false,
        message: "This order has already been confirmed",
      })
    }

    // Check if transaction is in pending status
    if (merchandiseTransaction.statusesandlogs.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Cannot confirm order in ${merchandiseTransaction.statusesandlogs.status} status`,
      })
    }

    // Get the registrant ID from the transaction
    const registrantId = merchandiseTransaction.system.thistransactionismadeby.id

    if (!registrantId) {
      return res.status(400).json({
        success: false,
        message: "Registrant ID not found in transaction",
      })
    }

    // Find the registrant by ID
    const registrant = await RegistrantDataModel.findById(registrantId)

    if (!registrant) {
      return res.status(404).json({
        success: false,
        message: "Registrant not found",
      })
    }

    // Generate timestamp for the confirmation
    const formattedDate = timestamps.getFormattedDate()

    // Update the merchandise transaction statusesandlogs
    merchandiseTransaction.statusesandlogs.status = "confirmed"
    merchandiseTransaction.statusesandlogs.indication = "confirmed and processing"
    merchandiseTransaction.statusesandlogs.date = formattedDate

    // Add a new log entry to merchandise transaction
    merchandiseTransaction.statusesandlogs.logs.push({
      date: formattedDate,
      type: "confirmed",
      indication: "Order has been confirmed and is now being processed",
      messages: [
        { message: "Order has been confirmed by administrator" },
        { message: "Your order is being prepared for shipping" },
      ],
    })

    // Find the corresponding merchandise transaction in registrant's transactions
    // Use the id field to match the transaction
    const merchandiseTransactionIndex = registrant.transactions.merchandise.findIndex(
      (transaction) => transaction.id === id,
    )

    if (merchandiseTransactionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found in registrant records",
      })
    }

    // Update the registrant's merchandise transaction status and indication
    registrant.transactions.merchandise[merchandiseTransactionIndex].statusesandlogs.status = "confirmed"
    registrant.transactions.merchandise[merchandiseTransactionIndex].statusesandlogs.indication =
      "confirmed and processing"
    registrant.transactions.merchandise[merchandiseTransactionIndex].statusesandlogs.date = formattedDate

    // Add log entry to registrant's transaction (if logs array exists)
    if (registrant.transactions.merchandise[merchandiseTransactionIndex].statusesandlogs.logs) {
      registrant.transactions.merchandise[merchandiseTransactionIndex].statusesandlogs.logs.push({
        date: formattedDate,
        type: "confirmed",
        indication: "Order has been confirmed and is now being processed",
        messages: [
          { message: "Order has been confirmed by administrator" },
          { message: "Your order is being prepared for shipping" },
        ],
      })
    }

    // Save both documents
    await Promise.all([merchandiseTransaction.save(), registrant.save()])

    // Return success response
    return res.status(200).json({
      success: true,
      message: `Order ${_id} has been confirmed successfully`,
      updatedTransaction: merchandiseTransaction,
      updatedRegistrant: {
        id: registrant._id,
        name: registrant.name,
        updatedTransactionStatus:
          registrant.transactions.merchandise[merchandiseTransactionIndex].statusesandlogs.status,
      },
    })
  } catch (err) {
    console.error("Error confirming order:", err)

    // Handle specific MongoDB errors
    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID format",
      })
    }

    // Handle other errors
    return res.status(500).json({
      success: false,
      message: "Server error occurred while confirming order",
    })
  }
})

// Order For Shipping Route
Router.post("/orderforshipping", async (req, res) => {
  try {
    const { _id, id } = req.body

    console.log(_id)
    console.log(id)

    // Input validation
    if (!_id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      })
    }

    // Find the merchandise transaction by ID
    const merchandiseTransaction = await MerchandiseTransactionDataModel.findById(_id)

    // Check if transaction exists
    if (!merchandiseTransaction) {
      return res.status(404).json({
        success: false,
        message: "Order not found. Please refresh and try again.",
      })
    }

    // Check if transaction is already for shipping
    if (merchandiseTransaction.statusesandlogs.status === "forshipping") {
      return res.status(400).json({
        success: false,
        message: "This order is already marked for shipping",
      })
    }

    // Check if transaction is in confirmed status
    if (merchandiseTransaction.statusesandlogs.status !== "confirmed") {
      return res.status(400).json({
        success: false,
        message: `Cannot mark order for shipping when in ${merchandiseTransaction.statusesandlogs.status} status. Order must be confirmed first.`,
      })
    }

    // Get the registrant ID from the transaction
    const registrantId = merchandiseTransaction.system.thistransactionismadeby.id

    if (!registrantId) {
      return res.status(400).json({
        success: false,
        message: "Registrant ID not found in transaction",
      })
    }

    // Find the registrant by ID
    const registrant = await RegistrantDataModel.findById(registrantId)

    if (!registrant) {
      return res.status(404).json({
        success: false,
        message: "Registrant not found",
      })
    }

    // Generate timestamp for the status update
    const formattedDate = timestamps.getFormattedDate()

    // Update the merchandise transaction statusesandlogs
    merchandiseTransaction.statusesandlogs.status = "forshipping"
    merchandiseTransaction.statusesandlogs.indication = "ready for shipping"
    merchandiseTransaction.statusesandlogs.date = formattedDate

    // Add a new log entry to merchandise transaction
    merchandiseTransaction.statusesandlogs.logs.push({
      date: formattedDate,
      type: "forshipping",
      indication: "Order has been marked for shipping",
      messages: [
        { message: "Order has been prepared and is ready for shipping" },
        { message: "Your order will be dispatched soon" },
      ],
    })

    // Find the corresponding merchandise transaction in registrant's transactions
    // Use the id field to match the transaction
    const merchandiseTransactionIndex = registrant.transactions.merchandise.findIndex(
      (transaction) => transaction.id === id,
    )

    if (merchandiseTransactionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found in registrant records",
      })
    }

    // Update the registrant's merchandise transaction status and indication
    registrant.transactions.merchandise[merchandiseTransactionIndex].statusesandlogs.status = "forshipping"
    registrant.transactions.merchandise[merchandiseTransactionIndex].statusesandlogs.indication = "ready for shipping"
    registrant.transactions.merchandise[merchandiseTransactionIndex].statusesandlogs.date = formattedDate

    // Add log entry to registrant's transaction (if logs array exists)
    if (registrant.transactions.merchandise[merchandiseTransactionIndex].statusesandlogs.logs) {
      registrant.transactions.merchandise[merchandiseTransactionIndex].statusesandlogs.logs.push({
        date: formattedDate,
        type: "forshipping",
        indication: "Order has been marked for shipping",
        messages: [
          { message: "Order has been prepared and is ready for shipping" },
          { message: "Your order will be dispatched soon" },
        ],
      })
    }

    // Save both documents
    await Promise.all([merchandiseTransaction.save(), registrant.save()])

    // Return success response
    return res.status(200).json({
      success: true,
      message: `Order ${_id} has been marked for shipping successfully`,
      updatedTransaction: merchandiseTransaction,
      updatedRegistrant: {
        id: registrant._id,
        name: registrant.name,
        updatedTransactionStatus:
          registrant.transactions.merchandise[merchandiseTransactionIndex].statusesandlogs.status,
      },
    })
  } catch (err) {
    console.error("Error marking order for shipping:", err)

    // Handle specific MongoDB errors
    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID format",
      })
    }

    // Handle other errors
    return res.status(500).json({
      success: false,
      message: "Server error occurred while marking order for shipping",
    })
  }
})

// Order Shipped Route
Router.post("/ordershipped", async (req, res) => {
  try {
    const { _id, id } = req.body

    // Input validation
    if (!_id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      })
    }

    // Find the merchandise transaction by ID
    const merchandiseTransaction = await MerchandiseTransactionDataModel.findById(_id)

    // Check if transaction exists
    if (!merchandiseTransaction) {
      return res.status(404).json({
        success: false,
        message: "Order not found. Please refresh and try again.",
      })
    }

    // Check if transaction is already shipped
    if (merchandiseTransaction.statusesandlogs.status === "shipped") {
      return res.status(400).json({
        success: false,
        message: "This order has already been marked as shipped",
      })
    }

    // Check if transaction is in forshipping status
    if (merchandiseTransaction.statusesandlogs.status !== "forshipping") {
      return res.status(400).json({
        success: false,
        message: `Cannot mark order as shipped when in ${merchandiseTransaction.statusesandlogs.status} status. Order must be prepared for shipping first.`,
      })
    }

    // Get the registrant ID from the transaction
    const registrantId = merchandiseTransaction.system.thistransactionismadeby.id

    if (!registrantId) {
      return res.status(400).json({
        success: false,
        message: "Registrant ID not found in transaction",
      })
    }

    // Find the registrant by ID
    const registrant = await RegistrantDataModel.findById(registrantId)

    if (!registrant) {
      return res.status(404).json({
        success: false,
        message: "Registrant not found",
      })
    }

    // Generate timestamp for the status update
    const formattedDate = timestamps.getFormattedDate()

    // Update the merchandise transaction statusesandlogs
    merchandiseTransaction.statusesandlogs.status = "shipped"
    merchandiseTransaction.statusesandlogs.indication = "shipped to customer"
    merchandiseTransaction.statusesandlogs.date = formattedDate

    // Add a new log entry to merchandise transaction
    merchandiseTransaction.statusesandlogs.logs.push({
      date: formattedDate,
      type: "shipped",
      indication: "Order has been shipped",
      messages: [
        { message: "Order has been dispatched to shipping carrier" },
        { message: "Your order is on its way to you" },
        {
          message:
            "Don't forget to set your shipped order into accepted once order was received to update the status of the order into successful",
        },
      ],
    })

    // Find the corresponding merchandise transaction in registrant's transactions
    // Use the id field to match the transaction
    const merchandiseTransactionIndex = registrant.transactions.merchandise.findIndex(
      (transaction) => transaction.id === id,
    )

    if (merchandiseTransactionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found in registrant records",
      })
    }

    // Update the registrant's merchandise transaction status and indication
    registrant.transactions.merchandise[merchandiseTransactionIndex].statusesandlogs.status = "shipped"
    registrant.transactions.merchandise[merchandiseTransactionIndex].statusesandlogs.indication = "shipped to customer"
    registrant.transactions.merchandise[merchandiseTransactionIndex].statusesandlogs.date = formattedDate

    // Add log entry to registrant's transaction (if logs array exists)
    if (registrant.transactions.merchandise[merchandiseTransactionIndex].statusesandlogs.logs) {
      registrant.transactions.merchandise[merchandiseTransactionIndex].statusesandlogs.logs.push({
        date: formattedDate,
        type: "shipped",
        indication: "Order has been shipped",
        messages: [
          { message: "Order has been dispatched to shipping carrier" },
          { message: "Your order is on its way to you" },
          {
            message:
              "Don't forget to set your shipped order into accepted once order was received to update the status of the order into successful",
          },
        ],
      })
    }

    // Save both documents
    await Promise.all([merchandiseTransaction.save(), registrant.save()])

    // Return success response
    return res.status(200).json({
      success: true,
      message: `Order ${_id} has been marked as shipped successfully`,
      updatedTransaction: merchandiseTransaction,
      updatedRegistrant: {
        id: registrant._id,
        name: registrant.name,
        updatedTransactionStatus:
          registrant.transactions.merchandise[merchandiseTransactionIndex].statusesandlogs.status,
      },
    })
  } catch (err) {
    console.error("Error marking order as shipped:", err)

    // Handle specific MongoDB errors
    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID format",
      })
    }

    // Handle other errors
    return res.status(500).json({
      success: false,
      message: "Server error occurred while marking order as shipped",
    })
  }
})

// Get Product Order Transaction Route
Router.post("/getproductordertransaction", async (req, res) => {
  try {
    const { id } = req.body

    // Input validation
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID is required",
      })
    }

    // Validate that ID is not empty or just whitespace
    if (typeof id !== "string" || id.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Valid transaction ID is required",
      })
    }

    const trimmedId = id.trim()
    console.log("Searching for transaction with ID:", trimmedId) // Debug log

    // Find the merchandise transaction by the normal ID (not mongoose _id)
    // Based on your schema, the ID field is at the root level
    const merchandiseTransaction = await MerchandiseTransactionDataModel.findOne({
      id: trimmedId,
    })

    console.log("Transaction found:", !!merchandiseTransaction) // Debug log

    // Check if transaction exists
    if (!merchandiseTransaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found. Please verify the transaction ID and try again.",
      })
    }

    // Get the registrant ID from the transaction
    const registrantId = merchandiseTransaction.system?.thistransactionismadeby?.id

    // Find the registrant by ID to get additional information
    let registrantInfo = null
    if (registrantId) {
      try {
        const registrant = await RegistrantDataModel.findById(registrantId)
        if (registrant) {
          registrantInfo = {
            id: registrant._id,
            name: registrant.name,
            email: registrant.email || null,
            // Add other fields as needed
          }
        }
      } catch (registrantError) {
        console.warn("Could not fetch registrant info:", registrantError)
        // Continue without registrant info - don't fail the whole request
      }
    }

    // Prepare the response data based on your schema structure
    const transactionData = {
      _id: merchandiseTransaction._id,
      id: merchandiseTransaction.id,
      date: merchandiseTransaction.date,
      intent: merchandiseTransaction.intent,
      status: merchandiseTransaction.statusesandlogs?.status,
      indication: merchandiseTransaction.statusesandlogs?.indication,
      statusDate: merchandiseTransaction.statusesandlogs?.date,
      logs: merchandiseTransaction.statusesandlogs?.logs || [],

      // Transaction details
      merchandiseList: merchandiseTransaction.details?.merchandise?.list || [],
      paymentMethod: merchandiseTransaction.details?.paymentmethod || null,

      // System information - who made the transaction
      transactionMadeBy: {
        id: merchandiseTransaction.system?.thistransactionismadeby?.id || null,
        name: {
          firstname: merchandiseTransaction.system?.thistransactionismadeby?.name?.firstname || "",
          middlename: merchandiseTransaction.system?.thistransactionismadeby?.name?.middlename || "",
          lastname: merchandiseTransaction.system?.thistransactionismadeby?.name?.lastname || "",
        },
        address: merchandiseTransaction.system?.thistransactionismadeby?.address || null,
      },

      // System information - transaction intended for
      transactionIntendedFor: {
        id: merchandiseTransaction.system?.thistransactionismainlyintendedto?.id || null,
        name: {
          firstname: merchandiseTransaction.system?.thistransactionismainlyintendedto?.name?.firstname || "",
          middlename: merchandiseTransaction.system?.thistransactionismainlyintendedto?.name?.middlename || "",
          lastname: merchandiseTransaction.system?.thistransactionismainlyintendedto?.name?.lastname || "",
        },
        address: merchandiseTransaction.system?.thistransactionismainlyintendedto?.address || null,
      },

      // Order summary
      orderSummary: {
        merchandiseTotal: merchandiseTransaction.system?.ordersummary?.merchandisetotal || 0,
        shippingTotal: merchandiseTransaction.system?.ordersummary?.shippingtotal || 0,
        processingFee: merchandiseTransaction.system?.ordersummary?.processingfee || 0,
        totalCapital: merchandiseTransaction.system?.ordersummary?.totalcapital || 0,
        totalTransactionGiveaway: merchandiseTransaction.system?.ordersummary?.totaltransactiongiveaway || 0,
        totalProfit: merchandiseTransaction.system?.ordersummary?.totalprofit || 0,
        totalItems: merchandiseTransaction.system?.ordersummary?.totalitems || 0,
        totalWeightGrams: merchandiseTransaction.system?.ordersummary?.totalweightgrams || 0,
        totalWeightKilos: merchandiseTransaction.system?.ordersummary?.totalweightkilos || 0,
      },

      // Shipping information
      shippingInfo: merchandiseTransaction.system?.shippinginfo || null,

      // Add timestamps if available
      createdAt: merchandiseTransaction.createdAt,
      updatedAt: merchandiseTransaction.updatedAt,
    }

    // Return success response with transaction data
    return res.status(200).json({
      success: true,
      message: `Transaction ${trimmedId} retrieved successfully`,
      transaction: transactionData,
      registrant: registrantInfo,
      found: true,
    })
  } catch (err) {
    console.error("Error retrieving order transaction:", err)

    // Handle specific MongoDB errors
    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID format",
      })
    }

    // Handle connection errors
    if (err.name === "MongoNetworkError" || err.name === "MongoTimeoutError") {
      return res.status(503).json({
        success: false,
        message: "Database connection error. Please try again later.",
      })
    }

    // Handle validation errors
    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Data validation error. Please check your input.",
      })
    }

    // Handle other errors
    return res.status(500).json({
      success: false,
      message: "Server error occurred while retrieving order transaction. Please try again later.",
    })
  }
})

// Add this helper function before your router
const calculatePartialRefund = (removedItems) => {
  return removedItems.reduce((total, item) => {
    return total + item.details.price.amount * item.quantity + (item.details.price.shipping || 0) * item.quantity
  }, 0)
}

// order rejection
Router.put("/productrejection/:id", async (req, res) => {
  try {
    const transactionId = req.params.id
    const updatedTransactionData = req.body

    // Validate required fields
    if (!updatedTransactionData.statusesandlogs || !updatedTransactionData.statusesandlogs.status) {
      return res.status(400).json({
        success: false,
        message: "Status is required in statusesandlogs",
      })
    }

    if (!updatedTransactionData.refundDetails) {
      return res.status(400).json({
        success: false,
        message: "Refund details are required for product rejection",
      })
    }

    // Find the current transaction
    const currentTransaction = await MerchandiseTransactionDataModel.findOne({ id: transactionId })

    if (!currentTransaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      })
    }

    // Extract registrant ID from the transaction
    const registrantId = currentTransaction.system.thistransactionismadeby.id

    if (!registrantId) {
      return res.status(400).json({
        success: false,
        message: "Registrant ID not found in transaction",
      })
    }

    // Find the registrant
    const registrant = await RegistrantDataModel.findById(registrantId)

    if (!registrant) {
      return res.status(404).json({
        success: false,
        message: "Registrant not found",
      })
    }

    // Find the transaction in registrant's merchandise transactions
    const transactionIndex = registrant.transactions.merchandise.findIndex(
      (transaction) => transaction.id === transactionId,
    )

    if (transactionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found in registrant records",
      })
    }

    // Calculate refund amount from refund details
    const refundAmount = updatedTransactionData.refundDetails.amounts.totalRefund
    const hasRefund = updatedTransactionData.refundDetails.hasRefund

    // Update the main transaction document
    const updatedTransaction = await MerchandiseTransactionDataModel.findOneAndUpdate(
      { id: transactionId },
      {
        ...updatedTransactionData,
        // Update refund status to processed
        refundDetails: {
          ...updatedTransactionData.refundDetails,
          refundStatus: hasRefund ? "processed" : "not_required",
          refundProcessedDate: hasRefund ? new Date().toISOString() : null,
          refundMethod: hasRefund ? "omsiapawas_credit" : null,
          refundReference: hasRefund ? `REFUND_${transactionId}_${Date.now()}` : null,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    )

    // Update the transaction in registrant's records
    registrant.transactions.merchandise[transactionIndex] = {
      ...registrant.transactions.merchandise[transactionIndex].toObject(),
      ...updatedTransactionData,
      refundDetails: {
        ...updatedTransactionData.refundDetails,
        refundStatus: hasRefund ? "processed" : "not_required",
        refundProcessedDate: hasRefund ? new Date().toISOString() : null,
        refundMethod: hasRefund ? "omsiapawas_credit" : null,
        refundReference: hasRefund ? `REFUND_${transactionId}_${Date.now()}` : null,
      },
    }

    // Process refund if there is one
    let refundTransaction = null
    if (hasRefund && refundAmount > 0) {
      // Add refund amount to registrant's credits
      registrant.credits.omsiapawas.amount += refundAmount

      // Create refund transaction record
      refundTransaction = {
        id: `refund_${transactionId}_${Date.now()}`,
        intent: "product_rejection_refund",
        statusesandlogs: {
          status: "completed",
          indication: "automatic_refund",
          logs: [
            {
              date: new Date().toISOString(),
              type: "refund_processed",
              indication: "product_rejection_refund",
              messages: [
                {
                  message: `Refund processed for rejected/removed products from order ${transactionId}. Amount: ₱${refundAmount.toFixed(2)}`,
                },
              ],
            },
          ],
        },
        details: {
          paymentmethod: "omsiapawas_credit",
          thistransactionismadeby: updatedTransaction.system.thistransactionismadeby,
          thistransactionismainlyintendedto: updatedTransaction.system.thistransactionismadeby,
          amounts: {
            intent: refundAmount,
            phppurchaseorexchangeamount: refundAmount,
            deductions: {
              successfulprocessing: {
                amount: 0,
                reasons: "No deduction for refund",
              },
              rejectionprocessing: {
                amount: 0,
                reasons: "No deduction for refund",
              },
            },
            profit: 0,
            omsiapawasamounttorecieve: refundAmount,
          },
          referrence: {
            number: `REFUND_${transactionId}`,
            gcashtransactionrecieptimage: "",
          },
          refundDetails: {
            originalTransactionId: transactionId,
            refundReason: "Product rejection - items removed from order",
            refundBreakdown: {
              merchandiseRefund: updatedTransactionData.refundDetails.amounts.merchandiseRefund,
              shippingRefund: updatedTransactionData.refundDetails.amounts.shippingRefund,
              processingFeeRefund: updatedTransactionData.refundDetails.amounts.processingFeeRefund,
              totalRefund: updatedTransactionData.refundDetails.amounts.totalRefund,
            },
          },
        },
      }

      // Add refund transaction to registrant's currency exchange transactions
      registrant.credits.omsiapawas.transactions.currencyexchange.push(refundTransaction)

      // Add refund processing log to the main transaction
      const refundLog = {
        date: new Date().toISOString(),
        type: "refund_processed",
        indication: "product_rejection_refund",
        messages: [
          {
            message: `Refund of ₱${refundAmount.toFixed(2)} processed automatically for rejected products. New credit balance: ₱${registrant.credits.omsiapawas.amount.toFixed(2)}`,
          },
        ],
      }

      updatedTransaction.statusesandlogs.logs.push(refundLog)
      registrant.transactions.merchandise[transactionIndex].statusesandlogs.logs.push(refundLog)
    }

    // Save the updated registrant
    await registrant.save()

    // Save the updated transaction
    await updatedTransaction.save()

    // Prepare response data
    const responseData = {
      transaction: updatedTransaction,
      registrantUpdated: true,
      refundProcessed: hasRefund,
      refundAmount: refundAmount,
      newCreditBalance: registrant.credits.omsiapawas.amount,
      refundTransaction: refundTransaction,
      refundDetails: updatedTransactionData.refundDetails,
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: `Product rejection processed successfully${hasRefund ? ` with refund of ₱${refundAmount.toFixed(2)}` : ""}`,
      data: responseData,
    })
  } catch (error) {
    console.error("Error processing product rejection:", error)

    // Handle specific mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map((err) => err.message),
      })
    }

    // Handle mongoose cast errors (invalid ObjectId)
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      })
    }

    // Generic server error
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong",
    })
  }
})

// Accept Order Route
Router.post("/acceptorder", async (req, res) => {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb+srv://ofmackysinkandpaper:38NJaxXX2AF9Mpmp@cluster0.djai0.mongodb.net/omsiap", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "omsiap",
      autoCreate: false,
    })

    // Define the model
    const OmsiapData = mongoose.model("datas", omsiapdatascheme)

    // Fetch the specific document
    const omsiapDocument = await OmsiapData.findById("Code-113-1143")

    if (!omsiapDocument) {
      return res.status(404).json({
        message: "OMSIAP document not found",
        status: "error",
        errorCode: "DOCUMENT_NOT_FOUND",
      })
    }

    // Find the order in pending orders
    const pendingOrderIndex = omsiapDocument.transactions.orders.pending.findIndex((order) => order.id === req.body.id)

    if (pendingOrderIndex === -1) {
      return res.status(404).json({
        message: "Order not found in pending orders",
        status: "error",
        errorCode: "ORDER_NOT_FOUND",
      })
    }

    // Extract the order to be accepted
    const orderToAccept = omsiapDocument.transactions.orders.pending[pendingOrderIndex]

    // Check if order is already in an invalid state
    if (orderToAccept.status === "accepted") {
      return res.status(400).json({
        message: `Order ${req.body.id} is already accepted`,
        status: "warning",
        errorCode: "ORDER_ALREADY_ACCEPTED",
      })
    }

    // Update the order's status before moving
    orderToAccept.status = "accepted"

    // Remove from pending orders
    omsiapDocument.transactions.orders.pending.splice(pendingOrderIndex, 1)

    // Add to accepted orders
    omsiapDocument.transactions.orders.accepted.push(orderToAccept)

    // Update the order's status in the total orders array
    const totalOrderIndex = omsiapDocument.transactions.orders.total.findIndex((order) => order.id === req.body.id)

    if (totalOrderIndex !== -1) {
      // Update status in total orders, but keep the order in the total array
      omsiapDocument.transactions.orders.total[totalOrderIndex].status = "accepted"
    }

    // Save the updated document
    await omsiapDocument.save()

    // Respond with success and additional details
    res.status(200).json({
      message: `Order ${req.body.id} has been accepted successfully`,
      status: "success",
      orderId: req.body.id,
      acceptedAt: new Date().toISOString(),
    })
  } catch (err) {
    console.error("Error accepting order:", err)

    // Determine the appropriate error response
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error occurred",
        status: "error",
        errorCode: "VALIDATION_ERROR",
        details: err.errors,
      })
    }

    if (err.name === "MongoError" || err.name === "MongooseError") {
      return res.status(500).json({
        message: "Database operation failed",
        status: "error",
        errorCode: "DATABASE_ERROR",
        details: err.message,
      })
    }

    // Generic server error
    res.status(500).json({
      message: "Error processing order acceptance",
      status: "error",
      errorCode: "INTERNAL_SERVER_ERROR",
      details: err.message,
    })
  }
})

// Cleanup routes
Router.post("/currencyexchange/cleanup", async (req, res) => {
  try {
    // Get months parameter - default to 1 month if not specified
    const months = req.body.months ? Number.parseInt(req.body.months) : 1

    if (isNaN(months) || months < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid months parameter. Must be a positive number.",
      })
    }

    // Run the cleanup
    const result = await cleanupOldFiles(UPLOAD_PATHS.CURRENCY_EXCHANGE, months)

    return res.status(200).json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error("Error during manual cleanup:", error)
    return res.status(500).json({
      success: false,
      message: "Error during cleanup process",
      error: error.message,
    })
  }
})

Router.post("/withdrawals/cleanup", async (req, res) => {
  try {
    // Get months parameter - default to 1 month if not specified
    const months = req.body.months ? Number.parseInt(req.body.months) : 1

    if (isNaN(months) || months < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid months parameter. Must be a positive number.",
      })
    }

    // Run the cleanup
    const result = await cleanupOldFiles(UPLOAD_PATHS.WITHDRAWALS, months)

    return res.status(200).json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error("Error during withdrawal images cleanup:", error)
    return res.status(500).json({
      success: false,
      message: "Error during cleanup process",
      error: error.message,
    })
  }
})

// Currency Exchange Route
Router.post("/currencyexchange", multerInstances.currencyExchange.single("transactionImage"), async (req, res) => {
  try {
    // Get request data
    const { transactionmadeby, exchangeamount, referenceNumber, phpAmount } = req.body

    // Validate required fields
    if (!exchangeamount || !referenceNumber || !req.file) {
      console.log("Missing required fields")

      // Delete uploaded file if validation fails
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path)
      }

      return res.status(400).json({
        success: false,
        status: "MISSING_FIELDS",
        message: "Please provide all required fields",
      })
    }

    // Validate exchange amount
    const exchangeAmountFloat = Number.parseFloat(exchangeamount)
    if (isNaN(exchangeAmountFloat) || exchangeAmountFloat <= 0) {
      // Delete uploaded file
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path)
      }

      return res.status(400).json({
        success: false,
        status: "INVALID_AMOUNT",
        message: "Invalid exchange amount",
      })
    }

    // Validate PHP amount
    const phpAmountFloat = Number.parseFloat(phpAmount)
    if (isNaN(phpAmountFloat) || phpAmountFloat < 210 || phpAmountFloat > 5250) {
      // Delete uploaded file
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path)
      }

      return res.status(400).json({
        success: false,
        status: "INVALID_AMOUNT",
        message: "PHP amount must be between ₱210 and ₱5,250",
      })
    }

    // Get image path relative to public directory
    const imageFilename = req.file.filename
    const imagePath = `/images/currencyexchange/${imageFilename}`

    // Parse user data
    let userDataObj

    try {
      userDataObj = typeof transactionmadeby === "string" ? JSON.parse(transactionmadeby) : transactionmadeby
    } catch (error) {
      console.error("Error parsing user data:", error)

      // Delete uploaded file
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path)
      }

      return res.status(400).json({
        success: false,
        status: "INVALID_USER_DATA",
        message: "Invalid user data format",
      })
    }

    // Check for existing transaction with same reference number
    const existingTransaction = await CurrencyExchangeTransactionDataModel.findOne({
      "details.referrence.number": referenceNumber,
    })

    if (existingTransaction) {
      // Delete uploaded file
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path)
      }

      return res.status(400).json({
        success: false,
        status: "DUPLICATE_REFERENCE",
        message: "This reference number has already been used for another transaction",
      })
    }

    // Get user ID
    const userId = userDataObj._id || userDataObj.id

    // Check if registrant exists
    const registrantExists = await RegistrantDataModel.findById(userId)

    if (!registrantExists) {
      // Delete uploaded file
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path)
      }

      return res.status(400).json({
        success: false,
        status: "REGISTRANT_NOT_FOUND",
        message: "User account not found. Please check your account details or register first.",
      })
    }

    // Generate transaction ID
    const transactionId = uuidv4()

    // Get formatted date
    const formattedDate = timestamps.getFormattedDate()

    // Create new transaction object
    const newTransaction = {
      id: transactionId,
      intent: "currency exchange",
      statusesandlogs: {
        status: "pending",
        indication: "waiting for approval",
        logs: [
          {
            date: formattedDate,
            type: "pending",
            indication: "first log, waiting for approval",
            messages: [{ message: "Your exchange request has been submitted and is pending approval." }],
          },
        ],
      },
      details: {
        paymentmethod: "GCASH",
        thistransactionismadeby: {
          id: userDataObj._id,
          name: {
            firstname: userDataObj.name.firstname,
            middlename: userDataObj.name.middlename || "",
            lastname: userDataObj.name.lastname,
            nickname: userDataObj.name.nickname || "",
          },
          contact: {
            phonenumber: userDataObj.contact.phonenumber,
            emailaddress: userDataObj.contact.emailaddress,
            address: {
              street: userDataObj.contact.address?.street || "",
              trademark: userDataObj.contact.address?.trademark || "",
              baranggay: userDataObj.contact.address?.baranggay || "",
              city: userDataObj.contact.address?.city || "",
              province: userDataObj.contact.address?.province || "",
              postal_zip_code: userDataObj.contact.address?.postal_zip_code || "",
              country: userDataObj.contact.address?.country || "",
            },
          },
        },
        thistransactionismainlyintendedto: {
          id: userDataObj._id,
          name: {
            firstname: "OMSIAP",
            middlename: "",
            lastname: "System",
            nickname: "",
          },
          contact: {
            phonenumber: "",
            emailaddress: "",
            address: {
              street: "",
              trademark: "",
              baranggay: "",
              city: "",
              province: "",
              postal_zip_code: "",
              country: "",
            },
          },
        },
        amounts: {
          intent: exchangeAmountFloat,
          phppurchaseorexchangeamount: phpAmountFloat,
          deductions: {
            successfulprocessing: {
              amount: 0,
              reasons: "",
            },
            rejectionprocessing: {
              amount: 0,
              reasons: "",
            },
          },
          profit: 0,
          omsiapawasamounttorecieve: exchangeAmountFloat,
        },
        referrence: {
          number: referenceNumber,
          gcashtransactionrecieptimage: imagePath,
        },
      },
    }

    // Save transaction to database
    const savedTransaction = await CurrencyExchangeTransactionDataModel.create(newTransaction)

    // Update user's credits.transactions.currencyexchange
    await RegistrantDataModel.findByIdAndUpdate(
      userId,
      {
        $push: {
          "credits.omsiapawas.transactions.currencyexchange": newTransaction,
        },
      },
      { new: true },
    )

    // Return success response
    return res.status(200).json({
      success: true,
      status: "EXCHANGE_PENDING",
      message: "Your exchange request has been submitted and is pending approval.",
      transaction: {
        id: transactionId,
        date: formattedDate,
        amount: exchangeAmountFloat,
        status: "pending",
        phpAmount: phpAmountFloat,
      },
    })
  } catch (error) {
    console.error("Currency exchange error:", error)

    // Delete the uploaded file if any error occurs
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path)
      } catch (unlinkError) {
        console.error("Error deleting file:", unlinkError)
      }
    }

    console.log("Error" + " " + error)

    return res.status(500).json({
      success: false,
      status: "SERVER_ERROR",
      message: "An error occurred while processing your request.",
    })
  }
})

// Approve currency exchange route
Router.post("/approvecurrencyexchange", async (req, res) => {
  try {
    const {
      _id,
      id,
      phpAmountVerification,
      omsiapAmountVerification,
      successfulDeductionAmount,
      rejectedDeductionAmount,
    } = req.body

    // Validate request data
    if (!_id && !id) {
      return res.status(400).json({ success: false, message: "Transaction ID is required" })
    }

    if (!phpAmountVerification || !omsiapAmountVerification || !successfulDeductionAmount) {
      return res.status(400).json({ success: false, message: "All verification amounts are required" })
    }

    // Use _id if provided, otherwise use id
    const transactionId = _id || id

    // Find the transaction in the main collection
    const transaction = await CurrencyExchangeTransactionDataModel.findOne({ _id: transactionId })

    // Check if transaction exists
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" })
    }

    // Check if transaction is already approved
    if (transaction.statusesandlogs.status === "approved" || transaction.statusesandlogs.status === "successful") {
      return res.status(409).json({ success: false, message: "Transaction has already been approved" })
    }

    // Get the recipient's ID from the transaction
    let recipientId = null

    console.log("=== RECIPIENT ID EXTRACTION DEBUG ===")
    console.log("Transaction ID:", transaction.id)
    console.log("Full transaction object keys:", Object.keys(transaction))

    // Try different possible paths based on your schema
    if (transaction.details?.thistransactionismainlyintendedto?.id) {
      recipientId = transaction.details.thistransactionismainlyintendedto.id
      console.log("Found recipient ID in details.thistransactionismainlyintendedto.id:", recipientId)
    } else if (transaction.system?.thistransactionismainlyintendedto?.id) {
      recipientId = transaction.system.thistransactionismainlyintendedto.id
      console.log("Found recipient ID in system.thistransactionismainlyintendedto.id:", recipientId)
    } else if (transaction.details?.system?.thistransactionismainlyintendedto?.id) {
      recipientId = transaction.details.system.thistransactionismainlyintendedto.id
      console.log("Found recipient ID in details.system.thistransactionismainlyintendedto.id:", recipientId)
    } else {
      // Recursive search for user ID
      const findUserIdInObject = (obj, path = "") => {
        if (!obj || typeof obj !== "object") return null

        for (const [key, value] of Object.entries(obj)) {
          const currentPath = path ? `${path}.${key}` : key

          if (key === "id" && typeof value === "string" && value !== "system" && value.length > 3) {
            console.log(`Potential user ID found at ${currentPath}:`, value)
            return value
          }

          if (typeof value === "object" && value !== null) {
            const result = findUserIdInObject(value, currentPath)
            if (result) return result
          }
        }
        return null
      }

      recipientId = findUserIdInObject(transaction)
      console.log("Recursive search result:", recipientId)
    }

    if (!recipientId || recipientId === "system") {
      return res.status(400).json({
        success: false,
        message: "Valid recipient ID not found in transaction",
        debug: {
          transactionKeys: Object.keys(transaction),
          detailsKeys: Object.keys(transaction.details || {}),
          extractedId: recipientId,
        },
      })
    }

    // Find the registrant
    console.log("=== REGISTRANT SEARCH DEBUG ===")
    console.log("Searching for registrant with ID:", recipientId)

    let registrant = await RegistrantDataModel.findOne({ id: recipientId })

    if (!registrant && /^[0-9a-fA-F]{24}$/.test(recipientId)) {
      console.log("Trying with _id field (ObjectId format detected)...")
      try {
        registrant = await RegistrantDataModel.findById(recipientId)
      } catch (err) {
        console.log("ObjectId search failed:", err.message)
      }
    }

    if (!registrant) {
      // Try to find registrant by transaction reference
      registrant = await RegistrantDataModel.findOne({
        "credits.omsiapawas.transactions.currencyexchange.id": transaction.id,
      })

      if (registrant) {
        console.log("Found registrant by transaction reference:", registrant.id)
        recipientId = registrant.id // Update recipientId to match found registrant
      }
    }

    if (!registrant) {
      const sampleRegistrants = await RegistrantDataModel.find({}).limit(3).select("id _id name")
      return res.status(404).json({
        success: false,
        message: `Recipient registrant not found with ID: ${recipientId}`,
        debug: {
          searchedId: recipientId,
          transactionId: transaction.id,
          sampleRegistrantIds: sampleRegistrants.map((r) => ({ id: r.id, _id: r._id })),
        },
      })
    }

    console.log("=== TRANSACTION VERIFICATION DEBUG ===")
    console.log("Found registrant ID:", registrant.id)
    console.log("Looking for transaction ID in registrant:", transaction.id)

    // Find the transaction index in registrant's records
    const currencyExchangeTransactions = registrant.credits?.omsiapawas?.transactions?.currencyexchange || []
    console.log("Total currency exchange transactions for registrant:", currencyExchangeTransactions.length)

    const transactionIndex = currencyExchangeTransactions.findIndex((tx) => tx.id === transaction.id)
    console.log("Transaction index found:", transactionIndex)

    if (transactionIndex === -1) {
      // Log all transaction IDs for debugging
      const existingTxIds = currencyExchangeTransactions.map((tx) => tx.id)
      console.log("Existing transaction IDs in registrant:", existingTxIds)

      return res.status(404).json({
        success: false,
        message: "Transaction not found in registrant's currency exchange records",
        debug: {
          searchedTransactionId: transaction.id,
          registrantId: registrant.id,
          existingTransactionIds: existingTxIds,
          totalTransactions: currencyExchangeTransactions.length,
        },
      })
    }

    // Create new status log
    const newStatusLog = {
      date: timestamps.getFormattedDate(),
      type: "approval",
      indication: "positive",
      messages: [{ message: "Transaction approved by administrator" }],
    }

    // Start a session for transaction consistency
    const session = await mongoose.startSession()

    try {
      await session.withTransaction(async () => {
        console.log("=== STARTING DATABASE UPDATES ===")

        // Update the main transaction collection
        console.log("Updating main transaction with ID:", transactionId)
        const updatedTransaction = await CurrencyExchangeTransactionDataModel.findByIdAndUpdate(
          transactionId,
          {
            $set: {
              "statusesandlogs.status": "successful",
              "statusesandlogs.indication":
                "The currency exchange has been approved and converted the sent PHP currency into OMSIAPAWASTO",
              "details.amounts.deductions.successfulprocessing.amount": successfulDeductionAmount,
              "details.amounts.deductions.successfulprocessing.reasons": "Approved by administrator",
              "details.amounts.deductions.rejectionprocessing.amount": rejectedDeductionAmount || 0,
              "details.amounts.phppurchaseorexchangeamount": phpAmountVerification,
              "details.amounts.omsiapawasamounttorecieve": omsiapAmountVerification,
            },
            $push: {
              "statusesandlogs.logs": newStatusLog,
            },
          },
          { new: true, session },
        )

        if (!updatedTransaction) {
          throw new Error("Failed to update main transaction")
        }
        console.log("Main transaction updated successfully")

        // Update the registrant's transaction
        console.log("Updating registrant transaction...")
        console.log("Registrant ID:", registrant.id)
        console.log("Transaction ID:", transaction.id)
        console.log("Transaction Index:", transactionIndex)

        // First, let's verify the registrant and transaction exist before update
        const preUpdateCheck = await RegistrantDataModel.findOne(
          {
            id: registrant.id,
            "credits.omsiapawas.transactions.currencyexchange.id": transaction.id,
          },
          { "credits.omsiapawas.transactions.currencyexchange.$": 1 },
          { session },
        )

        console.log("Pre-update check result:", preUpdateCheck ? "Found" : "Not found")

        if (!preUpdateCheck) {
          throw new Error(`Cannot find registrant ${registrant.id} with transaction ${transaction.id} for update`)
        }

        // Perform the registrant update using the confirmed data
        const updateQuery = {
          id: registrant.id,
          "credits.omsiapawas.transactions.currencyexchange.id": transaction.id,
        }

        const updateDoc = {
          $set: {
            [`credits.omsiapawas.transactions.currencyexchange.${transactionIndex}.statusesandlogs.status`]:
              "successful",
            [`credits.omsiapawas.transactions.currencyexchange.${transactionIndex}.statusesandlogs.indication`]:
              "The currency exchange has been approved and converted the sent PHP currency into OMSIAPAWASTO",
            [`credits.omsiapawas.transactions.currencyexchange.${transactionIndex}.details.amounts.deductions.successfulprocessing.amount`]:
              successfulDeductionAmount,
            [`credits.omsiapawas.transactions.currencyexchange.${transactionIndex}.details.amounts.deductions.successfulprocessing.reasons`]:
              "Approved by administrator",
            [`credits.omsiapawas.transactions.currencyexchange.${transactionIndex}.details.amounts.deductions.rejectionprocessing.amount`]:
              rejectedDeductionAmount || 0,
            [`credits.omsiapawas.transactions.currencyexchange.${transactionIndex}.details.amounts.phppurchaseorexchangeamount`]:
              phpAmountVerification,
            [`credits.omsiapawas.transactions.currencyexchange.${transactionIndex}.details.amounts.omsiapawasamounttorecieve`]:
              omsiapAmountVerification,
          },
          $push: {
            [`credits.omsiapawas.transactions.currencyexchange.${transactionIndex}.statusesandlogs.logs`]: newStatusLog,
          },
          $inc: {
            "credits.omsiapawas.amount": omsiapAmountVerification,
          },
        }

        console.log("Update query:", JSON.stringify(updateQuery, null, 2))
        console.log("Update document keys:", Object.keys(updateDoc.$set))

        const updateResult = await RegistrantDataModel.updateOne(updateQuery, updateDoc, { session })

        console.log("Update result:", {
          acknowledged: updateResult.acknowledged,
          matchedCount: updateResult.matchedCount,
          modifiedCount: updateResult.modifiedCount,
          upsertedCount: updateResult.upsertedCount,
        })

        if (updateResult.matchedCount === 0) {
          throw new Error(
            `No registrant found matching query. Registrant ID: ${registrant.id}, Transaction ID: ${transaction.id}`,
          )
        }

        if (updateResult.modifiedCount === 0) {
          throw new Error(
            `Registrant document was matched but not modified. This might indicate the transaction is already in the target state.`,
          )
        }

        console.log("Registrant transaction updated successfully")
      })

      // Return success response
      return res.status(200).json({
        success: true,
        message: "Currency exchange transaction approved successfully",
        approvedAt: timestamps.getFormattedDate(),
        transaction: {
          id: transactionId,
          status: "successful",
          omsiapAmountAdded: omsiapAmountVerification,
          recipientId: recipientId,
        },
      })
    } catch (transactionError) {
      console.error("=== TRANSACTION ERROR ===")
      console.error("Error details:", transactionError)
      console.error("Error message:", transactionError.message)
      console.error("Error stack:", transactionError.stack)

      return res.status(500).json({
        success: false,
        message: "Failed to complete approval process: " + transactionError.message,
        debug: {
          errorType: transactionError.constructor.name,
          registrantId: recipientId,
          transactionId: transactionId,
        },
      })
    } finally {
      await session.endSession()
    }
  } catch (error) {
    console.error("=== GENERAL ERROR ===")
    console.error("Error approving currency exchange:", error)

    // Handle specific error types
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ success: false, message: "Invalid transaction ID format" })
    }

    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ success: false, message: "Validation error", errors: error.errors })
    }

    return res.status(500).json({ success: false, message: "Server error while processing approval" })
  }
})

// Reject currency exchange route
Router.post("/rejectcurrencyexchange", async (req, res) => {
  try {
    const {
      _id,
      id,
      phpAmountVerification,
      omsiapAmountVerification,
      successfulDeductionAmount,
      rejectedDeductionAmount,
      reason,
    } = req.body

    console.log("_ID" + " " + _id)
    console.log("ID" + " " + id)

    // Validate request data
    if (!id) {
      return res.status(400).json({ success: false, message: "Transaction ID is required" })
    }

    if (!reason || reason.trim() === "") {
      return res.status(400).json({ success: false, message: "Rejection reason is required" })
    }

    // Find the transaction using MongoDB's _id field
    const transaction = await CurrencyExchangeTransactionDataModel.findById(_id)

    // Check if transaction exists
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      })
    }

    // Check if transaction is already processed
    if (transaction.statusesandlogs.status === "approved") {
      return res.status(409).json({
        success: false,
        message: "Transaction has already been approved and cannot be rejected",
        status: "approved",
      })
    }

    if (transaction.statusesandlogs.status === "rejected") {
      return res.status(409).json({
        success: false,
        message: "Transaction has already been rejected",
        status: "rejected",
      })
    }

    // Create new status log entry
    const newStatusLog = {
      date: timestamps.getFormattedDate(),
      type: "rejection",
      indication: "negative",
      messages: [{ message: `Transaction rejected: ${reason}` }],
    }

    // Update the main transaction document using the MongoDB _id
    const updatedTransaction = await CurrencyExchangeTransactionDataModel.findByIdAndUpdate(
      _id, // Use the _id parameter directly
      {
        $set: {
          "statusesandlogs.status": "rejected",
          "statusesandlogs.indication": reason,
          "details.amounts.deductions.successfulprocessing.amount": successfulDeductionAmount || 0,
          "details.amounts.deductions.rejectionprocessing.amount": rejectedDeductionAmount,
          "details.amounts.deductions.rejectionprocessing.reasons": reason,
          ...(phpAmountVerification !== undefined
            ? { "details.amounts.phppurchaseorexchangeamount": phpAmountVerification }
            : {}),
          ...(omsiapAmountVerification !== undefined
            ? { "details.amounts.omsiapawasamounttorecieve": omsiapAmountVerification }
            : {}),
        },
        $push: {
          "statusesandlogs.logs": newStatusLog,
        },
      },
      { new: true },
    )

    if (!updatedTransaction) {
      return res.status(500).json({ success: false, message: "Failed to update transaction" })
    }

    // Update the transaction in the registrant's data
    try {
      // Find the registrant who made this transaction using the custom 'id' field
      const registrant = await RegistrantDataModel.findOne({
        "credits.omsiapawas.transactions.currencyexchange.id": transaction.id,
      })

      if (registrant) {
        // Update the specific transaction in the registrant's currency exchange array
        await RegistrantDataModel.updateOne(
          {
            _id: registrant._id,
            "credits.omsiapawas.transactions.currencyexchange.id": transaction.id,
          },
          {
            $set: {
              "credits.omsiapawas.transactions.currencyexchange.$.statusesandlogs.status": "rejected",
              "credits.omsiapawas.transactions.currencyexchange.$.statusesandlogs.indication": reason,
              "credits.omsiapawas.transactions.currencyexchange.$.details.amounts.deductions.successfulprocessing.amount":
                successfulDeductionAmount || 0,
              "credits.omsiapawas.transactions.currencyexchange.$.details.amounts.deductions.rejectionprocessing.amount":
                rejectedDeductionAmount,
              "credits.omsiapawas.transactions.currencyexchange.$.details.amounts.deductions.rejectionprocessing.reasons":
                reason,
              ...(phpAmountVerification !== undefined
                ? {
                    "credits.omsiapawas.transactions.currencyexchange.$.details.amounts.phppurchaseorexchangeamount":
                      phpAmountVerification,
                  }
                : {}),
              ...(omsiapAmountVerification !== undefined
                ? {
                    "credits.omsiapawas.transactions.currencyexchange.$.details.amounts.omsiapawasamounttorecieve":
                      omsiapAmountVerification,
                  }
                : {}),
            },
            $push: {
              "credits.omsiapawas.transactions.currencyexchange.$.statusesandlogs.logs": newStatusLog,
            },
          },
        )

        console.log(`Successfully updated transaction ${transaction.id} in registrant ${registrant.id} record`)
      } else {
        console.warn(`Registrant not found for transaction ${transaction.id}`)
      }
    } catch (registrantUpdateError) {
      console.error("Error updating registrant transaction:", registrantUpdateError)
      // Don't fail the entire operation if registrant update fails
      // The main transaction was already updated successfully
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Currency exchange transaction has been rejected",
      rejectedAt: timestamps.getFormattedDate(),
      transaction: {
        id: updatedTransaction._id,
        status: updatedTransaction.statusesandlogs.status,
        indication: updatedTransaction.statusesandlogs.indication,
        reason: reason,
      },
    })
  } catch (error) {
    console.error("Error rejecting currency exchange:", error)

    // Handle specific error types
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID format",
      })
    }

    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      })
    }

    return res.status(500).json({
      success: false,
      message: "Server error while processing rejection",
    })
  }
})

// Withdrawal route
Router.post("/widthdrawal", async (req, res) => {
  try {
    const { firstName, middleName, lastName, phoneNumber, amount, password, userId } = req.body

    // Basic validation
    if (!firstName || !lastName || !phoneNumber || !amount || !password || !userId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      })
    }

    // Convert string ID to MongoDB ObjectId
    let objectId
    try {
      objectId = new mongoose.Types.ObjectId(userId)
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      })
    }

    // Find user by ObjectId
    const user = await RegistrantDataModel.findOne({ _id: objectId })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Verify password using bcrypt
    const storedHashedPassword = user.passwords?.account?.password
    if (!storedHashedPassword) {
      return res.status(401).json({
        success: false,
        message: "Password information not found",
      })
    }

    // Compare plain password with hashed password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, storedHashedPassword)
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      })
    }

    // Check for sufficient balance
    const userBalance = user.credits?.omsiapawas?.amount || 0
    if (userBalance < Number.parseFloat(amount)) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      })
    }

    // Calculate deductions and final amount
    const processingFee = Number.parseFloat(amount) * 0.025 // Example: 2.5% processing fee
    const finalAmount = Number.parseFloat(amount) - processingFee

    // Create a new withdrawal transaction record
    const withdrawalTransaction = new WidthdrawalTransactionDataModel({
      id: uuidv4(),
      intent: "withdrawal",
      statusesandlogs: {
        status: "pending",
        indication: "waiting for approval",
        logs: [
          {
            date: timestamps.getFormattedDate(),
            type: "first submission",
            indication: "first log, waiting for approval",
            messages: [{ message: "Withdrawal request received" }],
          },
        ],
      },
      details: {
        paymentmethod: "gcash", // Assuming GCash as payment method
        thistransactionismadeby: {
          id: userId,
          name: {
            firstname: firstName,
            middlename: middleName || "",
            lastname: lastName,
            nickname: user.name?.nickname || "",
          },
          contact: {
            phonenumber: phoneNumber,
            emailaddress: user.contact?.emailaddress || "",
            address: {
              street: user.contact?.address?.street || "",
              trademark: user.contact?.address?.trademark || "",
              baranggay: user.contact?.address?.baranggay || "",
              city: user.contact?.address?.city || "",
              province: user.contact?.address?.province || "",
              postal_zip_code: user.contact?.address?.postal_zip_code || "",
              country: user.contact?.address?.country || "Philippines",
            },
          },
        },
        thistransactionismainlyintendedto: {
          id: "system_account",
          name: {
            firstname: "System",
            middlename: "",
            lastname: "Account",
            nickname: "SysAccount",
          },
          contact: {
            phonenumber: "12345678900",
            emailaddress: "system@example.com",
            address: {
              street: "",
              trademark: "Company HQ",
              baranggay: "",
              city: "Metro Manila",
              province: "",
              postal_zip_code: "",
              country: "Philippines",
            },
          },
        },
        amounts: {
          intent: Number.parseFloat(amount),
          deductions: {
            successfulprocessing: {
              amount: processingFee,
              reasons: "Processing fee",
            },
            rejectionprocessing: {
              amount: 0,
              reasons: "",
            },
          },
          profit: processingFee,
          phpamounttorecieve: finalAmount,
        },
        referrence: {
          number: phoneNumber,
          gcashtransactionrecieptimage: "",
        },
      },
    })

    // Save the transaction to database
    const savedTransaction = await withdrawalTransaction.save()

    // Update user's balance and add transaction to their widthdrawals array
    if (!user.credits) {
      user.credits = { omsiapawas: { amount: 0, transactions: { widthdrawals: [] } } }
    }
    if (!user.credits.omsiapawas) {
      user.credits.omsiapawas = { amount: 0, transactions: { widthdrawals: [] } }
    }
    if (!user.credits.omsiapawas.transactions) {
      user.credits.omsiapawas.transactions = { widthdrawals: [] }
    }
    if (!user.credits.omsiapawas.transactions.widthdrawals) {
      user.credits.omsiapawas.transactions.widthdrawals = []
    }

    // Deduct the withdrawal amount from user's balance
    // user.credits.omsiapawas.amount -= parseFloat(amount);

    // Push the withdrawal transaction to user's widthdrawals array
    user.credits.omsiapawas.transactions.widthdrawals.push(savedTransaction)

    // Save the updated user document
    await user.save()

    // Respond with success
    return res.status(200).json({
      success: true,
      message: "Withdrawal request has been submitted successfully",
      transactionId: withdrawalTransaction.id,
      amount: finalAmount,
      status: "pending",
      estimatedCompletionTime: "24-48 hours",
      remainingBalance: user.credits.omsiapawas.amount,
    })
  } catch (err) {
    console.error("Withdrawal error:", err)

    // Handle different types of errors
    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error: " + err.message,
      })
    } else if (err.name === "MongoError" && err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate transaction detected",
      })
    } else if (err.name === "MongooseServerSelectionError") {
      return res.status(503).json({
        success: false,
        message: "Database connection error. Please try again later.",
      })
    } else {
      // General server error
      return res.status(500).json({
        success: false,
        message: "An error occurred while processing your withdrawal request",
      })
    }
  }
})

// Approve withdrawal route - FIXED VERSION
Router.post("/approvewithdrawal", multerInstances.withdrawals.single("receipt"), async (req, res) => {
  try {
    const { transactionId, successfulProcessingDeduction, intent, phpAmountToReceive } = req.body

    // Validate required fields
    if (!transactionId || !successfulProcessingDeduction) {
      // Delete uploaded file if validation fails
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path)
      }

      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      })
    }

    // Find the withdrawal transaction
    const withdrawalTransaction = await WidthdrawalTransactionDataModel.findById(transactionId)

    if (!withdrawalTransaction) {
      // Delete uploaded file if transaction not found
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path)
      }

      return res.status(404).json({
        success: false,
        message: "Withdrawal transaction not found",
      })
    }

    // Check if already processed
    if (
      withdrawalTransaction.statusesandlogs.status === "successful" ||
      withdrawalTransaction.statusesandlogs.status === "rejected"
    ) {
      // Delete uploaded file if transaction already processed
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path)
      }

      return res.status(409).json({
        success: false,
        message: "This withdrawal has already been processed",
      })
    }

    // Find the user who made the withdrawal
    const userId = withdrawalTransaction.details.thistransactionismadeby.id
    const user = await RegistrantDataModel.findById(userId)

    if (!user) {
      // Delete uploaded file if user not found
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path)
      }

      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Get withdrawal amount from transaction
    const withdrawalAmount = withdrawalTransaction.details.amounts.intent || 0
    const processingFee = Number.parseFloat(successfulProcessingDeduction) || 0

    // Check if user has sufficient balance (only need to check withdrawal amount)
    const currentBalance = user.credits?.omsiapawas?.amount || 0
    if (currentBalance < withdrawalAmount) {
      // Delete uploaded file if insufficient balance
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path)
      }

      return res.status(400).json({
        success: false,
        message: "Insufficient balance for withdrawal",
        details: {
          currentBalance,
          withdrawalAmount,
          processingFee,
        },
      })
    }

    // Create new log entry
    const formattedDate = timestamps.getFormattedDate()
    const newLogEntry = {
      date: formattedDate,
      type: "approval",
      indication: "success",
      messages: [{ message: "Withdrawal approved and processed" }],
    }

    // Update transaction data
    withdrawalTransaction.statusesandlogs.status = "successful"
    withdrawalTransaction.statusesandlogs.indication = "The withdrawal has been approved and processed"
    withdrawalTransaction.statusesandlogs.date = formattedDate

    // Add new log entry
    if (!withdrawalTransaction.statusesandlogs.logs) {
      withdrawalTransaction.statusesandlogs.logs = []
    }
    withdrawalTransaction.statusesandlogs.logs.push(newLogEntry)

    // Update deduction amount
    if (!withdrawalTransaction.details.amounts.deductions) {
      withdrawalTransaction.details.amounts.deductions = {}
    }

    withdrawalTransaction.details.amounts.deductions.successfulprocessing = {
      amount: processingFee,
      reasons: "Withdrawal processing fee",
    }

    // Calculate profit (processing fee only)
    withdrawalTransaction.details.amounts.profit = processingFee

    // Set PHP amount to receive (withdrawal amount minus processing fee)
    withdrawalTransaction.details.amounts.phpamounttorecieve = withdrawalAmount - processingFee

    // Update receipt image path if uploaded
    if (req.file) {
      const imageFilename = req.file.filename
      const relativePath = `/images/withdrawals/${imageFilename}`

      if (!withdrawalTransaction.details.referrence) {
        withdrawalTransaction.details.referrence = {}
      }

      withdrawalTransaction.details.referrence.gcashtransactionrecieptimage = relativePath
    }

    // *** CRITICAL FIX: Deduct only the withdrawal amount from user's credits ***
    user.credits.omsiapawas.amount -= withdrawalAmount

    // Update user's withdrawal transactions
    const userWithdrawalIndex = user.credits?.omsiapawas?.transactions?.widthdrawals?.findIndex(
      (tx) => tx._id.toString() === transactionId.toString() || tx.id === transactionId,
    )

    if (userWithdrawalIndex !== -1 && userWithdrawalIndex !== undefined) {
      user.credits.omsiapawas.transactions.widthdrawals[userWithdrawalIndex] = withdrawalTransaction
    }

    // Save both user and transaction
    await user.save()
    await withdrawalTransaction.save()

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Withdrawal approved successfully",
      transactionId: withdrawalTransaction._id,
      processingDate: formattedDate,
      details: {
        withdrawalAmount,
        processingFee,
        deductedFromCredits: withdrawalAmount,
        remainingBalance: user.credits.omsiapawas.amount,
        phpAmountToReceive: withdrawalAmount - processingFee,
      },
    })
  } catch (error) {
    console.error("Error approving withdrawal:", error)

    // Delete uploaded file if error occurs
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path)
      } catch (unlinkError) {
        console.error("Error deleting file after approval failure:", unlinkError)
      }
    }

    // Handle specific error types
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID format",
      })
    }

    // Return error response
    return res.status(500).json({
      success: false,
      message: "Server error while approving withdrawal",
      error: error.message,
    })
  }
})

// Reject withdrawal route
Router.post("/rejectwithdrawal", async (req, res) => {
  try {
    // Extract data from request body
    const { transactionId, rejectionProcessingDeduction, rejectionReason, intent } = req.body

    console.log("Transaction ID:", transactionId)
    console.log("Rejection Deduction:", rejectionProcessingDeduction)
    console.log("Rejection Reason:", rejectionReason)

    // Validate required fields
    if (!transactionId || !rejectionProcessingDeduction || !rejectionReason) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: transactionId, rejectionProcessingDeduction, and rejectionReason are required",
      })
    }

    // Validate that rejection processing deduction is a number
    const deductionAmount = Number.parseFloat(rejectionProcessingDeduction)
    if (isNaN(deductionAmount) || deductionAmount < 0) {
      return res.status(400).json({
        success: false,
        message: "Rejection processing deduction must be a valid positive number",
      })
    }

    // Find the withdrawal transaction
    const withdrawalTransaction = await WidthdrawalTransactionDataModel.findById(transactionId)

    if (!withdrawalTransaction) {
      return res.status(404).json({
        success: false,
        message: "Withdrawal transaction not found",
      })
    }

    // Check if already processed
    if (
      withdrawalTransaction.statusesandlogs.status === "successful" ||
      withdrawalTransaction.statusesandlogs.status === "rejected"
    ) {
      return res.status(409).json({
        success: false,
        message: "This withdrawal has already been processed",
      })
    }

    // Get formatted date for logs
    const formattedDate = timestamps.getFormattedDate()

    // Create new log entry
    const newLogEntry = {
      date: formattedDate,
      type: "rejection",
      indication: "rejected",
      messages: [{ message: rejectionReason }],
    }

    // Update transaction data
    withdrawalTransaction.statusesandlogs.status = "rejected"
    withdrawalTransaction.statusesandlogs.indication = rejectionReason
    withdrawalTransaction.statusesandlogs.date = formattedDate

    // Add new log entry
    if (!withdrawalTransaction.statusesandlogs.logs) {
      withdrawalTransaction.statusesandlogs.logs = []
    }
    withdrawalTransaction.statusesandlogs.logs.push(newLogEntry)

    // Update deduction amount
    if (!withdrawalTransaction.details.amounts.deductions) {
      withdrawalTransaction.details.amounts.deductions = {}
    }

    withdrawalTransaction.details.amounts.deductions.rejectionprocessing = {
      amount: deductionAmount,
      reasons: rejectionReason,
    }

    // Find the user who made the withdrawal
    const userId = withdrawalTransaction.details.thistransactionismadeby.id
    const user = await RegistrantDataModel.findById(userId)

    if (!user) {
      console.warn(`User with ID ${userId} not found when rejecting withdrawal ${transactionId}`)
    } else {
      // Update user's withdrawal transactions
      const userWithdrawalIndex = user.credits?.omsiapawas?.transactions?.widthdrawals?.findIndex(
        (tx) => tx._id.toString() === transactionId.toString() || tx.id === transactionId,
      )

      if (userWithdrawalIndex !== -1 && userWithdrawalIndex !== undefined) {
        user.credits.omsiapawas.transactions.widthdrawals[userWithdrawalIndex] = withdrawalTransaction
        await user.save()
      }
    }

    // Save the updated transaction
    await withdrawalTransaction.save()

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Withdrawal rejected successfully",
      transactionId: withdrawalTransaction._id,
      processingDate: formattedDate,
    })
  } catch (error) {
    console.error("Error rejecting withdrawal:", error)

    // Handle specific error types
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID format",
      })
    }

    // Return error response
    return res.status(500).json({
      success: false,
      message: "Server error while rejecting withdrawal",
      error: error.message,
    })
  }
})

Router.put("/profile/update", (req, res, next) => {
  // Use multer fields to handle multiple file uploads
  const uploadHandler = multerInstances.documents.fields(documentFields)

  // Add timeout handling for large file uploads
  const requestTimeout = setTimeout(() => {
    return res.status(408).json({
      success: false,
      message: "Request timeout. Please try again with smaller files or a better connection.",
    })
  }, 120000) // 2 minute timeout for file uploads

  uploadHandler(req, res, async (err) => {
    // Clear the timeout once handler is executing
    clearTimeout(requestTimeout)

    if (err instanceof multer.MulterError) {
      // Specific multer file upload errors
      let errorMessage = "File upload error"

      if (err.code === "LIMIT_FILE_SIZE") {
        errorMessage = "File too large. Maximum file size is 5MB."
      } else if (err.code === "LIMIT_FILE_COUNT") {
        errorMessage = "Too many files uploaded. Please try again."
      } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
        errorMessage = `Unexpected file field: ${err.field}. Please use the correct form fields.`
      } else {
        errorMessage = `${err.message}`
      }

      return res.status(400).json({
        success: false,
        message: errorMessage,
      })
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: `Error: ${err.message}`,
      })
    }

    try {
      // Validate required fields
      const { firstName, lastName, userId } = req.body

      if (!firstName || !lastName) {
        return res.status(400).json({
          success: false,
          message: "First name and last name are required",
        })
      }

      // Validate userId is provided
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required",
        })
      }

      // Get current user from database using the provided userId
      const user = await RegistrantDataModel.findById(userId)

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" })
      }

      // Optional: Implement additional authorization check if needed
      // For example, check if the requester is allowed to update this user
      // This could be based on a token, API key, or other authentication method

      // Process text fields for profile update
      const { middleName, phoneNumber } = req.body

      // Update user profile information
      user.name.firstname = firstName
      user.name.middlename = middleName !== undefined ? middleName : user.name.middlename
      user.name.lastname = lastName

      if (phoneNumber) {
        // Basic phone validation
        const phoneRegex = /^\+?[0-9\s\-()]{8,20}$/
        if (!phoneRegex.test(phoneNumber)) {
          return res.status(400).json({
            success: false,
            message: "Invalid phone number format",
          })
        }
        user.contact.phonenumber = phoneNumber
      }

      // Process uploaded documents (if any)
      // Initialize personaldata if it doesn't exist
      if (!user.personaldata) {
        user.personaldata = {}
      }

      // Initialize government ID and birth certificate structures if they don't exist
      if (!user.personaldata.government_issued_identification) {
        user.personaldata.government_issued_identification = {
          frontphoto: {},
          backphoto: {},
        }
      }

      if (!user.personaldata.birthcertificate) {
        user.personaldata.birthcertificate = {
          frontphoto: {},
          backphoto: {},
        }
      }

      // Flag to track if any document was uploaded
      let documentUploaded = false

      // Check which files were uploaded in this request
      if (req.files) {
        const formattedDate = timestamps.getFormattedDate()

        // Process birth certificate front if uploaded
        if (req.files.birthCertificateFront) {
          documentUploaded = true
          const file = req.files.birthCertificateFront[0]
          const newFilePath = `/images/documents/${file.filename}`

          // If there was a previous document, mark it for deletion
          if (
            user.personaldata.birthcertificate &&
            user.personaldata.birthcertificate.frontphoto &&
            user.personaldata.birthcertificate.frontphoto.image
          ) {
            const oldPath = path.join(
              __dirname,
              "../../../view/public",
              user.personaldata.birthcertificate.frontphoto.image,
            )
            removeOldDocument(oldPath)
          }

          // Update with new document info
          user.personaldata.birthcertificate.frontphoto = {
            name: "Birth Certificate (Front)",
            description: "Front side of birth certificate",
            image: newFilePath,
            uploaddate: formattedDate,
          }
        }

        // Process birth certificate back if uploaded
        if (req.files.birthCertificateBack) {
          documentUploaded = true
          const file = req.files.birthCertificateBack[0]
          const newFilePath = `/images/documents/${file.filename}`

          if (
            user.personaldata.birthcertificate &&
            user.personaldata.birthcertificate.backphoto &&
            user.personaldata.birthcertificate.backphoto.image
          ) {
            const oldPath = path.join(
              __dirname,
              "../../../view/public",
              user.personaldata.birthcertificate.backphoto.image,
            )
            removeOldDocument(oldPath)
          }

          user.personaldata.birthcertificate.backphoto = {
            name: "Birth Certificate (Back)",
            description: "Back side of birth certificate",
            image: newFilePath,
            uploaddate: formattedDate,
          }
        }

        // Process government ID front if uploaded
        if (req.files.governmentIdFront) {
          documentUploaded = true
          const file = req.files.governmentIdFront[0]
          const newFilePath = `/images/documents/${file.filename}`

          if (
            user.personaldata.government_issued_identification &&
            user.personaldata.government_issued_identification.frontphoto &&
            user.personaldata.government_issued_identification.frontphoto.image
          ) {
            const oldPath = path.join(
              __dirname,
              "../../../view/public",
              user.personaldata.government_issued_identification.frontphoto.image,
            )
            removeOldDocument(oldPath)
          }

          user.personaldata.government_issued_identification.frontphoto = {
            name: "Government ID (Front)",
            description: "Front side of government ID",
            image: newFilePath,
            uploaddate: formattedDate,
          }
        }

        // Process government ID back if uploaded
        if (req.files.governmentIdBack) {
          documentUploaded = true
          const file = req.files.governmentIdBack[0]
          const newFilePath = `/images/documents/${file.filename}`

          if (
            user.personaldata.government_issued_identification &&
            user.personaldata.government_issued_identification.backphoto &&
            user.personaldata.government_issued_identification.backphoto.image
          ) {
            const oldPath = path.join(
              __dirname,
              "../../../view/public",
              user.personaldata.government_issued_identification.backphoto.image,
            )
            removeOldDocument(oldPath)
          }

          user.personaldata.government_issued_identification.backphoto = {
            name: "Government ID (Back)",
            description: "Back side of government ID",
            image: newFilePath,
            uploaddate: formattedDate,
          }
        }
      }

      // Check if any documents were specifically removed
      try {
        const documentsToRemove = req.body.removedDocuments ? JSON.parse(req.body.removedDocuments) : []

        if (documentsToRemove.length > 0) {
          documentsToRemove.forEach((docField) => {
            // Handle government ID removal
            if (
              docField === "governmentIdFront" &&
              user.personaldata.government_issued_identification &&
              user.personaldata.government_issued_identification.frontphoto &&
              user.personaldata.government_issued_identification.frontphoto.image
            ) {
              const oldPath = path.join(
                __dirname,
                "../../../view/public",
                user.personaldata.government_issued_identification.frontphoto.image,
              )
              removeOldDocument(oldPath)
              user.personaldata.government_issued_identification.frontphoto = {}
            }

            if (
              docField === "governmentIdBack" &&
              user.personaldata.government_issued_identification &&
              user.personaldata.government_issued_identification.backphoto &&
              user.personaldata.government_issued_identification.backphoto.image
            ) {
              const oldPath = path.join(
                __dirname,
                "../../../view/public",
                user.personaldata.government_issued_identification.backphoto.image,
              )
              removeOldDocument(oldPath)
              user.personaldata.government_issued_identification.backphoto = {}
            }

            // Handle birth certificate removal
            if (
              docField === "birthCertificateFront" &&
              user.personaldata.birthcertificate &&
              user.personaldata.birthcertificate.frontphoto &&
              user.personaldata.birthcertificate.frontphoto.image
            ) {
              const oldPath = path.join(
                __dirname,
                "../../../view/public",
                user.personaldata.birthcertificate.frontphoto.image,
              )
              removeOldDocument(oldPath)
              user.personaldata.birthcertificate.frontphoto = {}
            }

            if (
              docField === "birthCertificateBack" &&
              user.personaldata.birthcertificate &&
              user.personaldata.birthcertificate.backphoto &&
              user.personaldata.birthcertificate.backphoto.image
            ) {
              const oldPath = path.join(
                __dirname,
                "../../../view/public",
                user.personaldata.birthcertificate.backphoto.image,
              )
              removeOldDocument(oldPath)
              user.personaldata.birthcertificate.backphoto = {}
            }
          })
        }
      } catch (parseError) {
        console.error("Error parsing removedDocuments:", parseError)
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
            registrationlog: [],
          }
        } else {
          // Update the indication only
          user.registrationstatusesandlogs.indication = "Pending Documents"
        }

        // Add a new log entry for this status change
        const logEntry = {
          date: timestamps.getFormattedDate(),
          type: "document_upload",
          indication: "Pending Documents",
          messages: [{ message: "User uploaded new document(s). Verification pending." }],
        }

        // Add the log entry to registrationLog array
        if (!user.registrationstatusesandlogs.registrationlog) {
          user.registrationstatusesandlogs.registrationlog = [logEntry]
        } else {
          user.registrationstatusesandlogs.registrationlog.push(logEntry)
        }
      }

      // Save the updated user profile
      await user.save()

      // Prepare document information for response
      const documentInfo = {
        governmentIdFront: user.personaldata.government_issued_identification?.frontphoto?.image || null,
        governmentIdBack: user.personaldata.government_issued_identification?.backphoto?.image || null,
        birthCertificateFront: user.personaldata.birthcertificate?.frontphoto?.image || null,
        birthCertificateBack: user.personaldata.birthcertificate?.backphoto?.image || null,
      }

      // Return success response
      return res.status(200).json({
        success: true,
        message: documentUploaded
          ? "Profile updated successfully. Document verification pending."
          : "Profile updated successfully",
        data: {
          firstName: user.name.firstname,
          middleName: user.name.middlename,
          lastName: user.name.lastname,
          phoneNumber: user.contact.phonenumber,
          documents: documentInfo,
          registrationStatus: user.registrationstatusesandlogs?.indication || null,
        },
      })
    } catch (error) {
      console.error("Profile update error:", error)
      return res.status(500).json({
        success: false,
        message: "Server error while updating profile. Please try again later.",
      })
    }
  })
})

// Updated verifymfatipregistrant route
Router.post("/verifymfatipregistrant", async (req, res) => {
  try {
    const { id, originalData, updatedData, registrationInfo, action } = req.body

    // Validate input
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Registrant ID is required",
      })
    }

    if (!updatedData || !updatedData.firstname || !updatedData.lastname) {
      return res.status(400).json({
        success: false,
        message: "First name and last name are required",
      })
    }

    if (!action || !["verify", "reject"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Valid action (verify or reject) is required",
      })
    }

    // Find the registrant
    const user = await RegistrantDataModel.findById(id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Registrant not found",
      })
    }

    // Check if already verified (only for verify action)
    if (action === "verify" && user.registrationstatusesandlogs.indication === "Verified") {
      return res.status(409).json({
        success: false,
        message: "Registrant is already verified",
      })
    }

    // Prepare update data - using nested name structure
    const updateData = {
      "name.firstname": updatedData.firstname,
      "name.middlename": updatedData.middlename || "",
      "name.lastname": updatedData.lastname,
      "name.nickname": updatedData.nickname || "",
    }

    // Create log entry based on action
    const logEntry = {
      date: timestamps.getFormattedDate(),
      type: action === "verify" ? "verification" : "rejection",
      indication: action === "verify" ? "Verified" : "Rejected",
      messages: [],
    }

    // Add appropriate messages based on action
    if (action === "verify") {
      logEntry.messages.push({
        message: "Account verified by administrator",
      })

      // Check if name was updated
      const nameChanged =
        originalData.firstname !== updatedData.firstname ||
        originalData.middlename !== updatedData.middlename ||
        originalData.lastname !== updatedData.lastname ||
        originalData.nickname !== updatedData.nickname

      if (nameChanged) {
        const originalFullName =
          `${originalData.firstname || ""} ${originalData.middlename || ""} ${originalData.lastname || ""}`.trim()
        const updatedFullName =
          `${updatedData.firstname || ""} ${updatedData.middlename || ""} ${updatedData.lastname || ""}`.trim()

        logEntry.messages.push({
          message: `Name updated from "${originalFullName}" to "${updatedFullName}"`,
        })
      }
    } else {
      logEntry.messages.push({
        message: "Account rejected by administrator",
      })
    }

    // Prepare the update query
    const updateQuery = {
      $set: {
        ...updateData,
        "registrationstatusesandlogs.indication": action === "verify" ? "Verified" : "Rejected",
        "registrationstatusesandlogs.type": "Month Financial Allocation To Individual People ( MFATIP )",
      },
      $push: {
        "registrationstatusesandlogs.registrationlog": logEntry,
      },
    }

    // Update registrant
    const updatedUser = await RegistrantDataModel.findByIdAndUpdate(id, updateQuery, {
      new: true, // Return updated document
      runValidators: true, // Run schema validators
    })

    if (!updatedUser) {
      return res.status(500).json({
        success: false,
        message: "Failed to update registrant",
      })
    }

    // Success response
    res.status(200).json({
      success: true,
      message: `Registrant ${action === "verify" ? "verified" : "rejected"} successfully`,
      registrant: {
        _id: updatedUser._id,
        name: {
          firstname: updatedUser.name.firstname,
          middlename: updatedUser.name.middlename,
          lastname: updatedUser.name.lastname,
          nickname: updatedUser.name.nickname,
        },
        registrationstatusesandlogs: updatedUser.registrationstatusesandlogs,
      },
    })
  } catch (error) {
    console.error("Error processing MFATIP registrant:", error)

    // Handle specific MongoDB errors
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid registrant ID format",
      })
    }

    if (error.name === "ValidationError") {
      return res.status(422).json({
        success: false,
        message: "Validation error: " + error.message,
      })
    }

    if (error.name === "MongoNetworkError") {
      return res.status(503).json({
        success: false,
        message: "Database connection error. Please try again later.",
      })
    }

    if (error.name === "MongoTimeoutError") {
      return res.status(408).json({
        success: false,
        message: "Database operation timed out. Please try again.",
      })
    }

    // Generic server error
    res.status(500).json({
      success: false,
      message: "Internal server error occurred while processing registrant",
    })
  }
})

// Backend: /rejectmfatipregistrant route
Router.post("/rejectmfatipregistrant", async (req, res) => {
  try {
    const { id } = req.body

    // Validate input
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Registrant ID is required",
      })
    }

    // Find the registrant
    const user = await RegistrantDataModel.findById(id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Registrant not found",
      })
    }

    // Check if already rejected
    if (user.registrationstatusesandlogs.indication === "Rejected") {
      return res.status(409).json({
        success: false,
        message: "Registrant is already rejected",
      })
    }

    // Create rejection log entry using custom timestamps
    const rejectionLogEntry = {
      date: timestamps.getFormattedDate(),
      type: "rejection",
      indication: "Rejected",
      messages: [
        {
          message: "Account rejected by administrator",
        },
      ],
    }

    // Update registrant status
    const updatedUser = await RegistrantDataModel.findByIdAndUpdate(
      id,
      {
        $set: {
          "registrationstatusesandlogs.indication": "Rejected Documents",
          "registrationstatusesandlogs.type": "Month Financial Allocation To Individual People ( MFATIP )",
        },
        $push: {
          "registrationstatusesandlogs.registrationlog": rejectionLogEntry,
        },
      },
      {
        new: true, // Return updated document
        runValidators: true, // Run schema validators
      },
    )

    if (!updatedUser) {
      return res.status(500).json({
        success: false,
        message: "Failed to update registrant status",
      })
    }

    // Success response
    res.status(200).json({
      success: true,
      message: "Registrant rejected successfully",
      registrant: {
        _id: updatedUser._id,
        registrationstatusesandlogs: updatedUser.registrationstatusesandlogs,
        name: updatedUser.name,
      },
    })
  } catch (error) {
    console.error("Error rejecting MFATIP registrant:", error)

    // Handle specific MongoDB errors
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid registrant ID format",
      })
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error: " + error.message,
      })
    }

    // Generic server error
    res.status(500).json({
      success: false,
      message: "Internal server error occurred while rejecting registrant",
    })
  }
})

Router.post("/order-receive", async (req, res) => {
  try {
    // Validate input
    if (!req.body || !req.body.transactionId) {
      return res.status(400).json({ error: "Transaction ID is required" })
    }

    const { transactionId } = req.body

    // Find the transaction in the MerchandiseTransaction collection
    const transaction = await MerchandiseTransactionDataModel.findOne({
      id: transactionId,
    })

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" })
    }

    // Add this check after finding the transaction
    if (transaction.statusesandlogs.status === "completed") {
      return res.status(400).json({
        error: "Transaction already processed",
      })
    }

    // Find the current registrant (the one receiving the order)
    let currentRegistrant
    const recipientId = transaction.system.thistransactionismadeby.id

    try {
      // Try to find by MongoDB ObjectID first
      currentRegistrant = await RegistrantDataModel.findById(recipientId)
    } catch (e) {
      // If that fails, try as custom id field
      currentRegistrant = await RegistrantDataModel.findOne({ id: recipientId })
    }

    if (!currentRegistrant) {
      return res.status(404).json({ error: "Recipient registrant not found" })
    }

    // Enhanced debugging
    console.log("Current Registrant Details:")
    console.log("- ID:", currentRegistrant._id)
    console.log("- Custom ID:", currentRegistrant.id)
    console.log("- Type:", currentRegistrant.registrationstatusesandlogs.type)
    console.log("- Indication:", currentRegistrant.registrationstatusesandlogs.indication)

    // Ensure credits structure exists
    currentRegistrant = ensureCreditsStructure(currentRegistrant)

    // Calculate total transaction giveaway from all merchandise
    let totalTransactionGiveaway = 0

    transaction.details.merchandise.list.forEach((product) => {
      // Use precise calculation - multiply giveaway by quantity
      const productGiveaway = preciseMultiply(product.details.price.transactiongiveaway, product.quantity)
      totalTransactionGiveaway = preciseAdd(totalTransactionGiveaway, productGiveaway)
    })

    if (totalTransactionGiveaway <= 0) {
      return res.status(400).json({
        error: "No transaction giveaway amount to distribute",
      })
    }

    // Calculate precise distribution amounts (60% to current user, 40% to distribute)
    const currentUserAmount = preciseMultiply(totalTransactionGiveaway, 0.6)
    const distributionPoolAmount = preciseSub(totalTransactionGiveaway, currentUserAmount)

    // Update current registrant's credits (60% share)
    currentRegistrant.credits.omsiapawas.amount = preciseAdd(
      currentRegistrant.credits.omsiapawas.amount,
      currentUserAmount,
    )

    // Add transaction record to current user's omsiapawas transfers
    if (!currentRegistrant.credits.omsiapawas.transactions) {
      currentRegistrant.credits.omsiapawas.transactions = {
        currencyexchange: [],
        widthdrawals: [],
        omsiapawastransfer: [],
      }
    }

    currentRegistrant.credits.omsiapawas.transactions.omsiapawastransfer.push({
      id: generateTransactionId(),
      type: "giveaway_receive",
      amount: currentUserAmount,
      from: "system",
      transactionReference: transactionId,
      date: new Date().toISOString(),
      description: `Transaction giveaway - 60% share from order ${transactionId}`,
    })

    // Save current registrant updates
    await currentRegistrant.save()

    // GET OR CREATE PENDING FUNDS
    let pendingFunds = await PendingFundsDataModel.findOne()
    if (!pendingFunds) {
      pendingFunds = new PendingFundsDataModel({ amount: 0 })
      await pendingFunds.save()
    }

    console.log("Pending Funds before distribution:", pendingFunds.amount)

    // Calculate total amount available for distribution (40% + pending funds)
    const totalDistributionAmount = preciseAdd(distributionPoolAmount, pendingFunds.amount)

    console.log("Distribution Pool (40%):", distributionPoolAmount)
    console.log("Previous Pending Funds:", pendingFunds.amount)
    console.log("Total Distribution Amount:", totalDistributionAmount)

    // Determine distribution strategy based on current user type
    let distributionQuery = {}
    const currentUserType = currentRegistrant.registrationstatusesandlogs.type

    console.log("Distribution Query Setup:")
    console.log("- Current User Type:", currentUserType)
    console.log("- Current User _id:", currentRegistrant._id)

    switch (currentUserType) {
      case "Month Financial Allocation To Individual People ( MFATIP )":
        // MFATIP: distribute to all users (no type restriction)
        distributionQuery = {
          _id: { $ne: currentRegistrant._id }, // Exclude current user
        }
        console.log("- Using MFATIP distribution query")
        break

      case "public":
        // Public: distribute to both public and private users
        distributionQuery = {
          _id: { $ne: currentRegistrant._id },
          "registrationstatusesandlogs.type": { $in: ["public", "private"] },
        }
        console.log("- Using public distribution query")
        break

      case "private":
        // Private: distribute only to private users
        distributionQuery = {
          _id: { $ne: currentRegistrant._id },
          "registrationstatusesandlogs.type": "private",
        }
        console.log("- Using private distribution query")
        break

      default:
        // Default: distribute to all users with active indication
        distributionQuery = {
          _id: { $ne: currentRegistrant._id },
          "registrationstatusesandlogs.indication": "Verified",
        }
        console.log("- Using default distribution query")
    }

    console.log("Final Distribution Query:", JSON.stringify(distributionQuery, null, 2))

    // Get eligible users for distribution
    const eligibleUsers = await RegistrantDataModel.find(distributionQuery)
    const eligibleUsersCount = eligibleUsers.length

    console.log("Eligible users found:", eligibleUsersCount)

    // Variables for UI notification
    let isNegativeDistribution = false
    let newPendingFundsAmount = 0
    let amountPerUser = 0
    let distributionCount = 0

    if (eligibleUsersCount === 0) {
      console.log("No eligible users found for distribution")

      // Since no users to distribute to, add the distribution amount to pending funds
      newPendingFundsAmount = preciseAdd(pendingFunds.amount, distributionPoolAmount)
      pendingFunds.amount = newPendingFundsAmount
      await pendingFunds.save()

      // Update transaction status and return
      await updateTransactionStatus(transactionId, "completed")
      await updateUserTransactionStatus(currentRegistrant._id, transactionId, "completed")

      // Move purchases from pending to accepted
      const purchaseMoveResult = await movePurchaseFromPendingToAccepted(transactionId)
      
      if (purchaseMoveResult.success && purchaseMoveResult.movedCount > 0) {
        console.log(`Successfully moved purchases from pending to accepted:`)
        console.log(`- Products affected: ${purchaseMoveResult.movedCount}`)
        console.log(`- Product IDs: ${purchaseMoveResult.productIds.join(', ')}`)
      } else if (!purchaseMoveResult.success) {
        console.error('Failed to move purchases from pending to accepted:', purchaseMoveResult.error)
      }

      return res.status(200).json({
        success: true,
        message: "Order received successfully - no users eligible for distribution",
        transactionId: transactionId,
        currentUserGiveaway: currentUserAmount,
        distributionAmount: 0,
        distributionCount: 0,
        totalGiveaway: totalTransactionGiveaway,
        pendingFundsNotification: {
          isNegativeDistribution: false,
          pendingFunds: newPendingFundsAmount,
          transactionGiveaway: distributionPoolAmount,
          totalEligibleUsers: 0,
        },
        purchaseUpdate: purchaseMoveResult,
      })
    }

    // Calculate amount per user using total distribution amount
    amountPerUser = preciseDiv(totalDistributionAmount, eligibleUsersCount)

    console.log("Amount per user:", amountPerUser)

    // Check if distribution amount per user is negative
    if (amountPerUser < 0) {
      isNegativeDistribution = true
      console.log("Negative distribution detected - storing as pending funds")

      // Store the negative amount as new pending funds
      newPendingFundsAmount = totalDistributionAmount // This will be negative
      pendingFunds.amount = newPendingFundsAmount
      await pendingFunds.save()

      // Don't distribute negative amounts to users
      amountPerUser = 0
    } else {
      // Positive distribution - reset pending funds to 0
      newPendingFundsAmount = 0
      pendingFunds.amount = 0
      await pendingFunds.save()

      // Distribute to eligible users
      const distributionTransactionId = generateTransactionId()

      for (const user of eligibleUsers) {
        try {
          // Ensure credits structure exists for each user
          const userWithCredits = ensureCreditsStructure(user)

          // Add amount to user's balance
          userWithCredits.credits.omsiapawas.amount = preciseAdd(
            userWithCredits.credits.omsiapawas.amount,
            amountPerUser,
          )

          // Add transaction record
          if (!userWithCredits.credits.omsiapawas.transactions) {
            userWithCredits.credits.omsiapawas.transactions = {
              currencyexchange: [],
              widthdrawals: [],
              omsiapawastransfer: [],
            }
          }

          userWithCredits.credits.omsiapawas.transactions.omsiapawastransfer.push({
            id: `${distributionTransactionId}_${distributionCount}`,
            type: "giveaway_distribution",
            amount: amountPerUser,
            from: "system",
            transactionReference: transactionId,
            date: new Date().toISOString(),
            description: `Transaction giveaway distribution - 40% pool share from order ${transactionId}${pendingFunds.amount !== 0 ? " (including pending funds)" : ""}`,
          })

          await userWithCredits.save()
          distributionCount++
        } catch (error) {
          console.error(`Error updating user ${user.id}:`, error)
          // Continue with other users even if one fails
        }
      }
    }

    // Update transaction status to completed
    await updateTransactionStatus(transactionId, "completed")
    await updateUserTransactionStatus(currentRegistrant._id, transactionId, "completed")

    // Move purchases from pending to accepted
    const purchaseMoveResult = await movePurchaseFromPendingToAccepted(transactionId)
    
    if (purchaseMoveResult.success && purchaseMoveResult.movedCount > 0) {
      console.log(`Successfully moved purchases from pending to accepted:`)
      console.log(`- Products affected: ${purchaseMoveResult.movedCount}`)
      console.log(`- Product IDs: ${purchaseMoveResult.productIds.join(', ')}`)
    } else if (!purchaseMoveResult.success) {
      console.error('Failed to move purchases from pending to accepted:', purchaseMoveResult.error)
    }

    console.log(`Order receive processed successfully:`)
    console.log(`- Transaction ID: ${transactionId}`)
    console.log(`- Total giveaway: ${totalTransactionGiveaway}`)
    console.log(`- Current user (60%): ${currentUserAmount}`)
    console.log(`- Distribution pool (40%): ${distributionPoolAmount}`)
    console.log(`- Previous pending funds: ${pendingFunds.amount}`)
    console.log(`- Total distribution amount: ${totalDistributionAmount}`)
    console.log(`- Amount per user: ${amountPerUser}`)
    console.log(`- Users updated: ${distributionCount}`)
    console.log(`- Is negative distribution: ${isNegativeDistribution}`)
    console.log(`- New pending funds: ${newPendingFundsAmount}`)

    return res.status(200).json({
      success: true,
      message: isNegativeDistribution
        ? "Order received - distribution was negative and stored as pending funds"
        : "Order received and giveaways distributed successfully",
      transactionId: transactionId,
      currentUserGiveaway: currentUserAmount,
      distributionAmount: amountPerUser,
      distributionCount: distributionCount,
      totalGiveaway: totalTransactionGiveaway,
      pendingFundsNotification: {
        isNegativeDistribution: isNegativeDistribution,
        pendingFunds: newPendingFundsAmount,
        transactionGiveaway: distributionPoolAmount,
        totalEligibleUsers: eligibleUsersCount,
      },
      purchaseUpdate: purchaseMoveResult,
    })
  } catch (error) {
    console.error("Error processing order receive:", error)
    return res.status(500).json({
      error: "Failed to process order receive",
      details: error.message,
    })
  }
})

function ensureCreditsStructure(registrant) {
  if (!registrant.credits) {
    registrant.credits = {
      omsiapawas: {
        id: generateOmsiapawasId(),
        amount: 0,
        transactions: {
          currencyexchange: [],
          widthdrawals: [],
          omsiapawastransfer: [],
        },
      },
    }
  }

  if (!registrant.credits.omsiapawas) {
    registrant.credits.omsiapawas = {
      id: generateOmsiapawasId(),
      amount: 0,
      transactions: {
        currencyexchange: [],
        widthdrawals: [],
        omsiapawastransfer: [],
      },
    }
  }

  if (!registrant.credits.omsiapawas.transactions) {
    registrant.credits.omsiapawas.transactions = {
      currencyexchange: [],
      widthdrawals: [],
      omsiapawastransfer: [],
    }
  }

  return registrant
}

/**
 * Moves purchase from pending to accepted in all matching products
 * @param {string} transactionId - The merchandise transaction ID to search for
 * @returns {Promise<{success: boolean, movedCount: number, productIds: string[]}>}
 */
async function movePurchaseFromPendingToAccepted(transactionId) {
  try {
    const movedPurchases = []
    
    // Find all products that have this transaction ID in pending purchases
    const productsWithPendingPurchase = await ProductDataModel.find({
      'system.purchases.pending.merchandisetransactionid': transactionId
    })

    console.log(`Found ${productsWithPendingPurchase.length} products with pending purchase for transaction ${transactionId}`)

    for (const product of productsWithPendingPurchase) {
      // Find the pending purchase(s) that match the transaction ID
      const matchingPurchases = product.system.purchases.pending.filter(
        purchase => purchase.merchandisetransactionid === transactionId
      )

      if (matchingPurchases.length > 0) {
        // Add each matching purchase to accepted array
        product.system.purchases.accepted.push(...matchingPurchases)

        // Remove matching purchases from pending array
        product.system.purchases.pending = product.system.purchases.pending.filter(
          purchase => purchase.merchandisetransactionid !== transactionId
        )

        // Save the updated product
        await product.save()

        movedPurchases.push({
          productId: product.authentications.id,
          purchaseCount: matchingPurchases.length
        })

        console.log(`Moved ${matchingPurchases.length} purchase(s) from pending to accepted for product ${product.authentications.id}`)
      }
    }

    return {
      success: true,
      movedCount: movedPurchases.length,
      productIds: movedPurchases.map(p => p.productId),
      details: movedPurchases
    }
  } catch (error) {
    console.error('Error moving purchase from pending to accepted:', error)
    return {
      success: false,
      movedCount: 0,
      productIds: [],
      error: error.message
    }
  }
}

// Helper function to update transaction status in user's transaction history
async function updateUserTransactionStatus(userId, transactionId, status) {
  try {
    const indication = status === "completed" ? "success" : "updated"

    // Create log entry for user's transaction
    const logEntry = {
      date: new Date().toISOString(),
      type: "status_update",
      indication: status,
      messages: [
        {
          message: `Order ${status} - giveaways distributed`,
        },
      ],
    }

    // Update the transaction in user's transactions.merchandise array
    await RegistrantDataModel.updateOne(
      {
        _id: userId,
        "transactions.merchandise.id": transactionId,
      },
      {
        $set: {
          "transactions.merchandise.$.statusesandlogs.status": status,
          "transactions.merchandise.$.statusesandlogs.indication": indication,
          "transactions.merchandise.$.statusesandlogs.date": new Date().toISOString(),
        },
        $push: {
          "transactions.merchandise.$.statusesandlogs.logs": logEntry,
        },
      },
    )

    console.log(`Updated transaction ${transactionId} status to ${status} in user ${userId} transaction history`)
  } catch (error) {
    console.error("Error updating user transaction status:", error)
  }
}

// Helper function to update transaction status
async function updateTransactionStatus(transactionId, status) {
  try {
    const updateData = {
      "statusesandlogs.status": status,
      "statusesandlogs.indication": status === "completed" ? "success" : "updated",
      "statusesandlogs.date": new Date().toISOString(),
    }

    // Add log entry
    const logEntry = {
      date: new Date().toISOString(),
      type: "status_update",
      indication: status,
      messages: [
        {
          message: `Order ${status} - giveaways distributed`,
        },
      ],
    }

    await MerchandiseTransactionDataModel.updateOne(
      { id: transactionId },
      {
        $set: updateData,
        $push: { "statusesandlogs.logs": logEntry },
      },
    )
  } catch (error) {
    console.error("Error updating transaction status:", error)
  }
}

// Precise arithmetic functions to avoid floating point errors
function preciseAdd(a, b) {
  const factor = 100 // Work with cents
  return Math.round(a * factor + b * factor) / factor
}

function preciseSub(a, b) {
  const factor = 100 // Work with cents
  return Math.round(a * factor - b * factor) / factor
}

function preciseMultiply(a, b) {
  const factor = 100 // Work with cents
  return Math.round(a * factor * b) / factor
}

function preciseDiv(a, b) {
  if (b === 0) return 0
  const factor = 100 // Work with cents
  return Math.round((a * factor) / b) / factor
}

// Helper function to generate transaction ID
function generateTransactionId() {
  return "TXN_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
}

// Helper function to generate omsiapawas ID
function generateOmsiapawasId() {
  return "OMS_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
}

// General Product Update Route
Router.put("/updateproduct/:id", async (req, res) => {
  try {
    const { id } = req.params
    const updatedProductData = req.body

    // Input validation
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      })
    }

    // Validate required fields in the request body
    if (!updatedProductData.details) {
      return res.status(400).json({
        success: false,
        message: "Product details are required",
      })
    }

    const { productname, category, description, price, weightingrams } = updatedProductData.details

    // Check for required product details
    if (!productname || !category || !description) {
      return res.status(400).json({
        success: false,
        message: "Product name, category, and description are required fields",
      })
    }

    // Validate price object if provided
    if (price) {
      if (typeof price !== "object") {
        return res.status(400).json({
          success: false,
          message: "Price must be an object with amount, capital, shipping, etc.",
        })
      }

      // Validate price.amount if provided
      if (price.amount !== undefined && (isNaN(price.amount) || price.amount < 0)) {
        return res.status(400).json({
          success: false,
          message: "Price amount must be a valid positive number",
        })
      }
    }

    // Validate weight if provided
    if (weightingrams !== undefined && weightingrams !== null && (isNaN(weightingrams) || weightingrams < 0)) {
      return res.status(400).json({
        success: false,
        message: "Weight must be a valid positive number",
      })
    }

    // Find the product by ID
    const existingProduct = await ProductDataModel.findById(id)

    // Check if product exists
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found. Please refresh and try again.",
      })
    }

    // Generate timestamp for the update
    const formattedDate = timestamps.getFormattedDate()

    // Prepare the update object
    const updateData = {
      authentications: {
        ...existingProduct.authentications?.toObject(),
        ...updatedProductData.authentications,
      },
      details: {
        ...existingProduct.details.toObject(), // Preserve existing details
        productname: updatedProductData.details.productname,
        category: updatedProductData.details.category,
        description: updatedProductData.details.description,
        weightingrams: updatedProductData.details.weightingrams ?? existingProduct.details.weightingrams,
        warranty: updatedProductData.details.warranty || existingProduct.details.warranty,
        webaddress: updatedProductData.details.webaddress || existingProduct.details.webaddress,
        features: updatedProductData.details.features || existingProduct.details.features,
        price: {
          amount: updatedProductData.details.price?.amount ?? existingProduct.details.price?.amount ?? 0,
          capital: updatedProductData.details.price?.capital ?? existingProduct.details.price?.capital ?? 0,
          shipping: updatedProductData.details.price?.shipping ?? existingProduct.details.price?.shipping ?? 0,
          transactiongiveaway:
            updatedProductData.details.price?.transactiongiveaway ??
            existingProduct.details.price?.transactiongiveaway ??
            0,
          profit: updatedProductData.details.price?.profit ?? existingProduct.details.price?.profit ?? 0,
        },
        // Preserve existing specifications - don't update them in this route
        specifications: existingProduct.details.specifications,
      },
      images: updatedProductData.images || existingProduct.images,
      videos: updatedProductData.videos || existingProduct.videos,
      customerfeedback: {
        rating: updatedProductData.customerfeedback?.rating ?? existingProduct.customerfeedback?.rating ?? 0,
        reviews: updatedProductData.customerfeedback?.reviews ?? existingProduct.customerfeedback?.reviews ?? 0,
      },
      system: {
        ...existingProduct.system?.toObject(),
        purchases: updatedProductData.system?.purchases ||
          existingProduct.system?.purchases || {
            total: [],
            pending: [],
            accepted: [],
            rejected: [],
          },
        stocks: updatedProductData.system?.stocks ?? existingProduct.system?.stocks ?? 0,
      },
    }

    // Update the product
    const updatedProduct = await ProductDataModel.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validation
    })

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found or could not be updated",
      })
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      updatedProduct: updatedProduct,
      updateDetails: {
        productId: updatedProduct._id,
        productName: updatedProduct.details.productname,
        updateType: "general",
        lastUpdated: formattedDate,
      },
    })
  } catch (err) {
    console.error("Error updating product:", err)

    // Handle specific MongoDB errors
    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      })
    }

    // Handle validation errors
    if (err.name === "ValidationError") {
      const validationErrors = Object.values(err.errors).map((error) => error.message)
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validationErrors,
      })
    }

    // Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Product with similar details already exists",
      })
    }

    // Handle network/connection errors (no internet scenario)
    if (err.name === "MongoNetworkError" || err.name === "MongoTimeoutError") {
      return res.status(503).json({
        success: false,
        message: "Database connection failed. Please check your internet connection and try again.",
      })
    }

    // Handle other MongoDB errors
    if (err.name === "MongoError") {
      return res.status(500).json({
        success: false,
        message: "Database error occurred while updating product",
      })
    }

    // Handle other unexpected errors
    return res.status(500).json({
      success: false,
      message: "Server error occurred while updating product",
    })
  }
})

// Product Specification Update Route
Router.put("/updateproduct/:id/specification", async (req, res) => {
  try {
    const { id } = req.params
    const updatedProductData = req.body

    // Input validation
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      })
    }

    // Validate request body
    if (!updatedProductData || !updatedProductData.details || !updatedProductData.details.specifications) {
      return res.status(400).json({
        success: false,
        message: "Product specifications data is required",
      })
    }

    // Find the product by ID
    const existingProduct = await ProductDataModel.findById(id)

    // Check if product exists
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found. Please refresh and try again.",
      })
    }

    const specifications = updatedProductData.details.specifications

    // Validate specifications array
    if (!Array.isArray(specifications)) {
      return res.status(400).json({
        success: false,
        message: "Specifications must be an array",
      })
    }

    // Validate each specification object
    for (let i = 0; i < specifications.length; i++) {
      const spec = specifications[i]

      // Check if specification has required fields
      if (!spec._id) {
        return res.status(400).json({
          success: false,
          message: `Specification at index ${i} is missing _id field`,
        })
      }

      // Check if the specification exists in the current product
      const existingSpec = existingProduct.details.specifications.find(
        (existingSpec) => existingSpec._id.toString() === spec._id.toString(),
      )

      if (!existingSpec) {
        return res.status(400).json({
          success: false,
          message: `Specification with ID ${spec._id} not found in product`,
        })
      }

      // Validate specification structure if needed
      if (spec.details) {
        if (spec.details.productname && typeof spec.details.productname !== "string") {
          return res.status(400).json({
            success: false,
            message: `Invalid productname in specification ${spec._id}`,
          })
        }

        if (spec.details.category && typeof spec.details.category !== "string") {
          return res.status(400).json({
            success: false,
            message: `Invalid category in specification ${spec._id}`,
          })
        }
      }
    }

    // Generate timestamp for the update
    const formattedDate = timestamps.getFormattedDate()

    // Update only the specifications in the product
    const updateData = {
      details: {
        ...existingProduct.details.toObject(),
        specifications: updatedProductData.details.specifications,
      },
    }

    // Update the product
    const updatedProduct = await ProductDataModel.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validation
    })

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found or could not be updated",
      })
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      updatedProduct: updatedProduct,
      updateDetails: {
        productId: updatedProduct._id,
        productName: updatedProduct.details.productname,
        updateType: "specification",
        specificationsUpdated: specifications.length,
        totalSpecifications: updatedProduct.details.specifications?.length || 0,
        lastUpdated: formattedDate,
      },
    })
  } catch (err) {
    console.error("Error updating product specifications:", err)

    // Handle specific MongoDB errors
    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      })
    }

    // Handle validation errors
    if (err.name === "ValidationError") {
      const validationErrors = Object.values(err.errors).map((error) => error.message)
      return res.status(400).json({
        success: false,
        message: "Validation error occurred while updating specifications",
        errors: validationErrors,
      })
    }

    // Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate specification detected",
      })
    }

    // Handle network/connection errors (no internet scenario)
    if (err.name === "MongoNetworkError" || err.name === "MongoTimeoutError") {
      return res.status(503).json({
        success: false,
        message: "Database connection failed. Please check your internet connection and try again.",
      })
    }

    // Handle other MongoDB errors
    if (err.name === "MongoError") {
      return res.status(500).json({
        success: false,
        message: "Database error occurred while updating specifications",
      })
    }

    // Handle array operation errors (for specifications updates)
    if (err.message && err.message.includes("specifications")) {
      return res.status(400).json({
        success: false,
        message: "Error updating product specifications. Please verify the data format.",
      })
    }

    // Handle other unexpected errors
    return res.status(500).json({
      success: false,
      message: "Server error occurred while updating product specifications",
    })
  }
})

// Delete Product Route
Router.delete("/deleteproduct/:id", async (req, res) => {
  try {
    const { id } = req.params

    // Input validation
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      })
    }

    // Find the product by ID first to get image paths
    const existingProduct = await ProductDataModel.findById(id)

    // Check if product exists
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found. Please refresh and try again.",
      })
    }

    // Function to safely delete files
    const deleteFile = (filePath) => {
      return new Promise((resolve) => {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.warn(`Failed to delete file: ${filePath}`, err.message)
          } else {
            console.log(`Successfully deleted file: ${filePath}`)
          }
          resolve() // Always resolve to continue with other deletions
        })
      })
    }

    // Function to check if URL is a local file (not external URL like YouTube, etc.)
    const isLocalFile = (url) => {
      if (!url || typeof url !== "string") return false

      // Skip external URLs
      if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("www.")) {
        return false
      }

      // Check if it's a local file with proper extension
      const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp"]
      const videoExtensions = [".mp4", ".avi", ".mov", ".wmv", ".flv", ".webm", ".mkv"]
      const allExtensions = [...imageExtensions, ...videoExtensions]

      return allExtensions.some((ext) => url.toLowerCase().includes(ext))
    }

    // Function to delete product images and videos
    const deleteProductMedia = async (product) => {
      const deletionPromises = []

      // Get the path to the public folder (view folder is at the same level as server folder)
      const publicPath = path.join(__dirname, "../../../view/public")

      // Delete main product images
      if (product.images && Array.isArray(product.images)) {
        for (const imageObj of product.images) {
          if (imageObj && imageObj.url && isLocalFile(imageObj.url)) {
            // Remove leading slash if present and construct full path
            const cleanImagePath = imageObj.url.startsWith("/") ? imageObj.url.slice(1) : imageObj.url
            const fullImagePath = path.join(publicPath, cleanImagePath)
            deletionPromises.push(deleteFile(fullImagePath))
          }
        }
      }

      // Delete main product videos (only local files, skip YouTube URLs)
      if (product.videos && Array.isArray(product.videos)) {
        for (const videoObj of product.videos) {
          if (videoObj && videoObj.url && isLocalFile(videoObj.url)) {
            const cleanVideoPath = videoObj.url.startsWith("/") ? videoObj.url.slice(1) : videoObj.url
            const fullVideoPath = path.join(publicPath, cleanVideoPath)
            deletionPromises.push(deleteFile(fullVideoPath))
          }
        }
      }

      // Delete images and videos from specifications (nested products)
      if (product.details && product.details.specifications && Array.isArray(product.details.specifications)) {
        for (const spec of product.details.specifications) {
          // Delete specification images
          if (spec.images && Array.isArray(spec.images)) {
            for (const imageObj of spec.images) {
              if (imageObj && imageObj.url && isLocalFile(imageObj.url)) {
                const cleanImagePath = imageObj.url.startsWith("/") ? imageObj.url.slice(1) : imageObj.url
                const fullImagePath = path.join(publicPath, cleanImagePath)
                deletionPromises.push(deleteFile(fullImagePath))
              }
            }
          }

          // Delete specification videos (only local files)
          if (spec.videos && Array.isArray(spec.videos)) {
            for (const videoObj of spec.videos) {
              if (videoObj && videoObj.url && isLocalFile(videoObj.url)) {
                const cleanVideoPath = videoObj.url.startsWith("/") ? videoObj.url.slice(1) : videoObj.url
                const fullVideoPath = path.join(publicPath, cleanVideoPath)
                deletionPromises.push(deleteFile(fullVideoPath))
              }
            }
          }
        }
      }

      // Additional cleanup: search for any other media URLs in the product data
      const searchForMediaUrls = (obj, currentPath = "") => {
        for (const key in obj) {
          if (obj[key] && typeof obj[key] === "string") {
            // Check if the value looks like a local media path (skip external URLs)
            if (isLocalFile(obj[key]) && obj[key].includes("/images/market/products/")) {
              const cleanMediaPath = obj[key].startsWith("/") ? obj[key].slice(1) : obj[key]
              const fullMediaPath = path.join(publicPath, cleanMediaPath)
              deletionPromises.push(deleteFile(fullMediaPath))
            }
          } else if (obj[key] && typeof obj[key] === "object" && obj[key] !== null) {
            // Skip already processed arrays to avoid duplication
            const newPath = currentPath ? `${currentPath}.${key}` : key
            if (
              newPath !== "images" &&
              newPath !== "videos" &&
              !newPath.includes(".images") &&
              !newPath.includes(".videos")
            ) {
              searchForMediaUrls(obj[key], newPath)
            }
          }
        }
      }

      // Search for any additional media URLs in the entire product object
      searchForMediaUrls(product.toObject ? product.toObject() : product)

      // Wait for all file deletions to complete
      await Promise.all(deletionPromises)
    }

    // Delete associated media files first
    await deleteProductMedia(existingProduct)

    // Delete the product from database
    const deletedProduct = await ProductDataModel.findByIdAndDelete(id)

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found or could not be deleted",
      })
    }

    // Generate timestamp for the deletion log
    const formattedDate = timestamps.getFormattedDate()

    // Log the deletion for audit purposes
    console.log(`Product deleted successfully:`, {
      productId: deletedProduct._id,
      productName: deletedProduct.details?.productname || "Unknown",
      deletedBy: "System", // You can modify this to include user info if available
      deletedAt: formattedDate,
    })

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      deleteDetails: {
        productId: deletedProduct._id,
        productName: deletedProduct.details?.productname || "Unknown Product",
        category: deletedProduct.details?.category || "Unknown Category",
        deletedAt: formattedDate,
      },
    })
  } catch (err) {
    console.error("Error deleting product:", err)

    // Handle specific MongoDB errors
    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      })
    }

    // Handle network/connection errors (no internet scenario)
    if (err.name === "MongoNetworkError" || err.name === "MongoTimeoutError") {
      return res.status(503).json({
        success: false,
        message: "Database connection failed. Please check your internet connection and try again.",
      })
    }

    // Handle other MongoDB errors
    if (err.name === "MongoError") {
      return res.status(500).json({
        success: false,
        message: "Database error occurred while deleting product",
      })
    }

    // Handle file system errors
    if (err.code === "ENOENT") {
      console.warn("Some files were not found during deletion, but product was removed from database")
      return res.status(200).json({
        success: true,
        message: "Product deleted successfully (some associated files were already missing)",
        warning: "Some media files were not found on the server",
      })
    }

    if (err.code === "EACCES" || err.code === "EPERM") {
      return res.status(500).json({
        success: false,
        message: "Permission denied while deleting product files",
      })
    }

    // Handle other unexpected errors
    return res.status(500).json({
      success: false,
      message: "Server error occurred while deleting product",
    })
  }
})

// Delete selected transactions route
Router.post("/transactions/delete", async (req, res) => {
  try {
    const { transactionIds, userId } = req.body

    // Validate input
    if (!transactionIds || !Array.isArray(transactionIds) || transactionIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Transaction IDs array is required and cannot be empty",
      })
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      })
    }

    // Find the user
    const user = await RegistrantDataModel.findById(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please refresh and try again.",
      })
    }

    // Track deletion results
    let deletedCount = 0
    let notFoundCount = 0
    const deletedTransactions = []
    const notFoundTransactions = []

    // Process each transaction ID
    for (const transactionId of transactionIds) {
      let found = false

      // Check in merchandise transactions
      const merchandiseIndex = user.transactions?.merchandise?.findIndex(
        (tx) => tx.id === transactionId || tx._id?.toString() === transactionId,
      )

      if (merchandiseIndex !== -1) {
        const deleted = user.transactions.merchandise.splice(merchandiseIndex, 1)[0]
        deletedTransactions.push({
          id: transactionId,
          type: "merchandise",
          amount: deleted.system?.ordersummary?.merchandisetotal || 0,
        })
        deletedCount++
        found = true

        // Also delete from main MerchandiseTransactionDataModel collection
        try {
          await MerchandiseTransactionDataModel.deleteOne({ id: transactionId })
        } catch (err) {
          console.warn(`Failed to delete merchandise transaction ${transactionId} from main collection:`, err)
        }
      }

      // Check in currency exchange transactions
      if (!found) {
        const currencyExchangeIndex = user.credits?.omsiapawas?.transactions?.currencyexchange?.findIndex(
          (tx) => tx.id === transactionId || tx._id?.toString() === transactionId,
        )

        if (currencyExchangeIndex !== -1) {
          const deleted = user.credits.omsiapawas.transactions.currencyexchange.splice(currencyExchangeIndex, 1)[0]
          deletedTransactions.push({
            id: transactionId,
            type: "currency_exchange",
            amount: deleted.details?.amounts?.omsiapawasamounttorecieve || 0,
          })
          deletedCount++
          found = true

          // Also delete from main CurrencyExchangeTransactionDataModel collection
          try {
            await CurrencyExchangeTransactionDataModel.deleteOne({ id: transactionId })
          } catch (err) {
            console.warn(`Failed to delete currency exchange transaction ${transactionId} from main collection:`, err)
          }
        }
      }

      // Check in withdrawal transactions
      if (!found) {
        const withdrawalIndex = user.credits?.omsiapawas?.transactions?.widthdrawals?.findIndex(
          (tx) => tx.id === transactionId || tx._id?.toString() === transactionId,
        )

        if (withdrawalIndex !== -1) {
          const deleted = user.credits.omsiapawas.transactions.widthdrawals.splice(withdrawalIndex, 1)[0]
          deletedTransactions.push({
            id: transactionId,
            type: "withdrawal",
            amount: deleted.details?.amounts?.phpamounttorecieve || 0,
          })
          deletedCount++
          found = true

          // Also delete from main WidthdrawalTransactionDataModel collection
          try {
            await WidthdrawalTransactionDataModel.deleteOne({ id: transactionId })
          } catch (err) {
            console.warn(`Failed to delete withdrawal transaction ${transactionId} from main collection:`, err)
          }
        }
      }

      // Check in omsiapawas transfer transactions
      if (!found) {
        const transferIndex = user.credits?.omsiapawas?.transactions?.omsiapawastransfer?.findIndex(
          (tx) => tx.id === transactionId || tx._id?.toString() === transactionId,
        )

        if (transferIndex !== -1) {
          const deleted = user.credits.omsiapawas.transactions.omsiapawastransfer.splice(transferIndex, 1)[0]
          deletedTransactions.push({
            id: transactionId,
            type: "omsiapawas_transfer",
            amount: deleted.amount || 0,
          })
          deletedCount++
          found = true
        }
      }

      if (!found) {
        notFoundTransactions.push(transactionId)
        notFoundCount++
      }
    }

    // Save the updated user document if any transactions were deleted
    if (deletedCount > 0) {
      await user.save()
    }

    // Prepare response message
    let message = ""
    if (deletedCount === transactionIds.length) {
      message = `Successfully deleted ${deletedCount} transaction${deletedCount > 1 ? "s" : ""}`
    } else if (deletedCount > 0) {
      message = `Deleted ${deletedCount} transaction${deletedCount > 1 ? "s" : ""}. ${notFoundCount} transaction${notFoundCount > 1 ? "s were" : " was"} not found.`
    } else {
      message = "No transactions were deleted. All specified transactions were not found."
    }

    // Return response
    return res.status(deletedCount > 0 ? 200 : 404).json({
      success: deletedCount > 0,
      message: message,
      details: {
        totalRequested: transactionIds.length,
        deleted: deletedCount,
        notFound: notFoundCount,
        deletedTransactions: deletedTransactions,
        notFoundTransactions: notFoundTransactions,
      },
    })
  } catch (error) {
    console.error("Error deleting transactions:", error)

    // Handle specific error types
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID or transaction ID format",
      })
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error: " + error.message,
      })
    }

    if (error.name === "MongoNetworkError" || error.name === "MongoTimeoutError") {
      return res.status(503).json({
        success: false,
        message: "Database connection error. Please check your internet connection and try again.",
      })
    }

    return res.status(500).json({
      success: false,
      message: "Server error occurred while deleting transactions",
    })
  }
})

// Delete all transactions route
Router.post("/transactions/delete-all", async (req, res) => {
  try {
    const { userId, confirmText } = req.body

    // Validate input
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      })
    }

    // Require confirmation text for safety
    if (confirmText !== "DELETE ALL") {
      return res.status(400).json({
        success: false,
        message: 'Confirmation text must be "DELETE ALL" to proceed',
      })
    }

    // Find the user
    const user = await RegistrantDataModel.findById(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please refresh and try again.",
      })
    }

    // Count transactions before deletion
    const merchandiseCount = user.transactions?.merchandise?.length || 0
    const currencyExchangeCount = user.credits?.omsiapawas?.transactions?.currencyexchange?.length || 0
    const withdrawalCount = user.credits?.omsiapawas?.transactions?.widthdrawals?.length || 0
    const transferCount = user.credits?.omsiapawas?.transactions?.omsiapawastransfer?.length || 0
    const totalCount = merchandiseCount + currencyExchangeCount + withdrawalCount + transferCount

    if (totalCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No transactions found to delete",
      })
    }

    // Collect all transaction IDs for deletion from main collections
    const merchandiseIds = user.transactions?.merchandise?.map((tx) => tx.id) || []
    const currencyExchangeIds = user.credits?.omsiapawas?.transactions?.currencyexchange?.map((tx) => tx.id) || []
    const withdrawalIds = user.credits?.omsiapawas?.transactions?.widthdrawals?.map((tx) => tx.id) || []

    // Delete all transactions from user document
    if (user.transactions?.merchandise) {
      user.transactions.merchandise = []
    }
    if (user.credits?.omsiapawas?.transactions?.currencyexchange) {
      user.credits.omsiapawas.transactions.currencyexchange = []
    }
    if (user.credits?.omsiapawas?.transactions?.widthdrawals) {
      user.credits.omsiapawas.transactions.widthdrawals = []
    }
    if (user.credits?.omsiapawas?.transactions?.omsiapawastransfer) {
      user.credits.omsiapawas.transactions.omsiapawastransfer = []
    }

    // Save the updated user document
    await user.save()

    // Delete from main collections (non-blocking, log errors but don't fail the request)
    const deletionPromises = []

    if (merchandiseIds.length > 0) {
      deletionPromises.push(
        MerchandiseTransactionDataModel.deleteMany({ id: { $in: merchandiseIds } }).catch((err) =>
          console.warn("Failed to delete merchandise transactions from main collection:", err),
        ),
      )
    }

    if (currencyExchangeIds.length > 0) {
      deletionPromises.push(
        CurrencyExchangeTransactionDataModel.deleteMany({ id: { $in: currencyExchangeIds } }).catch((err) =>
          console.warn("Failed to delete currency exchange transactions from main collection:", err),
        ),
      )
    }

    if (withdrawalIds.length > 0) {
      deletionPromises.push(
        WidthdrawalTransactionDataModel.deleteMany({ id: { $in: withdrawalIds } }).catch((err) =>
          console.warn("Failed to delete withdrawal transactions from main collection:", err),
        ),
      )
    }

    // Wait for all deletions to complete
    await Promise.all(deletionPromises)

    // Return success response
    return res.status(200).json({
      success: true,
      message: `Successfully deleted all ${totalCount} transaction${totalCount > 1 ? "s" : ""}`,
      details: {
        totalDeleted: totalCount,
        breakdown: {
          merchandise: merchandiseCount,
          currencyExchange: currencyExchangeCount,
          withdrawals: withdrawalCount,
          transfers: transferCount,
        },
      },
    })
  } catch (error) {
    console.error("Error deleting all transactions:", error)

    // Handle specific error types
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      })
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error: " + error.message,
      })
    }

    if (error.name === "MongoNetworkError" || error.name === "MongoTimeoutError") {
      return res.status(503).json({
        success: false,
        message: "Database connection error. Please check your internet connection and try again.",
      })
    }

    return res.status(500).json({
      success: false,
      message: "Server error occurred while deleting all transactions",
    })
  }
})

// Email for citizenship expiration
const sendCitizenshipExpirationEmail = async (userEmail, userName, citizenshipType) => {
  try {
    await resend.emails.send({
      from: 'OMSIAP <onboarding@resend.dev>',
      to: userEmail,
      subject: 'Your OMSIAP Citizenship Has Expired',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #dc3545; margin-bottom: 20px;">Citizenship Expiration Notice</h2>
            <p style="font-size: 16px; color: #333;">Dear ${userName},</p>
            <p style="font-size: 16px; color: #333; line-height: 1.6;">
              Your <strong>${citizenshipType}</strong> has expired after 3 months.
            </p>
            <p style="font-size: 16px; color: #333; line-height: 1.6;">
              Your account has been automatically reverted to <strong>MFATIP (Monthly Financial Allocation To Individual People)</strong> status.
            </p>
            <p style="font-size: 16px; color: #333; line-height: 1.6;">
              To continue enjoying premium benefits, please renew your citizenship through our platform.
            </p>
            <br>
            <p style="font-size: 14px; color: #666;">
              Best regards,<br>
              <strong>OMSIAP Team</strong><br>
              Of Macky's Ink And Paper
            </p>
          </div>
        </div>
      `
    });
    console.log('Expiration email sent successfully to:', userEmail);
    return true;
  } catch (error) {
    console.error('Error sending expiration email:', error);
    return false;
  }
};

// Email for contact form submissions
const sendContactUsEmail = async (formData) => {
  try {
    const { name, email, subject, message } = formData;
    
    // Send email to OMSIAP admin
    await resend.emails.send({
      from: 'OMSIAP Contact Form <onboarding@resend.dev>',
      to: 'hello@omsiap.com', // Your admin email - CHANGE THIS to your actual email
      replyTo: email, // User's email for easy reply
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #007bff; margin-bottom: 20px;">New Contact Form Submission</h2>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <p style="margin: 5px 0;"><strong>From:</strong> ${name}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p style="margin: 5px 0;"><strong>Subject:</strong> ${subject}</p>
            </div>
            
            <div style="margin-top: 20px;">
              <h3 style="color: #333; margin-bottom: 10px;">Message:</h3>
              <p style="font-size: 16px; color: #333; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #999; text-align: center;">
              This email was sent from the OMSIAP contact form
            </p>
          </div>
        </div>
      `
    });

    // Optional: Send confirmation email to user
    await resend.emails.send({
      from: 'OMSIAP <onboarding@resend.dev>',
      to: email,
      subject: 'We received your message - OMSIAP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #28a745; margin-bottom: 20px;">Thank You for Contacting OMSIAP!</h2>
            <p style="font-size: 16px; color: #333;">Dear ${name},</p>
            <p style="font-size: 16px; color: #333; line-height: 1.6;">
              We have received your message and will get back to you within 24-48 hours.
            </p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 5px 0; font-size: 14px; color: #666;"><strong>Your message:</strong></p>
              <p style="margin: 10px 0; font-size: 14px; color: #333; white-space: pre-wrap;">${message}</p>
            </div>
            
            <p style="font-size: 16px; color: #333; line-height: 1.6;">
              If you have any urgent concerns, please feel free to call us at <strong>+63 XXX XXX XXXX</strong>.
            </p>
            <br>
            <p style="font-size: 14px; color: #666;">
              Best regards,<br>
              <strong>OMSIAP Team</strong><br>
              Of Macky's Ink And Paper<br>
              Las Piñas, Metro Manila, PH
            </p>
          </div>
        </div>
      `
    });

    console.log('Contact form emails sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending contact form email:', error);
    return false;
  }
};

// POST route for contact form
Router.post('/contactus', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required. Please fill out the entire form.'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    // Validate message length
    if (message.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Message must be at least 10 characters long.'
      });
    }

    // Send email using Resend
    const data = await resend.emails.send({
      from: 'OMSIAP Contact Form <onboarding@resend.dev>', // Use your verified domain
      to: ['ofmackysinkandpaper@gmail.com'], // Your email address
      subject: `Contact Form: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .info-row { margin: 15px 0; padding: 10px; background: white; border-radius: 5px; }
              .label { font-weight: bold; color: #667eea; }
              .message-box { background: white; padding: 20px; border-left: 4px solid #667eea; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>New Contact Form Submission</h1>
                <p>You have received a new message from your website</p>
              </div>
              <div class="content">
                <div class="info-row">
                  <span class="label">From:</span> ${name}
                </div>
                <div class="info-row">
                  <span class="label">Email:</span> ${email}
                </div>
                <div class="info-row">
                  <span class="label">Subject:</span> ${subject}
                </div>
                <div class="message-box">
                  <div class="label">Message:</div>
                  <p>${message.replace(/\n/g, '<br>')}</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `
    });

    // Success response
    return res.status(200).json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.',
      emailId: data.id
    });

  } catch (err) {
    console.error('Contact form error:', err);

    // Handle Resend API errors
    if (err.name === 'ResendError') {
      return res.status(500).json({
        success: false,
        message: 'Email service error. Please try again later or contact us directly at hello@omsiap.com.'
      });
    }

    // Handle network errors
    if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
      return res.status(503).json({
        success: false,
        message: 'Unable to connect to email service. Please try again later.'
      });
    }

    // Generic error response
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again or contact us at hello@omsiap.com.'
    });
  }
});


// Export the router
module.exports = Router
