"use client"

import { useState, useMemo, useEffect } from "react"
import { Row, Col } from "react-bootstrap"
import {
  Phone,
  Mail,
  ChevronRight,
  BarChart3,
  PieChart,
  LineChart,
  Leaf,
  Building,
  ShoppingCart,
  Construction,
} from "lucide-react"

import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

import '../../styles/hope/hope.scss';

import NavBar from "../navbar/navbar/navbar-component.js"
import Footer from "../landingpage/footer/footer-component.js"

// Simple number counter (no external deps) — animates from 0 to `value` in `duration` ms
function AnimatedCounter({ value = 0, duration = 900, format = (v) => v }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let start = null
    const initial = Number(display)
    const target = Number(value)
    if (initial === target) return

    const step = (timestamp) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      const current = initial + (target - initial) * eased
      setDisplay(Number(current.toFixed(0)))
      if (progress < 1) requestAnimationFrame(step)
    }

    const raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <span>{format(display)}</span>
}

export default function HOPE({ viewport, user, usercb, alloftheproducts = [] }) {
  const [showImageModal, setShowImageModal] = useState(false)
  const [modalImage, setModalImage] = useState("")
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [modalContent, setModalContent] = useState({
    title: "",
    content: "",
    icon: null,
  })

  // New: which modal is active (so Market can animate on open)
  const [activeModalKey, setActiveModalKey] = useState(null)

  const openImageModal = (imageSrc) => {
    setModalImage(imageSrc)
    setShowImageModal(true)
  }

  const closeInfoModal = () => {
    setShowInfoModal(false)
    setActiveModalKey(null)
  }

  const openInfoModal = (type) => {
    setActiveModalKey(type)

    // We'll generate the modal's content after computing analytics (below)
    // For MARKET we build dynamic content — for others we keep placeholders
    setShowInfoModal(true)

    // We'll populate modalContent after analytics are computed via useMemo
    // Set a temporary header while computation runs
    setModalContent((prev) => ({ ...prev, title: "Loading...", content: <p>Loading data...</p> }))
  }

  // Placeholder images - replace with your actual image paths
  const headerImage = "../images/hope/happycrowd.jpg"
  const laptopImage = "../images/hope/happycrowd.jpg"
  const smallImage1 = "../images/hope/happycrowd.jpg"
  const smallImage2 = "../images/hope/happycrowd.jpg"

  // Navigation function (simulated)
  const navigate = (path) => {
    console.log(`Navigating to: ${path}`)
  }

  // ----------------- DATA ANALYTICS (from props.alloftheproducts) -----------------
  // Defensive helpers
  const safeArr = (v) => (Array.isArray(v) ? v : [])

  // Compute market analytics memoized for performance
  const marketAnalytics = useMemo(() => {
    const analytics = {
      totalProducts: 0,
      totalPurchases: 0,
      pendingPurchases: 0,
      acceptedPurchases: 0,
      rejectedPurchases: 0,
      totalMerchandiseAmount: 0,
      perProductAcceptedCount: {}, // id -> count
      perProductAcceptedAmount: {},
    }

    if (!Array.isArray(alloftheproducts)) return analytics

    analytics.totalProducts = alloftheproducts.length

    for (const product of alloftheproducts) {
      const pid = product?.authentications?.id || product?.details?.productname || "unknown"

      const purchases = product?.system?.purchases || {}
      const total = safeArr(purchases.total)
      const pending = safeArr(purchases.pending)
      const accepted = safeArr(purchases.accepted)
      const rejected = safeArr(purchases.rejected)

      analytics.totalPurchases += total.length
      analytics.pendingPurchases += pending.length
      analytics.acceptedPurchases += accepted.length
      analytics.rejectedPurchases += rejected.length

      // compute total merchandise amount from accepted purchases (ordersummary.merchandisetotal)
      let acceptedAmountForProduct = 0
      for (const purchase of accepted) {
        const merchTotal = Number(purchase?.ordersummary?.merchandisetotal || 0)
        acceptedAmountForProduct += isNaN(merchTotal) ? 0 : merchTotal
      }

      analytics.totalMerchandiseAmount += acceptedAmountForProduct

      analytics.perProductAcceptedCount[pid] = (analytics.perProductAcceptedCount[pid] || 0) + accepted.length
      analytics.perProductAcceptedAmount[pid] = (analytics.perProductAcceptedAmount[pid] || 0) + acceptedAmountForProduct
    }

    // top products array sorted by accepted count
    const topProducts = Object.entries(analytics.perProductAcceptedCount)
      .map(([id, count]) => {
        // find product name and accepted amount
        const prod = alloftheproducts.find((p) => (p?.authentications?.id || p?.details?.productname) === id) || {}
        const name = prod?.details?.productname || id || "Unnamed"
        const acceptedAmount = analytics.perProductAcceptedAmount[id] || 0
        return { id, name, count, acceptedAmount }
      })
      .sort((a, b) => b.count - a.count)

    analytics.topProducts = topProducts.slice(0, 5)

    // chart data for top products
    analytics.topProductsChart = analytics.topProducts.map((p) => ({ name: p.name, accepted: p.count }))

    return analytics
  }, [alloftheproducts])

  // When the Market modal opens, populate the modalContent dynamically
  useEffect(() => {
    if (!showInfoModal) return
    if (activeModalKey !== "MARKET") {
      // For other modals, keep existing behavior (static content)
      switch (activeModalKey) {
        case "BUSINESS":
          setModalContent({
            title: "Business Portfolio Management",
            icon: <Building size={32} className="modal-header-icon" />,
            content: (
              <>
                <div className="modal-section">
                  <h3>Business Portfolio Overview</h3>
                  <p>
                    Our business portfolio management system provides comprehensive tools for optimizing business
                    operations, maximizing profitability, and ensuring sustainable growth across diverse industries.
                  </p>
                </div>
                <div className="modal-section">
                  <h3>Placeholder</h3>
                  <p>Coming soon.</p>
                </div>
              </>
            ),
          })
          break
        case "INFRASTRUCTURES":
          setModalContent({
            title: "Infrastructure Development & Management",
            icon: <Construction size={32} className="modal-header-icon" />,
            content: (
              <>
                <div className="modal-section">
                  <h3>Infrastructure Solutions</h3>
                  <p>Coming soon.</p>
                </div>
              </>
            ),
          })
          break
        case "ECO_FRIENDLY":
          setModalContent({
            title: "Eco-Friendly Initiatives",
            icon: <Leaf size={32} className="modal-header-icon" />,
            content: (
              <>
                <div className="modal-section">
                  <h3>Our Green Commitment</h3>
                  <p>Coming soon.</p>
                </div>
              </>
            ),
          })
          break
        default:
          setModalContent({ title: "Information", content: <p>Content not available.</p> })
      }
      return
    }

    // Build the Market modal with analytics
    const a = marketAnalytics

    const marketContent = (
      <>
        <div className="modal-section">
          <h3>Market Summary</h3>

          <Row className="analytics-cards" style={{ gap: 12 }}>
            <Col xs={6} md={3}>
              <motion.div
                className="analytics-card"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.35 }}
              >
                <p className="card-label">Products</p>
                <h2 className="card-number special-text">
                  <AnimatedCounter value={a.totalProducts} />
                </h2>
              </motion.div>
            </Col>

            <Col xs={6} md={3}>
              <motion.div className="analytics-card" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
                <p className="card-label">Total Purchases</p>
                <h2 className="card-number">
                  <AnimatedCounter value={a.totalPurchases} />
                </h2>
              </motion.div>
            </Col>

            <Col xs={6} md={3}>
              <motion.div className="analytics-card" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45 }}>
                <p className="card-label">Accepted</p>
                <h2 className="card-number special-text">
                  <AnimatedCounter value={a.acceptedPurchases} />
                </h2>
              </motion.div>
            </Col>

            <Col xs={6} md={3}>
              <motion.div className="analytics-card" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
                <p className="card-label">Pending</p>
                <h2 className="card-number">
                  <AnimatedCounter value={a.pendingPurchases} />
                </h2>
              </motion.div>
            </Col>

            <Col xs={6} md={3}>
              <motion.div className="analytics-card" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.55 }}>
                <p className="card-label">Rejected</p>
                <h2 className="card-number">
                  <AnimatedCounter value={a.rejectedPurchases} />
                </h2>
              </motion.div>
            </Col>

            <Col xs={12} md={6}>
              <motion.div className="analytics-card wide" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
                <p className="card-label">Total Merchandise (Accepted)</p>
                <h2 className="card-number special-text">
                  ₱ <AnimatedCounter value={Math.round(a.totalMerchandiseAmount)} format={(v) => v.toLocaleString()} />
                </h2>
                <p className="muted">Sum of merchandisetotal from accepted purchases</p>
              </motion.div>
            </Col>
          </Row>
        </div>

        <div className="modal-section">
          <h3>Top Selling Products (Accepted Purchases)</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={a.topProductsChart} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.06} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="accepted" radius={[6, 6, 0, 0]}>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="top-products-list">
            {a.topProducts.length === 0 ? (
              <p className="muted">No accepted purchases found across products.</p>
            ) : (
              a.topProducts.map((p) => (
                <div key={p.id} className="top-product-row">
                  <div className="tp-name">{p.name}</div>
                  <div className="tp-stats">{p.count} accepted — ₱ {p.acceptedAmount.toLocaleString()}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="modal-section">
          <h3>Notes</h3>
          <p className="muted">Data are pulled from <strong>product.system.purchases</strong> arrays passed in <code>alloftheproducts</code> prop.</p>
        </div>
      </>
    )

    setModalContent({
      title: "Market Analysis & Opportunities",
      icon: <ShoppingCart size={32} className="modal-header-icon" />,
      content: marketContent,
    })
  }, [showInfoModal, activeModalKey, marketAnalytics])

  // ----------------- RENDER -----------------
  return (
    <div className="hope-container dark-theme blue-accent">
      {/* NavBar */}
      <NavBar viewport={viewport} user={user} usercb={usercb} />

      {/* Header Section */}
      <div className="hope-header">
        <div className="header-image-container">
          <img
            src={headerImage || "/placeholder.svg?height=500&width=1200"}
            alt="HOPE Header"
            className="header-image"
            onClick={() => openImageModal(headerImage)}
          />
          <div className="image-overlay dark-overlay"></div>
        </div>
        <div className="header-content">
          <h1 className="header-title">Honesties On Constitutional Promises Evaluation</h1>
          <h5 className="header-subtitle">(H)(O)(P)(E)</h5>
        </div>
      </div>

      {/* About HOPE Section */}
      <Row className="about-hope-section">
        <Col xs={12} md={6} className="about-content-col">
          <div className="main-image-container">
            <img
              src={laptopImage || "/placeholder.svg?height=400&width=600"}
              alt="About HOPE"
              className="main-image"
              onClick={() => openImageModal(laptopImage)}
            />
          </div>

          <h1 className="about-title">Honesties On Constitutional Promises Evaluation (H) (O) (P) (E)</h1>

          <p className="about-description">
            It all began with one man’s dedication and hard work.
            His relentless efforts transformed into meaningful experiences that he shared freely with others — transcending fatigue, struggles, and financial constraints to create purposeful opportunities.

            This motivation grew through years of work across different industries — from construction, to the Business Process Outsourcing (BPO) sector, and eventually to remote opportunities with global companies.

            These combined experiences led to a single realization:
            the need to evaluate transparency systems and improve data analytics displays to support government and industrial operations that lack openness.

            From this vision emerged an alternative framework — one built to ensure precision in industrial projects, market operations, and pension management systems.
            This is more than innovation.
            This is HOPE.
          </p>

          <div className="eco-friendly-banner">
            <Leaf className="eco-banner-icon" />
            <div className="eco-banner-content">
              <h3>ECO FRIENDLY INITIATIVES</h3>
              <p>
                Our commitment to sustainability drives every aspect of our operations. We implement eco-friendly
                practices across all our projects, reducing environmental impact while maximizing efficiency and
                performance.
              </p>
            </div>
          </div>

          <Row className="small-images-row">
            <Col xs={6} className="small-image-col">
              <div className="small-image-container">
                <img
                  src={smallImage1 || "/placeholder.svg?height=200&width=300"}
                  alt="HOPE Image 1"
                  className="small-image"
                  onClick={() => openImageModal(smallImage1)}
                />
              </div>
            </Col>
            <Col xs={6} className="small-image-col">
              <div className="small-image-container">
                <img
                  src={smallImage2 || "/placeholder.svg?height=200&width=300"}
                  alt="HOPE Image 2"
                  className="small-image"
                  onClick={() => openImageModal(smallImage2)}
                />
              </div>
            </Col>
          </Row>
        </Col>

        <Col xs={12} md={6} className="subjects-col">
          <div className="subjects-container">
            <div className="subject-item" onClick={() => openInfoModal("MARKET") }>
              <div className="subject-content">
                <ShoppingCart className="subject-icon" />
                <p className="subject-title">MARKET</p>
              </div>
              <div className="subject-arrow">
                <ChevronRight className="arrow-icon" />
              </div>
            </div>

            <div className="subject-item" onClick={() => openInfoModal("BUSINESS") }>
              <div className="subject-content">
                <Building className="subject-icon" />
                <p className="subject-title">BUSINESS</p>
              </div>
              <div className="subject-arrow">
                <ChevronRight className="arrow-icon" />
              </div>
            </div>

            <div className="subject-item" onClick={() => openInfoModal("INFRASTRUCTURES") }>
              <div className="subject-content">
                <Construction className="subject-icon" />
                <p className="subject-title">INFRASTRUCTURES</p>
              </div>
              <div className="subject-arrow">
                <ChevronRight className="arrow-icon" />
              </div>
            </div>

            <div className="subject-item eco-item" onClick={() => openInfoModal("ECO_FRIENDLY") }>
              <div className="subject-content">
                <Leaf className="subject-icon" />
                <p className="subject-title">ECO FRIENDLY</p>
              </div>
              <div className="subject-arrow">
                <ChevronRight className="arrow-icon" />
              </div>
            </div>
          </div>

          <div className="help-container">
            <h3 className="help-title">Need any help?</h3>
            <p className="help-description">
              At Tector, we are dedicated to providing innovative and reliable technology solutions tailored to meet the
              unique needs of your business
            </p>
            <div className="contact-item">
              <Phone className="contact-icon" />
              <h4 className="contact-text">(555) 123-4567</h4>
            </div>
            <div className="contact-item">
              <Mail className="contact-icon" />
              <h4 className="contact-text">support@tector.com</h4>
            </div>
          </div>
        </Col>
      </Row>

      {/* Footer */}
      <Footer />

      {/* Image Modal */}
      {showImageModal && (
        <div className="modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="modal-container dark-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowImageModal(false)}>
              ×
            </button>
            <div className="modal-content">
              <img src={modalImage || "/placeholder.svg?height=600&width=800"} alt="HOPE" className="modal-image" />
            </div>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {showInfoModal && (
        <div className="modal-overlay" onClick={closeInfoModal}>
          <div className="info-modal-container dark-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeInfoModal}>
              ×
            </button>
            <div className="info-modal-header">
              {modalContent.icon}
              <h2 className="info-modal-title">{modalContent.title}</h2>
            </div>
            <div className="info-modal-content">{modalContent.content}</div>
          </div>
        </div>
      )}

      {/* local style overrides for blue accent + cards (keeps original structure) */}
      <style jsx global>{`
        .blue-accent { --accent: #00b7ff; }
        .blue-accent .special-text { color: var(--accent); }

        /* Analytics cards */
        .analytics-cards { margin-top: 12px; display: flex; flex-wrap: wrap; }
        .analytics-card { background: rgba(10,12,18,0.6); border: 1px solid rgba(0,183,255,0.08); padding: 14px; border-radius: 10px; box-shadow: 0 6px 18px rgba(0,183,255,0.04); }
        .analytics-card.wide { width: 100%; }
        .card-label { font-size: 0.85rem; color: #8eaecf; margin: 0 0 6px 0; }
        .card-number { font-size: 1.45rem; margin: 0; color: #eaf7ff; }

        .top-products-list { margin-top: 12px; }
        .top-product-row { display:flex; justify-content:space-between; padding:8px 10px; border-bottom:1px solid rgba(255,255,255,0.03); }
        .tp-name { font-weight:600; color:#cfeeff }
        .tp-stats { color:#9fbfd6; font-size:0.9rem }

        /* Recharts bar styling - small tweak to blend with dark theme */
        .recharts-surface { background: transparent !important }

        /* Muted text */
        .muted { color: #9fbfd6; font-size: 0.9rem }

        /* keep existing dark-theme rules but adjust hover accent */
        .dark-theme { background-color: #000; color: #e5eef9; }
        .dark-modal { background-color: #05060a; color: #e5eef9; border: 1px solid rgba(0,183,255,0.12); }
        .dark-modal .info-modal-header { background: linear-gradient(90deg, rgba(0,183,255,0.04), rgba(0,0,0,0)); }

        /* subject hover glow */
        .subject-item:hover { box-shadow: 0 8px 28px rgba(0,183,255,0.06); border-color: rgba(0,183,255,0.12); }

        /* small responsive tweaks */
        @media (max-width: 768px) {
          .analytics-card { width: 48%; margin-bottom: 10px }
          .analytics-card.wide { width: 100% }
        }
      `}</style>
    </div>
  )
}
