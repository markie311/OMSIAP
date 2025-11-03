"use client"
import '../../styles/businessportfolio/businessportfolio.scss';

import { useState, useEffect, useCallback } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { ArrowUpRight, ArrowDownRight, TrendingUp, MapPin, Clock, User, Package, DollarSign } from "lucide-react"

// Define colors explicitly with a more professional palette
const COLORS = {
  PRIMARY_BLUE: "#3b82f6",
  SECONDARY_BLUE: "#60a5fa",
  TEAL: "#14b8a6",
  ORANGE: "#f97316",
  RED: "#ef4444",
  PURPLE: "#8b5cf6",
  GREEN: "#22c55e",
  YELLOW: "#eab308",
  GRAY: "#6b7280",
}

const COLOR_PALETTE = [
  COLORS.PRIMARY_BLUE,
  COLORS.TEAL,
  COLORS.ORANGE,
  COLORS.PURPLE,
  COLORS.GREEN,
  COLORS.YELLOW,
  COLORS.RED,
]

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{`${label}`}</p>
        <p className="tooltip-data">{`Sales: $${payload[0].value.toLocaleString()}`}</p>
      </div>
    )
  }

  return null
}

// Custom formatter for Y-axis values
const formatYAxis = (value) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`
  }
  return `$${value}`
}

function BusinessPortfolio() {
  const [viewMode, setViewMode] = useState("monthly")
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedBusiness, setSelectedBusiness] = useState(null)

  // Full year of months
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  // Generate realistic sales data for the entire year
  const generateYearlySalesData = useCallback((baseValue, businessId) => {
    // Create a deterministic but seemingly random pattern based on the business ID
    const seed = businessId.charCodeAt(0) + businessId.charCodeAt(businessId.length - 1)

    return months.map((month, index) => {
      // Create seasonal variations
      let seasonalFactor = 1
      if (index < 2)
        seasonalFactor = 0.8 // Lower in Jan-Feb
      else if (index >= 10)
        seasonalFactor = 1.3 // Higher in Nov-Dec (holiday season)
      else if (index >= 5 && index <= 7) seasonalFactor = 1.1 // Slightly higher in summer

      // Create a growth trend throughout the year
      const growthFactor = 1 + index * 0.01

      // Add some controlled randomness
      const randomVariation = Math.sin(seed + index) * 0.15 + 1

      const sales = Math.floor(baseValue * seasonalFactor * growthFactor * randomVariation)

      return {
        month,
        sales,
        expenses: Math.floor(sales * (0.4 + Math.sin(index) * 0.1)), // Expenses as a varying percentage of sales
        profit: Math.floor(sales * (0.6 - Math.sin(index) * 0.1)), // Profit as the remainder
      }
    })
  }, [])

  // Generate quarterly data
  const generateQuarterlySalesData = useCallback((yearlySalesData) => {
    return [
      {
        quarter: "Q1",
        sales: yearlySalesData.slice(0, 3).reduce((sum, item) => sum + item.sales, 0),
        expenses: yearlySalesData.slice(0, 3).reduce((sum, item) => sum + item.expenses, 0),
        profit: yearlySalesData.slice(0, 3).reduce((sum, item) => sum + item.profit, 0),
      },
      {
        quarter: "Q2",
        sales: yearlySalesData.slice(3, 6).reduce((sum, item) => sum + item.sales, 0),
        expenses: yearlySalesData.slice(3, 6).reduce((sum, item) => sum + item.expenses, 0),
        profit: yearlySalesData.slice(3, 6).reduce((sum, item) => sum + item.profit, 0),
      },
      {
        quarter: "Q3",
        sales: yearlySalesData.slice(6, 9).reduce((sum, item) => sum + item.sales, 0),
        expenses: yearlySalesData.slice(6, 9).reduce((sum, item) => sum + item.expenses, 0),
        profit: yearlySalesData.slice(6, 9).reduce((sum, item) => sum + item.profit, 0),
      },
      {
        quarter: "Q4",
        sales: yearlySalesData.slice(9, 12).reduce((sum, item) => sum + item.sales, 0),
        expenses: yearlySalesData.slice(9, 12).reduce((sum, item) => sum + item.expenses, 0),
        profit: yearlySalesData.slice(9, 12).reduce((sum, item) => sum + item.profit, 0),
      },
    ]
  }, [])

  // Generate more realistic recent purchases
  const generateRecentPurchases = useCallback((businessId) => {
    const customers = [
      { name: "John Doe", location: "New York, NY" },
      { name: "Sarah Johnson", location: "Los Angeles, CA" },
      { name: "Michael Chen", location: "Chicago, IL" },
      { name: "Emma Wilson", location: "Austin, TX" },
      { name: "David Kim", location: "Seattle, WA" },
      { name: "Olivia Martinez", location: "Miami, FL" },
    ]

    const products = [
      { name: "Premium Tablet", basePrice: 899 },
      { name: "Ultra Laptop", basePrice: 1499 },
      { name: "Smart Phone Pro", basePrice: 1099 },
      { name: "Eco-Friendly Backpack", basePrice: 129 },
      { name: "Solar Power Bank", basePrice: 79 },
      { name: "Wireless Earbuds", basePrice: 199 },
    ]

    // Generate 3-5 recent purchases
    const count = 3 + Math.floor(Math.random() * 3)
    const purchases = []

    for (let i = 0; i < count; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)]
      const product = products[Math.floor(Math.random() * products.length)]

      // Generate a time within the last 12 hours
      const hours = Math.floor(Math.random() * 12)
      const minutes = Math.floor(Math.random() * 60)
      const ampm = hours < 6 ? "PM" : "AM"
      const time = `${hours === 0 ? 12 : hours % 12}:${minutes.toString().padStart(2, "0")} ${ampm}`

      // Slightly vary the price
      const priceVariation = 0.9 + Math.random() * 0.2 // 90% to 110% of base price
      const amount = Math.floor(product.basePrice * priceVariation)

      purchases.push({
        id: `${businessId}-${i}`,
        time,
        customerName: customer.name,
        customerLocation: customer.location,
        amount,
        productName: product.name,
      })
    }

    // Sort by most recent (assuming the random times represent most recent at the top)
    return purchases
  }, [])

  const [businesses, setBusinesses] = useState([
    {
      id: "001",
      name: "Tech Innovations Inc.",
      totalMonthlySales: 125000,
      todaySales: 4500,
      location: "San Francisco, CA",
      productsSold: 42,
      highlight: {
        topPerformer: true,
        growthRate: 25,
        specialBadge: "Top Tech",
      },
      salesByProduct: [
        { name: "Tablets", value: 450000 },
        { name: "Laptops", value: 550000 },
        { name: "Smartphones", value: 250000 },
        { name: "Accessories", value: 180000 },
      ],
      monthlySalesData: [],
      quarterlySalesData: [],
      recentPurchases: [],
    },
    {
      id: "002",
      name: "Green Retail Solutions",
      totalMonthlySales: 87500,
      todaySales: 2800,
      location: "Seattle, WA",
      productsSold: 28,
      highlight: {
        topPerformer: false,
        growthRate: 15,
        specialBadge: "Eco Innovator",
      },
      salesByProduct: [
        { name: "Eco Bags", value: 300000 },
        { name: "Reusable Bottles", value: 350000 },
        { name: "Solar Chargers", value: 225000 },
        { name: "Bamboo Products", value: 175000 },
      ],
      monthlySalesData: [],
      quarterlySalesData: [],
      recentPurchases: [],
    },
    {
      id: "003",
      name: "Urban Fashion Collective",
      totalMonthlySales: 105000,
      todaySales: 3200,
      location: "New York, NY",
      productsSold: 36,
      highlight: {
        topPerformer: false,
        growthRate: 18,
        specialBadge: "Trending",
      },
      salesByProduct: [
        { name: "Apparel", value: 420000 },
        { name: "Footwear", value: 380000 },
        { name: "Accessories", value: 250000 },
      ],
      monthlySalesData: [],
      quarterlySalesData: [],
      recentPurchases: [],
    },
  ])

  // Initialize data on component mount
  useEffect(() => {
    setBusinesses((prevBusinesses) =>
      prevBusinesses.map((business) => {
        const monthlySalesData = generateYearlySalesData(
          business.id === "001" ? 100000 : business.id === "002" ? 75000 : 85000,
          business.id,
        )

        return {
          ...business,
          monthlySalesData,
          quarterlySalesData: generateQuarterlySalesData(monthlySalesData),
          recentPurchases: generateRecentPurchases(business.id),
        }
      }),
    )
  }, [generateQuarterlySalesData, generateRecentPurchases, generateYearlySalesData])

  const calculateTotalSales = () => {
    return businesses.reduce((total, business) => total + business.totalMonthlySales, 0)
  }

  const calculateTotalProductsSold = () => {
    return businesses.reduce((total, business) => total + business.productsSold, 0)
  }

  // Calculate year-over-year growth
  const calculateYearlyGrowth = () => {
    // In a real app, this would compare to previous year's data
    // For demo purposes, we'll use a fixed value
    return 18.5
  }

  // Get the appropriate data based on view mode
  const getChartData = (business) => {
    if (viewMode === "quarterly") {
      return business.quarterlySalesData
    }
    return business.monthlySalesData
  }

  // Get the appropriate x-axis key based on view mode
  const getXAxisKey = () => {
    if (viewMode === "quarterly") {
      return "quarter"
    }
    return "month"
  }

  // Filter businesses if one is selected
  const displayedBusinesses = selectedBusiness ? businesses.filter((b) => b.id === selectedBusiness) : businesses

  return (
    <div className="business-portfolio">
      <header className="portfolio-header">
        <div className="header-top">
          <h1 className="main-title">Business Portfolio Dashboard</h1>
          <div className="header-controls">
            <div className="select-container">
              <select className="view-mode-select" value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
                <option value="monthly">Monthly View</option>
                <option value="quarterly">Quarterly View</option>
              </select>
            </div>

            <div className="select-container">
              <select
                className="business-select"
                value={selectedBusiness || "all"}
                onChange={(e) => setSelectedBusiness(e.target.value === "all" ? null : e.target.value)}
              >
                <option value="all">All Businesses</option>
                {businesses.map((business) => (
                  <option key={business.id} value={business.id}>
                    {business.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="total-metrics">
          <div className="metric-card">
            <div className="metric-card-content">
              <div className="metric-icon">
                <DollarSign className="icon" />
              </div>
              <div className="metric-data">
                <h3>Total Monthly Sales</h3>
                <div className="metric-value">${calculateTotalSales().toLocaleString()}</div>
                <div className="metric-growth">
                  <ArrowUpRight className="growth-icon" />
                  <span>{calculateYearlyGrowth()}% YoY</span>
                </div>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-card-content">
              <div className="metric-icon">
                <Package className="icon" />
              </div>
              <div className="metric-data">
                <h3>Total Products Sold</h3>
                <div className="metric-value">{calculateTotalProductsSold()}</div>
                <div className="metric-growth">
                  <TrendingUp className="growth-icon" />
                  <span>Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="businesses-grid">
        {displayedBusinesses.map((business) => (
          <div key={business.id} className={`business-card ${business.highlight.topPerformer ? "top-performer" : ""}`}>
            {business.highlight.specialBadge && <div className="special-badge">{business.highlight.specialBadge}</div>}

            <div className="business-header">
              <div className="business-info">
                <h2>{business.name}</h2>
                <p className="location">
                  <MapPin className="location-icon" size={14} />
                  {business.location}
                </p>
              </div>

              <div className="growth-indicator">
                <span>Growth</span>
                <strong
                  className={`growth-rate ${business.highlight.growthRate > 20 ? "high-growth" : "moderate-growth"}`}
                >
                  {business.highlight.growthRate}%
                  {business.highlight.growthRate > 0 ? (
                    <ArrowUpRight size={16} className="growth-icon" />
                  ) : (
                    <ArrowDownRight size={16} className="growth-down-icon" />
                  )}
                </strong>
              </div>
            </div>

            <div className="business-metrics">
              <div className="metric">
                <span>Monthly Sales</span>
                <strong>${business.totalMonthlySales.toLocaleString()}</strong>
              </div>
              <div className="metric">
                <span>Today's Sales</span>
                <strong>${business.todaySales.toLocaleString()}</strong>
              </div>
              <div className="metric">
                <span>Products Sold</span>
                <strong>{business.productsSold}</strong>
              </div>
            </div>

            <div className="business-tabs">
              <div className="tabs-list">
                <button
                  className={`tab-trigger ${viewMode === "sales" ? "active" : ""}`}
                  onClick={() => setViewMode("sales")}
                >
                  Sales Trend
                </button>
                <button
                  className={`tab-trigger ${viewMode === "products" ? "active" : ""}`}
                  onClick={() => setViewMode("products")}
                >
                  Product Mix
                </button>
                <button
                  className={`tab-trigger ${viewMode === "profitability" ? "active" : ""}`}
                  onClick={() => setViewMode("profitability")}
                >
                  Profitability
                </button>
              </div>

              <div className="tab-content">
                {viewMode === "sales" && (
                  <>
                    <h3>Sales Trend ({viewMode === "quarterly" ? "Quarterly" : "Monthly"})</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={getChartData(business)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey={getXAxisKey()} tick={{ fontSize: 12 }} axisLine={{ stroke: "#e5e7eb" }} />
                        <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12 }} axisLine={{ stroke: "#e5e7eb" }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="sales" fill={COLORS.PRIMARY_BLUE} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </>
                )}

                {viewMode === "products" && (
                  <>
                    <h3>Sales by Product</h3>
                    <div className="pie-chart-container">
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={business.salesByProduct}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {business.salesByProduct.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLOR_PALETTE[index % COLOR_PALETTE.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                )}

                {viewMode === "profitability" && (
                  <>
                    <h3>Revenue vs. Expenses ({viewMode === "quarterly" ? "Quarterly" : "Monthly"})</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={getChartData(business)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey={getXAxisKey()} tick={{ fontSize: 12 }} axisLine={{ stroke: "#e5e7eb" }} />
                        <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12 }} axisLine={{ stroke: "#e5e7eb" }} />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="sales"
                          stackId="1"
                          stroke={COLORS.PRIMARY_BLUE}
                          fill={COLORS.SECONDARY_BLUE}
                          name="Revenue"
                        />
                        <Area
                          type="monotone"
                          dataKey="expenses"
                          stackId="2"
                          stroke={COLORS.RED}
                          fill={COLORS.RED}
                          fillOpacity={0.6}
                          name="Expenses"
                        />
                        <Legend />
                      </AreaChart>
                    </ResponsiveContainer>
                  </>
                )}
              </div>
            </div>

            <div className="recent-purchases">
              <h3>Recent Purchases</h3>
              {business.recentPurchases.map((purchase) => (
                <div key={purchase.id} className="purchase-item">
                  <div className="purchase-details">
                    <div className="purchase-info">
                      <span className="purchase-time">
                        <Clock size={14} className="time-icon" />
                        {purchase.time}
                      </span>
                      <span className="purchase-amount">
                        <DollarSign size={14} className="amount-icon" />
                        {purchase.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="customer-details">
                      <p className="customer-name">
                        <User size={14} className="user-icon" />
                        {purchase.customerName}
                      </p>
                      <p className="customer-location">
                        <MapPin size={14} className="location-icon" />
                        {purchase.customerLocation}
                      </p>
                      <p className="product-name">
                        <Package size={14} className="package-icon" />
                        {purchase.productName}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BusinessPortfolio

