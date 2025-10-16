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
  FaBox,
  FaTag,
} from "react-icons/fa"

import "../../styles/placeorder/placeorder.scss"

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

  // Initialize cart from location state - Updated to handle market component's cart structure
  useEffect(() => {
    const cart = location.state?.cart || []
    console.log("Received cart from market:", cart)

    if (cart.length > 0) {
      setCartItems(cart)
    }
  }, [location.state])

  // Calculate cart statistics for the new cart structure
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

    const { totalSummary } = calculateCartTotals(cartItems)
    const totalItemCount = getTotalItemCount(cartItems)
    const shippingCost = calculateMainProductShipping(cartItems)

    // Calculate 2% payment processing fee on subtotal + shipping
    const subtotalPlusShipping = preciseAdd(totalSummary.totalPrice, shippingCost)
    const paymentProcessingFee = Math.round(preciseMultiply(subtotalPlusShipping, PAYMENT_PROCESSING_FEE_RATE))

    // Calculate final total
    const total = Math.round(preciseAdd(subtotalPlusShipping, paymentProcessingFee))

    setCartStats({
      totalItems: totalItemCount,
      totalWeightGrams: formatDecimal(totalSummary.totalWeightInGrams, 2),
      totalWeightKilos: formatDecimal(totalSummary.totalWeightInKilos, 3),
      shippingCost: formatDecimal(shippingCost, 2),
      subtotal: formatDecimal(totalSummary.totalPrice, 2),
      paymentProcessingFee: paymentProcessingFee,
      total: total,
      exceedsWeightLimit: totalSummary.totalWeightInKilos > MAX_WEIGHT_LIMIT,
    })
  }, [cartItems])

 // Replace existing calculateCartTotals with this
const calculateCartTotals = (cartItems) => {
  const totalSummary = {
    totalPrice: 0,
    totalWeightInGrams: 0,
    totalWeightInKilos: 0,
  }

  cartItems.forEach((mainProduct) => {
    mainProduct.specifications.forEach((spec) => {
      const quantity = Math.max(1, parseInt(spec.quantity || 1, 10))
      const price = Number(spec.price || 0)
      const weightInGrams = Number(spec.data?.details?.weightingrams || 0)

      const specTotal = preciseMultiply(price, quantity)
      const specWeightGrams = preciseMultiply(weightInGrams, quantity)
      const specWeightKilos = preciseMultiply(specWeightGrams, 0.001)

      totalSummary.totalPrice = preciseAdd(totalSummary.totalPrice, specTotal)
      totalSummary.totalWeightInGrams = preciseAdd(totalSummary.totalWeightInGrams, specWeightGrams)
      totalSummary.totalWeightInKilos = preciseAdd(totalSummary.totalWeightInKilos, specWeightKilos)
    })
  })

  return { totalSummary }
}

  // Get total item count
  const getTotalItemCount = (cartItems) => {
    return cartItems.reduce((total, mainProduct) => {
      return (
        total +
        mainProduct.specifications.reduce((specTotal, spec) => {
          return specTotal + (spec.quantity || 1)
        }, 0)
      )
    }, 0)
  }

  // NEW: Calculate shipping based on main products with weight-based multiplication
  const calculateMainProductShipping = (cartItems) => {
    if (cartItems.length === 0) return 0

    let totalShippingCost = 0

    console.log("=== MAIN PRODUCT SHIPPING CALCULATION ===")

    cartItems.forEach((mainProduct, index) => {
      console.log(`\n--- Main Product ${index + 1}: ${mainProduct.productName} ---`)

      // Get main product's base shipping rate
      let baseShippingRate = mainProduct.mainProduct?.details?.price?.shipping || 0
      const hasFallback = baseShippingRate === 0 || isNaN(baseShippingRate)

      if (hasFallback) {
        baseShippingRate = 50 // Fallback rate per kg
      }

      console.log(`Base shipping rate: ₱${baseShippingRate}/kg ${hasFallback ? "(Fallback)" : ""}`)

      // Calculate total weight for this main product (all specifications combined)
      let totalMainProductWeightGrams = 0
      let totalMainProductQuantity = 0

      mainProduct.specifications.forEach((spec) => {
        const quantity = spec.quantity || 1
        const weightInGrams = spec.data?.details?.weightingrams || 0
        const specWeightGrams = preciseMultiply(weightInGrams, quantity)

        totalMainProductWeightGrams = preciseAdd(totalMainProductWeightGrams, specWeightGrams)
        totalMainProductQuantity += quantity

        console.log(`  - ${spec.name}: ${quantity} × ${weightInGrams}g = ${specWeightGrams}g`)
      })

      const totalMainProductWeightKilos = preciseMultiply(totalMainProductWeightGrams, 0.001)

      // Weight-based multiplication: if weight is 1kg = 1x rate, 2kg = 2x rate, etc.
      const weightMultiplier = Math.min(Math.ceil(totalMainProductWeightKilos), MAX_WEIGHT_LIMIT)

      // Calculate shipping cost for this main product
      const mainProductShippingCost = preciseMultiply(baseShippingRate, weightMultiplier)

      console.log(`Total weight: ${totalMainProductWeightGrams}g (${totalMainProductWeightKilos}kg)`)
      console.log(`Weight multiplier: ${weightMultiplier}x (capped at ${MAX_WEIGHT_LIMIT}kg)`)
      console.log(`Shipping cost: ₱${baseShippingRate} × ${weightMultiplier} = ₱${mainProductShippingCost}`)

      totalShippingCost = preciseAdd(totalShippingCost, mainProductShippingCost)
    })

    console.log(`\nTotal Shipping Cost: ₱${totalShippingCost}`)
    console.log("=== END SHIPPING CALCULATION ===")

    return totalShippingCost
  }

// Replace existing getMainProductShippingDetails with this
const getMainProductShippingDetails = (mainProduct) => {
  let baseShippingRate = Number(mainProduct.mainProduct?.details?.price?.shipping || 0)
  const hasFallback = baseShippingRate === 0 || isNaN(baseShippingRate)

  if (hasFallback) {
    baseShippingRate = 50 // Fallback rate per kg
  }

  let totalMainProductWeightGrams = 0
  mainProduct.specifications.forEach((spec) => {
    const quantity = Math.max(1, parseInt(spec.quantity || 1, 10))
    const weightInGrams = Number(spec.data?.details?.weightingrams || 0)
    const specWeightGrams = preciseMultiply(weightInGrams, quantity)
    totalMainProductWeightGrams = preciseAdd(totalMainProductWeightGrams, specWeightGrams)
  })

  const totalMainProductWeightKilos = preciseMultiply(totalMainProductWeightGrams, 0.001)
  const weightMultiplier = Math.min(Math.ceil(totalMainProductWeightKilos), MAX_WEIGHT_LIMIT)
  const shippingCost = preciseMultiply(baseShippingRate, weightMultiplier)

  return {
    baseRate: baseShippingRate,
    totalWeightGrams: totalMainProductWeightGrams,
    totalWeightKilos: totalMainProductWeightKilos,
    weightMultiplier,
    shippingCost,
    hasFallback,
  }
}

  // Enhanced decimal formatting without toFixed
  const formatDecimal = (number, decimalPlaces) => {
    const factor = Math.pow(10, decimalPlaces)
    return Math.round(number * factor) / factor
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

const updateSpecificationQuantity = (mainProductName, specificationName, delta) => {
  setCartItems(prev =>
    prev.map(mainProduct => {
      if (mainProduct.mainProductName !== mainProductName) return mainProduct;

      return {
        ...mainProduct,
        specifications: mainProduct.specifications.map(spec =>
          spec.name === specificationName
            ? { ...spec, quantity: Math.max(1, (spec.quantity || 1) + delta) }
            : spec
        ),
      };
    })
  );
};

// Remove a specification or entire main product (uses mainProductName)
const removeFromCart = (targetMainProductName, targetSpecificationName = null) => {
  setCartItems((prevCart) =>
    prevCart
      .map((mainProduct) => {
        const currentMainName = mainProduct.mainProductName

        // Remove specific specification under this main product
        if (targetSpecificationName) {
          if (currentMainName === targetMainProductName) {
            const updatedSpecs = mainProduct.specifications.filter(
              (spec) => spec.name !== targetSpecificationName
            )
            // If no specs left, remove main product
            return updatedSpecs.length > 0
              ? { ...mainProduct, specifications: updatedSpecs }
              : null
          }
          return mainProduct
        }

        // Remove entire main product
        if (currentMainName === targetMainProductName) {
          return null
        }

        // Keep all others
        return mainProduct
      })
      .filter(Boolean)
  )
}




  // Helper function to get image URL with fallback
  const getImageUrl = (imageArray, fallbackUrl = "/placeholder.svg?height=80&width=80") => {
    if (!imageArray || !Array.isArray(imageArray) || imageArray.length === 0) {
      return fallbackUrl
    }

    // Handle both string URLs and objects with url property
    const firstImage = imageArray[0]
    if (typeof firstImage === "string") {
      return firstImage
    } else if (firstImage && firstImage.url) {
      return firstImage.url
    }

    return fallbackUrl
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
            <FaShoppingCart className="header-icon" /> Place 
            Order 
            <button onClick={()=> {
                console.log("Cart items")
                console.log(location.state.cart)
            }}>click me</button>
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
              {/* Enhanced Cart Summary for Market Component Structure */}
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
                    {cartItems.length} main products ({cartStats.totalItems} total items)
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
                    {cartItems.map((mainProduct, mainIndex) => {
                      const shippingDetails = getMainProductShippingDetails(mainProduct)

                      return (
                        <motion.div
                          key={mainProduct.mainProductId}
                          className="main-product-group"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * mainIndex }}
                        >
                          {/* Main Product Header */}
                          <div className="main-product-header">
                            <div className="main-product-image">
                              <img
                                src={
                                  getImageUrl(mainProduct.mainProductImages, "/placeholder.svg?height=80&width=80") ||
                                  "/placeholder.svg"
                                }
                                alt={mainProduct.productName}
                                onError={(e) => {
                                  e.target.src = "/placeholder.svg?height=80&width=80"
                                }}
                              />
                            </div>
                            <div className="main-product-info">
                              <h3 className="main-product-name">
                                <FaBox className="product-icon" />
                                {mainProduct.productName}
                              </h3>
                              <p className="specification-count">
                                {mainProduct.specifications.length} specification
                                {mainProduct.specifications.length > 1 ? "s" : ""} selected
                              </p>
                              {mainProduct.mainProduct?.details?.category && (
                                <p className="main-product-category">
                                  <FaTag className="category-icon" />
                                  {mainProduct.mainProduct.details.category}
                                </p>
                              )}
                              <div className="main-product-shipping-summary">
                                <p className="shipping-rate">
                                  <FaTruck className="shipping-icon" />
                                  Shipping: ₱{formatDecimal(shippingDetails.baseRate, 2)}/kg
                                  {shippingDetails.hasFallback && (
                                    <span className="fallback-indicator">(Auto-calculated)</span>
                                  )}
                                </p>
                                <p className="total-shipping">
                                  Total: ₱{formatDecimal(shippingDetails.shippingCost, 2)}
                                  <span className="weight-info">
                                    ({formatDecimal(shippingDetails.totalWeightKilos, 2)}kg ×{" "}
                                    {shippingDetails.weightMultiplier})
                                  </span>
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              className="remove-main-product-btn"
                              onClick={() => removeFromCart(mainProduct.mainProductName)}
                              title="Remove entire product"
                            >
                              <FaTrashAlt />
                            </button>
                          </div>

                          {/* Specifications List */}
                          <div className="specifications-list">
                            {mainProduct.specifications.map((spec, specIndex) => {
                              const specTotal = preciseMultiply(spec.price, spec.quantity)
                              const specWeight = preciseMultiply(spec.data?.details?.weightingrams || 0, spec.quantity)

                              return (
                                <motion.div
                                  key={`${mainProduct.mainProductId}-${spec.id}`}
                                  className="specification-item"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.05 * specIndex }}
                                >
                                  <div className="spec-image">
                                    <img
                                      src={
                                        getImageUrl(
                                          spec.images,
                                          getImageUrl(
                                            mainProduct.mainProductImages,
                                            "/placeholder.svg?height=80&width=80",
                                          ),
                                        ) || "/placeholder.svg"
                                      }
                                      alt={spec.name}
                                      onError={(e) => {
                                        e.target.src = "/placeholder.svg?height=80&width=80"
                                      }}
                                    />
                                  </div>

                                  <div className="spec-details">
                                    <h4 className="spec-name">{spec.name}</h4>
                                    <div className="spec-meta">
                                      <span className="spec-price">₱{formatDecimal(spec.price, 2)} each</span>
                                      <span className="spec-weight">
                                        {formatDecimal(spec.data?.details?.weightingrams || 0, 2)}g per unit
                                      </span>
                                    </div>
                                  </div>

                                  <div className="spec-quantity-controls">
                                    <div className="quantity-control">
                                      <motion.button
                                        type="button"
                                        className="quantity-btn"
                                        onClick={() =>
                                         updateSpecificationQuantity(mainProduct.mainProductName, spec.name, -1)

                                        }
                                        whileTap={{ scale: 0.9 }}
                                        disabled={spec.quantity <= 1}
                                      >
                                        -
                                      </motion.button>
                                      <span className="quantity">{spec.quantity}</span>
                                      <motion.button
                                        type="button"
                                        className="quantity-btn"
                                        onClick={() =>
                                          updateSpecificationQuantity(mainProduct.mainProductName, spec.name, +1)

                                        }
                                        whileTap={{ scale: 0.9 }}
                                      >
                                        +
                                      </motion.button>
                                    </div>
                                  </div>

                                  <div className="spec-totals">
                                    <div className="spec-subtotal">₱{formatDecimal(specTotal, 2)}</div>
                                    <div className="spec-total-weight">{formatDecimal(specWeight, 2)}g</div>
                                  </div>

                                  <button
                                    type="button"
                                    className="remove-spec-btn"
                                    onClick={() =>  removeFromCart(mainProduct.mainProductName, spec.name)
}
                                    title="Remove this specification"
                                  >
                                    <FaTrashAlt />
                                  </button>
                                </motion.div>
                              )
                            })}
                          </div>
                        </motion.div>
                      )
                    })}
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
                      <FaTruck /> Total shipping cost:
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

                  <div className="shipping-calculation-breakdown">
                    <h4>
                      <FaInfoCircle /> Main Product Shipping Calculation:
                    </h4>
                    <div className="breakdown-note">
                      New Formula: Base Shipping Rate × Total Weight (per main product, rounded up, max 20kg)
                    </div>

                    {cartItems.map((mainProduct) => {
                      const shippingDetails = getMainProductShippingDetails(mainProduct)

                      return (
                        <div key={mainProduct.mainProductId} className="main-product-shipping-breakdown">
                          <h5 className="breakdown-product-name">{mainProduct.productName}</h5>
                          <div
                            className={`main-product-shipping-details ${shippingDetails.hasFallback ? "fallback" : ""}`}
                          >
                            <div className="shipping-breakdown-header">
                              <span className="product-breakdown-name" style={{color: 'black'}}>Combined Weight Calculation</span>
                              {shippingDetails.hasFallback && <span className="fallback-badge" style={{color: 'black'}}>Fallback Rate</span>}
                            </div>
                            <div className="shipping-breakdown-content">
                              <div className="breakdown-row">
                                <span style={{color: 'black'}}>Base Rate: ₱{formatDecimal(shippingDetails.baseRate, 2)}/kg</span>
                                <span style={{color: 'black'}}>Total Weight: {formatDecimal(shippingDetails.totalWeightKilos, 3)}kg</span>
                              </div>
                              <div className="breakdown-row">
                                <span>Weight Multiplier: {shippingDetails.weightMultiplier}kg (rounded up)</span>
                                <span className="breakdown-total" style={{color: 'black'}}>
                                  Shipping: ₱{formatDecimal(shippingDetails.shippingCost, 2)}
                                </span>
                              </div>
                              <div className="calculation-formula" style={{color: 'black'}}>
                                Calculation: ₱{formatDecimal(shippingDetails.baseRate, 2)}/kg ×{" "}
                                {shippingDetails.weightMultiplier}kg = ₱{formatDecimal(shippingDetails.shippingCost, 2)}
                              </div>

                              {/* Show individual specification weights */}
                              <div className="spec-weight-breakdown">
                                <h6 style={{color: 'black'}}>Specification Weights:</h6>
                                {mainProduct.specifications.map((spec) => {
                                  const specWeight = preciseMultiply(
                                    spec.data?.details?.weightingrams || 0,
                                    spec.quantity,
                                  )
                                  return (
                                    <div key={spec.id} className="spec-weight-item">
                                      <span style={{color: 'black'}}>
                                        {spec.name} (×{spec.quantity}): {formatDecimal(specWeight, 2)}g
                                      </span>
                                    </div>
                                  )
                                })}
                                <div className="spec-weight-total">
                                  <strong style={{color: 'black'}}>
                                    Total: {formatDecimal(shippingDetails.totalWeightGrams, 2)}g (
                                    {formatDecimal(shippingDetails.totalWeightKilos, 3)}kg)
                                  </strong>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="shipping-info-row weight-limit-note">
                    <FaExclamationTriangle className="note-icon" />
                    <span>Orders are limited to a maximum of {MAX_WEIGHT_LIMIT}kg per order.</span>
                  </div>
                </div>
              </motion.section>
            </div>

            <div className="placeorder-sidebar">
              {/* Enhanced Order Summary */}
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
                    <span>Main Products</span>
                    <span>{cartItems.length}</span>
                  </div>

                  <div className="summary-row">
                    <span>Total Specifications</span>
                    <span>
                      {cartItems.reduce((total, mainProduct) => total + mainProduct.specifications.length, 0)}
                    </span>
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
                    disabled={cartStats.totalWeightKilos > MAX_WEIGHT_LIMIT || cartItems.length === 0}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {cartStats.totalWeightKilos > MAX_WEIGHT_LIMIT ? (
                      <>
                        <FaExclamationTriangle className="button-icon" />
                        Order Exceeds {MAX_WEIGHT_LIMIT}kg Weight Limit
                      </>
                    ) : cartItems.length === 0 ? (
                      <>
                        <FaShoppingCart className="button-icon" />
                        Cart is Empty
                      </>
                    ) : (
                      <>
                        <FaCheckCircle className="button-icon" />
                        Place Order - ₱{cartStats.total}
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