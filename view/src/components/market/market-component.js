import '../../styles/market/market.scss';
// components/MarketingComponent.js
import React, { useState, useEffect, useCallback } from 'react';

import { useNavigate } from "react-router-dom";

// Sample product data
const initialProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 129.99,
    description: "Premium wireless headphones with noise cancellation and 30-hour battery life.",
    images: ["headphones-1.jpg", "headphones-2.jpg", "headphones-3.jpg"],
    category: "Electronics"
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 199.99,
    description: "Track your fitness, check notifications, and more with this stylish smartwatch.",
    images: ["smartwatch-1.jpg", "smartwatch-2.jpg"],
    category: "Electronics"
  },
  {
    id: 3,
    name: "Coffee Maker",
    price: 89.99,
    description: "Brew perfect coffee every morning with this programmable coffee maker.",
    images: ["coffeemaker-1.jpg", "coffeemaker-2.jpg", "coffeemaker-3.jpg"],
    category: "Home"
  },
  {
    id: 4,
    name: "Yoga Mat",
    price: 34.99,
    description: "Non-slip, eco-friendly yoga mat for your daily practice.",
    images: ["yogamat-1.jpg", "yogamat-2.jpg"],
    category: "Fitness"
  },
  {
    id: 5,
    name: "Desk Lamp",
    price: 49.99,
    description: "Adjustable LED desk lamp with multiple brightness levels and color temperatures.",
    images: ["lamp-1.jpg", "lamp-2.jpg"],
    category: "Home"
  },
  {
    id: 6,
    name: "Water Bottle",
    price: 24.99,
    description: "BPA-free insulated water bottle that keeps drinks cold for 24 hours.",
    images: ["bottle-1.jpg", "bottle-2.jpg"],
    category: "Fitness"
  }
];

const Market = (props) => {

  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const carouselSlides = [
    {
      image: '../images/market/products/watch.jpg',
      title: 'Spring Collection 2025',
      description: 'Discover our latest products with exclusive discounts for a limited time.',
      buttonText: 'Shop Now',
      buttonLink: '#spring-collection'
    },
    {
      image: '../images/market/products/watch.jpg',
      title: 'Premium Electronics',
      description: 'High-quality headphones, smartwatches, and more with 2-year warranty.',
      buttonText: 'Explore',
      buttonLink: '#electronics'
    },
    {
      image: '../images/market/products/watch.jpg',
      title: 'Free Shipping',
      description: 'Enjoy free shipping on all orders over $50. No coupon needed.',
      buttonText: 'Learn More',
      buttonLink: '#shipping'
    }
  ];

  // Sample product data - replace with your API call
  useEffect(() => {
    // Simulating API fetch
    const fetchProducts = () => {
      const sampleProducts = [
        {
          id: 1,
          name: 'Premium Headphones',
          price: 299.99,
          category: 'electronics',
          description: 'High-quality noise-cancelling headphones with premium sound.',
          images: ['../images/market/products/watch.jpg', '../images/market/products/watch.jpg', '../images/market/products/watch.jpg'],
          stock: 15,
          rating: 4.8,
          reviews: 127,
          specifications: [
            { name: 'Battery Life', value: '30 hours' },
            { name: 'Noise Cancellation', value: 'Active' },
            { name: 'Connectivity', value: 'Bluetooth 5.0' },
            { name: 'Weight', value: '250g' }
          ],
          videoUrl: '/api/placeholder/640/360', // Placeholder for video URL
          features: [
            'Active noise cancellation',
            'Transparency mode',
            'Spatial audio',
            'Voice assistant compatibility'
          ],
          warranty: '2 years manufacturer warranty'
        },
        {
          id: 2,
          name: 'Designer Watch',
          price: 199.99,
          category: 'accessories',
          description: 'Elegant timepiece with leather strap and Swiss movement.',
          images: ['../images/market/products/watch.jpg', '../images/market/products/watch.jpg', '../images/market/products/watch.jpg'],
          stock: 8,
          rating: 4.5,
          reviews: 84,
          specifications: [
            { name: 'Movement', value: 'Swiss Quartz' },
            { name: 'Water Resistance', value: '50 meters' },
            { name: 'Case Material', value: 'Stainless Steel' },
            { name: 'Band Material', value: 'Genuine Leather' }
          ],
          videoUrl: '/api/placeholder/640/360',
          features: [
            'Luminous hands',
            'Sapphire crystal glass',
            'Date display',
            'Chronograph function'
          ],
          warranty: '1 year limited warranty'
        },
        {
          id: 3,
          name: 'Wireless Earbuds',
          price: 149.99,
          category: 'electronics',
          description: 'True wireless earbuds with long battery life and water resistance.',
          images: ['../images/market/products/watch.jpg', '../images/market/products/watch.jpg', '../images/market/products/watch.jpg'],
          stock: 20,
          rating: 4.3,
          reviews: 156,
          specifications: [
            { name: 'Battery Life', value: '8 hours (28 with case)' },
            { name: 'Water Resistance', value: 'IPX7' },
            { name: 'Connectivity', value: 'Bluetooth 5.2' },
            { name: 'Charging', value: 'USB-C & Wireless' }
          ],
          videoUrl: '/api/placeholder/640/360',
          features: [
            'Touch controls',
            'Active noise cancellation',
            'Ambient sound mode',
            'Auto-pause when removed'
          ],
          warranty: '1 year warranty'
        },
        {
          id: 4,
          name: 'Leather Wallet',
          price: 59.99,
          category: 'accessories',
          description: 'Genuine leather wallet with RFID protection.',
          images: ['../images/market/products/watch.jpg', '../images/market/products/watch.jpg', '../images/market/products/watch.jpg'],
          stock: 25,
          rating: 4.2,
          reviews: 63,
          specifications: [
            { name: 'Material', value: 'Full-grain Leather' },
            { name: 'Card Slots', value: '8' },
            { name: 'Dimensions', value: '4.5" x 3.5"' },
            { name: 'RFID Protection', value: 'Yes' }
          ],
          videoUrl: '/api/placeholder/640/360',
          features: [
            'RFID blocking technology',
            'Multiple card slots',
            'Bill compartment',
            'ID window'
          ],
          warranty: '1 year warranty'
        },
        {
          id: 5,
          name: 'Smart Speaker',
          price: 129.99,
          category: 'electronics',
          description: 'Voice-controlled smart speaker with premium sound quality.',
          images: ['../images/market/products/watch.jpg', '../images/market/products/watch.jpg', '../images/market/products/watch.jpg'],
          stock: 12,
          rating: 4.6,
          reviews: 92,
          specifications: [
            { name: 'Connectivity', value: 'Wi-Fi, Bluetooth' },
            { name: 'Power', value: '30W' },
            { name: 'Voice Assistant', value: 'Multiple platform support' },
            { name: 'Microphones', value: '6 far-field mics' }
          ],
          videoUrl: '/api/placeholder/640/360',
          features: [
            'Multi-room audio',
            'Voice control',
            'Smart home integration',
            'Audio streaming'
          ],
          warranty: '1 year limited warranty'
        },
        {
          id: 6,
          name: 'Sunglasses',
          price: 89.99,
          category: 'accessories',
          description: 'Polarized sunglasses with UV protection.',
          images: ['../images/market/products/watch.jpg', '../images/market/products/watch.jpg', '../images/market/products/watch.jpg'],
          stock: 18,
          rating: 4.1,
          reviews: 47,
          specifications: [
            { name: 'Frame Material', value: 'Acetate' },
            { name: 'Lens Material', value: 'Polarized Glass' },
            { name: 'UV Protection', value: '100%' },
            { name: 'Weight', value: '25g' }
          ],
          videoUrl: '/api/placeholder/640/360',
          features: [
            'Polarized lenses',
            'UV400 protection',
            'Lightweight design',
            'Spring hinges'
          ],
          warranty: '6 months warranty'
        },
        {
          id: 7,
          name: 'Sunglasses',
          price: 89.99,
          category: 'accessories',
          description: 'Polarized sunglasses with UV protection.',
          images: ['../images/market/products/watch.jpg', '../images/market/products/watch.jpg', '../images/market/products/watch.jpg'],
          stock: 18,
          rating: 4.1,
          reviews: 47,
          specifications: [
            { name: 'Frame Material', value: 'Acetate' },
            { name: 'Lens Material', value: 'Polarized Glass' },
            { name: 'UV Protection', value: '100%' },
            { name: 'Weight', value: '25g' }
          ],
          videoUrl: '/api/placeholder/640/360',
          features: [
            'Polarized lenses',
            'UV400 protection',
            'Lightweight design',
            'Spring hinges'
          ],
          warranty: '6 months warranty'
        }
      ];

      setProducts(sampleProducts);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(sampleProducts.map(product => product.category))];
      setCategories(uniqueCategories);
    };

    fetchProducts();
  }, []);

  // Filter products based on selected category and price range
  const filteredProducts = products.filter(product => {

    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesPrice && matchesSearch;

  });

  // Cart functions
 // Cart functions
 const addToCart = (product) => {
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    // Increase quantity if already in cart
    setCart(cart.map(item => 
      item.id === product.id 
        ? { ...item, quantity: item.quantity + 1 } 
        : item
    ));
  } else {
    // Add new item to cart
    setCart([...cart, { ...product, quantity: 1 }]);
  }
};

const removeFromCart = (productId) => {
  setCart(cart.filter(item => item.id !== productId));
};

const updateQuantity = (productId, newQuantity) => {
  if (newQuantity < 1) {
    removeFromCart(productId);
    return;
  }
  
  setCart(cart.map(item => 
    item.id === productId 
      ? { ...item, quantity: newQuantity } 
      : item
  ));
};

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Open product detail modal
  const openProductModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    setActiveImageIndex(0);
    setShowVideo(false);
  };

  // Close product detail modal
  const closeProductModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Function to change active image in the modal
  const changeActiveImage = (index) => {
    setActiveImageIndex(index);
    setShowVideo(false);
  };

  // Function to toggle video view
  const toggleVideo = () => {
    setShowVideo(!showVideo);
  };

  // Format rating display with stars
  const displayRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '★'.repeat(fullStars);
    
    if (hasHalfStar) {
      stars += '½';
    }
    
    return stars;
  };

  return (
    <div className="ecommerce-app">

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
          />
        </div>
        <div className="cart-icon">
          <button onClick={() => document.getElementById('cart-sidebar').classList.toggle('open')}>
            Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
          </button>
        </div>
      </header>


      <main className="main-content">
        <aside className="filters-sidebar">
          <div className="filter-section">
            <h3>Categories</h3>
            <div className="category-filters">
              <button 
                className={selectedCategory === 'all' ? 'active' : ''} 
                onClick={() => setSelectedCategory('all')}
              >
                All Products
              </button>
              {categories.map(category => (
                <button 
                  key={category} 
                  className={selectedCategory === category ? 'active' : ''}
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
              <span>${priceRange.min}</span>
              <input 
                type="range" 
                min="0" 
                max="1000" 
                value={priceRange.max} 
                onChange={(e) => setPriceRange({...priceRange, max: parseInt(e.target.value)})}
              />
              <span>${priceRange.max}</span>
            </div>
          </div>
        </aside>

        <section className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.images[0]} alt={product.name} />
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-price">${product.price.toFixed(2)}</p>
                  <p className="product-category">{product.category}</p>
                  <div className="product-rating">
                    <span>{displayRating(product.rating)}</span>
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
            </div>
          )}
        </section>
      </main>

      <aside id="cart-sidebar" className="cart-sidebar">
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button onClick={() => document.getElementById('cart-sidebar').classList.toggle('open')} className="close-cart">
            ×
          </button>
        </div>

        {cart.length > 0 ? (
          <>
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.images[0]} alt={item.name} />
                  </div>
                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    <p>${item.price.toFixed(2)}</p>
                  </div>
                  <div className="cart-item-quantity">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="remove-item">
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <div className="cart-total">
                <h3>Total: ${cartTotal.toFixed(2)}</h3>
              </div>
              <button className="checkout-button"
                      onClick={()=> {
                        alert(cart.length)
                        props.cartcb(cart)
                        alert(JSON.stringify(props.cart))
                        navigate('/checkout')
                      }}>
                <p id="checkout-button-atag">Proceed to Checkout</p>
              </button>
            </div>
          </>
        ) : (
          <div className="empty-cart">
            <p>Your cart is empty.</p>
            <button onClick={() => document.getElementById('cart-sidebar').classList.toggle('open')}>
              Continue Shopping
            </button>
          </div>
        )}
      </aside>

      {isModalOpen && selectedProduct && (
        <div className="product-modal">
          <div className="modal-content">
            <button onClick={closeProductModal} className="close-modal">
              ×
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
                      src={selectedProduct.images[activeImageIndex]} 
                      alt={`${selectedProduct.name} - view ${activeImageIndex + 1}`} 
                      className="modal-main-image"
                    />
                  )}
                </div>
                <div className="modal-media-thumbnails">
                  {selectedProduct.images.map((image, index) => (
                    <img 
                      key={index} 
                      src={image} 
                      alt={`Thumbnail ${index + 1}`} 
                      className={!showVideo && activeImageIndex === index ? 'active' : ''}
                      onClick={() => changeActiveImage(index)}
                    />
                  ))}
                  <button 
                    className={`video-thumbnail ${showVideo ? 'active' : ''}`}
                    onClick={toggleVideo}
                  >
                    <div className="video-icon">▶</div>
                  </button>
                </div>
              </div>
              <div className="modal-product-info">
                <h2>{selectedProduct.name}</h2>
                <div className="modal-product-meta">
                  <p className="modal-product-price">${selectedProduct.price.toFixed(2)}</p>
                  <div className="modal-product-rating">
                    <span className="stars">{displayRating(selectedProduct.rating)}</span>
                    <span className="review-count">{selectedProduct.reviews} reviews</span>
                  </div>
                </div>
                <div className="modal-product-description">
                  <h3>Description</h3>
                  <p>{selectedProduct.description}</p>
                </div>
                
                <div className="modal-product-features">
                  <h3>Key Features</h3>
                  <ul>
                    {selectedProduct.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="modal-product-specs">
                  <h3>Specifications</h3>
                  <table>
                    <tbody>
                      {selectedProduct.specifications.map((spec, index) => (
                        <tr key={index}>
                          <td className="spec-name">{spec.name}</td>
                          <td className="spec-value">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="modal-product-warranty">
                  <h3>Warranty Information</h3>
                  <p>{selectedProduct.warranty}</p>
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
                    <label>Quantity:</label>
                    <div className="quantity-controls">
                      <button className="quantity-btn">-</button>
                      <input type="number" min="1" max={selectedProduct.stock} defaultValue="1" />
                      <button className="quantity-btn">+</button>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      addToCart(selectedProduct);
                      closeProductModal();
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
    </div>
  );

};


export default Market;