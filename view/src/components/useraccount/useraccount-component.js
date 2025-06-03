"use client"

import { useState, useEffect } from "react"

import { Spinner } from "react-bootstrap"

import {
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaReceipt,
  FaClock,
  FaInfoCircle,
  FaExchangeAlt,
  FaShoppingCart,
  FaWallet,
} from "react-icons/fa"

import "../../styles/useraccount/useraccount.scss"

import { useNavigate } from "react-router-dom"

import axiosCreatedInstance from "../lib/axiosutil.js"

const UserAccount = (props) => {
  const navigate = useNavigate()

  const [user, setUser] = useState({
    id: "Blank",
    firstName: "Blank",
    middleName: "Blank",
    lastName: "Blank",
    email: "Blank",
    phoneNumber: "Blank",
    balance: 0,
    status: "Unregistered",
    joinDate: "Blank",
    birthCertificateFront: null,
    birthCertificateBack: null,
    governmentIdFront: null,
    governmentIdBack: null,
  })

  // State for all transactions from different sources
  const [allTransactions, setAllTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Original transactions state (keeping for backward compatibility)
  const [transactions, setTransactions] = useState([
    {
      id: "TXN-001",
      date: "2025-02-25",
      type: "Purchase",
      amount: -1200.5,
      status: "Completed",
      products: [
        { id: "PRD-001", name: "Premium T-Shirt", price: 299.99, quantity: 1, color: "Black", size: "L" },
        { id: "PRD-002", name: "Designer Jeans", price: 450.5, quantity: 1, color: "Blue", size: "M" },
        { id: "PRD-003", name: "Sports Socks", price: 75.0, quantity: 3, color: "White", size: "One Size" },
      ],
    },
    {
      id: "TXN-002",
      date: "2025-02-20",
      type: "Deposit",
      amount: 3000.0,
      status: "Completed",
      products: [],
      transactionDetails: {
        receiptNumber: "RCPT-2345",
        paymentMethod: "GCash",
        receiptImage: "https://placeholder.com/receipt.jpg",
        notes: "Monthly deposit",
      },
    },
    {
      id: "TXN-003",
      date: "2025-02-15",
      type: "Purchase",
      amount: -750.25,
      status: "Completed",
      products: [
        { id: "PRD-004", name: "Running Shoes", price: 599.99, quantity: 1, color: "Red/Black", size: "42" },
        { id: "PRD-005", name: "Water Bottle", price: 45.25, quantity: 1, color: "Blue", size: "750ml" },
        { id: "PRD-006", name: "Fitness Band", price: 105.01, quantity: 1, color: "Black", size: "Regular" },
      ],
    },
    {
      id: "TXN-004",
      date: "2025-02-10",
      type: "Withdrawal",
      amount: -500.0,
      status: "Completed",
      products: [],
      transactionDetails: {
        receiptNumber: "WDRL-8765",
        withdrawalMethod: "GCash",
        accountNumber: "09XX-XXX-XX89",
        notes: "Weekly withdrawal",
      },
    },
  ])

  const [withdrawalForm, setWithdrawalForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phoneNumber: "",
    amount: "",
    password: "",
  })

  const [depositForm, setDepositForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phoneNumber: "",
    amount: "",
    transactionImage: null,
  })

  const [previewImage, setPreviewImage] = useState(null)

  const [previewImages, setPreviewImages] = useState({
    birthCertificateFront: user.birthCertificateFront ? URL.createObjectURL(user.birthCertificateFront) : null,
    birthCertificateBack: user.birthCertificateBack ? URL.createObjectURL(user.birthCertificateBack) : null,
    governmentIdFront: user.governmentIdFront ? URL.createObjectURL(user.governmentIdFront) : null,
    governmentIdBack: user.governmentIdBack ? URL.createObjectURL(user.governmentIdBack) : null,
  })

  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("account")

  const [currencyexchangeloadingindication, currencyexchangeloadingindicationcb] = useState(false)
  const [widthdrawalloadingindication, withdrawalloadingindicationcb] = useState(false)

  // Function to load and normalize all transactions from different sources
  useEffect(() => {
    if (activeTab === "transactions" && props.user) {
      loadAllTransactions()
    }
  }, [activeTab, props.user])

  const loadAllTransactions = () => {
    setIsLoading(true)

    try {
      const normalizedTransactions = []

    // 1. Process merchandise transactions
    if (props.user?.transactions?.merchandise && Array.isArray(props.user.transactions.merchandise)) {
      props.user.transactions.merchandise.forEach((tx) => {
        const products = tx.details?.merchandise?.list || []
        const totalAmount = tx.system?.ordersummary?.merchandisetotal + tx.system?.ordersummary?.shippingtotal 

        normalizedTransactions.push({
          id: tx.id || `MERCH-${generateRandomId()}`,
          date: tx.statusesandlogs?.date || new Date().toISOString().split("T")[0],
          type: "Merchandise",
          typeClass: "merchandise",
          merchandisesubtotal: tx.system?.ordersummary?.merchandisetotal || 0,
          shippingsubtotal: tx.system?.ordersummary?.shippingtotal,
          amount: -Math.abs(totalAmount), // Negative because it's a purchase
          status: tx.statusesandlogs?.indication || "Pending",
          products: products.map((product) => ({
            id: product.authentications?.id || `PRD-${generateRandomId()}`,
            name: product.details?.productname || "Unknown Product",
            price: product.details?.price?.amount || 0,
            quantity: product.quantity, // Default quantity if not specified
            color: product.details?.specifications?.find((s) => s.name === "Color")?.value || "",
            size: product.details?.specifications?.find((s) => s.name === "Size")?.value || "",
            image: product.images?.[0]?.url || null, // Extract first image URL
          })),
          originalData: tx,
          icon: <FaShoppingCart />,
        })
      })
    }

      // 2. Process currency exchange transactions
      if (
        props.user?.credits?.omsiapawas?.transactions?.currencyexchange &&
        Array.isArray(props.user.credits.omsiapawas.transactions.currencyexchange)
      ) {
        props.user.credits.omsiapawas.transactions.currencyexchange.forEach((tx) => {
          normalizedTransactions.push({
            id: tx.id || `EXCH-${generateRandomId()}`,
            date: tx.statusesandlogs?.logs?.[0]?.date || new Date().toISOString().split("T")[0],
            type: "Currency Exchange",
            typeClass: "currency-exchange",
            amount: tx.details?.amounts?.omsiapawasamounttorecieve || 0, // Positive because user receives OMSIAPAWAS
            phpAmount: tx.details?.amounts?.phppurchaseorexchangeamount || 0,
            status: tx.statusesandlogs?.indication || "Pending",
            transactionDetails: {
              receiptNumber: tx.details?.referrence?.number || "",
              paymentMethod: tx.details?.paymentmethod || "GCash",
              receiptImage: tx.details?.referrence?.gcashtransactionrecieptimage || null,
              notes: `Exchanged ₱${tx.amounts?.phppurchaseorexchangeamount || 0} for ${tx.amounts?.omsiapawasamounttorecieve || 0} OMSIAPAWAS`,
            },
            originalData: tx,
            icon: <FaExchangeAlt />,
          })
        })
      }

      // 3. Process withdrawal transactions
      if (
        props.user?.credits?.omsiapawas?.transactions?.widthdrawals &&
        Array.isArray(props.user.credits.omsiapawas.transactions.widthdrawals)
      ) {
        props.user.credits.omsiapawas.transactions.widthdrawals.forEach((tx) => {
          normalizedTransactions.push({
            id: tx.id || `WDRL-${generateRandomId()}`,
            date: tx.statusesandlogs?.logs?.[0]?.date || new Date().toISOString().split("T")[0],
            type: "Withdrawal",
            typeClass: "withdrawal",
            amount: -Math.abs(tx.amounts?.intent || 0), // Negative because user is withdrawing
            status: tx.statusesandlogs?.indication || "Pending",
            transactionDetails: {
              receiptNumber: tx.id || "",
              withdrawalMethod: tx.details?.paymentmethod || "GCash",
              accountNumber: tx.referrence?.gcashphonenumber || "",
              notes: `Withdrawal of ${tx.amounts?.intent || 0} OMSIAPAWAS to PHP`,
            },
            originalData: tx,
            icon: <FaWallet />,
          })
        })
      }

      // 4. Process OMSIAPAWAS transfer transactions (if they exist)
      if (
        props.user?.credits?.omsiapawas?.transactions?.omsiapawastransfer &&
        Array.isArray(props.user.credits.omsiapawas.transactions.omsiapawastransfer)
      ) {
        props.user.credits.omsiapawas.transactions.omsiapawastransfer.forEach((tx) => {
          // Assuming the structure, adjust as needed
          normalizedTransactions.push({
            id: tx.id || `TRANSFER-${generateRandomId()}`,
            date: tx.date || new Date().toISOString().split("T")[0],
            type: "OMSIAPAWAS Transfer",
            typeClass: "omsiapawas-transfer",
            amount: tx.amount || 0, // Could be positive (received) or negative (sent)
            status: tx.status || "Completed",
            transactionDetails: {
              notes: tx.notes || "OMSIAPAWAS Transfer",
            },
            originalData: tx,
            icon: <FaMoneyBillWave />,
          })
        })
      }

      // Sort all transactions by date (newest first)
      normalizedTransactions.sort((a, b) => {
        return new Date(b.date) - new Date(a.date)
      })

      setAllTransactions(normalizedTransactions)
    } catch (error) {
      console.error("Error loading transactions:", error)
      // If there's an error, use the mock data as fallback
      setAllTransactions(transactions)
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to generate random ID for transactions without one
  const generateRandomId = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase()
  }

  const handleWithdrawalChange = (e) => {
    const { name, value } = e.target
    setWithdrawalForm({ ...withdrawalForm, [name]: value })
  }

  const handleLogout = () => {
    // In a real app, handle logout logic here
    document.cookie = `id=; path=/; max-age=0`
    navigate("/mfatip/loginregister")
  }

  const handleDepositChange = (e) => {
    const { name, value, files } = e.target

    if (name === "transactionImage" && files && files[0]) {
      setDepositForm({ ...depositForm, [name]: files[0] })
      setPreviewImage(URL.createObjectURL(files[0]))
    } else {
      setDepositForm({ ...depositForm, [name]: value })
    }
  }

  const openTransactionModal = (transaction) => {
    setSelectedTransaction(transaction)
    setIsModalOpen(true)
  }

  const closeTransactionModal = () => {
    setIsModalOpen(false)
    setSelectedTransaction(null)
  }

  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [modalImageSrc, setModalImageSrc] = useState(null)

  const openImageModal = (imageSrc) => {
    setModalImageSrc(imageSrc)
    setImageModalOpen(true)
  }

  const closeImageModal = () => {
    setImageModalOpen(false)
    setModalImageSrc(null)
  }

  const handleDepositSubmit = (e) => {
    e.preventDefault()

    // In a real app, send deposit data to server
    console.log("Deposit submitted:", depositForm)

    // Mock successful deposit
    const newTransaction = {
      id: `TXN-00${transactions.length + 1}`,
      date: new Date().toISOString().split("T")[0],
      type: "Deposit",
      amount: Number.parseFloat(depositForm.amount),
      status: "Pending",
      products: [],
      transactionDetails: {
        receiptNumber: `RCPT-${Math.floor(1000 + Math.random() * 9000)}`,
        paymentMethod: "GCash",
        receiptImage: previewImage,
        notes: "Deposit via GCash",
      },
    }

    setTransactions([newTransaction, ...transactions])
    setUser({
      ...user,
      balance: user.balance + Number.parseFloat(depositForm.amount),
    })

    // Reset form
    setDepositForm({
      firstName: "",
      middleName: "",
      lastName: "",
      phoneNumber: "",
      amount: "",
      transactionImage: null,
    })
    setPreviewImage(null)
  }

  const handleWithdrawalSubmit = async (e) => {
    e.preventDefault()

    // In a real app, send withdrawal data to server
    console.log("Withdrawal submitted:", withdrawalForm)

    const widthdrawalResponseMessage = document.querySelector("#widthdrawal-responsemessage")
    widthdrawalResponseMessage.innerText = "Processing withdrawal request..."
    widthdrawalResponseMessage.style.color = "white"

    try {
      // Form validation before submission
      if (
        !withdrawalForm.firstName ||
        !withdrawalForm.lastName ||
        !withdrawalForm.phoneNumber ||
        !withdrawalForm.amount ||
        !withdrawalForm.password
      ) {
        widthdrawalResponseMessage.innerText = "Please fill in all required fields."
        widthdrawalResponseMessage.style.color = "red"
        return
      }

      // Validate amount is a positive number
      if (isNaN(withdrawalForm.amount) || Number.parseFloat(withdrawalForm.amount) <= 0) {
        widthdrawalResponseMessage.innerText = "Please enter a valid withdrawal amount."
        widthdrawalResponseMessage.style.color = "red"
        return
      }

      // Include the user ID in the withdrawal form
      const requestData = {
        ...withdrawalForm,
        userId: props.user._id, // Add user ID from props
      }

      const response = await axiosCreatedInstance.post("/omsiap/widthdrawal", requestData)

      // Handle success response
      if (response.data.success) {
        widthdrawalResponseMessage.innerText = response.data.message || "Withdrawal request submitted successfully!"
        widthdrawalResponseMessage.style.color = "green"

        // Reset form
        setWithdrawalForm({
          firstName: "",
          middleName: "",
          lastName: "",
          phoneNumber: "",
          amount: "",
          password: "",
        })

        // If you have a callback to refresh user data
        if (props.onWithdrawalSuccess) {
          props.onWithdrawalSuccess()
        }

        // Refresh transactions list
        loadAllTransactions()
      } else {
        // Handle specific error from server
        widthdrawalResponseMessage.innerText = response.data.message || "Failed to process withdrawal."
        widthdrawalResponseMessage.style.color = "red"
      }
    } catch (error) {
      console.error("Withdrawal error:", error)

      // Handle password error specifically
      if (error.response && error.response.status === 401) {
        widthdrawalResponseMessage.innerText = "Incorrect password. Please try again."

        // Clear only the password field
        setWithdrawalForm({
          ...withdrawalForm,
          password: "",
        })
      }
      // Handle other specific errors
      else if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message === "Insufficient balance"
      ) {
        widthdrawalResponseMessage.innerText = "You don't have enough balance for this withdrawal."
      }
      // Handle network/connection errors
      else if (error.message === "Network Error" || !navigator.onLine) {
        widthdrawalResponseMessage.innerText = "No internet connection. Please check your connection and try again."
      } else if (error.response) {
        // The server responded with a status code outside the 2xx range
        widthdrawalResponseMessage.innerText =
          error.response.data.message || `Error ${error.response.status}: ${error.response.statusText}`
      } else if (error.request) {
        // The request was made but no response was received
        widthdrawalResponseMessage.innerText = "Server not responding. Please try again later."
      } else {
        // Something else caused the error
        widthdrawalResponseMessage.innerText = "An error occurred. Please try again."
      }

      widthdrawalResponseMessage.style.color = "red"
    } finally {
      withdrawalloadingindicationcb(false)
    }
  }

  // Initial state for the exchange form
  const [exchangeForm, setExchangeForm] = useState({
    phpAmount: "",
    referenceNumber: "",
    transactionImage: null,
  })

  const [formError, setFormError] = useState("")

  // Preset PHP amounts and their OMSIAPAS equivalents
  const presetAmounts = [
    { php: 210, omsiapawas: 200 },
    { php: 525, omsiapawas: 500 },
    { php: 1050, omsiapawas: 1000 },
    { php: 1260, omsiapawas: 1200 },
    { php: 1575, omsiapawas: 1500 },
    { php: 2100, omsiapawas: 2000 },
    { php: 3150, omsiapawas: 3000 },
    { php: 4200, omsiapawas: 4000 },
    { php: 5250, omsiapawas: 5000 },
  ]

  // Handle preset amount button clicks
  const handlePresetAmountClick = (amount) => {
    setExchangeForm({
      ...exchangeForm,
      phpAmount: amount,
    })

    // Clear any previous form errors
    setFormError("")
  }

  // Handle changes to the exchange form
  const handleExchangeChange = (e) => {
    const { name, value, files } = e.target

    if (name === "transactionImage" && files && files[0]) {
      // Handle file upload
      const file = files[0]
      setExchangeForm({
        ...exchangeForm,
        transactionImage: file,
      })

      // Generate preview image
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    } else if (name === "phpAmount") {
      // Allow any input, but we'll validate on submission
      setExchangeForm({
        ...exchangeForm,
        [name]: value,
      })

      // Clear any previous form errors
      setFormError("")
    } else {
      // Handle regular inputs
      setExchangeForm({
        ...exchangeForm,
        [name]: value,
      })
    }
  }

  // Calculate OMSIAPAS amount from PHP amount
  const calculateOmsiapasAmount = (phpAmount) => {
    // Check if amount is one of the preset amounts for exact conversion
    const presetMatch = presetAmounts.find((preset) => preset.php === Number(phpAmount))
    if (presetMatch) {
      return presetMatch.omsiapawas
    }

    // Otherwise calculate based on the rate
    if (phpAmount >= 210) {
      return Math.floor((phpAmount / 210) * 200)
    }
    return 0
  }

  const handleExchangeSubmit = async (e) => {
    e.preventDefault()

    // Get response message element and reset it
    const responseMessageElement = document.querySelectorAll(".userdashboard-currencyexchange-responsemessage")[0]
    responseMessageElement.innerText = ""
    responseMessageElement.style.color = "white"

    // Show loading indicator
    currencyexchangeloadingindicationcb(true)

    // Clear previous form errors
    setFormError("")

    // Validate PHP amount
    if (!exchangeForm.phpAmount || exchangeForm.phpAmount < 210) {
      setFormError("Please enter an amount of at least ₱210")
      currencyexchangeloadingindicationcb(false)
      return
    }

    if (exchangeForm.phpAmount > 5015) {
      setFormError("The maximum amount allowed is ₱5,015")
      currencyexchangeloadingindicationcb(false)
      return
    }

    // Validate reference number
    if (!exchangeForm.referenceNumber || exchangeForm.referenceNumber.trim() === "") {
      setFormError("Please enter a valid reference number")
      currencyexchangeloadingindicationcb(false)
      return
    }

    // Validate transaction image
    if (!exchangeForm.transactionImage) {
      setFormError("Please upload your transaction receipt")
      currencyexchangeloadingindicationcb(false)
      return
    }

    // Calculate OMSIAPAS to be received
    const omsiapasAmount = calculateOmsiapasAmount(exchangeForm.phpAmount)

    // Create form data for file upload
    const formData = new FormData()

    // Add form fields to FormData
    formData.append("phpAmount", exchangeForm.phpAmount)
    formData.append("exchangeamount", omsiapasAmount)
    formData.append("referenceNumber", exchangeForm.referenceNumber)
    formData.append("transactionImage", exchangeForm.transactionImage)

    // Add user information
    const userInfo = {
      id: props.user.id,
      _id: props.user._id,
      name: {
        firstname: props.user.name.firstname,
        middlename: props.user.name.middlename || "",
        lastname: props.user.name.lastname,
        nickname: props.user.name.nickname || "",
      },
      contact: {
        phonenumber: props.user.contact.phonenumber || "123456-6789-0",
        telephonenumber: props.user.contact.telephonenumber || "",
        emailaddress: props.user.contact.emailaddress || "emailaddress@gmail.com",
        address: {
          street: props.user.contact.address?.street || "",
          trademark: props.user.contact.address?.trademark || "",
          baranggay: props.user.contact.address?.baranggay || "",
          city: props.user.contact.address?.city || "",
          province: props.user.contact.address?.province || "",
          postal_zip_code: props.user.contact.address?.postal_zip_code || "",
          country: props.user.contact.address?.country || "",
        },
      },
    }

    // Convert user object to JSON string and append to form data
    formData.append("transactionmadeby", JSON.stringify(userInfo))

    try {
      // Submit form data with file
      const response = await axiosCreatedInstance.post("/omsiap/currencyexchange", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      // Log the full response for debugging
      console.log("Exchange response:", response.data)

      // Handle response status and display appropriate message
      if (response.data && response.data.success) {
        // Handle successful response
        handleResponseStatus(response.data)

        // Safely log success info using optional chaining to avoid errors
        try {
          console.log("Exchange submitted:", {
            ...exchangeForm,
            omsiapasToReceive: omsiapasAmount,
            userName: `${props.user.name.firstname} ${props.user.name.middlename || ""} ${props.user.name.lastname}`,
            userPhone: props.user.contact.phonenumber,
            currentBalance: props.user.credits?.omsiapawas?.amount || "N/A", // Corrected to omsiapawas
          })
        } catch (logError) {
          console.warn("Non-critical error when logging exchange info:", logError)
        }

        // Reset form on success
        setExchangeForm({ phpAmount: "", referenceNumber: "", transactionImage: null })
        setPreviewImage(null)

        // Refresh transactions list
        loadAllTransactions()
      } else {
        // Handle unsuccessful response
        handleResponseStatus(response.data)
      }
    } catch (error) {
      console.error("Exchange submission error:", error)

      // Get error message and status from response if available
      const errorMessage = error.response?.data?.message || "An error occurred while processing your request."
      const errorStatus = error.response?.data?.status || "SERVER_ERROR"

      // Handle error response
      handleResponseStatus({
        success: false,
        status: errorStatus,
        message: errorMessage,
      })
    } finally {
      // Hide loading indicator
      currencyexchangeloadingindicationcb(false)
    }
  }

  // Function to handle different response statuses
  const handleResponseStatus = (responseData) => {
    const responseMessageElement = document.querySelectorAll(".userdashboard-currencyexchange-responsemessage")[0]

    if (!responseMessageElement) {
      console.error("Response message element not found")
      return
    }

    // Debug the response data
    console.log("handleResponseStatus received:", responseData)

    // Default error message if no response data
    if (!responseData) {
      responseMessageElement.innerText = "An unexpected error occurred. Please try again."
      responseMessageElement.style.color = "#ff5252"
      return
    }

    // Handle different response statuses
    switch (responseData.status) {
      // Success cases
      case "EXCHANGE_PENDING":
        responseMessageElement.innerText = "Your exchange request has been submitted and is pending approval."
        responseMessageElement.style.color = "#4caf50"
        break

      // Error cases
      case "MISSING_FIELDS":
        responseMessageElement.innerText = "Please fill in all required fields."
        responseMessageElement.style.color = "#ff5252"
        break

      case "INVALID_AMOUNT":
        responseMessageElement.innerText = "The exchange amount is invalid. Please check and try again."
        responseMessageElement.style.color = "#ff5252"
        break

      case "INVALID_REFERENCE":
        responseMessageElement.innerText = "Invalid reference number. Please check and try again."
        responseMessageElement.style.color = "#ff5252"
        break

      case "IMAGE_UPLOAD_FAILED":
        responseMessageElement.innerText = "Failed to upload your transaction image. Please try again."
        responseMessageElement.style.color = "#ff5252"
        break

      case "NOT_FOUND":
        responseMessageElement.innerText = "System data not found. Please contact support."
        responseMessageElement.style.color = "#ff5252"
        break

      case "DUPLICATE_REFERENCE":
        responseMessageElement.innerText = "This reference number has already been used. Please check and try again."
        responseMessageElement.style.color = "#ff5252"
        break

      case "SERVER_ERROR":
        responseMessageElement.innerText = "A server error occurred. Please try again later or contact support."
        responseMessageElement.style.color = "#ff5252"
        break

      default:
        // Display the message from the response or a default message
        responseMessageElement.innerText =
          responseData.message ||
          (responseData.success ? "Operation completed successfully." : "An error occurred. Please try again.")
        responseMessageElement.style.color = responseData.success ? "#4caf50" : "#ff5252"
    }
  }

  const getOMSIAPASAmount = (phpAmount) => {
    // Convert to number to ensure proper comparison
    const amount = Number(phpAmount)

    // Match exact preset amounts
    switch (amount) {
      case 210:
        return 200
      case 515:
        return 500
      case 1020:
        return 1000
      case 2015:
        return 2000
      case 3015:
        return 3000
      case 4015:
        return 4000
      case 5015:
        return 5000
      default:
        // Fallback calculation for custom amounts
        return Math.floor((amount * 200) / 210)
    }
  }

  // Helper function to format currency based on type
  const formatCurrency = (amount, type) => {
    if (type === "Currency Exchange" || type === "OMSIAPAWAS Transfer") {
      return `${amount >= 0 ? "+" : ""}${Math.abs(amount).toFixed(2)} OMSIAPAWAS`
    } else if (type === "Withdrawal") {
      return `${amount >= 0 ? "+" : ""}${Math.abs(amount).toFixed(2)} OMSIAPAWAS`
    } else {
      return `${amount >= 0 ? "+" : ""}₱${Math.abs(amount).toFixed(2)}`
    }
  }

  const renderTransactionDetails = (transaction) => {
  if (!transaction) return null

  switch (transaction.type) {
    case "Merchandise":
      return (
        <div className="transaction-modal__product-details">
          <h4 className="transaction-modal__section-title">Purchased Merchandise</h4>
          {transaction.products && transaction.products.length > 0 ? (
            <div className="transaction-modal__table-container">
              <table className="transaction-modal__product-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Image</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {transaction.products.map((product, index) => (
                    <tr key={product.id || index} className="transaction-modal__product-row">
                      <td className="transaction-modal__product-name">
                        <span className="transaction-modal__product-title">{product.name}</span>
                      </td>
                      <td className="transaction-modal__product-image-cell">
                        {product.image ? (
                          <div className="transaction-modal__product-image-container">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="transaction-modal__product-image"
                              onClick={() => openImageModal(product.image)}
                            />
                          </div>
                        ) : (
                          <div className="transaction-modal__product-image-placeholder">
                            <span>No Image</span>
                          </div>
                        )}
                      </td>
                      <td className="transaction-modal__product-quantity">
                        <span className="transaction-modal__quantity-badge">{product.quantity || 1}</span>
                      </td>
                      <td className="transaction-modal__product-price">₱{product.price.toFixed(2)}</td>
                      <td className="transaction-modal__product-subtotal">
                        <strong>₱{((product.price || 0) * (product.quantity || 1)).toFixed(2)}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="transaction-modal__total-section">
                <div className="transaction-modal__total-row">
                  <span className="transaction-modal__total-label">Total merchandise purchase amount: </span>
                  <span className="transaction-modal__total-amount">
                    ₱
                    {transaction.products
                      .reduce((sum, product) => sum + (product.price || 0) * (product.quantity || 1), 0)
                      .toFixed(2)}
                  </span>
                </div>
                <div className="transaction-modal__total-row">
                  <span className="transaction-modal__total-label">Total shipping amount:</span>
                  <span className="transaction-modal__total-amount">
                    ₱
                    {transaction.shippingsubtotal}
                  </span>
                </div>
                <div className="transaction-modal__total-row">
                  <span className="transaction-modal__total-label">Total Amount:</span>
                  <span className="transaction-modal__total-amount">
                    ₱
                    { transaction.merchandisesubtotal + transaction.shippingsubtotal}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="transaction-modal__no-data">
              <p>No product details available</p>
            </div>
          )}
        </div>
      )

    case "Currency Exchange":
      return (
        <div className="transaction-modal__exchange-details">
          <h4 className="transaction-modal__section-title">Exchange Details</h4>
          <div className="transaction-modal__details-grid">
            <div className="transaction-modal__detail-card">
              <span className="transaction-modal__detail-label">Omsiapawas Purchase Amount</span>
              <span className="transaction-modal__detail-value transaction-modal__amount-negative">
                ₱{transaction.phpAmount?.toFixed(2) || "0.00"}
              </span>
            </div>
            <div className="transaction-modal__detail-card">
              <span className="transaction-modal__detail-label">OMSIAPAWAS Received</span>
              <span className="transaction-modal__detail-value transaction-modal__amount-positive">
                {transaction.amount?.toFixed(2) || "0.00"} OMSIAPAWAS
              </span>
            </div>
            {transaction.transactionDetails?.receiptNumber && (
              <div className="transaction-modal__detail-card transaction-modal__detail-card--full">
                <span className="transaction-modal__detail-label">Reference Number</span>
                <span className="transaction-modal__detail-value transaction-modal__reference-number">
                  {transaction.transactionDetails.receiptNumber}
                </span>
              </div>
            )}
          </div>
          {transaction.transactionDetails?.receiptImage && (
            <div className="transaction-modal__receipt-section">
              <h5 className="transaction-modal__subsection-title">Transaction Receipt</h5>
              <div className="transaction-modal__receipt-container">
                <img
                  src={transaction.transactionDetails.receiptImage || "/placeholder.svg?height=200&width=300"}
                  alt="Transaction Receipt"
                  className="transaction-modal__receipt-image"
                  onClick={() => openImageModal(transaction.transactionDetails.receiptImage)}
                />
                <p className="transaction-modal__image-hint">Click to view full size</p>
              </div>
            </div>
          )}
        </div>
      )

    case "Withdrawal":
      return (
        <div className="transaction-modal__withdrawal-details">
          <h4 className="transaction-modal__section-title">Withdrawal Details</h4>
          <div className="transaction-modal__details-grid">
            <div className="transaction-modal__detail-card">
              <span className="transaction-modal__detail-label">OMSIAPAWAS Amount</span>
              <span className="transaction-modal__detail-value transaction-modal__amount-negative">
                {Math.abs(transaction.amount).toFixed(2)} OMSIAPAWAS
              </span>
            </div>
            {transaction.transactionDetails?.accountNumber && (
              <div className="transaction-modal__detail-card">
                <span className="transaction-modal__detail-label">GCash Number</span>
                <span className="transaction-modal__detail-value">
                  {transaction.transactionDetails.accountNumber}
                </span>
              </div>
            )}
          </div>
          {transaction.transactionDetails?.notes && (
            <div className="transaction-modal__notes-section">
              <h5 className="transaction-modal__subsection-title">Notes</h5>
              <p className="transaction-modal__notes-text">{transaction.transactionDetails.notes}</p>
            </div>
          )}
        </div>
      )

    case "OMSIAPAWAS Transfer":
      return (
        <div className="transaction-modal__transfer-details">
          <h4 className="transaction-modal__section-title">Transfer Details</h4>
          <div className="transaction-modal__details-grid">
            <div className="transaction-modal__detail-card">
              <span className="transaction-modal__detail-label">Transfer Amount</span>
              <span
                className={`transaction-modal__detail-value ${
                  transaction.amount >= 0
                    ? "transaction-modal__amount-positive"
                    : "transaction-modal__amount-negative"
                }`}
              >
                {Math.abs(transaction.amount).toFixed(2)} OMSIAPAWAS
              </span>
            </div>
            <div className="transaction-modal__detail-card">
              <span className="transaction-modal__detail-label">Transfer Type</span>
              <span
                className={`transaction-modal__detail-value transaction-modal__transfer-type ${
                  transaction.amount >= 0
                    ? "transaction-modal__transfer-received"
                    : "transaction-modal__transfer-sent"
                }`}
              >
                {transaction.amount >= 0 ? "Received" : "Sent"}
              </span>
            </div>
          </div>
          {transaction.transactionDetails?.notes && (
            <div className="transaction-modal__notes-section">
              <h5 className="transaction-modal__subsection-title">Notes</h5>
              <p className="transaction-modal__notes-text">{transaction.transactionDetails.notes}</p>
            </div>
          )}
        </div>
      )

    default:
      return (
        <div className="transaction-modal__generic-details">
          <div className="transaction-modal__no-data">
            <p>No additional details available for this transaction type.</p>
          </div>
        </div>
      )
  }
  }

  const [selectedImage, setSelectedImage] = useState(null)


  // Document handling functions

// This function handles file uploads
const handleFileUpload = (event) => {
  const { name, files } = event.target;
  
  if (files && files[0]) {
    // Update the profile form with the selected file
    setProfileForm(prev => ({
      ...prev,
      [name]: files[0]
    }));
  }
};

// This function handles removing a document
const handleRemoveDocument = (documentField) => {
  setProfileForm(prev => ({
    ...prev,
    [documentField]: null
  }));
};

{/*
const [profileForm, setProfileForm] = useState({
    firstName: user.firstName,
    middleName: user.middleName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    birthCertificateFront: null,
    birthCertificateBack: null,
    governmentIdFront: null,
    governmentIdBack: null,
  })
*/}

{/*
// Initial form state with proper optional chaining
const [profileForm, setProfileForm] = useState({
  // Basic personal information
  firstName: props.user.name.firstname || '',
  middleName: props.user.name.middlename || '',
  lastName: props.user.name.lastname || '',
  phoneNumber: props.user.contact.phonenumber || '',
  
  // Document fields with proper optional chaining
  birthCertificateFront: props.user.personaldata.birthcertificate.frontphoto?.image || null,
  birthCertificateBack: props.user.personaldata.birthcertificate.backphoto?.image || null,
  governmentIdFront: props.user.personaldata.government_issued_identification.frontphoto?.image || null,
  governmentIdBack: props.user.personaldata.government_issued_identification.backphoto?.image || null
});
*/}
// Initial form state with more robust optional chaining and default values
const [profileForm, setProfileForm] = useState({
  // Basic personal information
  firstName: '',
  middleName: '',
  lastName: '',
  phoneNumber: '',
  
  // Document fields
  birthCertificateFront: null,
  birthCertificateBack: null,
  governmentIdFront: null,
  governmentIdBack: null
});

// Update form data when props.user changes or becomes available
useEffect(() => {
  if (props.user) {
    setProfileForm({
      firstName: props.user?.name?.firstname || '',
      middleName: props.user?.name?.middlename || '',
      lastName: props.user?.name?.lastname || '',
      phoneNumber: props.user?.contact?.phonenumber || '',
      
      birthCertificateFront: props.user?.personaldata?.birthcertificate?.frontphoto?.image || null,
      birthCertificateBack: props.user?.personaldata?.birthcertificate?.backphoto?.image || null,
      governmentIdFront: props.user?.personaldata?.government_issued_identification?.frontphoto?.image || null,
      governmentIdBack: props.user?.personaldata?.government_issued_identification?.backphoto?.image || null
    });
  }
}, [props.user]);

// 2. Add console logging to help debug
useEffect(() => {
  console.log("Current props.user:", props.user);
  console.log("Current profileForm state:", profileForm);
}, [props.user, profileForm]);

// 3. Helper function to safely access nested properties
const getNestedValue = (obj, path, defaultValue = '') => {
  try {
    const value = path.split('.').reduce((o, key) => (o || {})[key], obj);
    return value !== undefined && value !== null ? value : defaultValue;
  } catch (error) {
    console.error(`Error accessing path ${path}:`, error);
    return defaultValue;
  }
};



// Track documents that should be removed
const [removedDocuments, setRemovedDocuments] = useState([])

// State for loading and notifications
const [isSubmitting, setIsSubmitting] = useState(false)

const [notification, setNotification] = useState({ show: false, type: '', message: '' })

const [profilesubmitloadingindication, profilesubmitloadingindicationcb] = useState(false)

{/*
   const handleProfileChange = (e) => {
    const { name, value, files } = e.target

    if (files && files[0]) {
      setProfileForm({ ...profileForm, [name]: files[0] })
      setPreviewImages({
        ...previewImages,
        [name]: URL.createObjectURL(files[0]),
      })
    } else {
      setProfileForm({ ...profileForm, [name]: value })
    }
  }
  */}

// Handle normal form input changes
const handleProfileChange = (event) => {
  const { name, value } = event.target;
  setProfileForm(prev => ({
    ...prev,
    [name]: value
  }));
};

{/*
   const handleProfileSubmit = (e) => {
    e.preventDefault()

    // In a real app, send profile update to server
    console.log("Profile updated:", profileForm)

    // Update user state with new profile information
    setUser({
      ...user,
      firstName: profileForm.firstName,
      middleName: profileForm.middleName,
      lastName: profileForm.lastName,
      phoneNumber: profileForm.phoneNumber,
      birthCertificateFront: profileForm.birthCertificateFront || user.birthCertificateFront,
      birthCertificateBack: profileForm.birthCertificateBack || user.birthCertificateBack,
      governmentIdFront: profileForm.governmentIdFront || user.governmentIdFront,
      governmentIdBack: profileForm.governmentIdBack || user.governmentIdBack,
    })

    // Show success message (in a real app, this would be more sophisticated)
    alert("Profile updated successfully!")
  }
  */}

// Handle profile form submission 
const handleProfileSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  // Get reference to the response message element
  const responseMessage = document.querySelector('#userdashboard-profilesubmit-responsemessage');
  responseMessage.textContent = 'Submitting profile updates...';
  responseMessage.style.color = '#666'; // Neutral color for processing
  
  // Show loading indicator
  profilesubmitloadingindicationcb(true);
  
  try {
    // Check internet connection
    if (!navigator.onLine) {
      throw new Error('No internet connection. Please check your network and try again.');
    }
    
    // Create FormData for file uploads
    const formData = new FormData();
    
    // Add user ID explicitly instead of relying on middleware
    formData.append('userId', props.user._id); // Assuming currentUser is available from context/state
    
    // Add text fields
    formData.append('firstName', profileForm.firstName);
    formData.append('middleName', profileForm.middleName || '');
    formData.append('lastName', profileForm.lastName);
    formData.append('phoneNumber', profileForm.phoneNumber);
    
    // Add files if they are File objects (newly uploaded)
    if (profileForm.birthCertificateFront instanceof File) {
      formData.append('birthCertificateFront', profileForm.birthCertificateFront);
    }
    
    if (profileForm.birthCertificateBack instanceof File) {
      formData.append('birthCertificateBack', profileForm.birthCertificateBack);
    }
    
    if (profileForm.governmentIdFront instanceof File) {
      formData.append('governmentIdFront', profileForm.governmentIdFront);
    }
    
    if (profileForm.governmentIdBack instanceof File) {
      formData.append('governmentIdBack', profileForm.governmentIdBack);
    }
    
    // Add the list of documents to remove
    if (removedDocuments.length > 0) {
      formData.append('removedDocuments', JSON.stringify(removedDocuments));
    }
    
    // Set timeout for the request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30-second timeout
    
    // Send request to update profile
    const response = await axiosCreatedInstance.put('/omsiap/profile/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      signal: controller.signal
    });
    
    // Clear the timeout
    clearTimeout(timeoutId);
    
    if (response.data.success) {
      // Reset removed documents array after successful update
      setRemovedDocuments([]);
      
      // Update profile form with the returned data
      const updatedData = response.data.data;
      setProfileForm(prev => ({
        ...prev,
        firstName: updatedData.firstName || prev.firstName,
        middleName: updatedData.middleName || prev.middleName,
        lastName: updatedData.lastName || prev.lastName,
        phoneNumber: updatedData.phoneNumber || prev.phoneNumber,
        birthCertificateFront: updatedData.documents?.birthCertificateFront || null,
        birthCertificateBack: updatedData.documents?.birthCertificateBack || null,
        governmentIdFront: updatedData.documents?.governmentIdFront || null,
        governmentIdBack: updatedData.documents?.governmentIdBack || null
      }));
      
      // Update UI with success message
      responseMessage.textContent = 'Profile updated successfully!';
      responseMessage.style.color = '#4caf50'; // Green for success
      
      // Show success notification
      setNotification({
        show: true,
        type: 'success',
        message: 'Profile updated successfully'
      });
    } else {
      throw new Error(response.data.message || 'Failed to update profile');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    
    // Handle specific error types
    let errorMessage = 'An unexpected error occurred. Please try again later.';
    
    if (!navigator.onLine) {
      errorMessage = 'No internet connection. Please check your network and try again.';
    } else if (error.name === 'AbortError') {
      errorMessage = 'Request timed out. The server is taking too long to respond.';
    } else if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response from server. Please try again later.';
    } else {
      // Something happened in setting up the request
      errorMessage = error.message || 'Failed to send request';
    }
    
    // Update UI with error message
    responseMessage.textContent = errorMessage;
    responseMessage.style.color = '#f44336'; // Red for error
    
    // Show error notification
    setNotification({
      show: true,
      type: 'error',
      message: errorMessage
    });
  } finally {
    // Hide loading indicator
    profilesubmitloadingindicationcb(false);
    setIsSubmitting(false);
    
    // Hide notification after 5 seconds (increased from 3)
    if (notification.show) {
      setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
      }, 5000);
    }
  }
};

  return (
    <div className="userdashboard-dashboard-container" style={{ display: props.userdashboardmodal }}>

      <header className="userdashboard-dashboard-header">
        <h1>(M)onthly (F)inancial (A)llocation (T)o (I)ndividual (P)eople PROFILE</h1>
        <div className="userdashboard-nav-tabs">
          <button
            className={`userdashboard-tab-btn ${activeTab === "account" ? "userdashboard-active" : ""}`}
            onClick={() => setActiveTab("account")}
          >
            Account
          </button>
          <button
            className={`userdashboard-tab-btn ${activeTab === "currencyexchange" ? "userdashboard-active" : ""}`}
            onClick={() => setActiveTab("currencyexchange")}
          >
            Exchange Currency
          </button>
          <button
            className={`userdashboard-tab-btn ${activeTab === "withdrawal" ? "userdashboard-active" : ""}`}
            onClick={() => setActiveTab("withdrawal")}
          >
            Withdrawal
          </button>
          <button
            className={`userdashboard-tab-btn ${activeTab === "transactions" ? "userdashboard-active" : ""}`}
            onClick={() => setActiveTab("transactions")}
          >
            Transactions
          </button>
          <button
            className={`userdashboard-tab-btn ${activeTab === "settings" ? "userdashboard-active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            Account Settings
          </button>
        </div>

        <button className="userdashboard-gotohome-btn">
          <a href={"/"} id="gotohomeatag">
            <span style={{color: 'white'}}>Go to home</span>
          </a>
        </button>

        {/*
          {
          props.user.loginstatus === "logged in" ?
          (
            <button className="userdashboard-logout-btn" onClick={handleLogout}>LOG OUT</button>
          )
          :
          (
            <button className="userdashboard-login-btn" onClick={()=> {
              navigate('/mfatip/loginregister')
            }}>LOG IN</button>
          )
          }
        */}
      </header>

      <div className="userdashboard-dashboard-content">

        {/* Account Summary Tab */}
        {activeTab === "account" && (
          <div className="userdashboard-account-panel">
            <section className="userdashboard-account-summary">
              <h2>Account Summary</h2>
              <div className="userdashboard-summary-details">
                <div className="userdashboard-summary-item" style={{ "--item-index": 1 }}>
                  <span className="userdashboard-label">Account ID:</span>
                  <span className="userdashboard-value">{props.user.id}</span>
                </div>
                <div className="userdashboard-summary-item" style={{ "--item-index": 2 }}>
                  <span className="userdashboard-label">Name:</span>
                  <span className="userdashboard-value">
                    {props.user.name.firstname}
                    {props.user.name.middlename && ` ${props.user.name.middlename} `}
                    {props.user.name.lastname}
                  </span>
                </div>
                <div className="userdashboard-summary-item" style={{ "--item-index": 3 }}>
                  <span className="userdashboard-label">Email:</span>
                  <span className="userdashboard-value">
                    {props.user.contact.emailaddress || "Add or change your email address in the account settings tab"}
                  </span>
                </div>
                <div className="userdashboard-summary-item" style={{ "--item-index": 4 }}>
                  <span className="userdashboard-label">Phone:</span>
                  <span className="userdashboard-value">{props.user.contact.phonenumber}</span>
                </div>
                <div className="userdashboard-summary-item" style={{ "--item-index": 5 }}>
                  <span className="userdashboard-label">Status:</span>
                  <span className="userdashboard-value userdashboard-status-active">
                    {props.user.registrationstatusesandlogs.indication}
                  </span>
                </div>
                <div className="userdashboard-summary-item" style={{ "--item-index": 6 }}>
                  <span className="userdashboard-label">Member Since:</span>

                  <span className="userdashboard-value">
                    {props.user.registrationstatusesandlogs.registrationlog[0].date}
                  </span>
                </div>
              </div>
            </section>

            <section className="userdashboard-balance-details">
              <h2>Balance Details</h2>
              <div className="userdashboard-balance-amount">
                <span className="userdashboard-currency"></span>
                <span className="userdashboard-amount">{props.user.credits.omsiapawas.amount.toFixed(2)}</span>
              </div>
            </section>

           {/* Redesigned Document Verification Section - Simplified Based on Overall Status */}
            <section className="userdashboard-documents-verification">
              <h2>Document Verification Status</h2>
              
              {props.user.registrationstatusesandlogs.indication === "Verified" ? (
                <div className="userdashboard-verification-message userdashboard-verified">
                  <div className="userdashboard-verification-icon">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div className="userdashboard-verification-content">
                    <h3>Account Successfully Verified</h3>
                    <p>All your documents have been verified. Your account is fully activated and ready to use.</p>
                  </div>
                </div>
              ) : props.user.registrationstatusesandlogs.indication === "Pending Documents" ? (
                // Show individual document cards only when status is Pending
                <div className="userdashboard-documents-status-grid">
                  {/* Birth Certificate Card */}
                  <div
                    className={`userdashboard-document-card ${
                      props.user.personaldata?.birthcertificate?.frontphoto?.image && 
                      props.user.personaldata?.birthcertificate?.backphoto?.image
                        ? "userdashboard-verified"
                        : "userdashboard-pending"
                    }`}
                  >
                    <div className="userdashboard-document-icon">
                      {props.user.personaldata?.birthcertificate?.frontphoto?.image && 
                      props.user.personaldata?.birthcertificate?.backphoto?.image ? (
                        <i className="fas fa-check-circle"></i>
                      ) : (
                        <i className="fas fa-exclamation-circle"></i>
                      )}
                    </div>
                    <div className="userdashboard-document-info">
                      <h3 className="userdashboard-document-title">Birth Certificate</h3>
                      <span
                        className={`userdashboard-document-badge ${
                          props.user.personaldata?.birthcertificate?.frontphoto?.image && 
                          props.user.personaldata?.birthcertificate?.backphoto?.image
                            ? "userdashboard-verified"
                            : "userdashboard-pending"
                        }`}
                      >
                        {props.user.personaldata?.birthcertificate?.frontphoto?.image && 
                        props.user.personaldata?.birthcertificate?.backphoto?.image
                          ? "Verified"
                          : "Pending Documents"}
                      </span>
                      {!(props.user.personaldata?.birthcertificate?.frontphoto?.image && 
                        props.user.personaldata?.birthcertificate?.backphoto?.image) && (
                        <p className="userdashboard-document-action">
                          Please upload your birth certificate in the Settings section
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Government ID Card */}
                  <div
                    className={`userdashboard-document-card ${
                      props.user.personaldata?.government_issued_identification?.frontphoto?.image && 
                      props.user.personaldata?.government_issued_identification?.backphoto?.image
                        ? "userdashboard-verified"
                        : "userdashboard-pending"
                    }`}
                  >
                    <div className="userdashboard-document-icon">
                      {props.user.personaldata?.government_issued_identification?.frontphoto?.image && 
                      props.user.personaldata?.government_issued_identification?.backphoto?.image ? (
                        <i className="fas fa-check-circle"></i>
                      ) : (
                        <i className="fas fa-exclamation-circle"></i>
                      )}
                    </div>
                    <div className="userdashboard-document-info">
                      <h3 className="userdashboard-document-title">Government ID</h3>
                      <span
                        className={`userdashboard-document-badge ${
                          props.user.personaldata?.government_issued_identification?.frontphoto?.image && 
                          props.user.personaldata?.government_issued_identification?.backphoto?.image
                            ? "userdashboard-verified"
                            : "userdashboard-pending"
                        }`}
                      >
                        {props.user.personaldata?.government_issued_identification?.frontphoto?.image && 
                        props.user.personaldata?.government_issued_identification?.backphoto?.image
                          ? "Verified"
                          : "Pending Verification"}
                      </span>
                      {!(props.user.personaldata?.government_issued_identification?.frontphoto?.image && 
                        props.user.personaldata?.government_issued_identification?.backphoto?.image) && (
                        <p className="userdashboard-document-action">
                          Please upload your government ID in the Settings section
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Status Message for Pending */}
                  <div className="userdashboard-document-status-message userdashboard-pending">
                    <i className="fas fa-clock"></i>
                    <p>Your account verification is in progress. Our team is reviewing your documents.</p>
                  </div>
                </div>
              ) : (
                // Unverified Status - Simple Message
                <div className="userdashboard-verification-message userdashboard-unverified">
                  <div className="userdashboard-verification-icon">
                    <i className="fas fa-exclamation-triangle"></i>
                  </div>
                  <div className="userdashboard-verification-content">
                    <h3>Account Verification Required</h3>
                    <p>Please provide the required documents to verify your account. Upload your birth certificate and government ID in the Settings section.</p>
                    <button className="userdashboard-verification-action-btn">
                      Go to Settings
                    </button>
                  </div>
                </div>
              )}
            </section>

          </div>
        )}

        {/* Currency Exchange Tab */}
        {activeTab === "currencyexchange" && (
          <div className="userdashboard-exchange-panel">
            <section className="userdashboard-exchange-user-info">
              <h2>Your Information</h2>
              <br />
              <br />
              <div className="userdashboard-user-details">
                <div className="userdashboard-user-info-row">
                  <div className="userdashboard-user-info-item">
                    <span className="info-label">Full Name:</span>
                    <span className="info-value">
                      {props.user.name.firstname} {props.user.name.middlename ? props.user.name.middlename + " " : ""}
                      {props.user.name.lastname}
                    </span>
                  </div>
                  <div className="userdashboard-user-info-item">
                    <span className="info-label">Phone Number:</span>
                    <span className="info-value">{props.user.contact.phonenumber}</span>
                  </div>
                </div>
                <br />
                <div className="userdashboard-user-info-row">
                  <div className="userdashboard-user-info-item">
                    <span className="info-label">
                      Current&nbsp;
                      <span className="tooltip-container">
                        OMSIAPAWAS
                        <span className="tooltip-text">Of Macky's Ink And Paper And Wood And Stone Currency</span>
                      </span>{" "}
                      &nbsp; Balance:
                    </span>
                    <span className="info-value omsiapas-balance">
                      {props.user.credits.omsiapawas.amount}
                      <span className="tooltip-container">
                        &nbsp;OMSIAPAWAS
                        <span className="tooltip-text">Of Macky's Ink And Paper And Wood And Stone Currency</span>
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="userdashboard-exchange-notice">
              <h2>Important Notice</h2>
              <div className="userdashboard-notice-content">
                <ul className="exchange-info">
                  <li style={{ color: "white" }} className="exchange-rate fade-in">
                    The exchange rate is{" "}
                    <strong>
                      210 PESO CURRENCY = 200{" "}
                      <span className="tooltip-container">
                        OMSIAPAWAS
                        <span className="tooltip-text">Of Macky's Ink And Paper And Wood And Stone Currency</span>
                      </span>
                    </strong>
                    ,{" "}
                    <strong>
                      525 PESO CURRENCY = 500{" "}
                      <span className="tooltip-container">
                        OMSIAPAWAS
                        <span className="tooltip-text">Of Macky's Ink And Paper And Wood And Stone Currency</span>
                      </span>
                    </strong>
                    ,{" "}
                    <strong>
                      1050 PESO CURRENCY = 1000{" "}
                      <span className="tooltip-container">
                        OMSIAPAWAS
                        <span className="tooltip-text">Of Macky's Ink And Paper And Wood And Stone Currency</span>
                      </span>
                    </strong>
                    ,{" "}
                    <strong>
                      1575 PESO CURRENCY = 1500{" "}
                      <span className="tooltip-container">
                        OMSIAPAWAS
                        <span className="tooltip-text">Of Macky's Ink And Paper And Wood And Stone Currency</span>
                      </span>
                    </strong>
                    , and so on until reaching the maximum transaction exchange amount.
                  </li>
                  <li className="min-amount slide-in">
                    <FaInfoCircle className="icon" />
                    Minimum transaction amount is <strong>210 PHP</strong> equivalent to <strong>200 OMSIAPAWAS</strong>{" "}
                    per exchange.
                  </li>
                  <li className="max-amount slide-in">
                    <FaInfoCircle className="icon" />
                    Maximum transaction amount is <strong>5,250 PHP</strong> equivalent to{" "}
                    <strong>5,000 OMSIAPAWAS</strong> per exchange.
                  </li>
                  <li className="process-info bounce-in">
                    <FaMoneyBillWave className="icon" />
                    All exchanges are processed through GCash payment integration and will be validated by OMSIAP
                    personnel through the OMSIAP database management system.
                  </li>
                  <li style={{ color: "green" }} className="important-notice pulse">
                    <FaExclamationTriangle className="icon warning" />
                    Failure to send the exact amounts specified in the form will result in your money being returned to
                    your GCash account with a 50-peso deduction for processing, or disciplinary action for not following
                    instructions.
                  </li>
                  <li style={{ color: "white" }} className="receipt-info fade-in">
                    <FaReceipt className="icon" />
                    All transactions require a valid GCash receipt screenshot for validation and comparison by OMSIAP
                    personnel.
                  </li>
                  <li className="reference-info slide-in">
                    <FaInfoCircle className="icon" />
                    Please ensure the GCash transaction reference number is clearly visible in your screenshot.
                  </li>
                  <li className="processing-time bounce-in">
                    <FaClock className="icon" />
                    Processing may take up to 24 hours during business days.
                  </li>
                </ul>
              </div>
            </section>

            <section className="userdashboard-exchange-form-section">
              <h2>Currency Exchange Form</h2>
              <form className="userdashboard-exchange-form">
                <div className="userdashboard-preset-amounts">
                  <h3>Select Amount to Exchange</h3>
                  <div className="userdashboard-preset-buttons">
                    <button
                      type="button"
                      className={`preset-btn ${exchangeForm.phpAmount === 210 ? "active" : ""}`}
                      onClick={() => handlePresetAmountClick(210)}
                    >
                      ₱210 = 200 OMSIAPAWAS
                    </button>
                    <button
                      type="button"
                      className={`preset-btn ${exchangeForm.phpAmount === 525 ? "active" : ""}`}
                      onClick={() => handlePresetAmountClick(525)}
                    >
                      ₱525 = 500 OMSIAPAWAS
                    </button>
                    <button
                      type="button"
                      className={`preset-btn ${exchangeForm.phpAmount === 1050 ? "active" : ""}`}
                      onClick={() => handlePresetAmountClick(1050)}
                    >
                      ₱1,050 = 1,000 OMSIAPAWAS
                    </button>
                    <button
                      type="button"
                      className={`preset-btn ${exchangeForm.phpAmount === 1260 ? "active" : ""}`}
                      onClick={() => handlePresetAmountClick(1260)}
                    >
                      ₱1,260 = 1,200 OMSIAPAWAS
                    </button>
                    <button
                      type="button"
                      className={`preset-btn ${exchangeForm.phpAmount === 1575 ? "active" : ""}`}
                      onClick={() => handlePresetAmountClick(1575)}
                    >
                      ₱1,575 = 1,500 OMSIAPAWAS
                    </button>
                    <button
                      type="button"
                      className={`preset-btn ${exchangeForm.phpAmount === 2100 ? "active" : ""}`}
                      onClick={() => handlePresetAmountClick(2100)}
                    >
                      ₱2,100 = 2,000 OMSIAPAWAS
                    </button>
                    <button
                      type="button"
                      className={`preset-btn ${exchangeForm.phpAmount === 3150 ? "active" : ""}`}
                      onClick={() => handlePresetAmountClick(3150)}
                    >
                      ₱3,150 = 3,000 OMSIAPAWAS
                    </button>
                    <button
                      type="button"
                      className={`preset-btn ${exchangeForm.phpAmount === 4200 ? "active" : ""}`}
                      onClick={() => handlePresetAmountClick(4200)}
                    >
                      ₱4,200 = 4,000 OMSIAPAWAS
                    </button>
                    <button
                      type="button"
                      className={`preset-btn ${exchangeForm.phpAmount === 5250 ? "active" : ""}`}
                      onClick={() => handlePresetAmountClick(5250)}
                    >
                      ₱5,250 = 5,000 OMSIAPAWAS
                    </button>
                  </div>
                </div>

                <div className="userdashboard-payment-instructions">
                  <h3>Payment Instructions</h3>
                  <p>
                    Please send <strong>₱{exchangeForm.phpAmount || 0}</strong> to the GCash accounts:
                    <strong> Of Macky'S Ink And Paper</strong> (OMSIAP)
                  </p>
                  <ul style={{ color: "black" }}>
                    <br />
                    <li className="userdashboard-omsiapgcashnumber">(1.) 0-995-677-7674</li>
                    <br />
                  </ul>
                </div>
                <p style={{ color: "black" }}>After sending the amount,</p>
                <p style={{ color: "black" }}>
                  1. Copy and paste the reference number in your transaction reciept and paste it on the gcash reference
                  number field
                </p>
                <p style={{ color: "black" }}>2. Take a screenshot of the Gcash transaction and upload it here</p>
                <p style={{ color: "black" }}>
                  3. The process exchange button will be available after selecting an amount on the currency exchange
                  form, click process exchange after following the procedure 1 and 2. The process exchange button will
                  be not be summited if procedure 1 and 2 is not followed.
                </p>
                <div className="userdashboard-form-row">
                  <div className="userdashboard-form-group">
                    <label>GCash Reference Number</label>
                    <input
                      type="text"
                      id="referenceNumber"
                      name="referenceNumber"
                      placeholder="e.g. 1234567890"
                      value={exchangeForm.referenceNumber}
                      onChange={handleExchangeChange}
                      required
                    />
                  </div>
                </div>

                <div className="userdashboard-form-row userdashboard-image-upload">
                  <div className="userdashboard-form-group">
                    <label htmlFor="transactionImage" className="userdashboard-file-input-label">
                      GCash Transaction Screenshot
                      <div className="userdashboard-image-preview">
                        {previewImage ? (
                          <img
                            src={previewImage || "/placeholder.svg"}
                            alt="Transaction Screenshot"
                            onClick={() => openImageModal(previewImage)}
                            style={{ cursor: "pointer" }}
                          />
                        ) : (
                          <div className="userdashboard-upload-placeholder">
                            <span>Upload GCash Screenshot</span>
                          </div>
                        )}
                      </div>
                    </label>
                    <input
                      type="file"
                      id="transactionImage"
                      name="transactionImage"
                      accept="image/*"
                      onChange={handleExchangeChange}
                      required
                      className="userdashboard-file-input"
                    />
                  </div>
                </div>

                <h3 className="userdashboard-currencyexchange-responsemessage"></h3>

                {currencyexchangeloadingindication ? (
                  <Spinner animation="border" variant="success" />
                ) : (
                  <button
                    type="button"
                    className={`userdashboard-exchange-btn ${!exchangeForm.phpAmount || exchangeForm.phpAmount < 210 || exchangeForm.phpAmount > 5250 ? "disabled-btn" : ""}`}
                    disabled={!exchangeForm.phpAmount || exchangeForm.phpAmount < 210 || exchangeForm.phpAmount > 5250}
                    onClick={(e) => handleExchangeSubmit(e)}
                  >
                    Process Exchange
                  </button>
                )}
              </form>
            </section>
          </div>
        )}

        {/* Withdrawal Tab */}
        {activeTab === "withdrawal" && (
          <div className="userdashboard-withdrawal-panel">
            <section className="userdashboard-withdrawal-section">
              <h2>Make a Withdrawal</h2>
              <form className="userdashboard-withdrawal-form" onSubmit={handleWithdrawalSubmit}>
                <div className="userdashboard-form-row">
                  <div className="userdashboard-form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      id="w-firstName"
                      name="firstName"
                      value={withdrawalForm.firstName}
                      onChange={handleWithdrawalChange}
                      required
                    />
                  </div>
                  <div className="userdashboard-form-group">
                    <label>Middle Name</label>
                    <input
                      type="text"
                      id="w-middleName"
                      name="middleName"
                      value={withdrawalForm.middleName}
                      onChange={handleWithdrawalChange}
                    />
                  </div>
                </div>

                <div className="userdashboard-form-row">
                  <div className="userdashboard-form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      id="w-lastName"
                      name="lastName"
                      value={withdrawalForm.lastName}
                      onChange={handleWithdrawalChange}
                      required
                    />
                  </div>
                  <div className="userdashboard-form-group">
                    <label>GCash Phone Number</label>
                    <input
                      type="tel"
                      id="w-phoneNumber"
                      name="phoneNumber"
                      value={withdrawalForm.phoneNumber}
                      onChange={handleWithdrawalChange}
                      required
                    />
                  </div>
                </div>

                <div className="userdashboard-form-row">
                  <div className="userdashboard-form-group">
                    <label>Withdrawal Amount</label>
                    <input
                      type="number"
                      id="w-amount"
                      name="amount"
                      min="1"
                      step="0.01"
                      value={withdrawalForm.amount}
                      onChange={handleWithdrawalChange}
                      required
                    />
                  </div>
                  <div className="userdashboard-form-group">
                    <label>Account Password</label>
                    <input
                      type="password"
                      id="w-password"
                      name="password"
                      value={withdrawalForm.password}
                      onChange={handleWithdrawalChange}
                      required
                    />
                  </div>
                </div>

                <h4 style={{ color: "black", textAlign: "center" }} id="widthdrawal-responsemessage">
                  Response message
                </h4>

                {widthdrawalloadingindication ? (
                  <Spinner animation="border" variant="success" style={{ marginLeft: "auto", marginRight: "auto" }} />
                ) : (
                  <button type="submit" className="userdashboard-withdrawal-btn">
                    Submit Withdrawal
                  </button>
                )}
              </form>
            </section>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <div className="userdashboard-transactions-panel">
            <section className="userdashboard-transactions-section">
              <h2>Recent Transactions</h2>

              {isLoading ? (
                <div className="userdashboard-loading-spinner">
                  <Spinner animation="border" variant="primary" />
                  <p>Loading transactions...</p>
                </div>
              ) : allTransactions.length === 0 ? (
                <div className="userdashboard-no-transactions">
                  <p>No transactions found.</p>
                </div>
              ) : (
                <div className="userdashboard-transactions-list">
                  {allTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className={`userdashboard-transaction-item userdashboard-${transaction.typeClass || transaction.type.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <div className="userdashboard-transaction-header">
                        <div className="userdashboard-transaction-info">
                          <span className="userdashboard-transaction-id">{transaction.id}</span>
                          <span className="userdashboard-transaction-date">{transaction.date}</span>
                        </div>
                        <div className="userdashboard-transaction-status">
                          <span
                            className={`userdashboard-status-badge userdashboard-${transaction.status.toLowerCase().replace(/\s+/g, "-")}`}
                          >
                            {transaction.status}
                          </span>
                        </div>
                      </div>

                      <div className="userdashboard-transaction-details">
                        <div className="userdashboard-transaction-type">
                          {transaction.icon && (
                            <span className="userdashboard-transaction-icon">{transaction.icon}</span>
                          )}
                          <span
                            className={`userdashboard-type-badge userdashboard-${transaction.typeClass || transaction.type.toLowerCase().replace(/\s+/g, "-")}`}
                          >
                            {transaction.type}
                          </span>
                        </div>
                        <div className="userdashboard-transaction-amount">
                          <span
                            className={
                              transaction.amount >= 0
                                ? "userdashboard-amount-positive"
                                : "userdashboard-amount-negative"
                            }
                          >
                            {formatCurrency(transaction.amount, transaction.type)}
                          </span>
                        </div>
                      </div>

                      <div className="userdashboard-view-details">
                        <button
                          className="userdashboard-view-details-btn"
                          onClick={() => openTransactionModal(transaction)}
                        >
                          {transaction.type === "Merchandise" && transaction.products && transaction.products.length > 0
                            ? `View ${transaction.products.length} items`
                            : "View transaction details"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

       {/* Settings Tab */}
       {activeTab === "settings" && (
        <div className="userdashboard-settings-panel">
          <section className="userdashboard-user-settings">
            <h2>Account Settings</h2>
            <form className="userdashboard-profile-form" onSubmit={handleProfileSubmit}>
              <div className="userdashboard-settings-group userdashboard-personal-info">
                <h3>Personal Information</h3>
                <div className="userdashboard-form-row">
                  <div className="userdashboard-form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      id="profile-firstName"
                      name="firstName"
                      value={profileForm.firstName}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                  <div className="userdashboard-form-group">
                    <label>Middle Name</label>
                    <input
                      type="text"
                      id="profile-middleName"
                      name="middleName"
                      value={profileForm.middleName}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>

                <div className="userdashboard-form-row">
                  <div className="userdashboard-form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      id="profile-lastName"
                      name="lastName"
                      value={profileForm.lastName}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                  <div className="userdashboard-form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      id="profile-phoneNumber"
                      name="phoneNumber"
                      value={profileForm.phoneNumber}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="userdashboard-settings-group userdashboard-document-uploads">
                <h3>Identity Verification Documents</h3>

                <div className="userdashboard-document-section">
                  <h4>Birth Certificate</h4>
                  <div className="userdashboard-form-row userdashboard-document-row">
                    <div className="userdashboard-form-group">
                      <label className="userdashboard-file-input-label">
                        Front of Birth Certificate
                        <div className="userdashboard-image-preview">
                          {profileForm.birthCertificateFront ? (
                            <div className="userdashboard-document-preview">
                              <img
                                src={typeof profileForm.birthCertificateFront === 'string' 
                                  ? profileForm.birthCertificateFront 
                                  : URL.createObjectURL(profileForm.birthCertificateFront)}
                                alt="Birth Certificate Front"
                              />
                              <button 
                                type="button" 
                                className="userdashboard-remove-document" 
                                onClick={() => handleRemoveDocument('birthCertificateFront')}
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <div className="userdashboard-upload-placeholder">
                              <span>Upload Front Image</span>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          id="birthCertificateFront"
                          name="birthCertificateFront"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="userdashboard-file-input"
                        />
                      </label>
                    </div>

                    <div className="userdashboard-form-group">
                      <label className="userdashboard-file-input-label">
                        Back of Birth Certificate
                        <div className="userdashboard-image-preview">
                          {profileForm.birthCertificateBack ? (
                            <div className="userdashboard-document-preview">
                              <img
                                src={typeof profileForm.birthCertificateBack === 'string' 
                                  ? profileForm.birthCertificateBack 
                                  : URL.createObjectURL(profileForm.birthCertificateBack)}
                                alt="Birth Certificate Back"
                              />
                              <button 
                                type="button" 
                                className="userdashboard-remove-document" 
                                onClick={() => handleRemoveDocument('birthCertificateBack')}
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <div className="userdashboard-upload-placeholder">
                              <span>Upload Back Image</span>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          id="birthCertificateBack"
                          name="birthCertificateBack"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="userdashboard-file-input"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="userdashboard-document-section">
                  <h4>Government ID</h4>
                  <div className="userdashboard-form-row userdashboard-document-row">
                    <div className="userdashboard-form-group">
                      <label className="userdashboard-file-input-label">
                        Front of Government ID
                        <div className="userdashboard-image-preview">
                          {profileForm.governmentIdFront ? (
                            <div className="userdashboard-document-preview">
                              <img
                                src={typeof profileForm.governmentIdFront === 'string' 
                                  ? profileForm.governmentIdFront 
                                  : URL.createObjectURL(profileForm.governmentIdFront)}
                                alt="Government ID Front"
                              />
                              <button 
                                type="button" 
                                className="userdashboard-remove-document" 
                                onClick={() => handleRemoveDocument('governmentIdFront')}
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <div className="userdashboard-upload-placeholder">
                              <span>Upload Front Image</span>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          id="governmentIdFront"
                          name="governmentIdFront"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="userdashboard-file-input"
                        />
                      </label>
                    </div>

                    <div className="userdashboard-form-group">
                      <label className="userdashboard-file-input-label">
                        Back of Government ID
                        <div className="userdashboard-image-preview">
                          {profileForm.governmentIdBack ? (
                            <div className="userdashboard-document-preview">
                              <img
                                src={typeof profileForm.governmentIdBack === 'string' 
                                  ? profileForm.governmentIdBack 
                                  : URL.createObjectURL(profileForm.governmentIdBack)}
                                alt="Government ID Back"
                              />
                              <button 
                                type="button" 
                                className="userdashboard-remove-document" 
                                onClick={() => handleRemoveDocument('governmentIdBack')}
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <div className="userdashboard-upload-placeholder">
                              <span>Upload Back Image</span>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          id="governmentIdBack"
                          name="governmentIdBack"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="userdashboard-file-input"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <h1 id="userdashboard-profilesubmit-responsemessage">Response message</h1>

              <div className="userdashboard-settings-actions">
                {profilesubmitloadingindication ? (
                  <Spinner animation="border" variant="primary" />
                ) : (
                  <button type="submit" className="userdashboard-save-settings-btn">
                    Save changes
                  </button>
                )}
              </div>
            </form>
          </section>
        </div>
       )}

      </div>

        {/* Transaction Details Modal */}
        {isModalOpen && selectedTransaction && (
            <>
              {/* Main Transaction Modal */}
              <div className="transaction-modal__overlay" onClick={closeTransactionModal}>
                <div className="transaction-modal__content" onClick={(e) => e.stopPropagation()}>
                  <div className="transaction-modal__header">
                    <div className="transaction-modal__header-content">
                      <h3 className="transaction-modal__title">Transaction Details</h3>
                      <div
                        className={`transaction-modal__status-badge transaction-modal__status-${selectedTransaction.status.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        {selectedTransaction.status}
                      </div>
                    </div>
                    <button className="transaction-modal__close-btn" onClick={closeTransactionModal}>
                      ×
                    </button>
                  </div>

                  <div className="transaction-modal__body">
                    <div className="transaction-modal__summary">
                      <div className="transaction-modal__summary-grid">
                        <div className="transaction-modal__summary-item">
                          <span className="transaction-modal__summary-label">Transaction ID</span>
                          <span className="transaction-modal__summary-value">{selectedTransaction.id}</span>
                        </div>
                        <div className="transaction-modal__summary-item">
                          <span className="transaction-modal__summary-label">Date</span>
                          <span className="transaction-modal__summary-value">{selectedTransaction.date}</span>
                        </div>
                        <div className="transaction-modal__summary-item">
                          <span className="transaction-modal__summary-label">Type</span>
                          <span className="transaction-modal__summary-value">{selectedTransaction.type}</span>
                        </div>
                        <div className="transaction-modal__summary-item">
                          <span className="transaction-modal__summary-label">Amount</span>
                          <span
                            className={`transaction-modal__summary-value ${
                              selectedTransaction.amount >= 0
                                ? "transaction-modal__amount-positive"
                                : "transaction-modal__amount-negative"
                            }`}
                          >
                            {formatCurrency(selectedTransaction.amount, selectedTransaction.type)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="transaction-modal__details">{renderTransactionDetails(selectedTransaction)}</div>
                  </div>

                  <div className="transaction-modal__footer">
                    <button className="transaction-modal__action-btn" onClick={closeTransactionModal}>
                      Close
                    </button>
                  </div>
                </div>
              </div>

               {/* Image Modal */}
              {imageModalOpen && selectedImage && (
                <div className="transaction-modal__image-overlay" onClick={closeImageModal}>
                  <div className="transaction-modal__image-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="transaction-modal__image-header">
                      <h4 className="transaction-modal__image-title">Image Preview</h4>
                      <button className="transaction-modal__image-close" onClick={closeImageModal}>
                        ×
                      </button>
                    </div>
                    <div className="transaction-modal__image-container">
                      <img
                        src={selectedImage || "/placeholder.svg"}
                        alt="Full size preview"
                        className="transaction-modal__full-image"
                      />
                    </div>
                    <div className="transaction-modal__image-footer">
                      <button className="transaction-modal__action-btn" onClick={closeImageModal}>
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}

           </>
        )}

   
       {/* Full-size Image Modal */}
        {imageModalOpen && modalImageSrc && (
          <div className="userdashboard-modal-overlay userdashboard-full-size-modal" onClick={closeImageModal}>
            <div
              className="userdashboard-modal-content userdashboard-image-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="userdashboard-close-modal-btn" onClick={closeImageModal}>
                ×
              </button>
              <img
                src={modalImageSrc || "/placeholder.svg"}
                alt="Full size image"
                className="userdashboard-full-size-image"
              />
            </div>
          </div>
        )}


    </div>
  )
}

export default UserAccount
