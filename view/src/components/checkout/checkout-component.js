"use client"

import { useState, useEffect, useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import "../../styles/checkout/checkout.scss"
import axiosCreatedInstance from "../lib/axiosutil.js"
import {
  FaUser,
  FaPhone,
  FaHome,
  FaCity,
  FaGlobe,
  FaMapMarkerAlt,
  FaBox,
  FaShoppingCart,
  FaMoneyBillWave,
  FaTruck,
  FaLock,
  FaLandmark,
  FaMapPin,
  FaMapMarkedAlt,
  FaEnvelope,
  FaTag,
  FaWeight,
  FaInfoCircle,
  FaCalculator,
  FaReceipt,
} from "react-icons/fa"

// Enhanced decimal precision utility with no rounding for display
const preciseCalculator = {
  // Convert number to precise decimal representation with specified precision
  toPreciseDecimal: (num, precision = 12) => {
    if (typeof num !== "number" || isNaN(num)) return 0
    // Use parseFloat to handle string inputs, then multiply/divide to maintain precision
    const factor = Math.pow(10, precision)
    return Math.round(Number.parseFloat(num) * factor) / factor
  },

  // Add two numbers with maximum precision
  add: (...numbers) => {
    return numbers.reduce((sum, num) => {
      const a = Number.parseFloat(sum) || 0
      const b = Number.parseFloat(num) || 0

      // Convert to strings to find decimal places
      const aStr = a.toString()
      const bStr = b.toString()

      const aDecimals = aStr.includes(".") ? aStr.split(".")[1].length : 0
      const bDecimals = bStr.includes(".") ? bStr.split(".")[1].length : 0
      const maxDecimals = Math.max(aDecimals, bDecimals, 2) // Minimum 2 for currency

      const multiplier = Math.pow(10, maxDecimals)
      return (Math.round(a * multiplier) + Math.round(b * multiplier)) / multiplier
    }, 0)
  },

  // Subtract two numbers with precision
  subtract: (a, b) => {
    const numA = Number.parseFloat(a) || 0
    const numB = Number.parseFloat(b) || 0

    const aStr = numA.toString()
    const bStr = numB.toString()

    const aDecimals = aStr.includes(".") ? aStr.split(".")[1].length : 0
    const bDecimals = bStr.includes(".") ? bStr.split(".")[1].length : 0
    const maxDecimals = Math.max(aDecimals, bDecimals, 2)

    const multiplier = Math.pow(10, maxDecimals)
    return (Math.round(numA * multiplier) - Math.round(numB * multiplier)) / multiplier
  },

  // Multiply two numbers with precision
  multiply: (a, b) => {
    const numA = Number.parseFloat(a) || 0
    const numB = Number.parseFloat(b) || 0

    if (numA === 0 || numB === 0) return 0

    const aStr = numA.toString()
    const bStr = numB.toString()

    const aDecimals = aStr.includes(".") ? aStr.split(".")[1].length : 0
    const bDecimals = bStr.includes(".") ? bStr.split(".")[1].length : 0
    const totalDecimals = aDecimals + bDecimals

    // Remove decimal points and multiply as integers
    const aInt = Number.parseInt(aStr.replace(".", ""))
    const bInt = Number.parseInt(bStr.replace(".", ""))

    return (aInt * bInt) / Math.pow(10, totalDecimals)
  },

  // Divide two numbers with precision
  divide: (a, b) => {
    const numA = Number.parseFloat(a) || 0
    const numB = Number.parseFloat(b) || 1

    if (numB === 0) return 0

    return preciseCalculator.toPreciseDecimal(numA / numB, 6)
  },

  // Format for currency display without rounding
  formatCurrency: (amount, showSymbol = true) => {
    const num = Number.parseFloat(amount) || 0
    const formatted = num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6, // Show up to 6 decimal places for precision
    })
    return showSymbol ? `₱${formatted}` : formatted
  },

  // Get exact decimal representation
  getExactValue: (amount) => {
    return Number.parseFloat(amount) || 0
  },
}

const CheckoutPage = (props) => {
  const location = useLocation()
  const navigate = useNavigate()

  const [authError, setAuthError] = useState("")
  const [isCheckingAuth, setIsCheckingAuth] = useState(false)

  // Use useMemo to stabilize orderData reference
  const orderData = useMemo(() => {
    const data = location.state?.orderData || { cartItems: [], cartStats: {} }
    console.log("Received order data from place order:", data)
    return data
  }, [location.state])

  // Form data for personal and shipping information
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phoneNumber: "",
    street: "",
    trademark: "",
    baranggay: "",
    city: "",
    province: "",
    zipCode: "",
    country: "",
  })

  // Enhanced order summary state with precise calculations
  const [orderSummary, setOrderSummary] = useState({
    merchandiseTotal: 0,
    shippingTotal: 0,
    paymentProcessingFee: 0,
    totalTransactionGiveaway: 0,
    totalOmsiaProfit: 0,
    totalCapital: 0,
    totalItems: 0,
    totalProducts: 0,
    totalMainProducts: 0,
    totalSpecifications: 0,
    totalWeightGrams: 0,
    totalWeightKilos: 0,
    subtotal: 0, // Merchandise + Shipping
    taxAmount: 0,
    discountAmount: 0,
    finalTotal: 0,
    // Precise calculation breakdown
    calculationBreakdown: {
      itemCalculations: [],
      feeCalculations: [],
      totalCalculations: [],
    },
  })

  // Enhanced payment details
  const [paymentDetails, setPaymentDetails] = useState({
    omsiapawastoBalance: props.user.credits.omsiapawas.amount, // Example balance with decimals
    selectedPaymentMethod: "omsiapawasto",
    balanceAfterPayment: 0,
    transactionFee: 0,
  })

  // Animation states
  const [showSummary, setShowSummary] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setShowSummary(true)
    }, 300)
  }, [])

  // Helper function to get image URL with fallback
  const getImageUrl = (imageArray, fallbackUrl = "/placeholder.svg?height=60&width=60") => {
    if (!imageArray || !Array.isArray(imageArray) || imageArray.length === 0) {
      return fallbackUrl
    }

    const firstImage = imageArray[0]
    if (typeof firstImage === "string") {
      return firstImage
    } else if (firstImage && firstImage.url) {
      return firstImage.url
    }

    return fallbackUrl
  }

  // Add this function after the getImageUrl helper function
  const validateUserAuthentication = () => {
    setIsCheckingAuth(true)
    setAuthError("")

    // Check if user is logged in
    if (!props.user || !props.user._id) {
      setAuthError("You must be logged in to place an order. Please log in first.")
      setIsCheckingAuth(false)
      return false
    }

    // Check if user has device login status
    if (props.user.registrationstatusesandlogs?.deviceloginstatus !== 'logged in') {
      setAuthError("Your session has expired. Please log in again to continue.")
      setIsCheckingAuth(false)
      return false
    }

    // Check if user has OMSIAPAWASTO credits
    if (!props.user.credits?.omsiapawas) {
      setAuthError("You don't have OMSIAPAWASTO credits set up. Please ensure you have credits cashed in before proceeding to order.")
      setIsCheckingAuth(false)
      return false
    }

    // Check if user has sufficient balance
    const userBalance = props.user.credits.omsiapawas.amount || 0
    if (userBalance < orderSummary.finalTotal) {
      setAuthError(`Insufficient OMSIAPAWASTO balance. You need ${preciseCalculator.formatCurrency(orderSummary.finalTotal)} but only have ${preciseCalculator.formatCurrency(userBalance)}. Please cash in more credits before proceeding.`)
      setIsCheckingAuth(false)
      return false
    }

    setIsCheckingAuth(false)
    return true
  }

  // Convert new cart structure to flat array for database compatibility
  const convertCartToFlatStructure = (cartItems) => {
    const flatItems = []

    cartItems.forEach((mainProduct) => {
      mainProduct.specifications.forEach((spec) => {
        const flatItem = {
          ...spec.data,
          quantity: spec.quantity,
          mainProductId: mainProduct.mainProductId,
          mainProductName: mainProduct.productName,
          specificationId: spec.id,
          specificationName: spec.name,
          details: {
            ...spec.data.details,
            price: {
              ...spec.data.details.price,
              amount: spec.price,
            },
          },
        }
        flatItems.push(flatItem)
      })
    })

    console.log("Converted cart to flat structure:", flatItems)
    return flatItems
  }

  // Enhanced calculation with precise arithmetic
  const calculatedSummary = useMemo(() => {
    if (orderData && orderData.cartItems && orderData.cartItems.length > 0) {
      // Initialize calculation breakdown
      const calculationBreakdown = {
        itemCalculations: [],
        feeCalculations: [],
        totalCalculations: [],
      }

      // Get base values with precise handling
      const baseMerchandiseTotal = preciseCalculator.toPreciseDecimal(
        orderData.paymentBreakdown?.subtotal || orderData.cartStats?.subtotal || 0,
      )
      const baseShippingTotal = preciseCalculator.toPreciseDecimal(
        orderData.paymentBreakdown?.shipping || orderData.cartStats?.shippingCost || 0,
      )
      const basePaymentProcessingFee = preciseCalculator.toPreciseDecimal(
        orderData.paymentBreakdown?.paymentProcessingFee || orderData.cartStats?.paymentProcessingFee || 0,
      )

      const totalWeightGrams = preciseCalculator.toPreciseDecimal(orderData.cartStats?.totalWeightGrams || 0)
      const totalWeightKilos = preciseCalculator.toPreciseDecimal(orderData.cartStats?.totalWeightKilos || 0)
      const totalItems = Number.parseInt(orderData.cartStats?.totalItems || 0)

      // Initialize precise totals
      let preciseTotalTransactionGiveaway = 0
      let preciseTotalOmsiaProfit = 0
      let preciseTotalCapital = 0
      let totalMainProducts = 0
      let totalSpecifications = 0

      // Process cart items with precise calculations
      orderData.cartItems.forEach((mainProduct) => {
        totalMainProducts++

        mainProduct.specifications.forEach((spec) => {
          totalSpecifications++
          const quantity = Number.parseInt(spec.quantity) || 1
          const itemPrice = preciseCalculator.toPreciseDecimal(spec.price || 0)

          // Extract precise values from specification data
          const itemTransactionGiveaway = preciseCalculator.toPreciseDecimal(
            spec.data?.details?.price?.transactiongiveaway || 0,
          )
          const itemProfit = preciseCalculator.toPreciseDecimal(spec.data?.details?.price?.profit || 0)
          const itemCapital = preciseCalculator.toPreciseDecimal(spec.data?.details?.price?.capital || 0)

          // Calculate totals with precise multiplication
          const totalItemTransactionGiveaway = preciseCalculator.multiply(itemTransactionGiveaway, quantity)
          const totalItemOmsiaProfit = preciseCalculator.multiply(itemProfit, quantity)
          const totalItemCapital = preciseCalculator.multiply(itemCapital, quantity)
          const totalItemPrice = preciseCalculator.multiply(itemPrice, quantity)

          // Add to running totals with precise addition
          preciseTotalTransactionGiveaway = preciseCalculator.add(
            preciseTotalTransactionGiveaway,
            totalItemTransactionGiveaway,
          )
          preciseTotalOmsiaProfit = preciseCalculator.add(preciseTotalOmsiaProfit, totalItemOmsiaProfit)
          preciseTotalCapital = preciseCalculator.add(preciseTotalCapital, totalItemCapital)

          // Store item calculation for breakdown
          calculationBreakdown.itemCalculations.push({
            name: spec.name,
            unitPrice: itemPrice,
            quantity: quantity,
            totalPrice: totalItemPrice,
            transactionGiveaway: totalItemTransactionGiveaway,
            profit: totalItemOmsiaProfit,
            capital: totalItemCapital,
          })
        })
      })

      // Calculate subtotal (merchandise + shipping)
      const subtotal = preciseCalculator.add(baseMerchandiseTotal, baseShippingTotal)

      // Calculate final total with all fees
      const finalTotal = preciseCalculator.add(subtotal, basePaymentProcessingFee)

      // Store fee calculations
      calculationBreakdown.feeCalculations = [
        { name: "Merchandise Total", amount: baseMerchandiseTotal },
        { name: "Shipping Total", amount: baseShippingTotal },
        { name: "Payment Processing Fee", amount: basePaymentProcessingFee },
      ]

      // Store total calculations
      calculationBreakdown.totalCalculations = [
        { name: "Subtotal (Merchandise + Shipping)", amount: subtotal },
        { name: "Payment Processing Fee", amount: basePaymentProcessingFee },
        { name: "Final Total", amount: finalTotal },
      ]

      return {
        merchandiseTotal: baseMerchandiseTotal,
        shippingTotal: baseShippingTotal,
        paymentProcessingFee: basePaymentProcessingFee,
        totalTransactionGiveaway: preciseTotalTransactionGiveaway,
        totalOmsiaProfit: preciseTotalOmsiaProfit,
        totalCapital: preciseTotalCapital,
        totalItems,
        totalProducts: totalSpecifications,
        totalMainProducts,
        totalSpecifications,
        totalWeightGrams,
        totalWeightKilos,
        subtotal,
        taxAmount: 0, // Can be calculated if needed
        discountAmount: 0, // Can be calculated if needed
        finalTotal,
        total: finalTotal, // Keep for backward compatibility
        calculationBreakdown,
      }
    }

    // Return default values if no cart items
    return {
      merchandiseTotal: 0,
      shippingTotal: 0,
      paymentProcessingFee: 0,
      totalTransactionGiveaway: 0,
      totalOmsiaProfit: 0,
      totalCapital: 0,
      totalItems: 0,
      totalProducts: 0,
      totalMainProducts: 0,
      totalSpecifications: 0,
      totalWeightGrams: 0,
      totalWeightKilos: 0,
      subtotal: 0,
      taxAmount: 0,
      discountAmount: 0,
      finalTotal: 0,
      total: 0,
      calculationBreakdown: {
        itemCalculations: [],
        feeCalculations: [],
        totalCalculations: [],
      },
    }
  }, [orderData])

  // Update order summary and payment details when calculations change
  useEffect(() => {
    setOrderSummary(calculatedSummary)

    // Calculate balance after payment
    const balanceAfterPayment = preciseCalculator.subtract(
      paymentDetails.omsiapawastoBalance,
      calculatedSummary.finalTotal,
    )

    setPaymentDetails((prev) => ({
      ...prev,
      balanceAfterPayment,
      transactionFee: calculatedSummary.paymentProcessingFee,
    }))
  }, [calculatedSummary, paymentDetails.omsiapawastoBalance])

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  // Handle order submission
  const handleSubmit = async (e) => {
    e.preventDefault()

     // First, validate authentication
   if (!validateUserAuthentication()) {
    return // Stop execution if authentication fails
   }

    setFormSubmitted(true)

    if (paymentDetails.omsiapawastoBalance < orderSummary.finalTotal) {
      alert(
        `Insufficient OMSIAPAWASTO balance. You need ${preciseCalculator.formatCurrency(orderSummary.finalTotal)} but only have ${preciseCalculator.formatCurrency(paymentDetails.omsiapawastoBalance)}.`,
      )
      setFormSubmitted(false)
      return
    }

    const flatCartItems = convertCartToFlatStructure(orderData.cartItems)

    const completeOrderData = {
      personal: formData,
      orderSummary: {
        ...orderSummary,
        shippingMethod: "weight-based",
        paymentMethod: orderData.paymentMethod || "omsiapawasto",
      },
      paymentMethod: paymentDetails.selectedPaymentMethod,
      cartItems: flatCartItems,
      originalCartStructure: orderData.cartItems,
      orderDate: new Date().toISOString(),
      preciseCalculations: orderSummary.calculationBreakdown,
    }

    const order = {
      registrantid: props.user._id,
      registrantomsiapcitizenship: props.user.registrationstatusesandlogs.type,
      registrantbirthcertificatereferencenumber: props.user.personaldata.birthcertificate.birthcertificatereferencenumber,
      products: flatCartItems,
      personalInfo: formData,
      paymentInfo: {
        method: paymentDetails.selectedPaymentMethod,
        amount: orderSummary.finalTotal,
        exactAmount: preciseCalculator.getExactValue(orderSummary.finalTotal),
        balanceBefore: paymentDetails.omsiapawastoBalance,
        balanceAfter: paymentDetails.balanceAfterPayment,
      },
      orderSummary,
    }

    try {
      await axiosCreatedInstance.post("/products/order", {
        $order: order,
      })

      console.log("Order submitted:", order)
      alert(`Order successfully placed! Total: ${preciseCalculator.formatCurrency(orderSummary.finalTotal)}`)
       // Navigate to home page after successful order
       navigate("/omsiapmarket")
    } catch (error) {
      console.error("Error placing order:", error)
      alert("There was an error processing your order. Please try again.")
    } finally {
      setFormSubmitted(false)
    }
  }

  // Memoize cart display items for the UI
  const cartDisplayItems = useMemo(() => {
    const displayItems = []

    orderData.cartItems.forEach((mainProduct) => {
      displayItems.push({
        type: "mainProduct",
        id: mainProduct.mainProductId,
        name: mainProduct.productName,
        category: mainProduct.mainProduct?.details?.category,
        image: getImageUrl(mainProduct.mainProductImages),
        specCount: mainProduct.specifications.length,
      })

      mainProduct.specifications.forEach((spec) => {
        const itemPrice = preciseCalculator.toPreciseDecimal(spec.price || 0)
        const quantity = Number.parseInt(spec.quantity) || 1
        const totalPrice = preciseCalculator.multiply(itemPrice, quantity)

        displayItems.push({
          type: "specification",
          id: spec.id,
          name: spec.name,
          price: itemPrice,
          quantity: quantity,
          totalPrice: totalPrice,
          weight: preciseCalculator.toPreciseDecimal(spec.data?.details?.weightingrams || 0),
          image: getImageUrl(spec.images, getImageUrl(mainProduct.mainProductImages)),
          mainProductId: mainProduct.mainProductId,
        })
      })
    })

    return displayItems
  }, [orderData.cartItems])

  // If there's no order data, show a message
  if (!orderData || !orderData.cartItems || orderData.cartItems.length === 0) {
    return (
      <div className="checkout-container">
        <h1>Check out</h1>
        <div className="checkout-empty-cart">
          <FaShoppingCart className="checkout-empty-icon" />
          <p>No order data available. Please go back to your cart.</p>
          <button className="checkout-back-button" onClick={() => navigate("/market")}>
            Return to Market
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-container">
      <h1 className="checkout-title" style={{ color: "black" }}>
        <FaLock className="checkout-secure-icon" /> Secure Checkout
      </h1>
       <h5  style={{ color: "black", textAlign: "center" }}>
        <FaLock className="checkout-secure-icon" /> Do not refresh page. If current balance goes back to zero, go back to market then add to cart and place order again
      </h5>

      <br/>

      <div className="checkout-grid-layout">
        {/* Left Column: Shipping & Personal Information */}
        <div className="checkout-shipping-column">
          <div className="checkout-info-card checkout-fade-in">
            <h2 className="checkout-card-header">
              <FaUser className="checkout-header-icon" />
              Shipping & Personal Information
            </h2>
            <form onSubmit={handleSubmit} className="checkout-form">

              {/* Add this authentication error display */}
              {authError && (
                <div className="checkout-auth-error" style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '6px',
                  padding: '12px',
                  marginBottom: '20px',
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <FaLock className="checkout-error-icon" />
                  <span>{authError}</span>
                </div>
              )}

              <div className="checkout-form-section">
                <h3 className="checkout-section-heading">Personal Details</h3>
                <div className="checkout-form-grid">
                  <div className="checkout-form-group">
                    <label>
                      <FaUser className="checkout-input-icon" /> First Name*
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="checkout-input"
                    />
                  </div>
                  <div className="checkout-form-group">
                    <label>
                      <FaUser className="checkout-input-icon" /> Middle Name
                    </label>
                    <input
                      type="text"
                      id="middleName"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleChange}
                      className="checkout-input"
                    />
                  </div>
                  <div className="checkout-form-group">
                    <label>
                      <FaUser className="checkout-input-icon" /> Last Name*
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="checkout-input"
                    />
                  </div>
                  <div className="checkout-form-group checkout-phone-field">
                    <label>
                      <FaPhone className="checkout-input-icon" /> Phone Number*
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                      className="checkout-input"
                    />
                  </div>
                </div>
              </div>

              <div className="checkout-form-section">
                <h3 className="checkout-section-heading">
                  <FaHome className="checkout-section-icon" /> Shipping Address
                </h3>
                <div className="checkout-form-grid">
                  <div className="checkout-form-group checkout-full-width">
                    <label>
                      <FaMapMarkerAlt className="checkout-input-icon" /> Street*
                    </label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      required
                      className="checkout-input"
                      placeholder="House/Unit No., Street Name"
                    />
                  </div>

                  <div className="checkout-form-group checkout-full-width">
                    <label htmlFor="trademark">
                      <FaLandmark className="checkout-input-icon" /> Landmark/Trademark
                    </label>
                    <input
                      type="text"
                      id="trademark"
                      name="trademark"
                      value={formData.trademark}
                      onChange={handleChange}
                      className="checkout-input"
                      placeholder="Near landmark or building (optional)"
                    />
                  </div>

                  <div className="checkout-form-group">
                    <label>
                      <FaMapPin className="checkout-input-icon" /> Baranggay*
                    </label>
                    <input
                      type="text"
                      id="baranggay"
                      name="baranggay"
                      value={formData.baranggay}
                      onChange={handleChange}
                      required
                      className="checkout-input"
                    />
                  </div>

                  <div className="checkout-form-group">
                    <label>
                      <FaCity className="checkout-input-icon" /> City/Municipality*
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="checkout-input"
                    />
                  </div>

                  <div className="checkout-form-group">
                    <label>
                      <FaMapMarkedAlt className="checkout-input-icon" /> Province*
                    </label>
                    <input
                      type="text"
                      id="province"
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
                      required
                      className="checkout-input"
                    />
                  </div>

                  <div className="checkout-form-group">
                    <label>
                      <FaEnvelope className="checkout-input-icon" /> Postal Zipcode*
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                      className="checkout-input"
                    />
                  </div>

                  <div className="checkout-form-group">
                    <label>
                      <FaGlobe className="checkout-input-icon" /> Country*
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      className="checkout-input"
                      placeholder="e.g., Philippines"
                    />
                  </div>
                </div>
              </div>

              <button
                  type="submit"
                  className={`checkout-button ${formSubmitted || isCheckingAuth ? "checkout-loading" : ""} ${authError ? "checkout-disabled" : ""}`}
                  disabled={formSubmitted || isCheckingAuth || authError}
                  style={authError ? { backgroundColor: '#9ca3af', cursor: 'not-allowed' } : {}}
                >
                  {isCheckingAuth ? (
                    <>Checking Authentication...</>
                  ) : formSubmitted ? (
                    <>Processing Order...</>
                  ) : authError ? (
                    <>Please Log In First</>
                  ) : (
                    <>Confirm Order & Pay {preciseCalculator.formatCurrency(orderSummary.finalTotal)}</>
                  )}
                </button>

            </form>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className={`checkout-summary-column ${showSummary ? "checkout-slide-in" : ""}`}>
          <div className="checkout-info-card">
            <h2 className="checkout-card-header">
              <FaShoppingCart className="checkout-header-icon" /> Order Summary
            </h2>

            <div className="checkout-summary-section">
              <h3 className="checkout-section-heading">
                <FaBox className="checkout-section-icon" />
                Products ({orderSummary.totalMainProducts} main products, {orderSummary.totalSpecifications}{" "}
                specifications)
              </h3>
              <div className="checkout-cart-items">
                {cartDisplayItems.map((item, index) => {
                  if (item.type === "mainProduct") {
                    return (
                      <div key={`main-${item.id}`} className="checkout-main-product-header">
                        <div className="checkout-main-product-info">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="checkout-main-product-image"
                            onError={(e) => {
                              e.target.src = "/placeholder.svg?height=40&width=40"
                            }}
                          />
                          <div className="checkout-main-product-details">
                            <span className="checkout-main-product-name">
                              <FaBox className="checkout-product-icon" />
                              {item.name}
                            </span>
                            {item.category && (
                              <span className="checkout-main-product-category">
                                <FaTag className="checkout-category-icon" />
                                {item.category}
                              </span>
                            )}
                            <span className="checkout-spec-count">
                              {item.specCount} specification{item.specCount > 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  } else {
                    return (
                      <div key={`spec-${item.id}`} className="checkout-cart-item checkout-specification-item">
                        <div className="checkout-item-image-container">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="checkout-item-image"
                            onError={(e) => {
                              e.target.src = "/placeholder.svg?height=50&width=50"
                            }}
                          />
                        </div>
                        <div className="checkout-item-info">
                          <span className="checkout-item-name">{item.name}</span>
                          <div className="checkout-item-meta">
                            <span className="checkout-item-quantity">×{item.quantity}</span>
                            <span className="checkout-item-weight">
                              <FaWeight className="checkout-weight-icon" />
                              {preciseCalculator.formatCurrency(item.weight, false)}g each
                            </span>
                          </div>
                        </div>
                        <span className="checkout-item-price">{preciseCalculator.formatCurrency(item.totalPrice)}</span>
                      </div>
                    )
                  }
                })}
              </div>
            </div>

            <div className="checkout-summary-section">
              <h3 className="checkout-section-heading">
                <FaTruck className="checkout-section-icon" /> Order Details
              </h3>
              <div className="checkout-summary-grid">
                <div className="checkout-summary-item">
                  <span className="checkout-label">Main Products:</span>
                  <span className="checkout-value">{orderSummary.totalMainProducts}</span>
                </div>
                <div className="checkout-summary-item">
                  <span className="checkout-label">Total Specifications:</span>
                  <span className="checkout-value">{orderSummary.totalSpecifications}</span>
                </div>
                <div className="checkout-summary-item">
                  <span className="checkout-label">Total Items:</span>
                  <span className="checkout-value">{orderSummary.totalItems} units</span>
                </div>
                <div className="checkout-summary-item">
                  <span className="checkout-label">Total Weight:</span>
                  <span className="checkout-value">
                    {preciseCalculator.formatCurrency(orderSummary.totalWeightGrams, false)}g (
                    {preciseCalculator.formatCurrency(orderSummary.totalWeightKilos, false)}kg)
                  </span>
                </div>
              </div>
            </div>

            {/* Enhanced Calculation Breakdown */}
            <div className="checkout-summary-section">
              <h3 className="checkout-section-heading">
                <FaCalculator className="checkout-section-icon" /> Precise Calculation Breakdown
              </h3>
              <div className="checkout-summary-grid">
                <div className="checkout-summary-item">
                  <span className="checkout-label">Merchandise Total:</span>
                  <span className="checkout-value">
                    {preciseCalculator.formatCurrency(orderSummary.merchandiseTotal)}
                  </span>
                </div>
                <div className="checkout-summary-item">
                  <span className="checkout-label">Shipping Total:</span>
                  <span className="checkout-value">{preciseCalculator.formatCurrency(orderSummary.shippingTotal)}</span>
                </div>
                <div className="checkout-summary-item" style={{ borderTop: "1px solid #e2e8f0", paddingTop: "8px" }}>
                  <span className="checkout-label" style={{ fontWeight: "600" }}>
                    Subtotal:
                  </span>
                  <span className="checkout-value" style={{ fontWeight: "600" }}>
                    {preciseCalculator.formatCurrency(orderSummary.subtotal)}
                  </span>
                </div>
                <div className="checkout-summary-item" style={{ color: "#3b82f6" }}>
                  <span className="checkout-label">Payment Processing Fee:</span>
                  <span className="checkout-value">
                    {preciseCalculator.formatCurrency(orderSummary.paymentProcessingFee)}
                  </span>
                </div>
              </div>
            </div>

            <div className="checkout-summary-section">
              <h3 className="checkout-section-heading">
                <FaMoneyBillWave className="checkout-section-icon" /> Financial Breakdown
              </h3>
              <div className="checkout-summary-grid">
                <div className="checkout-summary-item">
                  <span className="checkout-label">Transaction Giveaway:</span>
                  <span className="checkout-value">
                    {preciseCalculator.formatCurrency(orderSummary.totalTransactionGiveaway)}
                  </span>
                </div>
              </div>
            </div>

            <div className="checkout-divider"></div>

            {/* Enhanced Total Payment Information */}
            <div className="checkout-summary-section">
              <h3 className="checkout-section-heading">
                <FaReceipt className="checkout-section-icon" /> Total Payment Information
              </h3>
              <div className="checkout-summary-grid">
                <div className="checkout-summary-item checkout-total">
                  <span className="checkout-label" style={{ fontSize: "1.1em", fontWeight: "700" }}>
                    Final Total Amount:
                  </span>
                  <span className="checkout-value checkout-highlight" style={{ fontSize: "1.2em", fontWeight: "700" }}>
                    {preciseCalculator.formatCurrency(orderSummary.finalTotal)}
                  </span>
                </div>
                <div className="checkout-summary-item" style={{ fontSize: "0.9em", color: "#666" }}>
                  <span className="checkout-label">Exact Amount:</span>
                  <span className="checkout-value">{preciseCalculator.getExactValue(orderSummary.finalTotal)} PHP</span>
                </div>
              </div>
            </div>

            <div className="checkout-payment-details">
              <h3 className="checkout-section-heading">
                <FaMoneyBillWave className="checkout-section-icon" /> Payment Method & Balance
              </h3>
               {/* Add this authentication check display */}
              {!props.user || !props.user._id ? (
                <div className="checkout-auth-warning" style={{
                  backgroundColor: '#fef3c7',
                  border: '1px solid #fde68a',
                  borderRadius: '6px',
                  padding: '12px',
                  marginBottom: '16px',
                  color: '#92400e',
                  textAlign: 'center'
                }}>
                  <FaLock style={{ marginRight: '8px' }} />
                  Please log in to view payment options
                </div>
              ) : (
              <div className="checkout-payment-selection">
                <label className="checkout-payment-method">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="omsiapawasto"
                    checked={paymentDetails.selectedPaymentMethod === "omsiapawasto"}
                    onChange={() => setPaymentDetails({ ...paymentDetails, selectedPaymentMethod: "omsiapawasto" })}
                  />
                  <div className="checkout-method-info">
                    {/*<div className="checkout-method-name">OMSIAPAWASTO Currency</div>*/}
                    <div className="checkout-method-balance">
                      Current Balance: {preciseCalculator.formatCurrency(paymentDetails.omsiapawastoBalance)}
                    </div>
                    <div
                      className="checkout-method-balance"
                      style={{ color: paymentDetails.balanceAfterPayment >= 0 ? "#10b981" : "#ef4444" }}
                    >
                      Balance After Payment: {preciseCalculator.formatCurrency(paymentDetails.balanceAfterPayment)}
                    </div>
                  </div>
                </label>
              </div>
              )}

              <div className="checkout-divider"></div>

              <div className="checkout-payment-confirmation">
                <div className="checkout-summary-grid">
                  <div className="checkout-summary-item">
                    <span className="checkout-label">Amount to Deduct:</span>
                    <span className="checkout-value checkout-highlight">
                      {preciseCalculator.formatCurrency(orderSummary.finalTotal)}
                    </span>
                  </div>
                  <div className="checkout-summary-item">
                    <span className="checkout-label">Transaction Fee Included:</span>
                    <span className="checkout-value">
                      {preciseCalculator.formatCurrency(paymentDetails.transactionFee)}
                    </span>
                  </div>
                </div>

                <div className="checkout-important-notice">
                  <FaInfoCircle className="checkout-notice-icon" />
                  <span className="checkout-notice-text">
                    MAKE SURE TO PROVIDE YOUR CURRENT PHONE NUMBER IN THE PERSONAL SECTION SO THAT THE SHIPPING COMPANY
                    WILL CALL YOU TO RECEIVE YOUR PARCELS
                  </span>
                </div>

                {paymentDetails.omsiapawastoBalance < orderSummary.finalTotal && (
                  <div className="checkout-insufficient-funds">
                    <span className="checkout-warning-icon">⚠️</span>
                    Warning: Insufficient balance. You need{" "}
                    {preciseCalculator.formatCurrency(orderSummary.finalTotal)} but only have{" "}
                    {preciseCalculator.formatCurrency(paymentDetails.omsiapawastoBalance)}. Shortage:{" "}
                    {preciseCalculator.formatCurrency(
                      preciseCalculator.subtract(orderSummary.finalTotal, paymentDetails.omsiapawastoBalance),
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
