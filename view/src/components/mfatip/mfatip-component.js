"use client"

import { useState, useEffect } from "react"

import NavBar from "../navbar/navbar/navbar-component.js"

import { useNavigate } from 'react-router-dom';

import Footer from "../landingpage/footer/footer-component.js"

import "../../styles/mfatip/mfatip.scss"

export default function MonthlyFinancialAllocation() {

  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(false)
  const [counts, setCounts] = useState({
    ecommerce: 0,
    business: 0,
    stores: 0,
    community: 0,
  })
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    setIsVisible(true)
    animateCounts()
  }, [])

  const animateCounts = () => {
    const targetCounts = {
      ecommerce: 1,
      business: 0,
      stores: 0,
      community: 0,
    }

    const duration = 2500
    const steps = 60
    const interval = duration / steps
    let step = 0

    const timer = setInterval(() => {
      step++
      const progress = step / steps

      setCounts({
        ecommerce: Math.round(targetCounts.ecommerce * progress),
        business: Math.round(targetCounts.business * progress),
        stores: Math.round(targetCounts.stores * progress),
        community: Math.round(targetCounts.community * progress),
      })

      if (step === steps) clearInterval(timer)
    }, interval)
  }

  const profitSources = [
    {
      id: "ecommerce",
      title: "E-Commerce Profit",
      icon: "🛒",
      description: "Global online transactions",
      allocation: "₱2,000",
      percentage: 25,
      color: "#00D9FF",
    },
    {
      id: "business",
      title: "Business Profit",
      icon: "💼",
      description: "Corporate operations",
      allocation: "₱2,000",
      percentage: 25,
      color: "#00FF88",
    },
    {
      id: "stores",
      title: "Stores Profit",
      icon: "🏪",
      description: "Retail locations",
      allocation: "₱2,000",
      percentage: 25,
      color: "#FF00FF",
    },
    {
      id: "community",
      title: "Community Projects",
      icon: "🤝",
      description: "Social initiatives",
      allocation: "₱2,000",
      percentage: 25,
      color: "#FFD700",
    },
  ]

  return (
    <div className={`mfatip-container ${isVisible ? "visible" : ""}`}>

      <NavBar />
      
      {/* Main Header */}
      <header className="mfatip-main-header">
        <div className="header-content">
          <div className="header-badge">OMSIAP Initiative</div>
          <h1 className="header-title">
            This is <span className="highlight-omsiap">OMSIAP</span>, This is{" "}
            <span className="highlight-mfatip">MFATIP</span>
          </h1>
          <p className="header-subtitle">Strengthening its foundation for everyone's sake</p>
          <div className="header-divider"></div>
        </div>
      </header>

      <ProfitSourcesSection />

      {/* Navigation Tabs */}
      <nav className="mfatip-nav">
        <button
          className={`nav-tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`nav-tab ${activeTab === "allocation" ? "active" : ""}`}
          onClick={() => setActiveTab("allocation")}
        >
          Allocation Details
        </button>
        <button
          className={`nav-tab ${activeTab === "benefits" ? "active" : ""}`}
          onClick={() => setActiveTab("benefits")}
        >
          Benefits
        </button>
      </nav>

      {/* Content Sections */}
      <main className="mfatip-content">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <section className="content-section overview-section">
            <div className="section-header">
              <h2>Monthly Financial Allocation Overview</h2>
              <p>Transparent distribution from multiple profit sources</p>
            </div>

            {/* Profit Sources Grid */}
            <div className="profit-sources-grid">
              {profitSources.map((source, index) => (
                <div
                  key={source.id}
                  className="profit-card"
                  style={{ "--card-color": source.color, "--delay": `${index * 0.1}s` }}
                >
                  <div className="card-icon">{source.icon}</div>
                  <h3 className="card-title">{source.title}</h3>
                  <p className="card-description">{source.description}</p>
                  <div className="card-allocation">
                    <span className="allocation-label">Monthly Allocation</span>
                   {/*<span className="allocation-amount">{source.allocation}</span>*/}
                    </div>
                  <div className="card-progress">
                    <div className="progress-bar" style={{ width: `${source.percentage}%` }}></div>
                  </div>
                  <span className="card-percentage">{source.percentage}%</span>
                </div>
              ))}
            </div>

            {/* Total Allocation Card */}
            <div className="total-allocation-card">
              <div className="total-content">
                <h3>Total Monthly Allocation</h3>
                <p>UP TO</p>
                <div className="total-amount">₱15,000</div>
                <p className="total-description">
                  Distributed equally from all profit sources to support individual growth
                </p>
                 <p className="total-description">
                  Based from available PROFIT SOURCES above
                </p>
              </div>
              <div className="total-visual">
                <div className="circle-progress">
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" className="circle-bg"></circle>
                    <circle cx="50" cy="50" r="45" className="circle-progress-bar"></circle>
                  </svg>
                  <div className="circle-text">100%</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Allocation Details Tab */}
        {activeTab === "allocation" && (
          <section className="content-section allocation-section">
            <div className="section-header">
              <h2>Allocation Breakdown</h2>
              <p>Detailed view of how funds are distributed</p>
            </div>

            <div className="allocation-details">
              {profitSources.map((source) => (
                <div key={source.id} className="allocation-item">
                  <div className="allocation-header">
                    <div className="allocation-title-group">
                      <span className="allocation-icon">{source.icon}</span>
                      <div>
                        <h4>{source.title}</h4>
                        <p>{source.description}</p>
                      </div>
                    </div>
                    <div className="allocation-amount-group">
                      {/*<span className="amount">{source.allocation}</span>*/}
                      <span className="percentage">{source.percentage}%</span>
                    </div>
                  </div>
                  <div className="allocation-bar">
                    <div
                      className="allocation-fill"
                      style={{
                        width: `${source.percentage}%`,
                        backgroundColor: source.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Distribution Timeline */}
            <div className="distribution-timeline">
              <h3>Distribution Timeline</h3>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h4>Application Submitted</h4>
                    <p>Complete your MFATIP profile</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h4>Verification Process</h4>
                    <p>Our team reviews your information</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h4>Approval & Activation</h4>
                    <p>Account activated for allocations</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h4>Monthly Disbursement</h4>
                    <p>Receive your allocation every month</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Benefits Tab */}
        {activeTab === "benefits" && (
          <section className="content-section benefits-section">
            <div className="section-header">
              <h2>MFATIP Benefits</h2>
              <p>Comprehensive support for your personal growth</p>
            </div>

            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">💰</div>
                <h3>Monthly Financial Support</h3>
                <p>Up to ₱8,000 in monthly allocations from multiple profit sources</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">🔒</div>
                <h3>Secure & Transparent</h3>
                <p>All transactions are secure and fully transparent with detailed reporting</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">⏰</div>
                <h3>Lifetime Access</h3>
                <p>Once approved, enjoy lifetime account access with no renewal fees</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">📊</div>
                <h3>Personal Dashboard</h3>
                <p>Track your allocations and manage your account from your personal dashboard</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">🎓</div>
                <h3>Growth Tools</h3>
                <p>Access portfolio builder, resume creator, and task management systems</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">🌍</div>
                <h3>Community Support</h3>
                <p>Join a growing community of individuals supported by OMSIAP</p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="cta-section">
              <h3>Ready to Get Started?</h3>
              <p>Join thousands of individuals already benefiting from MFATIP</p>
              <button className="cta-button">Register Now</button>
            </div>
          </section>
        )}
      </main>


      {/* Footer */}
       <footer className="mfatip-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>About OMSIAP</h4>
            <p>Empowering individuals through transparent financial allocation and community support.</p>
          </div>
          <div className="footer-section">
            <h4>Contact Us</h4>
            <p>Email: ofmackysinkandpaper@gmail.com</p>
            <p>Phone: +63 (9) 567-77674</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <a href="#faq">FAQ</a>
              </li>
              <li>
                <a href="#terms">Terms & Conditions</a>
              </li>
              <li>
                <a href="#privacy">Privacy Policy</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 OMSIAP. All rights reserved. Strengthening foundations for everyone's sake.</p>
        </div>
      </footer>
    </div>
  )
}

function ProfitSourcesSection() {
  const [counts, setCounts] = useState({
    ecommerce: 0,
    stores: 0,
    businesses: 0,
    community: 0,
  })

  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setAnimate(true)
      animateCounts()
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const animateCounts = () => {
    const targetCounts = {
      ecommerce: 1,
      stores: 0,
      businesses: 0,
      community: 0,
    }

    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps

      setCounts({
        ecommerce: Math.round(targetCounts.ecommerce * progress),
        stores: Math.round(targetCounts.stores * progress),
        businesses: Math.round(targetCounts.businesses * progress),
        community: Math.round(targetCounts.community * progress),
      })

      if (step === steps) {
        clearInterval(timer)
        setCounts(targetCounts)
      }
    }, interval)
  }

  const sources = [
    {
      id: "ecommerce",
      title: "E-Commerce Profit",
      description:
        "Current 1 nationwide e-commerce website ready to support your Monthly Financial Allocations through transaction giveaways",
      icon: "🛍️",
      count: counts.ecommerce,
      color: "ecommerce",
      details: "Active worldwide platform generating sustainable revenue",
    },
    {
      id: "stores",
      title: "Physical Stores",
      description: "Current 0 Stores ready to support your Monthly Financial Allocations through a portion of total profit",
      icon: "🏪",
      count: counts.stores,
      color: "stores",
      details: "Retail locations contributing to community growth",
    },
    {
      id: "businesses",
      title: "Active Businesses",
      description:
        "Current 0 Business names ready and prepared to share portions of profit for your Monthly Financial Allocations",
      icon: "💼",
      count: counts.businesses,
      color: "businesses",
      details: "Diverse business ventures supporting the initiative",
    },
    {
      id: "community",
      title: "Community Projects",
      description:
        "Current 0 community projects whose profit will be shared among everyone as Monthly Financial Allocations",
      icon: "🤝",
      count: counts.community,
      color: "community",
      details: "Collaborative projects benefiting all participants",
    },
  ]

  return (
    <section className="profit-sources">
      <div className="profit-sources__container">
        <div className="profit-sources__header">
          <h2 className="profit-sources__title">Profit Sources</h2>
          <p className="profit-sources__subtitle">Four pillars of financial allocation supporting individual growth</p>
        </div>

        <div className="profit-sources__grid">
          {sources.map((source, index) => (
            <div
              key={source.id}
              className={`profit-card profit-card--${source.color}`}
              style={{ "--delay": `${index * 0.1}s` }}
            >
              <div className="profit-card__header">
                <div className="profit-card__icon">{source.icon}</div>
                <div className="profit-card__count-badge">
                  <span className={`profit-card__count ${animate ? "profit-card__count--animate" : ""}`}>
                    {source.count}
                  </span>
                </div>
              </div>

              <h3 className="profit-card__title">{source.title}</h3>
              
              <p className="profit-card__description"> {source.description}</p>

              <div className="profit-card__details">
                <span className="profit-card__detail-text">{source.details}</span>
              </div>

              <div className="profit-card__progress">
                <div className="profit-card__progress-bar"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="profit-sources__stats">
          <div className="stat-item">
            <span className="stat-item__label">Total Active Sources</span>
            <span className="stat-item__value">1</span>
          </div>
          <div className="stat-item">
            <span className="stat-item__label">Potential Growth</span>
            <span className="stat-item__value">3</span>
          </div>
          <div className="stat-item">
            <span className="stat-item__label">Allocation Channels</span>
            <span className="stat-item__value">4</span>
          </div>
        </div>
      </div>
    </section>
  )
}