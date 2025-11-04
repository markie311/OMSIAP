
import '../../../styles/omsiapmarket/shopperdetails/shopperdetails.scss'
import React, { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { Col, Row } from 'react-bootstrap'

import axiosCreatedInstance from "../../lib/axiosutil.js"


export default function ShopperDetails(props) {
  const navigate = useNavigate()
  
  // State management for all data
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState({
    total: [],
    pending: [],
    confirmed: [],
    rejected: [],
    forshipping: [],
    shipped: [],
    successful: []
  })
  const [currencyExchange, setCurrencyExchange] = useState({
    total: [],
    pending: [],
    successful: [],
    rejected: []
  })
  const [withdrawals, setWithdrawals] = useState({
    total: [],
    pending: [],
    successful: [],
    rejected: []
  })
  const [registrants, setRegistrants] = useState({
    total: [],
    verified: [],
    pending: [],
    rejected: []
  })
  const [giveawayStats, setGiveawayStats] = useState({
    mfatip: { total: 0, transactions: 0, average: 0 },
    public: { total: 0, transactions: 0, average: 0 },
    private: { total: 0, transactions: 0, average: 0 }
  })
  const [loading, setLoading] = useState(true)

  // Calculate giveaway statistics from orders based on citizenship type
  const calculateGiveawayStats = (ordersData) => {
    const stats = {
      mfatip: { total: 0, transactions: 0, average: 0 },
      public: { total: 0, transactions: 0, average: 0 },
      private: { total: 0, transactions: 0, average: 0 }
    }

    ordersData.forEach(order => {
      if (order.system?.thistransactionismadeby?.citizenship && 
          order.system?.ordersummary?.totaltransactiongiveaway) {
        
        const citizenship = order.system.thistransactionismadeby.citizenship.toLowerCase()
        const giveaway = order.system.ordersummary.totaltransactiongiveaway
        
        if (citizenship.includes('mfatip')) {
          stats.mfatip.total += giveaway
          stats.mfatip.transactions += 1
        } else if (citizenship.includes('public')) {
          stats.public.total += giveaway
          stats.public.transactions += 1
        } else if (citizenship.includes('private')) {
          stats.private.total += giveaway
          stats.private.transactions += 1
        }
      }
    })

    // Calculate averages
    Object.keys(stats).forEach(key => {
      if (stats[key].transactions > 0) {
        stats[key].average = stats[key].total / stats[key].transactions
      }
    })

    return stats
  }

  // Client-side fetchOmsiapData function
  const fetchOmsiapData = async () => {
    try {
      setLoading(true)
      const response = await axiosCreatedInstance.get("/omsiap/getomsiapdata")
      const omsiapdata = response.data
      
      // Process products data
      if (omsiapdata && omsiapdata.products) {
        setProducts(omsiapdata.products)
      }
      
      // Process transactions data
      if (omsiapdata && omsiapdata.transactions) {
        // Update orders data
        if (omsiapdata.transactions.orders) {
          const ordersData = {
            total: omsiapdata.transactions.orders.total || [],
            pending: omsiapdata.transactions.orders.pending || [],
            confirmed: omsiapdata.transactions.orders.confirmed || [],
            rejected: omsiapdata.transactions.orders.rejected || [],
            forshipping: omsiapdata.transactions.orders.forshipping || [],
            shipped: omsiapdata.transactions.orders.shipped || [],
            successful: omsiapdata.transactions.orders.successful || []
          }
          setOrders(ordersData)
          
          // Calculate giveaway statistics
          const stats = calculateGiveawayStats(ordersData.total)
          setGiveawayStats(stats)
        }
        
        // Update currency exchange data
        if (omsiapdata.transactions.currencyexchange) {
          setCurrencyExchange({
            total: omsiapdata.transactions.currencyexchange.total || [],
            pending: omsiapdata.transactions.currencyexchange.pending || [],
            successful: omsiapdata.transactions.currencyexchange.successful || [],
            rejected: omsiapdata.transactions.currencyexchange.rejected || []
          })
        }
        
        // Update withdrawals data
        if (omsiapdata.transactions.withdrawals) {
          setWithdrawals({
            total: omsiapdata.transactions.withdrawals.total || [],
            pending: omsiapdata.transactions.withdrawals.pending || [],
            successful: omsiapdata.transactions.withdrawals.successful || [],
            rejected: omsiapdata.transactions.withdrawals.rejected || []
          })
        }
      }
      
      // Process MFATIP registrants data
      if (omsiapdata && omsiapdata.people) {
        const verified = omsiapdata.people.filter(person =>
          person.status && person.status.type === "Month Financial Allocation To Individual People ( MFATIP )" &&
          person.status.indication === "Verified"
        )
        
        const pending = omsiapdata.people.filter(person =>
          person.status &&
          person.status.type === "Month Financial Allocation To Individual People ( MFATIP )" &&
          person.status.indication === "unverified"
        )
        
        const rejected = omsiapdata.people.filter(person =>
          person.status &&
          person.status.type === "Month Financial Allocation To Individual People ( MFATIP )" &&
          person.status.indication === "Rejected Documents"
        )
        
        setRegistrants({
          total: omsiapdata.people || [],
          verified: verified,
          pending: pending,
          rejected: rejected
        })
      }
      
      setLoading(false)
    } catch (err) {
      console.error('Error fetching OMSIAP data:', err)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOmsiapData()
  }, [])

  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0)
  }

  return (
    <Col className="shopper-details">
      {/* Back Button */}
      <Col className="shopper-details__back-button-container">
        <button 
          className="shopper-details__back-button"
          onClick={() => navigate('/omsiapmarket')}
        >
          <span className="shopper-details__back-arrow">←</span>
          <span className="shopper-details__back-text"></span>
        </button>
      </Col>

      {/* Main Information */}
      <Row className="shopper-details__main-info animate-slide-in">
        <Col 
          className="shopper-details__name-section"
          xs={12} md={6} lg={6}
        >
          <div className="shopper-details__info-card">
            <h2 className="shopper-details__card-title">Account Information</h2>
            <div className="shopper-details__info-item">
              <span className="shopper-details__label">Full Name:</span>
              <span className="shopper-details__value">
                {props.user?.name?.firstname} {props.user?.name?.middlename} {props.user?.name?.lastname}
              </span>
            </div>
            <div className="shopper-details__info-item">
              <span className="shopper-details__label">OMSIAP Citizenship:</span>
              <span className="shopper-details__value shopper-details__citizenship">
                {props.user?.registrationstatusesandlogs?.type || 'N/A'}
              </span>
            </div>
            <div className="shopper-details__info-item">
              <span className="shopper-details__label">Account Status:</span>
              <span className={`shopper-details__value shopper-details__status shopper-details__status--${props.user?.registrationstatusesandlogs?.indication?.toLowerCase()}`}>
                {props.user?.registrationstatusesandlogs?.indication || 'N/A'}
              </span>
            </div>
          </div>
        </Col>

        <Col 
          className="shopper-details__balance-section"
          xs={12} md={6} lg={6}
        >
          <div className="shopper-details__balance-card">
            <h2 className="shopper-details__balance-title">Balance Details</h2>
            <div className="shopper-details__balance-amount">
              <span className="shopper-details__currency">₱</span>
              <span className="shopper-details__amount">
                {formatCurrency(props.user?.credits?.omsiapawas?.amount)}
              </span>
            </div>
            <div className="shopper-details__balance-label">OMSIAPAWAS</div>
          </div>
        </Col>
      </Row>

      {/* Sub Information */}
      <Row className="shopper-details__sub-info animate-fade-in">
        <Col className="shopper-details__info-col" xs={12} md={4} lg={4}>
          <div className="shopper-details__feature-card">
            <div className="shopper-details__icon">🔗</div>
            <h3 className="shopper-details__feature-title">Blockchain Shares</h3>
            <p className="shopper-details__feature-text">
              <strong>MFATIP:</strong> Share and receive transaction giveaways from all MFATIP citizenships.
            </p>
            <p className="shopper-details__feature-text">
              <strong>Public:</strong> Share with public and private citizens, receive from MFATIP and public.
            </p>
            <p className="shopper-details__feature-text">
              <strong>Private:</strong> Share with private citizens only, receive from MFATIP and public.
            </p>
          </div>
        </Col>

        <Col className="shopper-details__info-col" xs={12} md={4} lg={4}>
          <div className="shopper-details__feature-card">
            <div className="shopper-details__icon">✓</div>
            <h3 className="shopper-details__feature-title">Account Verification</h3>
            <p className="shopper-details__feature-text">
              Only verified accounts will automatically receive transaction giveaways upon order confirmation.
            </p>
            <p className="shopper-details__feature-text">
              Complete your verification to unlock all benefits and features of the platform.
            </p>
          </div>
        </Col>

        <Col className="shopper-details__info-col" xs={12} md={4} lg={4}>
          <div className="shopper-details__feature-card">
            <div className="shopper-details__icon">🔐</div>
            <h3 className="shopper-details__feature-title">Account Validation</h3>
            <p className="shopper-details__feature-text">
              All accounts use a bREn (Birth Certificate Reference Number) that validates uniqueness.
            </p>
            <p className="shopper-details__feature-text">
              This ensures secure and authentic user identification across the entire platform.
            </p>
          </div>
        </Col>
      </Row>

      {/* Transaction Giveaway Statistics Table */}
      <Row className="shopper-details__giveaway-section animate-slide-up">
        <Col xs={12}>
          <div className="shopper-details__table-container">
            <h2 className="shopper-details__table-title">
              Transaction Giveaway Statistics by Citizenship Type
            </h2>
            
            {loading ? (
              <div className="shopper-details__loading">
                <div className="shopper-details__spinner"></div>
                <p>Loading statistics...</p>
              </div>
            ) : (
              <div className="shopper-details__table-wrapper">
                <table className="shopper-details__table">
                  <thead>
                    <tr>
                      <th>Citizenship Type</th>
                      <th>Total Giveaways Given</th>
                      <th>Total Transactions</th>
                      <th>Average per Transaction</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="shopper-details__table-row shopper-details__table-row--mfatip">
                      <td className="shopper-details__citizenship-cell">
                        <span className="shopper-details__citizenship-badge shopper-details__citizenship-badge--mfatip">
                          MFATIP
                        </span>
                      </td>
                      <td className="shopper-details__amount-cell">
                        ₱ {formatCurrency(giveawayStats.mfatip.total)}
                      </td>
                      <td className="shopper-details__count-cell">
                        {giveawayStats.mfatip.transactions}
                      </td>
                      <td className="shopper-details__average-cell">
                        ₱ {formatCurrency(giveawayStats.mfatip.average)}
                      </td>
                    </tr>
                    <tr className="shopper-details__table-row shopper-details__table-row--public">
                      <td className="shopper-details__citizenship-cell">
                        <span className="shopper-details__citizenship-badge shopper-details__citizenship-badge--public">
                          Public
                        </span>
                      </td>
                      <td className="shopper-details__amount-cell">
                        ₱ {formatCurrency(giveawayStats.public.total)}
                      </td>
                      <td className="shopper-details__count-cell">
                        {giveawayStats.public.transactions}
                      </td>
                      <td className="shopper-details__average-cell">
                        ₱ {formatCurrency(giveawayStats.public.average)}
                      </td>
                    </tr>
                    <tr className="shopper-details__table-row shopper-details__table-row--private">
                      <td className="shopper-details__citizenship-cell">
                        <span className="shopper-details__citizenship-badge shopper-details__citizenship-badge--private">
                          Private
                        </span>
                      </td>
                      <td className="shopper-details__amount-cell">
                        ₱ {formatCurrency(giveawayStats.private.total)}
                      </td>
                      <td className="shopper-details__count-cell">
                        {giveawayStats.private.transactions}
                      </td>
                      <td className="shopper-details__average-cell">
                        ₱ {formatCurrency(giveawayStats.private.average)}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="shopper-details__table-row shopper-details__table-row--total">
                      <td className="shopper-details__citizenship-cell">
                        <strong>Total</strong>
                      </td>
                      <td className="shopper-details__amount-cell">
                        <strong>
                          ₱ {formatCurrency(
                            giveawayStats.mfatip.total + 
                            giveawayStats.public.total + 
                            giveawayStats.private.total
                          )}
                        </strong>
                      </td>
                      <td className="shopper-details__count-cell">
                        <strong>
                          {giveawayStats.mfatip.transactions + 
                           giveawayStats.public.transactions + 
                           giveawayStats.private.transactions}
                        </strong>
                      </td>
                      <td className="shopper-details__average-cell">
                        <strong>
                          ₱ {formatCurrency(
                            (giveawayStats.mfatip.total + 
                             giveawayStats.public.total + 
                             giveawayStats.private.total) /
                            Math.max(1, giveawayStats.mfatip.transactions + 
                                       giveawayStats.public.transactions + 
                                       giveawayStats.private.transactions)
                          )}
                        </strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Col>
  )
}