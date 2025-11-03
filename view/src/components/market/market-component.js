"use client"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search,
  ShoppingCart,
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  Play,
  Heart,
  Plus,
  ShoppingBag,
  Info,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react"

import Footer from "../landingpage/footer/footer-component.js"

import "../../styles/market/market.scss"

const Market = (props) => {
    
  const navigate = useNavigate()
  const { loadingState, updateLoadingState } = props.useLoading || { loadingState: { products: false } }
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 })
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [fullScreenImage, setFullScreenImage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [showVideo, setShowVideo] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const carouselRef = useRef(null)
  const autoplayRef = useRef(null)
  const modalRef = useRef(null)
  const imageModalRef = useRef(null)

  const carouselSlides = [
    {
      image: "../images/market/products/lighter.jpg",
      title: "Spring Collection 2025",
      description: "Discover our latest products with exclusive discounts for a limited time.",
      buttonText: "Shop Now",
      buttonLink: "#spring-collection",
    },
    {
      image: "../images/market/products/lighter.jpg",
      title: "Premium Electronics",
      description: "High-quality headphones, smartwatches, and more with 2-year warranty.",
      buttonText: "Explore",
      buttonLink: "#electronics",
    },
    {
      image: "../images/market/products/lighter.jpg",
      title: "Free Shipping",
      description: "Enjoy free shipping on all orders over ₱2,500. No coupon needed.",
      buttonText: "Learn More",
      buttonLink: "#shipping",
    },
  ]

  // Add these state variables to your component
  const [fullScreenVideo, setFullScreenVideo] = useState(false)

  // Add these functions to your component
  const openFullScreenVideo = () => {
    setFullScreenVideo(true)
  }

  const closeFullScreenVideo = () => {
    setFullScreenVideo(false)
  }

  // Load products from props
  useEffect(() => {
    if (props.alloftheproducts) {
      setProducts(props.alloftheproducts)
      // Extract unique categories
      const uniqueCategories = [
        ...new Set(
          props.alloftheproducts.map((product) =>
            product.details && product.details.category ? product.details.category : "uncategorized",
          ),
        ),
      ]
      setCategories(uniqueCategories)
    }
  }, [props.alloftheproducts])

  // Carousel autoplay
  useEffect(() => {
    const startAutoplay = () => {
      autoplayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)
      }, 5000)
    }
    startAutoplay()
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
      }
    }
  }, [carouselSlides.length])

  // Update carousel position when slide changes
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(-${currentSlide * 100}%)`
    }
  }, [currentSlide])

  // Handle click outside modal to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isModalOpen && modalRef.current && !modalRef.current.contains(event.target)) {
        closeProductModal()
      }
      if (imageModalOpen && imageModalRef.current && !imageModalRef.current.contains(event.target)) {
        closeImageModal()
      }
    }

    if (isModalOpen || imageModalOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [isModalOpen, imageModalOpen])

  // Filter products based on selected category, price range, and search query
  const filteredProducts = products.filter((product) => {
    if (!product.details) return false
    const productCategory = product.details.category || "uncategorized"
    const productPrice = product.details.price && product.details.price.amount ? product.details.price.amount : 0
    const productName = product.details.productname || ""
    const productDescription = product.details.description || ""
    const matchesCategory = selectedCategory === "all" || productCategory === selectedCategory
    const matchesPrice = productPrice >= priceRange.min && productPrice <= priceRange.max
    const matchesSearch =
      productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      productDescription.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesPrice && matchesSearch
  })

  // Enhanced Cart functions - Groups specifications under main products
  // MODIFICATION 1: Replace the existing addToCart function (around line 107)
  
      const addToCart = (specificationProduct, mainProduct, quantity = 1) => {
        console.log("Specification Product:", specificationProduct)
        console.log("Main Product:", mainProduct)

        // CHANGED: Use product names instead of IDs
        const mainProductName = mainProduct.details?.productname || "Unnamed Product"
        const specificationName = specificationProduct.details?.productname || "Default Specification"

        // Find if main product already exists in cart BY NAME
        const existingMainProduct = cart.find((item) => item.mainProductName === mainProductName)

        if (existingMainProduct) {
          // Check if this specific specification already exists under this main product BY NAME
          const existingSpec = existingMainProduct.specifications.find((spec) => spec.name === specificationName)

          if (existingSpec) {
            // Increase quantity of existing specification
            setCart(
              cart.map((item) =>
                item.mainProductName === mainProductName
                  ? {
                      ...item,
                      specifications: item.specifications.map((spec) =>
                        spec.name === specificationName ? { ...spec, quantity: spec.quantity + quantity } : spec,
                      ),
                    }
                  : item,
              ),
            )
          } else {
            // Add new specification to existing main product
            const newSpecification = {
              name: specificationName, // CHANGED: Use name as primary identifier
              data: specificationProduct,
              quantity: quantity,
              price: specificationProduct.details?.price?.amount || 0,
              images: specificationProduct.images || [],
            }

            setCart(
              cart.map((item) =>
                item.mainProductName === mainProductName
                  ? {
                      ...item,
                      specifications: [...item.specifications, newSpecification],
                    }
                  : item,
              ),
            )
          }
        } else {
          // Create new main product entry with first specification
          const newCartItem = {
            mainProductName: mainProductName, // CHANGED: Use name as primary identifier
            mainProduct: mainProduct,
            productName: mainProductName, // Keep this for consistency
            mainProductImages: mainProduct.images || [],
            specifications: [
              {
                name: specificationName, // CHANGED: Use name as primary identifier
                data: specificationProduct,
                quantity: quantity,
                price: specificationProduct.details?.price?.amount || 0,
                images: specificationProduct.images || [],
              },
            ],
          }

          setCart([...cart, newCartItem])
        }
        
        // Show cart after adding item
        setIsCartOpen(true)
        
        // CHANGED: Animation now uses product name for element ID
        const productElement = document.getElementById(`product-${mainProductName.replace(/\s+/g, '-').toLowerCase()}`)
        if (productElement) {
          productElement.classList.add("market-added-to-cart")
          setTimeout(() => {
            productElement.classList.remove("market-added-to-cart")
          }, 1000)
        }
      }

  // MODIFICATION 2: Replace the existing removeFromCart function (around line 170)
  const removeFromCart = (mainProductName, specificationName = null) => {
    if (specificationName) {
      // Remove specific specification from main product BY NAME
      setCart(
        cart
          .map((item) => {
            if (item.mainProductName === mainProductName) {
              const updatedSpecs = item.specifications.filter((spec) => spec.name !== specificationName)
              // If no specifications left, remove the entire main product
              return updatedSpecs.length > 0 ? { ...item, specifications: updatedSpecs } : null
            }
            return item
          })
          .filter(Boolean),
      ) // Remove null entries
    } else {
      // Remove entire main product BY NAME
      setCart(cart.filter((item) => item.mainProductName !== mainProductName))
    }
  }

  // MODIFICATION 3: Replace the existing updateQuantity function (around line 190)
  const updateQuantity = (mainProductName, specificationName, newQuantity) => {
    const intQuantity = Math.max(1, newQuantity)
    if (intQuantity < 1) {
      removeFromCart(mainProductName, specificationName)
      return
    }
    setCart(
      cart.map((item) =>
        item.mainProductName === mainProductName
          ? {
              ...item,
              specifications: item.specifications.map((spec) =>
                spec.name === specificationName ? { ...spec, quantity: intQuantity } : spec,
              ),
            }
          : item,
      ),
    )
  }

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => {
    const itemTotal = item.specifications.reduce((specTotal, spec) => {
      return specTotal + spec.price * spec.quantity
    }, 0)
    return total + itemTotal
  }, 0)

  // Open product detail modal
  const openProductModal = (product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
    setActiveImageIndex(0)
    setShowVideo(false)
    setQuantity(1)
  }

  // Close product detail modal
  const closeProductModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  // Enhance the existing openImageModal function
  const openImageModal = (imageUrl, index) => {
    setFullScreenImage(imageUrl)
    setImageModalOpen(true)
    setActiveImageIndex(index)
    // Pause video if it's playing
    if (showVideo) {
      setShowVideo(false)
    }
  }

  // Close full screen image modal
  const closeImageModal = () => {
    setImageModalOpen(false)
  }

  // Function to change active image in the modal
  const changeActiveImage = (index) => {
    setActiveImageIndex(index)
    setShowVideo(false)
    // Update fullScreenImage in case it's used elsewhere
    if (selectedProduct && selectedProduct.images && selectedProduct.images[index]) {
      setFullScreenImage(selectedProduct.images[index].url)
    }
  }

  // Function to toggle video view
  const toggleVideo = () => {
    setShowVideo(!showVideo)
  }

  // Navigate to previous slide
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length)
  }

  // Navigate to next slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)
  }

  // Toggle cart sidebar
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
  }

  // Format price in Philippine Peso
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price || 0)
  }

  // Navigate to next image in full screen mode
  const nextImage = () => {
    if (!selectedProduct) return
    const images = selectedProduct.images || []
    if (images.length === 0) return

    const nextIndex = (activeImageIndex + 1) % images.length
    setActiveImageIndex(nextIndex)
    setFullScreenImage(images[nextIndex].url) // Add .url here
    setShowVideo(false)
  }

  // Navigate to previous image in full screen mode
  const prevImage = () => {
    if (!selectedProduct) return
    const images = selectedProduct.images || []
    if (images.length === 0) return

    const prevIndex = (activeImageIndex - 1 + images.length) % images.length
    setActiveImageIndex(prevIndex)
    setFullScreenImage(images[prevIndex].url)
    setShowVideo(false) // Ensure we're in image mode, not video mode
  }

  // Show loading skeleton if products are still loading
  if (loadingState.products) {
    return (
      <div className="market-container">
        <h2 className="market-title">Market</h2>
        <div className="market-loading-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="market-product-skeleton">
              <div className="market-image-skeleton"></div>
              <div className="market-title-skeleton"></div>
              <div className="market-price-skeleton"></div>
              <div className="market-button-skeleton"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="market-container">

      {/*Marketing Carousel Header 
      <div className="market-carousel-container">
        <div className="market-carousel-track" ref={carouselRef}>
          {carouselSlides.map((slide, index) => (
            <div key={index} className="market-carousel-slide">
              <div className="market-carousel-image-container">
                <img
                  src={slide.image || "/placeholder.svg?height=600&width=1200"}
                  alt={slide.title}
                  className="market-carousel-image"
                />
                <div className="market-carousel-content">
                  <h2 className="market-carousel-title">{slide.title}</h2>
                  <p className="market-carousel-description">{slide.description}</p>
                  <a href={slide.buttonLink} className="market-carousel-button">
                    {slide.buttonText}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          className="market-carousel-control market-carousel-prev"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <ChevronLeft className="market-carousel-control-icon" />
        </button>
        <button className="market-carousel-control market-carousel-next" onClick={nextSlide} aria-label="Next slide">
          <ChevronRight className="market-carousel-control-icon" />
        </button>
        <div className="market-carousel-indicators">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              className={`market-carousel-indicator ${currentSlide === index ? "market-active" : ""}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>*/}

      <header className="market-header">
        <div className="market-logo">
          <button id="market-backbutton"
                  onClick={()=> {
                    navigate('/omsiapmarket')
                  }}>&#8592;</button>
        </div>
        <div className="market-search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search products"
          />
        </div>
        <div className="market-cart-icon">
          <button onClick={toggleCart} aria-label="Open cart">
            <ShoppingCart />
            <span className="market-cart-count">
              {cart.reduce(
                (total, item) => total + item.specifications.reduce((specTotal, spec) => specTotal + spec.quantity, 0),
                0,
              )}
            </span>
          </button>
        </div>
      </header>

      <main className="market-main-content">
        <aside className="market-filters-sidebar">
          <div className="market-filter-section">
            <h3>Categories</h3>
            <div className="market-category-filters">
              <button
                className={selectedCategory === "all" ? "market-active" : ""}
                onClick={() => setSelectedCategory("all")}
              >
                All Products
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  className="market-productcategory"
                  className={selectedCategory === category ? "market-active" : ""}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)} 
                </button>
              ))}
            </div>
          </div>
          <div className="market-filter-section">
            <h3>Price Range</h3>
            <div className="market-price-filter">
              <span>{formatPrice(priceRange.min)}</span>
              <input
                type="range"
                min="0"
                max="50000"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: Number.parseInt(e.target.value) })}
                aria-label="Maximum price"
              />
              <span>{formatPrice(priceRange.max)}</span>
            </div>
          </div>
        </aside>

        <section className="market-products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const productId = product.authentications && product.authentications.id ? product.authentications.id : ""
              const productName =
                product.details && product.details.productname ? product.details.productname : "Unnamed Product"
              const productPrice =
                product.details && product.details.price && product.details.price.amount
                  ? product.details.price.amount
                  : 0
              const productCategory =
                product.details && product.details.category ? product.details.category : "Uncategorized"
              const productRating =
                product.customerfeedback && product.customerfeedback.rating ? product.customerfeedback.rating : 0
              const productReviews =
                product.customerfeedback && product.customerfeedback.reviews ? product.customerfeedback.reviews : 0
              const productImages =
                product.images && product.images.length > 0
                  ? product.images.map((img) => img.url)
                  : ["/placeholder.svg?height=400&width=400"]

              return (
               <div key={productName} // CHANGED: Use productName instead of productId
                    id={`product-${productName.replace(/\s+/g, '-').toLowerCase()}`} // CHANGED: Use productName for ID
                    className="market-product-card">
                  <div className="market-product-image">
                    <img
                      src={productImages[0] || "/placeholder.svg?height=400&width=400"}
                      alt={productName}
                      onClick={() => openImageModal(productImages[0], 0)}
                    />
                    <button className="market-wishlist-button" aria-label="Add to wishlist">
                      <Heart />
                    </button>
                  </div>
                  <div className="market-product-info">
                    <h3 style={{color:'white'}}>{productName}</h3>
                    <p className="market-product-price">{formatPrice(productPrice)}</p>
                    <p className="market-product-category">{productCategory}</p>
                    <div className="market-product-rating">
                      <div className="market-stars">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`market-star ${i < Math.floor(productRating) ? "market-filled" : ""} ${
                              i === Math.floor(productRating) && productRating % 1 >= 0.5 ? "market-half-filled" : ""
                            }`}
                          />
                        ))}
                      </div>
                      <span className="market-review-count">({productReviews})</span>
                    </div>
                  </div>
                  <div className="market-product-actions">
                    <button onClick={() => openProductModal(product)} className="market-view-details">
                      <Info size={16} />
                      View Details
                    </button>
                  </div>
                  {/* Highlight if product has specifications */}
                  {product.details && product.details.specifications && product.details.specifications.length > 0 && (
                    <div className="market-product-badge">
                      <span>Specifications Available</span>
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div className="market-no-products">
              <p>No products match your current filters.</p>
              <button
                onClick={() => {
                  setSelectedCategory("all")
                  setPriceRange({ min: 0, max: 50000 })
                  setSearchQuery("")
                }}
                className="market-reset-filters"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Cart Sidebar */}
      <aside className={`market-cart-sidebar ${isCartOpen ? "market-open" : ""}`}>
        <div className="market-cart-header">
          <h2>Your Cart</h2>
          <button onClick={toggleCart} className="market-close-cart" aria-label="Close cart">
            <X />
          </button>
        </div>
        {cart.length > 0 ? (
          <>
            <div className="market-cart-items">
              {cart.map((item) => {
                const mainProductImages =
                  item.mainProductImages && item.mainProductImages.length > 0
                    ? item.mainProductImages.map((img) => img.url)
                    : ["/placeholder.svg?height=100&width=100"]
                return (
                  <div key={item.mainProductName} className="market-cart-main-product"> {/* CHANGED: Use mainProductName as key */}
                    {/* Main Product Header */}
                    <div className="market-cart-product-header">
                      <div className="market-cart-product-image">
                        <img
                          src={mainProductImages[0] || "/placeholder.svg?height=80&width=80"}
                          alt={item.productName}
                        />
                      </div>
                      <div className="market-cart-product-info">
                        <h4 className="market-cart-product-name">{item.productName}</h4>
                        {item.mainProduct?.details?.category && (
                          <p className="market-cart-category">
                            <small>Category: {item.mainProduct.details.category}</small>
                          </p>
                        )}
                        <p className="market-cart-spec-count">
                          <small>
                            {item.specifications.length} specification{item.specifications.length > 1 ? "s" : ""}{" "}
                            selected
                          </small>
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.mainProductName)} 
                        className="market-remove-main-product"
                        aria-label="Remove entire product"
                        title="Remove entire product"
                      >
                        <X className="market-remove-icon" />
                      </button>
                    </div>
                    {/* Specifications List */}
                    <div className="market-cart-specifications">
                      {item.specifications.map((spec) => {
                        const specImages =
                          spec.images && spec.images.length > 0 ? spec.images.map((img) => img.url) : mainProductImages
                        return (
                          <div key={spec.name} className="market-cart-specification"> {/* CHANGED: Use spec.name as key */}
                            <div className="market-cart-spec-image">
                              <img src={specImages[0] || "/placeholder.svg?height=60&width=60"} alt={spec.name} />
                            </div>
                            <div className="market-cart-spec-details">
                              <p className="market-cart-spec-name">{spec.name}</p>
                              <p className="market-cart-spec-price">{formatPrice(spec.price)}</p>
                              {spec.data?.details?.weightingrams && (
                                <p className="market-cart-weight">
                                  <small>Weight: {spec.data.details.weightingrams}g</small>
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => removeFromCart(item.mainProductName, spec.name)} 
                              className="market-remove-specification"
                              aria-label="Remove specification"
                              title="Remove this specification"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="market-cart-footer">
              <div className="market-cart-total">
                <h3>Total: {formatPrice(cartTotal)}</h3>
              </div>
             <button
                  className="market-checkout-button"
                  onClick={() => {
                    if (props.cartcb) {
                      props.cartcb(cart) // Cart now contains name-based structure
                      navigate("/placeorder", { state: { cart } })
                    }
                  }}
                >
                  <ShoppingBag size={16} />
                  Proceed Placing The Orders
                </button>
            </div>
          </>
        ) : (
          <div className="market-empty-cart">
            <ShoppingCart size={48} />
            <p>Your cart is empty.</p>
            <button onClick={toggleCart} className="market-continue-shopping">
              Continue Shopping
            </button>
          </div>
        )}
      </aside>

      {/* Product Detail Modal */}
      {isModalOpen && selectedProduct && (
        <div className="market-product-modal">
          <div className="market-modal-content" ref={modalRef}>
            <button onClick={closeProductModal} className="market-close-modal" aria-label="Close modal">
              X
            </button>
            <div className="market-modal-product-details">
              <div className="market-modal-product-media">
                <div className="market-modal-media-main">
                  {showVideo && selectedProduct.videos && selectedProduct.videos.length > 0 ? (
                    <div className="market-product-video-container">
                      {(() => {
                        const videoUrl = selectedProduct.videos[0].url
                        console.log("Video URL:", videoUrl)
                        console.log("Show Video:", showVideo)

                        // Check if it's a YouTube URL
                        if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
                          // Convert YouTube URL to embed format
                          let embedUrl = videoUrl
                          if (videoUrl.includes("youtube.com/watch?v=")) {
                            const videoId = videoUrl.split("v=")[1].split("&")[0]
                            embedUrl = `https://www.youtube.com/embed/${videoId}`
                          } else if (videoUrl.includes("youtu.be/")) {
                            const videoId = videoUrl.split("youtu.be/")[1].split("?")[0]
                            embedUrl = `https://www.youtube.com/embed/${videoId}`
                          }

                          return (
                            <iframe
                              src={embedUrl}
                              title="Product Video"
                              className="market-product-video"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              style={{ width: "100%", height: "400px", borderRadius: "8px" }}
                            />
                          )
                        } else {
                          // For regular video files
                          return (
                            <video
                              src={videoUrl}
                              controls
                              poster={
                                selectedProduct.images && selectedProduct.images.length > 0
                                  ? selectedProduct.images[0].url
                                  : "/placeholder.svg?height=400&width=400"
                              }
                              className="market-product-video"
                              style={{ width: "100%", height: "400px", borderRadius: "8px" }}
                            >
                              Your browser does not support the video tag.
                            </video>
                          )
                        }
                      })()}
                    </div>
                  ) : (
                    <img
                      src={
                        selectedProduct.images && selectedProduct.images.length > 0
                          ? selectedProduct.images[activeImageIndex].url
                          : "/placeholder.svg?height=400&width=400"
                      }
                      alt={`${selectedProduct.details ? selectedProduct.details.productname : "Product"} - view ${activeImageIndex + 1}`}
                      className="market-modal-main-image"
                      onClick={() =>
                        openImageModal(
                          selectedProduct.images && selectedProduct.images.length > 0
                            ? selectedProduct.images[activeImageIndex].url
                            : "/placeholder.svg?height=400&width=400",
                          activeImageIndex,
                        )
                      }
                    />
                  )}
                </div>
                <div className="market-modal-media-thumbnails">
                  {selectedProduct.images &&
                    selectedProduct.images.map((image, index) => (
                      <img
                        key={index}
                        src={image.url || "/placeholder.svg?height=100&width=100"}
                        alt={`Thumbnail ${index + 1}`}
                        className={!showVideo && activeImageIndex === index ? "market-active" : ""}
                        onClick={() => changeActiveImage(index)}
                      />
                    ))}
                  {selectedProduct.videos && selectedProduct.videos.length > 0 && (
                    <button
                      className={`market-video-thumbnail ${showVideo ? "market-active" : ""}`}
                      onClick={toggleVideo}
                      aria-label="Show video"
                    >
                      <Play className="market-video-icon" />
                      <span>Video</span>
                    </button>
                  )}
                </div>
              </div>
              <a style={{marginLeft: "auto", marginRight: "auto", color: "dodgerblue"}} href={selectedProduct.videos[0].url}>Click here if the product video won't play</a>
              <div className="market-modal-product-info">
                <h2>{selectedProduct.details ? selectedProduct.details.productname : "Product"} </h2>
                <div className="market-modal-product-meta">
                  <p className="market-modal-product-price">
                    {formatPrice(
                      selectedProduct.details && selectedProduct.details.price
                        ? selectedProduct.details.price.amount
                        : 0,
                    )}
                  </p>
                  <div className="market-modal-product-rating">
                    <div className="market-stars">
                      {[...Array(5)].map((_, i) => {
                        const rating = selectedProduct.customerfeedback ? selectedProduct.customerfeedback.rating : 0
                        return (
                          <Star
                            key={i}
                            className={`market-star ${i < Math.floor(rating) ? "market-filled" : ""} ${
                              i === Math.floor(rating) && rating % 1 >= 0.5 ? "market-half-filled" : ""
                            }`}
                          />
                        )
                      })}
                    </div>
                    <span className="market-review-count">
                      {selectedProduct.customerfeedback ? selectedProduct.customerfeedback.reviews : 0} reviews
                    </span>
                  </div>
                </div>
                <div className="market-modal-product-description">
                  <h3>Description</h3>
                  <p>{selectedProduct.details ? selectedProduct.details.description : ""}</p>
                </div>
                <div className="market-modal-product-features">
                  <h3>Key Features</h3>
                  <ul>
                    {selectedProduct.details && selectedProduct.details.features ? (
                      selectedProduct.details.features.map((feature, index) => <li key={index}>{feature.data}</li>)
                    ) : (
                      <li>No features available</li>
                    )}
                  </ul>
                </div>
                {/* Specifications Section - Highlighted */}
                {selectedProduct.details &&
                  selectedProduct.details.specifications &&
                  selectedProduct.details.specifications.length > 0 && (
                    <div className="market-modal-product-specs">
                      <h3>Specifications</h3>
                      <div className="market-specs-container">
                        {selectedProduct.details.specifications.map((spec, index) => (
                          <div key={index} className="market-spec-item">
                            <div className="market-spec-header">
                              <h4>{spec.details ? spec.details.productname : `Specification ${index + 1}`}</h4>
                            </div>
                            <br />
                            {spec.system.stocks < 1 ? (
                              <p>
                                Cannot add to cart: <span style={{ color: "tomato" }}>Out of stocks</span>
                              </p>
                            ) : (
                              <button
                                className="market-add-spec-to-cart"
                                onClick={() => addToCart(spec, selectedProduct)}
                              >
                                <Plus size={14} />
                                Add to Cart
                              </button>
                            )}

                            <br />
                            <div className="market-spec-details">
                              <p>DESCRIPTION</p>
                              <p>{spec.details ? spec.details.description : ""}</p>
                              <p>CATEGORY</p>
                              <p>{spec.details.category}</p>
                              <p>FEATURES</p>
                              <ul>
                                {spec.details.features.map((features, featuresindx) => (
                                  <li key={featuresindx}>{features.data}</li>
                                ))}
                              </ul>
                              <p>WEIGHT</p>
                              <p>Weight in grams: {spec.details.weightingrams} grams</p>
                              <p>FOR</p>
                              <p>For age {spec.details.for.age}</p>
                              <p>For {spec.details.for.part}</p>
                              <p>For all {spec.details.for.gender} genders </p>
                              <p>Reminder: {spec.details.for.reminder}</p>
                              <p>PRICE</p>
                              <p className="market-spec-price">
                                {formatPrice(spec.details && spec.details.price ? spec.details.price.amount : 0)}
                              </p>
                              <p>
                                TRANSACTION GIVE AWAY TO BE SHARED AMONG MONTHLY FINANCIAL ALLOCATION TO INDIVIDUAL
                                PEOPLE ( MFATIP ) USERS
                              </p>
                              <p>&#8369;{spec.details.price.transactiongiveaway}</p>
                              <p>STOCKS</p>
                              <p>Stocks: {spec.system.stocks}</p>
                              <div className="market-spec-images">
                                {spec.images.map((specImage, specImageIndex) => {
                                  return (
                                    <img
                                      key={specImageIndex}
                                      className="specimages"
                                      src={specImage.url || "/placeholder.svg"}
                                      alt="Product Specification Image"
                                      onClick={() => openImageModal(specImage.url, 0)}
                                      style={{ cursor: "pointer" }}
                                    />
                                  )
                                })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                <div className="market-modal-product-warranty">
                  <h3>Warranty Information</h3>
                  <p>
                    {selectedProduct.details ? selectedProduct.details.warranty : "No warranty information available"}
                  </p>
                </div>
                <div className="market-modal-product-actions">
                  <button className="market-modal-wishlist">
                    <Heart size={16} />
                    Add to Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Full Screen Image Modal */}
      {imageModalOpen && (
        <div className="market-fullscreen-modal">
          <div className="market-fullscreen-modal-content" ref={imageModalRef}>
            <button
              onClick={closeImageModal}
              className="market-close-fullscreen-modal"
              aria-label="Close fullscreen view"
            >
              <X size={24} />
            </button>
            <div className="market-fullscreen-image-container">
              <button
                onClick={prevImage}
                className="market-fullscreen-nav market-prev-image"
                aria-label="Previous image"
              >
                <ChevronLeft size={36} />
              </button>
              <img
                src={fullScreenImage || "/placeholder.svg?height=800&width=800"}
                alt="Full screen view"
                className="market-fullscreen-image"
              />
              <button onClick={nextImage} className="market-fullscreen-nav market-next-image" aria-label="Next image">
                <ChevronRight size={36} />
              </button>
            </div>
            <div className="market-fullscreen-image-counter">
              {selectedProduct && selectedProduct.images && (
                <span>
                  {activeImageIndex + 1} / {selectedProduct.images.length}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Video Modal */}
      {fullScreenVideo && selectedProduct && selectedProduct.videos && selectedProduct.videos.length > 0 && (
        <div className="market-fullscreen-modal">
          <div className="market-fullscreen-modal-content">
            <button
              onClick={() => setFullScreenVideo(false)}
              className="market-close-fullscreen-modal"
              aria-label="Close fullscreen video"
            >
              <X size={24} />
            </button>
            <div className="market-fullscreen-video-container">
              {(() => {
                const videoUrl = selectedProduct.videos[0].url
                if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
                  let embedUrl = videoUrl
                  if (videoUrl.includes("youtube.com/watch?v=")) {
                    const videoId = videoUrl.split("v=")[1].split("&")[0]
                    embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`
                  } else if (videoUrl.includes("youtu.be/")) {
                    const videoId = videoUrl.split("youtu.be/")[1].split("?")[0]
                    embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`
                  }

                  return (
                    <iframe
                      src={embedUrl}
                      title="Product Video Fullscreen"
                      className="market-fullscreen-video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )
                } else {
                  return (
                    <video src={videoUrl} controls autoPlay className="market-fullscreen-video">
                      Your browser does not support the video tag.
                    </video>
                  )
                }
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Image Modal */}
      {imageModalOpen && (
        <div className="market-image-modal">
          <button onClick={closeImageModal} className="market-close-image-modal" aria-label="Close image">
            <X size={20} />
          </button>
          <div className="market-fullscreen-image-container">
            <button onClick={prevImage} className="market-image-nav market-prev-image" aria-label="Previous image">
              <ChevronLeft />
            </button>
            <img
              src={fullScreenImage || "/placeholder.svg?height=800&width=800"}
              alt="Full screen view"
              className="market-fullscreen-image"
            />
            <button onClick={nextImage} className="market-image-nav market-next-image" aria-label="Next image">
              <ChevronRight />
            </button>
          </div>
          <div className="market-image-counter">
            {selectedProduct && selectedProduct.images && (
              <span>
                {activeImageIndex + 1} / {selectedProduct.images.length}
              </span>
            )}
          </div>
        </div>
      )}

      <Footer />

    </div>
  )
}

export default Market