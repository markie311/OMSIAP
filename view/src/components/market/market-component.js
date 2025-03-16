import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight, ShoppingCart, Search, Star, X, Play } from "lucide-react"

import "../../styles/market/market.scss";

const Market = (props) => {
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 }) // Adjusted for Peso
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [showVideo, setShowVideo] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const carouselRef = useRef(null)
  const autoplayRef = useRef(null)

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

  // Sample product data - replace with your API call
  useEffect(() => {
    // Simulating API fetch
    const fetchProducts = () => {
      const sampleProducts = [
        {
          id: 1,
          name: "Premium Headphones",
          price: 14999.99,  // Converted to Peso
          category: "electronics",
          description: "High-quality noise-cancelling headphones with premium sound.",
          weightingrams: 1000,
          images: [
            "../images/market/products/watch.jpg",
            "../images/market/products/watch.jpg",
            "../images/market/products/watch.jpg",
          ],
          stock: 15,
          rating: 4.8,
          reviews: 127,
          specifications: [
            { name: "Battery Life", value: "30 hours" },
            { name: "Noise Cancellation", value: "Active" },
            { name: "Connectivity", value: "Bluetooth 5.0" },
            { name: "Weight", value: "250g" },
          ],
          videoUrl: "/placeholder.svg?height=400&width=400", // Placeholder for video URL
          features: [
            "Active noise cancellation",
            "Transparency mode",
            "Spatial audio",
            "Voice assistant compatibility",
          ],
          warranty: "2 years manufacturer warranty",
          quantity: 0,         
          focuseddata: {
            price: {
                price: 60,
                capital: 57,
                transactiongiveaway: 2,
                omsiapprofit: 1
            }
          },
          orderdetails: { 
            quantity: 0,
            product: {
              price: 0,
              capital: 0,
              transactiongiveaway: 0,
              omsiapprofit: 0,
            },
            shipment: {
              totalkilos: 0,
              totalshipmentfee: 0
            }
          }
        },
        {
          id: 2,
          name: "Designer Watch",
          price: 9999.99,  // Converted to Peso
          category: "accessories",
          description: "Elegant timepiece with leather strap and Swiss movement.",
          weightingrams: 1000,
          images: [
           "../images/market/products/watch.jpg",
            "../images/market/products/watch.jpg",
            "../images/market/products/watch.jpg",
          ],
          stock: 8,
          rating: 4.5,
          reviews: 84,
          specifications: [
            { name: "Movement", value: "Swiss Quartz" },
            { name: "Water Resistance", value: "50 meters" },
            { name: "Case Material", value: "Stainless Steel" },
            { name: "Band Material", value: "Genuine Leather" },
          ],
          videoUrl: "/placeholder.svg?height=400&width=400",
          features: ["Luminous hands", "Sapphire crystal glass", "Date display", "Chronograph function"],
          warranty: "1 year limited warranty",
          quantity: 0, 
          focuseddata: {
            price: {
                price: 60,
                capital: 57,
                transactiongiveaway: 2,
                omsiapprofit: 1
            }
          },
          orderdetails: { 
            quantity: 0,
            product: {
              price: 0,
              capital: 0,
              transactiongiveaway: 0,
              omsiapprofit: 0,
            },
            shipment: {
              totalkilos: 0,
              totalshipmentfee: 0
            }
          }
        },
        {
          id: 3,
          name: "Wireless Earbuds",
          price: 7499.99,  // Converted to Peso
          category: "electronics",
          description: "True wireless earbuds with long battery life and water resistance.",
          weightingrams: 1000,
          images: [
            "../images/market/products/watch.jpg",
            "../images/market/products/watch.jpg",
            "../images/market/products/watch.jpg",
          ],
          stock: 20,
          rating: 4.3,
          reviews: 156,
          specifications: [
            { name: "Battery Life", value: "8 hours (28 with case)" },
            { name: "Water Resistance", value: "IPX7" },
            { name: "Connectivity", value: "Bluetooth 5.2" },
            { name: "Charging", value: "USB-C & Wireless" },
          ],
          videoUrl: "/placeholder.svg?height=400&width=400",
          features: ["Touch controls", "Active noise cancellation", "Ambient sound mode", "Auto-pause when removed"],
          warranty: "1 year warranty",
          quantity: 0, 
          focuseddata: {
            price: {
                price: 60,
                capital: 57,
                transactiongiveaway: 2,
                omsiapprofit: 1
            }
          },
          orderdetails: { 
            quantity: 0,
            product: {
              price: 0,
              capital: 0,
              transactiongiveaway: 0,
              omsiapprofit: 0,
            },
            shipment: {
              totalkilos: 0,
              totalshipmentfee: 0
            }
          }
        },
        {
          id: 4,
          name: "Leather Wallet",
          price: 2999.99,  // Converted to Peso
          category: "accessories",
          description: "Genuine leather wallet with RFID protection.",
          weightingrams: 1000,
          images: [
            "../images/market/products/watch.jpg",
            "../images/market/products/watch.jpg",
            "../images/market/products/watch.jpg",
          ],
          stock: 25,
          rating: 4.2,
          reviews: 63,
          specifications: [
            { name: "Material", value: "Full-grain Leather" },
            { name: "Card Slots", value: "8" },
            { name: "Dimensions", value: '4.5" x 3.5"' },
            { name: "RFID Protection", value: "Yes" },
          ],
          videoUrl: "/placeholder.svg?height=400&width=400",
          features: ["RFID blocking technology", "Multiple card slots", "Bill compartment", "ID window"],
          warranty: "1 year warranty",
          quantity: 0, 
          focuseddata: {
            price: {
                price: 60,
                capital: 57,
                transactiongiveaway: 2,
                omsiapprofit: 1
            }
          },
          orderdetails: { 
            quantity: 0,
            product: {
              price: 0,
              capital: 0,
              transactiongiveaway: 0,
              omsiapprofit: 0,
            },
            shipment: {
              totalkilos: 0,
              totalshipmentfee: 0
            }
          }
        },
        {
          id: 5,
          name: "Smart Speaker",
          price: 6499.99,  // Converted to Peso
          category: "electronics",
          description: "Voice-controlled smart speaker with premium sound quality.",
          weightingrams: 1000,
          images: [
            "../images/market/products/watch.jpg",
            "../images/market/products/watch.jpg",
            "../images/market/products/watch.jpg",
          ],
          stock: 12,
          rating: 4.6,
          reviews: 92,
          specifications: [
            { name: "Connectivity", value: "Wi-Fi, Bluetooth" },
            { name: "Power", value: "30W" },
            { name: "Voice Assistant", value: "Multiple platform support" },
            { name: "Microphones", value: "6 far-field mics" },
          ],
          videoUrl: "/placeholder.svg?height=400&width=400",
          features: ["Multi-room audio", "Voice control", "Smart home integration", "Audio streaming"],
          warranty: "1 year limited warranty",
          quantity: 0, 
          focuseddata: {
            price: {
                price: 60,
                capital: 57,
                transactiongiveaway: 2,
                omsiapprofit: 1
            }
          },
          orderdetails: { 
            quantity: 0,
            product: {
              price: 0,
              capital: 0,
              transactiongiveaway: 0,
              omsiapprofit: 0,
            },
            shipment: {
              totalkilos: 0,
              totalshipmentfee: 0
            }
          }
        },
        {
          id: 6,
          name: "Sunglasses",
          price: 4499.99,  // Converted to Peso
          category: "accessories",
          description: "Polarized sunglasses with UV protection.",
          weightingrams: 1000,
          images: [
           "../images/market/products/watch.jpg",
            "../images/market/products/watch.jpg",
            "../images/market/products/watch.jpg",
          ],
          stock: 18,
          rating: 4.1,
          reviews: 47,
          specifications: [
            { name: "Frame Material", value: "Acetate" },
            { name: "Lens Material", value: "Polarized Glass" },
            { name: "UV Protection", value: "100%" },
            { name: "Weight", value: "25g" },
          ],
          videoUrl: "/placeholder.svg?height=400&width=400",
          features: ["Polarized lenses", "UV400 protection", "Lightweight design", "Spring hinges"],
          warranty: "6 months warranty",
          quantity: 0, 
          focuseddata: {
            price: {
                price: 60,
                capital: 57,
                transactiongiveaway: 2,
                omsiapprofit: 1
            }
          },
          orderdetails: { 
            quantity: 0,
            product: {
              price: 0,
              capital: 0,
              transactiongiveaway: 0,
              omsiapprofit: 0,
            },
            shipment: {
              totalkilos: 0,
              totalshipmentfee: 0
            }
          }
        }
      ]

      setProducts(sampleProducts)

      // Extract unique categories
      const uniqueCategories = [...new Set(sampleProducts.map((product) => product.category))]
      setCategories(uniqueCategories)
    }

    fetchProducts()
  }, [])

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
  }, [])

  // Update carousel position when slide changes
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(-${currentSlide * 100}%)`
    }
  }, [currentSlide])

  // Filter products based on selected category and price range
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesPrice && matchesSearch
  })

  // Cart functions
  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find((item) => item.id === product.id)

    if (existingItem) {
      // Increase quantity if already in cart - using integer quantities
      setCart(cart.map((item) => 
        item.id === product.id 
          ? { 
              ...item, 
              quantity: item.quantity + quantity 
            } 
          : item
      ))
    } else {
      // Add new item to cart
      setCart([...cart, { ...product, quantity: quantity }])
    }
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId, newQuantity) => {
    // Use integer quantities
    const intQuantity = Math.max(1, newQuantity)
    
    if (intQuantity < 1) {
      removeFromCart(productId)
      return
    }

    setCart(cart.map((item) => 
      item.id === productId 
        ? { ...item, quantity: intQuantity } 
        : item
    ))
  }

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => {
    return total + (item.price * item.quantity)
  }, 0).toFixed(2)

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

  // Function to change active image in the modal
  const changeActiveImage = (index) => {
    setActiveImageIndex(index)
    setShowVideo(false)
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
    const cartSidebar = document.getElementById("cart-sidebar")
    if (cartSidebar) {
      cartSidebar.classList.toggle("open")
    }
  }

  // Format price in Philippine Peso
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  return (
    <div className="ecommerce-app">
      {/* Marketing Carousel Header */}
      <div className="carousel-container">
        <div className="carousel-track" ref={carouselRef}>
          {carouselSlides.map((slide, index) => (
            <div key={index} className="carousel-slide">
              <div className="carousel-image-container">
                <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="carousel-image" />
                <div className="carousel-content">
                  <h2 className="carousel-title">{slide.title}</h2>
                  <p className="carousel-description">{slide.description}</p>
                  <a href={slide.buttonLink} className="carousel-button">
                    {slide.buttonText}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="carousel-control carousel-prev" onClick={prevSlide} aria-label="Previous slide">
          <ChevronLeft className="carousel-control-icon" />
        </button>
        <button className="carousel-control carousel-next" onClick={nextSlide} aria-label="Next slide">
          <ChevronRight className="carousel-control-icon" />
        </button>

        <div className="carousel-indicators">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              className={`carousel-indicator ${currentSlide === index ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <header className="header">
        <div className="logo">
          <h1>ShopEase</h1>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search products"
          />
          <Search className="search-icon" />
        </div>
        <div className="cart-icon">
          <button onClick={toggleCart} aria-label="Open cart">
            <ShoppingCart />
            <span className="cart-count">{cart.reduce((total, item) => total + item.quantity, 0)}</span>
          </button>
        </div>
      </header>

      <main className="main-content">
        <aside className="filters-sidebar">
          <div className="filter-section">
            <h3>Categories</h3>
            <div className="category-filters">
              <button className={selectedCategory === "all" ? "active" : ""} onClick={() => setSelectedCategory("all")}>
                All Products
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  className={selectedCategory === category ? "active" : ""}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Price Range</h3>
            <div className="price-filter">
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

        <section className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.images[0] || "/placeholder.svg"} alt={product.name} />
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-price">{formatPrice(product.price)}</p>
                  <p className="product-category">{product.category}</p>
                  <div className="product-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`star ${i < Math.floor(product.rating) ? "filled" : ""} ${
                            i === Math.floor(product.rating) && product.rating % 1 >= 0.5 ? "half-filled" : ""
                          }`}
                        />
                      ))}
                    </div>
                    <span className="review-count">({product.reviews})</span>
                  </div>
                </div>
                <div className="product-actions">
                  <button onClick={() => openProductModal(product)} className="view-details">
                    View Details
                  </button>
                  <button onClick={() => addToCart(product)} className="add-to-cart">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-products">
              <p>No products match your current filters.</p>
              <button
                onClick={() => {
                  setSelectedCategory("all")
                  setPriceRange({ min: 0, max: 50000 })
                  setSearchQuery("")
                }}
                className="reset-filters"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>
      </main>

      <aside id="cart-sidebar" className="cart-sidebar">
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button onClick={toggleCart} className="close-cart" aria-label="Close cart">
            <X />
          </button>
        </div>

        {cart.length > 0 ? (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.images[0] || "/placeholder.svg"} alt={item.name} />
                  </div>
                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    <p>{formatPrice(item.price)}</p>
                  </div>
                  <div className="cart-item-quantity">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span style={{color:"black"}}>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="remove-item" aria-label="Remove item">
                    <X className="remove-icon" />
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <div className="cart-total">
                <h3>Total: {formatPrice(cartTotal)}</h3>
              </div>
              <button
                className="checkout-button"
                onClick={() => {
                  if (props.cartcb) {
                    props.cartcb(cart)
                    navigate('/checkout', { state: { cart } });
                  }
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        ) : (
          <div className="empty-cart">
            <p>Your cart is empty.</p>
            <button onClick={toggleCart} className="continue-shopping">
              Continue Shopping
            </button>
          </div>
        )}
      </aside>

      {isModalOpen && selectedProduct && (
        <div className="market-product-modal">
          <div className="modal-content">
            <button onClick={closeProductModal} className="market-close-modal" aria-label="Close modal">
              <X color="black"/>
            </button>
            <div className="modal-product-details">
              <div className="modal-product-media">
                <div className="modal-media-main">
                  {showVideo ? (
                    <div className="product-video-container">
                      <video
                        src={selectedProduct.videoUrl}
                        controls
                        poster={selectedProduct.images[0]}
                        className="product-video"
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ) : (
                    <img
                      src={selectedProduct.images[activeImageIndex] || "/placeholder.svg"}
                      alt={`${selectedProduct.name} - view ${activeImageIndex + 1}`}
                      className="modal-main-image"
                    />
                  )}
                </div>
                <div className="modal-media-thumbnails">
                  {selectedProduct.images.map((image, index) => (
                    <img
                      key={index}
                      src={image || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      className={!showVideo && activeImageIndex === index ? "active" : ""}
                      onClick={() => changeActiveImage(index)}
                    />
                  ))}
                  <button
                    className={`video-thumbnail ${showVideo ? "active" : ""}`}
                    onClick={toggleVideo}
                    aria-label="Show video"
                  >
                    <Play className="video-icon" />
                  </button>
                </div>
              </div>
              <div className="modal-product-info">
                <h2>{selectedProduct.name}</h2>
                <div className="modal-product-meta">
                  <p className="modal-product-price">{formatPrice(selectedProduct.price)}</p>
                  <div className="modal-product-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`star ${i < Math.floor(selectedProduct.rating) ? "filled" : ""} ${
                            i === Math.floor(selectedProduct.rating) && selectedProduct.rating % 1 >= 0.5
                              ? "half-filled"
                              : ""
                          }`}
                        />
                      ))}
                    </div>
                    <span className="review-count">{selectedProduct.reviews} reviews</span>
                  </div>
                </div>
                <div className="modal-product-description">
                  <h3>Description</h3>
                  <p style={{color:"black"}}>{selectedProduct.description}</p>
                </div>

                <div className="modal-product-features">
                  <h3>Key Features</h3>
                  <ul>
                    {selectedProduct.features.map((feature, index) => (
                      <li key={index} style={{color:"black"}}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="modal-product-specs">
                  <h3>Specifications</h3>
                  <table>
                    <tbody>
                      {selectedProduct.specifications.map((spec, index) => (
                        <tr key={index}>
                          <td className="spec-name" style={{color:"black"}}>{spec.name}</td>
                          <td className="spec-value" style={{color:"black"}}>{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="modal-product-warranty">
                  <h3>Warranty Information</h3>
                  <p style={{color:"black"}}>{selectedProduct.warranty}</p>
                </div>

                <div className="modal-product-stock">
                  <p>
                    <span className={selectedProduct.stock > 0 ? "in-stock" : "out-of-stock"}>
                      {selectedProduct.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                    {selectedProduct.stock > 0 && `: ${selectedProduct.stock} units`}
                  </p>
                </div>

                <div className="modal-product-actions">
                  <div className="quantity-selector">
                    <label htmlFor="product-quantity">Quantity:</label>
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn"
                        onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <input
                        id="product-quantity"
                        type="number"
                        min="1"
                        step="1"
                        max={selectedProduct.stock}
                        value={quantity}
                        onChange={(e) => {
                          const inputValue = e.target.value === '' ? 1 : parseInt(e.target.value, 10);
                          const newQuantity = Math.min(
                            selectedProduct.stock, 
                            Math.max(1, inputValue)
                          );
                          setQuantity(newQuantity);
                        }}
                        aria-label="Product quantity"
                      />
                      <button
                        className="quantity-btn"
                        onClick={() => setQuantity((prev) => Math.min(selectedProduct.stock, prev + 1))}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      addToCart(selectedProduct, quantity)
                      closeProductModal()
                    }}
                    className="modal-add-to-cart"
                    disabled={selectedProduct.stock <= 0}
                  >
                    {selectedProduct.stock > 0 ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>ShopEase</h3>
            <p>Your one-stop shop for premium products at competitive prices.</p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">
                Facebook
              </a>
              <a href="#" aria-label="Twitter">
                Twitter
              </a>
              <a href="#" aria-label="Instagram">
                Instagram
              </a>
            </div>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">Shop</a>
              </li>
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Customer Service</h3>
            <ul>
              <li>
                <a href="#">FAQ</a>
              </li>
              <li>
                <a href="#">Shipping Policy</a>
              </li>
              <li>
                <a href="#">Returns & Refunds</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Newsletter</h3>
            <p>Subscribe to receive updates on new arrivals and special offers.</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Your email address" aria-label="Email for newsletter" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ShopEase. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}

export default Market
