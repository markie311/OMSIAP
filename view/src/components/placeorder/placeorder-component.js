"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  FaShoppingCart,
  FaTruck,
  FaWeightHanging,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTrashAlt,
  FaCreditCard,
  FaInfoCircle,
} from "react-icons/fa"

import '../../styles/placeorder/placeorder.scss'

const PlaceOrderPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [cartItems, setCartItems] = useState([])
  const [selectedShipping, setSelectedShipping] = useState("weight-based")
  const [paymentMethod, setPaymentMethod] = useState("omsiapawasto")
  const [combinedPayment, setCombinedPayment] = useState("none")
  const [showWeightLimitModal, setShowWeightLimitModal] = useState(false)
  const [cartStats, setCartStats] = useState({
    totalItems: 0,
    totalWeightGrams: 0,
    totalWeightKilos: 0,
    shippingCost: 0,
    subtotal: 0,
    paymentProcessingFee: 0,
    total: 0,
    exceedsWeightLimit: false,
  })

  // Maximum weight limit in kilograms
  const MAX_WEIGHT_LIMIT = 20
  const PAYMENT_PROCESSING_FEE_RATE = 0.02 // 2%

  // Initialize cart from location state
  useEffect(() => {
    const cart = location.state?.cart || []

    if (cart.length > 0) {
      const normalizedCart = cart.map((item) => {
        const normalizedItem = { ...item }

        if (normalizedItem.quantity) {
          normalizedItem.quantity = Math.floor(normalizedItem.quantity)
          if (normalizedItem.quantity < 1) normalizedItem.quantity = 1
        } else {
          normalizedItem.quantity = 1
        }

        return normalizedItem
      })

      setCartItems(normalizedCart)

      // Debug cart data structure
      console.log("Cart Items Debug:", normalizedCart)
      normalizedCart.forEach((item, index) => {
        console.log(`Item ${index + 1}:`, {
          name: item.details?.productname || "Unknown",
          baseShipping: item.details?.price?.shipping,
          weight: item.details?.weightingrams,
          fullItem: item,
        })
      })
    }
  }, [location.state])

  // Calculate cart statistics whenever cartItems changes
  useEffect(() => {
    if (cartItems.length === 0) {
      setCartStats({
        totalItems: 0,
        totalWeightGrams: 0,
        totalWeightKilos: 0,
        shippingCost: 0,
        subtotal: 0,
        paymentProcessingFee: 0,
        total: 0,
        exceedsWeightLimit: false,
      })
      return
    }

    const { totalSummary } = calculateProductDetails(cartItems)

    const totalItemCount = cartItems.reduce((count, product) => count + (product.quantity || 1), 0)

    const totalWeightGrams = totalSummary.totalWeightInGrams
    const totalWeightKilos = totalSummary.totalWeightInKilos
    const shippingCost = calculateShippingCost(cartItems)
    const subtotal = totalSummary.totalPrice

    // Calculate 2% payment processing fee on subtotal + shipping
    const subtotalPlusShipping = preciseAdd(subtotal, shippingCost)
    const paymentProcessingFee = Math.round(preciseMultiply(subtotalPlusShipping, PAYMENT_PROCESSING_FEE_RATE))

    // Calculate final total
    const total = Math.round(preciseAdd(subtotalPlusShipping, paymentProcessingFee))

    setCartStats({
      totalItems: totalItemCount,
      totalWeightGrams: formatDecimal(totalWeightGrams, 2),
      totalWeightKilos: formatDecimal(totalWeightKilos, 3),
      shippingCost: formatDecimal(shippingCost, 2),
      subtotal: formatDecimal(subtotal, 2),
      paymentProcessingFee: paymentProcessingFee,
      total: total,
      exceedsWeightLimit: totalWeightKilos > MAX_WEIGHT_LIMIT,
    })
  }, [cartItems])

  // Enhanced decimal formatting without toFixed
  const formatDecimal = (number, decimalPlaces) => {
    const factor = Math.pow(10, decimalPlaces)
    return Math.round(number * factor) / factor
  }

// Calculate shipping cost per product based on individual product weight
const calculateShippingCost = (cartItems) => {
  if (cartItems.length === 0) return 0

  let totalShippingCost = 0

  console.log("=== DETAILED SHIPPING CALCULATION DEBUG ===")

  cartItems.forEach((item, index) => {
    console.log(`\n--- Item ${index + 1} Debug ---`)
    console.log("Full item object:", item)
    console.log("item.details:", item.details)
    console.log("item.details?.price:", item.details?.price)
    console.log("item.details?.price?.shipping:", item.details?.price?.shipping)
    console.log("typeof shipping:", typeof item.details?.price?.shipping)
    
    const quantity = Math.floor(item.quantity || 1)
    const itemWeightGrams = preciseMultiply(Number.parseFloat(item.details?.weightingrams || 0), quantity)
    const itemWeightKilos = preciseMultiply(itemWeightGrams, 0.001)

    // Get base shipping rate (this is the rate per 1kg)
    let rawShippingRate = item.details?.price?.shipping
    let baseShippingRate = Number.parseFloat(rawShippingRate || 0)

    console.log("Raw shipping rate:", rawShippingRate)
    console.log("Parsed shipping rate:", baseShippingRate)
    console.log("Is NaN?", isNaN(baseShippingRate))
    console.log("Is zero?", baseShippingRate === 0)

    // If no shipping rate is set, use fallback calculation
    if (baseShippingRate === 0 || isNaN(baseShippingRate)) {
      console.log("*** USING FALLBACK RATE ***")
      baseShippingRate = 50
    } else {
      console.log("*** USING ACTUAL RATE ***")
    }

    // Calculate weight multiplier (rounded up, max 20kg)
    const actualWeightKilos = Math.ceil(itemWeightKilos)
    const weightMultiplier = Math.min(actualWeightKilos, MAX_WEIGHT_LIMIT)

    // Calculate shipping cost: base rate × weight in kg
    const productShippingCost = preciseMultiply(baseShippingRate, weightMultiplier)

    console.log(`Final calculation: ${baseShippingRate} × ${weightMultiplier} = ${productShippingCost}`)

    // Add to total shipping cost
    totalShippingCost = preciseAdd(totalShippingCost, productShippingCost)
  })

  console.log("\nFinal Total Shipping Cost:", totalShippingCost)
  console.log("=== END DETAILED DEBUG ===")

  return totalShippingCost
}

// Helper function to get individual product shipping cost
const getProductShippingCost = (item) => {
  const quantity = Math.floor(item.quantity || 1)
  const itemWeightGrams = preciseMultiply(Number.parseFloat(item.details?.weightingrams || 0), quantity)
  const itemWeightKilos = preciseMultiply(itemWeightGrams, 0.001)

  // Get base shipping rate (rate per 1kg)
  let baseShippingRate = Number.parseFloat(item.details?.price?.shipping || 0)

  // If no shipping rate is set, use fallback calculation
  if (baseShippingRate === 0 || isNaN(baseShippingRate)) {
    // Fallback: ₱50 per kg
    baseShippingRate = 50
  }

  // Calculate weight multiplier (rounded up, max 20kg)
  const actualWeightKilos = Math.ceil(itemWeightKilos)
  const weightMultiplier = Math.min(actualWeightKilos, MAX_WEIGHT_LIMIT)

  // Calculate shipping cost: base rate × weight in kg
  const productShippingCost = preciseMultiply(baseShippingRate, weightMultiplier)

  return {
    baseRate: baseShippingRate,
    weightMultiplier,
    shippingCost: productShippingCost,
    itemWeightKilos,
    actualWeightKilos,
    hasFallback:
      Number.parseFloat(item.details?.price?.shipping || 0) === 0 ||
      isNaN(Number.parseFloat(item.details?.price?.shipping || 0)),
  }
}

  // Enhanced precise multiplication without floating point errors
  const preciseMultiply = (a, b) => {
    if (a === 0 || b === 0) return 0

    const aStr = a.toString()
    const bStr = b.toString()

    const aDecimals = aStr.includes(".") ? aStr.split(".")[1].length : 0
    const bDecimals = bStr.includes(".") ? bStr.split(".")[1].length : 0

    const totalDecimals = aDecimals + bDecimals
    const factor = Math.pow(10, totalDecimals)

    const aInt = Number.parseInt(aStr.replace(".", ""))
    const bInt = Number.parseInt(bStr.replace(".", ""))

    return (aInt * bInt) / factor
  }

  // Enhanced precise addition
  const preciseAdd = (a, b) => {
    if (a === 0) return b
    if (b === 0) return a

    const aStr = a.toString()
    const bStr = b.toString()

    const aDecimals = aStr.includes(".") ? aStr.split(".")[1].length : 0
    const bDecimals = bStr.includes(".") ? bStr.split(".")[1].length : 0

    const maxDecimals = Math.max(aDecimals, bDecimals)
    const factor = Math.pow(10, maxDecimals)

    return (Math.round(a * factor) + Math.round(b * factor)) / factor
  }

  // Enhanced precise subtraction
  const preciseSubtract = (a, b) => {
    if (b === 0) return a
    if (a === 0) return -b

    const aStr = a.toString()
    const bStr = b.toString()

    const aDecimals = aStr.includes(".") ? aStr.split(".")[1].length : 0
    const bDecimals = bStr.includes(".") ? bStr.split(".")[1].length : 0

    const maxDecimals = Math.max(aDecimals, bDecimals)
    const factor = Math.pow(10, maxDecimals)

    return (Math.round(a * factor) - Math.round(b * factor)) / factor
  }

  // Update cart item quantity with precise integer handling
  const updateQuantity = (itemId, newQuantity) => {
    const intQuantity = Math.floor(newQuantity)

    if (intQuantity < 1) return

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.authentications?.id === itemId) {
          return { ...item, quantity: intQuantity }
        }
        return item
      }),
    )
  }

  const increaseQuantity = (itemId) => {
    const item = cartItems.find((item) => item.authentications?.id === itemId)
    const currentQty = Math.floor(item.quantity || 1)
    updateQuantity(itemId, currentQty + 1)
  }

  const decreaseQuantity = (itemId) => {
    const item = cartItems.find((item) => item.authentications?.id === itemId)
    const currentQty = Math.floor(item.quantity || 1)
    if (currentQty > 1) {
      updateQuantity(itemId, currentQty - 1)
    }
  }

  const removeItem = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.authentications?.id !== itemId))
  }

  // Enhanced validation
  const validateOrder = () => {
    if (cartItems.length === 0) {
      setShowErrorToast("Your cart is empty")
      return false
    }

    if (!paymentMethod) {
      setShowErrorToast("Please select a payment method")
      return false
    }

    if (cartStats.totalWeightKilos > MAX_WEIGHT_LIMIT) {
      setShowWeightLimitModal(true)
      return false
    }

    return true
  }

  const [showErrorToast, setShowErrorToast] = useState(null)

  useEffect(() => {
    if (showErrorToast) {
      const timer = setTimeout(() => {
        setShowErrorToast(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showErrorToast])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateOrder()) {
      const orderData = {
        cartItems,
        cartStats,
        paymentMethod,
        combinedPayment,
        paymentBreakdown: {
          subtotal: cartStats.subtotal,
          shipping: cartStats.shippingCost,
          paymentProcessingFee: cartStats.paymentProcessingFee,
          total: cartStats.total,
        },
      }

      console.log("Enhanced Order data:", orderData)
      navigate("/checkout", { state: { orderData } })

      if (window.updateCheckoutComponent) {
        window.updateCheckoutComponent()
      }
    }
  }

  // Enhanced product details calculation
  function calculateProductDetails(products) {
    const updatedProducts = JSON.parse(JSON.stringify(products))

    const totalSummary = {
      totalPrice: 0,
      totalCapital: 0,
      totalTransactionGiveaway: 0,
      totalOmsiaProfit: 0,
      totalWeightInGrams: 0,
      totalWeightInKilos: 0,
    }

    updatedProducts.forEach((product) => {
      let quantity = Math.floor(product.quantity || 1)
      if (quantity < 1) quantity = 1

      const price = product.details?.price?.amount || 0
      const capital = product.details?.price?.capital || 0
      const transactionGiveaway = product.details?.price?.transactiongiveaway || 0
      const profit = product.details?.price?.profit || 0

      const productPrice = preciseMultiply(price, quantity)
      const productCapital = preciseMultiply(capital, quantity)
      const productTransactionGiveaway = preciseMultiply(transactionGiveaway, quantity)
      const productOmsiaProfit = preciseMultiply(profit, quantity)

      const weightInGrams = preciseMultiply(Number.parseFloat(product.details?.weightingrams || 0), quantity)
      const weightInKilos = preciseMultiply(weightInGrams, 0.001)

      totalSummary.totalPrice = preciseAdd(totalSummary.totalPrice, productPrice)
      totalSummary.totalCapital = preciseAdd(totalSummary.totalCapital, productCapital)
      totalSummary.totalTransactionGiveaway = preciseAdd(
        totalSummary.totalTransactionGiveaway,
        productTransactionGiveaway,
      )
      totalSummary.totalOmsiaProfit = preciseAdd(totalSummary.totalOmsiaProfit, productOmsiaProfit)
      totalSummary.totalWeightInGrams = preciseAdd(totalSummary.totalWeightInGrams, weightInGrams)
      totalSummary.totalWeightInKilos = preciseAdd(totalSummary.totalWeightInKilos, weightInKilos)
    })

    return {
      updatedProducts,
      totalSummary,
    }
  }

  // Helper functions
  const getProductImage = (item) => {
    if (item.images && item.images.length > 0) return item.images[0].url
    return "../images/market/products/watch.jpg"
  }

  const getProductName = (item) => {
    return item.details?.productname || "Unnamed Product"
  }

  const getProductPrice = (item) => {
    return item.details?.price?.amount || 0
  }

  const getProductShippingRate = (item) => {
    return item.details?.price?.shipping || 0
  }

  // Enhanced Weight Limit Modal
  const WeightLimitModal = ({ show, onClose }) => {
    if (!show) return null

    return (
      <AnimatePresence>
        {show && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="modal-header">
                <h3>
                  <FaExclamationTriangle className="warning-icon" /> Weight Limit Exceeded
                </h3>
                <button className="close-button" onClick={onClose}>
                  ×
                </button>
              </div>
              <div className="modal-body">
                <p>Your order weight exceeds our limit of {MAX_WEIGHT_LIMIT} kilograms.</p>
                <div className="weight-progress">
                  <div className="weight-bar">
                    <div
                      className="weight-fill exceeded"
                      style={{ width: `${Math.min((cartStats.totalWeightKilos / MAX_WEIGHT_LIMIT) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="weight-labels">
                    <span>0kg</span>
                    <span>{MAX_WEIGHT_LIMIT}kg</span>
                  </div>
                </div>
                <p className="current-weight">
                  Current weight: <strong>{cartStats.totalWeightKilos} kg</strong>
                </p>
                <p>Please reduce the quantity of items in your cart to continue.</p>
              </div>
              <div className="modal-footer">
                <button className="btn primary-btn" onClick={onClose}>
                  I Understand
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  // Enhanced Toast notification
  const ToastNotification = ({ message, type }) => {
    return (
      <AnimatePresence>
        {message && (
          <motion.div
            className={`toast-notification ${type}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="toast-icon">{type === "error" ? <FaExclamationTriangle /> : <FaCheckCircle />}</div>
            <div className="toast-message">{message}</div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  return (
    <div className="placeorder-page">
      <ToastNotification message={showErrorToast} type="error" />

      <div className="placeorder-container">
        <motion.header
          className="placeorder-header"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1>
            <FaShoppingCart className="header-icon" /> Place Order
          </h1>
        </motion.header>

        {/* Enhanced Weight Warning Banner */}
        <AnimatePresence>
          {cartStats.totalWeightKilos > MAX_WEIGHT_LIMIT * 0.8 && cartStats.totalWeightKilos <= MAX_WEIGHT_LIMIT && (
            <motion.div
              className="weight-warning-banner"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FaExclamationTriangle className="warning-icon" />
              <p>
                <strong>Warning:</strong> Your order is approaching the {MAX_WEIGHT_LIMIT}kg weight limit. Current
                weight: <strong>{cartStats.totalWeightKilos} kg</strong>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Weight Exceeded Banner */}
        <AnimatePresence>
          {cartStats.totalWeightKilos > MAX_WEIGHT_LIMIT && (
            <motion.div
              className="weight-error-banner"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <FaExclamationTriangle className="error-icon" />
              <p>
                <strong>Error:</strong> Your order exceeds the {MAX_WEIGHT_LIMIT}kg weight limit. Current weight:{" "}
                <strong>{cartStats.totalWeightKilos} kg</strong>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit}>
          <div className="placeorder-layout">
            <div className="placeorder-main">
              {/* Enhanced Cart Summary */}
              <motion.section
                className="card cart-summary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="card-header">
                  <h2>
                    <FaShoppingCart className="section-icon" /> Cart Summary
                  </h2>
                  <span className="item-count">
                    {cartItems.length} products ({cartStats.totalItems} items)
                  </span>
                </div>

                {cartItems.length === 0 ? (
                  <div className="empty-cart">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{
                        repeat: 2,
                        repeatType: "reverse",
                        duration: 1,
                      }}
                    >
                      <FaShoppingCart className="empty-cart-icon" />
                    </motion.div>
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  <div className="cart-items">
                    {cartItems.map((item, index) => (
                      <motion.div
                        key={item.authentications?.id}
                        className="cart-item"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <div className="item-image">
                          <img src={getProductImage(item) || "/placeholder.svg"} alt={getProductName(item)} />
                        </div>

                        <div className="item-details">
                          <div className="item-name">{getProductName(item)}</div>
                          <div className="item-price">₱{formatDecimal(getProductPrice(item), 2)}</div>
                          <div className="item-shipping-rate">
                            Base shipping: ₱{formatDecimal(getProductShippingRate(item), 2)}
                            {getProductShippingCost(item).hasFallback && (
                              <span style={{ color: "#f59e0b", fontSize: "0.8rem", marginLeft: "5px" }}>
                                (Auto-calculated)
                              </span>
                            )}
                          </div>
                          <div className="item-weight">
                            Weight: {formatDecimal(Number.parseFloat(item.details?.weightingrams || 0), 2)}g per unit
                          </div>

                          <div className="item-actions">
                            <div className="quantity-control">
                              <motion.button
                                type="button"
                                className="quantity-btn"
                                onClick={() => decreaseQuantity(item.authentications?.id)}
                                whileTap={{ scale: 0.9 }}
                              >
                                -
                              </motion.button>
                              <span className="quantity" style={{color:'black'}}>{Math.floor(item.quantity || 1)}</span>
                              <motion.button
                                type="button"
                                className="quantity-btn"
                                onClick={() => increaseQuantity(item.authentications?.id)}
                                whileTap={{ scale: 0.9 }}
                              >
                                +
                              </motion.button>
                            </div>

                            <motion.button
                              type="button"
                              className="remove-btn"
                              onClick={() => removeItem(item.authentications?.id)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FaTrashAlt /> Remove
                            </motion.button>
                          </div>
                        </div>

                        <div className="item-total">
                          <div className="item-subtotal">
                            ₱{formatDecimal(preciseMultiply(getProductPrice(item), Math.floor(item.quantity || 1)), 2)}
                          </div>
                          <div className="item-shipping-cost">
                            Shipping: ₱{formatDecimal(getProductShippingCost(item).shippingCost, 2)}
                          </div>
                          <div className="item-total-weight">
                            {formatDecimal(
                              preciseMultiply(
                                Number.parseFloat(item.details?.weightingrams || 0),
                                Math.floor(item.quantity || 1),
                              ),
                              2,
                            )}
                            g ({formatDecimal(getProductShippingCost(item).itemWeightKilos, 3)}kg)
                          </div>
                          <div className="item-weight-multiplier">
                            Multiplier: {getProductShippingCost(item).weightMultiplier}x
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.section>

              {/* Enhanced Shipping Information */}
              <motion.section
                className="card shipping-options"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="card-header">
                  <h2>
                    <FaTruck className="section-icon" /> Shipping Information
                  </h2>
                </div>

                <div className="shipping-details">
                 <div className="shipping-info-row">
  <span>
    <FaTruck /> Weight-based shipping calculation:
  </span>
  <span className="shipping-value highlighted">₱{cartStats.shippingCost}</span>
</div>

                  <div className="shipping-info-row">
                    <span>
                      <FaWeightHanging /> Total Weight:
                    </span>
                    <span
                      className={`shipping-value ${cartStats.totalWeightKilos > MAX_WEIGHT_LIMIT ? "text-error" : ""}`}
                    >
                      {cartStats.totalWeightGrams}g ({cartStats.totalWeightKilos}kg)
                      {cartStats.totalWeightKilos > MAX_WEIGHT_LIMIT && (
                        <span className="weight-exceed-marker">
                          <FaExclamationTriangle /> Exceeds {MAX_WEIGHT_LIMIT}kg limit!
                        </span>
                      )}
                    </span>
                  </div>

 <div className="shipping-calculation-example">
  <h4>
    <FaInfoCircle /> Individual Product Shipping Calculation:
  </h4>
  <div style={{ fontSize: "0.85rem", marginBottom: "10px", color: "#64748b" }}>
    Formula: Base Shipping Rate (per kg) × Weight (rounded up, max 20kg)
  </div>
  {cartItems.map((item, index) => {
    const shippingInfo = getProductShippingCost(item)
    const quantity = Math.floor(item.quantity || 1)

    return (
      <div
        key={index}
        style={{
          padding: "10px",
          background: shippingInfo.hasFallback ? "#fef3c7" : "#f1f5f9",
          margin: "8px 0",
          borderRadius: "6px",
          fontSize: "0.85rem",
          border: shippingInfo.hasFallback ? "1px solid #f59e0b" : "1px solid #e2e8f0",
        }}
      >
        <div style={{ fontWeight: "600", marginBottom: "4px" }}>
          {getProductName(item)} (Qty: {quantity})
          {shippingInfo.hasFallback && (
            <span style={{ color: "#f59e0b", fontSize: "0.8rem", marginLeft: "8px" }}>
              (Fallback: ₱50/kg)
            </span>
          )}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px", fontSize: "0.8rem" }}>
          <div>Rate: ₱{formatDecimal(shippingInfo.baseRate, 2)}/kg</div>
          <div>Actual Weight: {formatDecimal(shippingInfo.itemWeightKilos, 3)}kg</div>
          <div>Billing Weight: {shippingInfo.weightMultiplier}kg</div>
          <div style={{ fontWeight: "600", color: "#059669" }}>
            Shipping: ₱{formatDecimal(shippingInfo.shippingCost, 2)}
          </div>
        </div>
        <div style={{ 
          marginTop: "6px", 
          padding: "4px 8px", 
          background: "#e0f2fe", 
          borderRadius: "4px",
          fontSize: "0.75rem",
          color: "#0369a1"
        }}>
          Calculation: ₱{formatDecimal(shippingInfo.baseRate, 2)}/kg × {shippingInfo.weightMultiplier}kg = ₱{formatDecimal(shippingInfo.shippingCost, 2)}
        </div>
      </div>
    )
  })}
  <div
    style={{
      marginTop: "12px",
      fontWeight: "bold",
      background: "#dcfce7",
      padding: "10px",
      borderRadius: "6px",
      border: "1px solid #16a34a",
      color: "#15803d"
    }}
  >
    <strong>Total Shipping Cost: ₱{cartStats.shippingCost}</strong>
  </div>
</div>

                  <div className="shipping-info-row weight-limit-note">
                    <FaExclamationTriangle className="note-icon" />
                    <span>Orders are limited to a maximum of {MAX_WEIGHT_LIMIT}kg per order.</span>
                  </div>
                </div>
              </motion.section>
            </div>

            <div className="placeorder-sidebar">
              {/* Enhanced Order Summary with Payment Processing Fee */}
              <motion.section
                className="card order-summary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="card-header">
                  <h2>
                    <FaMoneyBillWave className="section-icon" /> Order Summary
                  </h2>
                </div>

                <div className="summary-content">
                  <div className="summary-row">
                    <span>Products</span>
                    <span>{cartItems.length} items</span>
                  </div>

                  <div className="summary-row">
                    <span>Total Quantity</span>
                    <span>{cartStats.totalItems} units</span>
                  </div>

                  <div className="summary-row">
                    <span>Total Weight</span>
                    <span className={cartStats.totalWeightKilos > MAX_WEIGHT_LIMIT ? "text-error" : ""}>
                      {cartStats.totalWeightGrams}g ({cartStats.totalWeightKilos}kg)
                      {cartStats.totalWeightKilos > MAX_WEIGHT_LIMIT && (
                        <FaExclamationTriangle className="inline-warning-icon" />
                      )}
                    </span>
                  </div>

                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>₱{cartStats.subtotal}</span>
                  </div>

                  <div className="summary-row">
                    <span>Shipping</span>
                    <span>₱{cartStats.shippingCost}</span>
                  </div>

                  {/* New Payment Processing Fee Section */}
                  <div className="summary-row payment-fee-row">
                    <span>
                      <FaCreditCard className="fee-icon" />
                      Payment Processing Fee (2%)
                      <div className="fee-explanation">Applied to subtotal + shipping</div>
                    </span>
                    <span>₱{cartStats.paymentProcessingFee}</span>
                  </div>

                  <div className="summary-divider"></div>

                  <motion.div
                    className="summary-row total"
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 1, delay: 0.8 }}
                  >
                    <span>Total</span>
                    <span>₱{cartStats.total}</span>
                  </motion.div>

                  {/* Payment Breakdown */}
                  <div className="payment-breakdown">
                    <h4>
                      <FaInfoCircle /> Payment Breakdown:
                    </h4>
                    <div className="breakdown-item">
                      <span>Subtotal:</span>
                      <span>₱{cartStats.subtotal}</span>
                    </div>
                    <div className="breakdown-item">
                      <span>+ Shipping:</span>
                      <span>₱{cartStats.shippingCost}</span>
                    </div>
                    <div className="breakdown-item">
                      <span>+ Processing Fee (2%):</span>
                      <span>₱{cartStats.paymentProcessingFee}</span>
                    </div>
                    <div className="breakdown-total">
                      <span>= Final Total:</span>
                      <span>₱{cartStats.total}</span>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    className="checkout-button"
                    disabled={cartStats.totalWeightKilos > MAX_WEIGHT_LIMIT}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {cartStats.totalWeightKilos > MAX_WEIGHT_LIMIT ? (
                      <>
                        <FaExclamationTriangle className="button-icon" />
                        Order Exceeds {MAX_WEIGHT_LIMIT}kg Weight Limit
                      </>
                    ) : (
                      <>
                        <FaCheckCircle className="button-icon" />
                        Place Order - Pay ₱{cartStats.total}
                      </>
                    )}
                  </motion.button>

                  {cartStats.totalWeightKilos > MAX_WEIGHT_LIMIT && (
                    <motion.div
                      className="weight-limit-error-message"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <FaExclamationTriangle className="error-icon" />
                      Please reduce your order weight to continue.
                    </motion.div>
                  )}
                </div>
              </motion.section>
            </div>
          </div>
        </form>

        <WeightLimitModal show={showWeightLimitModal} onClose={() => setShowWeightLimitModal(false)} />
      </div>
    </div>
  )
}

export default PlaceOrderPage
