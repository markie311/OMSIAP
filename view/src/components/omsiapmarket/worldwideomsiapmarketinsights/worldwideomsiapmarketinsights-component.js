"use client"

import { useState, useMemo } from "react"

import { Col, Row } from 'react-bootstrap' 

import { motion, AnimatePresence } from "framer-motion"

import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, DollarSign, Package, Users, ArrowUpRight, ArrowDownRight } from "lucide-react"

import '../../../styles/omsiapmarket/worldwideomsiapmarketinsights/worldwideomsiapmarketinsights.scss'

const WorldWideOmsiapMarketInsights = ({ alloftheproducts = [] }) => {
  const [activeTab, setActiveTab] = useState("overview")
  const [detailsTab, setDetailsTab] = useState("accepted")
  const [selectedMonth, setSelectedMonth] = useState("All")
  const [selectedYear, setSelectedYear] = useState("All")

  const allPurchases = useMemo(() => {
    return alloftheproducts.flatMap((product) =>
      (product.system?.purchases?.total || []).map((purchase) => ({
        ...purchase,
        productName: product.details?.productname || "Unknown",
        productCategory: product.details?.category || "Uncategorized",
        productPrice: product.details?.price?.amount || 0,
        productCapital: product.details?.price?.capital || 0,
        status: "total",
      })),
    )
  }, [alloftheproducts])

  const acceptedPurchases = useMemo(() => {
    return alloftheproducts.flatMap((product) =>
      (product.system?.purchases?.accepted || []).map((purchase) => ({
        ...purchase,
        productName: product.details?.productname || "Unknown",
        productCategory: product.details?.category || "Uncategorized",
        productPrice: product.details?.price?.amount || 0,
        productCapital: product.details?.price?.capital || 0,
        status: "accepted",
      })),
    )
  }, [alloftheproducts])

  const pendingPurchases = useMemo(() => {
    return alloftheproducts.flatMap((product) =>
      (product.system?.purchases?.pending || []).map((purchase) => ({
        ...purchase,
        productName: product.details?.productname || "Unknown",
        productCategory: product.details?.category || "Uncategorized",
        productPrice: product.details?.price?.amount || 0,
        productCapital: product.details?.price?.capital || 0,
        status: "pending",
      })),
    )
  }, [alloftheproducts])

  const rejectedPurchases = useMemo(() => {
    return alloftheproducts.flatMap((product) =>
      (product.system?.purchases?.rejected || []).map((purchase) => ({
        ...purchase,
        productName: product.details?.productname || "Unknown",
        productCategory: product.details?.category || "Uncategorized",
        productPrice: product.details?.price?.amount || 0,
        productCapital: product.details?.price?.capital || 0,
        status: "rejected",
      })),
    )
  }, [alloftheproducts])

  const metrics = useMemo(() => {
    const calculateMetrics = (purchases) => {
      return {
        count: purchases.length,
        merchandiseTotal: purchases.reduce((sum, p) => sum + (p.ordersummary?.merchandisetotal || 0), 0),
        shippingTotal: purchases.reduce((sum, p) => sum + (p.ordersummary?.shippingtotal || 0), 0),
        processingFee: purchases.reduce((sum, p) => sum + (p.ordersummary?.processingfee || 0), 0),
        totalCapital: purchases.reduce((sum, p) => sum + (p.ordersummary?.totalcapital || 0), 0),
        totalGiveaway: purchases.reduce((sum, p) => sum + (p.ordersummary?.totaltransactiongiveaway || 0), 0),
        totalProfit: purchases.reduce((sum, p) => sum + (p.ordersummary?.totalprofit || 0), 0),
        totalItems: purchases.reduce((sum, p) => sum + (p.ordersummary?.totalitems || 0), 0),
        totalWeight: purchases.reduce((sum, p) => sum + (p.ordersummary?.totalweightgrams || 0), 0),
      }
    }

    return {
      total: calculateMetrics(allPurchases),
      accepted: calculateMetrics(acceptedPurchases),
      pending: calculateMetrics(pendingPurchases),
      rejected: calculateMetrics(rejectedPurchases),
    }
  }, [allPurchases, acceptedPurchases, pendingPurchases, rejectedPurchases])

  const trends = useMemo(() => {
    const totalRevenue = metrics.total.merchandiseTotal
    const acceptedRevenue = metrics.accepted.merchandiseTotal
    const pendingRevenue = metrics.pending.merchandiseTotal
    const totalProfit = metrics.total.totalProfit
    const acceptedProfit = metrics.accepted.totalProfit

    return {
      revenueGrowth: totalRevenue > 0 ? ((acceptedRevenue / totalRevenue) * 100).toFixed(1) : 0,
      profitMargin: acceptedRevenue > 0 ? ((acceptedProfit / acceptedRevenue) * 100).toFixed(1) : 0,
      conversionRate: allPurchases.length > 0 ? ((acceptedPurchases.length / allPurchases.length) * 100).toFixed(1) : 0,
      avgOrderValue: acceptedPurchases.length > 0 ? (acceptedRevenue / acceptedPurchases.length).toFixed(2) : 0,
    }
  }, [metrics, allPurchases, acceptedPurchases])

  const statusDistribution = useMemo(
    () => [
      { name: "Accepted", value: metrics.accepted.count, color: "#10b981" },
      { name: "Pending", value: metrics.pending.count, color: "#f59e0b" },
      { name: "Rejected", value: metrics.rejected.count, color: "#ef4444" },
    ],
    [metrics],
  )

  const monthlyTrend = useMemo(() => {
    const months = {}
    acceptedPurchases.forEach((purchase) => {
      const month = purchase.date?.month || "Unknown"
      if (!months[month]) {
        months[month] = { month, revenue: 0, profit: 0, orders: 0, items: 0 }
      }
      months[month].revenue += purchase.ordersummary?.merchandisetotal || 0
      months[month].profit += purchase.ordersummary?.totalprofit || 0
      months[month].orders += 1
      months[month].items += purchase.ordersummary?.totalitems || 0
    })
    return Object.values(months).length > 0 ? Object.values(months) : []
  }, [acceptedPurchases])

  const categoryPerformance = useMemo(() => {
    const categories = {}
    acceptedPurchases.forEach((purchase) => {
      const cat = purchase.productCategory || "Uncategorized"
      if (!categories[cat]) {
        categories[cat] = { category: cat, revenue: 0, profit: 0, orders: 0, items: 0 }
      }
      categories[cat].revenue += purchase.ordersummary?.merchandisetotal || 0
      categories[cat].profit += purchase.ordersummary?.totalprofit || 0
      categories[cat].orders += 1
      categories[cat].items += purchase.ordersummary?.totalitems || 0
    })
    return Object.values(categories).sort((a, b) => b.revenue - a.revenue)
  }, [acceptedPurchases])

  const profitMarginData = useMemo(() => {
    return acceptedPurchases
      .map((p) => ({
        name: p.productName.substring(0, 12),
        revenue: p.ordersummary?.merchandisetotal || 0,
        profit: p.ordersummary?.totalprofit || 0,
        margin:
          p.ordersummary?.merchandisetotal > 0
            ? (((p.ordersummary?.totalprofit || 0) / (p.ordersummary?.merchandisetotal || 1)) * 100).toFixed(1)
            : 0,
      }))
      .filter((p) => p.revenue > 0)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 12)
  }, [acceptedPurchases])

  const topProducts = useMemo(() => {
    const products = {}
    acceptedPurchases.forEach((purchase) => {
      const name = purchase.productName
      if (!products[name]) {
        products[name] = { name, revenue: 0, profit: 0, orders: 0, items: 0 }
      }
      products[name].revenue += purchase.ordersummary?.merchandisetotal || 0
      products[name].profit += purchase.ordersummary?.totalprofit || 0
      products[name].orders += 1
      products[name].items += purchase.ordersummary?.totalitems || 0
    })
    return Object.values(products)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8)
  }, [acceptedPurchases])

  return (
    <div className="wwomi-analytics-root">

      <Col id="wwomi-backbuttoncontainer">
        <button id="wwomi-backbuttoncontainer-backbutton"
                onClick={()=> {
                  window.history.back()
                }}>&larr;</button>
      </Col>

      {/* Header */}
      <motion.header
        className="wwomi-analytics-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="wwomi-header-content">
          <h1 className="wwomi-analytics-title">
            <span className="wwomi-title-gradient">Market Analytics Dashboard</span>
          </h1>
          <p className="wwomi-analytics-subtitle">
            Real-time purchase insights and comprehensive financial performance metrics
          </p>
        </div>
      </motion.header>

      {/* KPI Cards */}
      <motion.div
        className="wwomi-kpi-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <KPICard
          icon={<DollarSign size={24} />}
          label="Total Revenue"
          value={`₱${metrics.accepted.merchandiseTotal.toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
          trend={`${trends.revenueGrowth}% conversion`}
          color="from-blue-600 to-cyan-500"
          isPositive={true}
        />
        <KPICard
          icon={<TrendingUp size={24} />}
          label="Total Profit"
          value={`₱${metrics.accepted.totalProfit.toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
          trend={`${trends.profitMargin}% margin`}
          color="from-emerald-600 to-teal-500"
          isPositive={true}
        />
        <KPICard
          icon={<Package size={24} />}
          label="Total Orders"
          value={metrics.accepted.count.toLocaleString()}
          trend={`Avg: ₱${trends.avgOrderValue}`}
          color="from-purple-600 to-pink-500"
          isPositive={true}
        />
        <KPICard
          icon={<Users size={24} />}
          label="Total Items Sold"
          value={metrics.accepted.totalItems.toLocaleString()}
          trend={`${trends.conversionRate}% success rate`}
          color="from-orange-600 to-red-500"
          isPositive={true}
        />
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        className="wwomi-tab-navigation"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {["overview", "financial", "performance", "details"].map((tab) => (
          <button
            key={tab}
            className={`wwomi-tab-button ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </motion.div>

      {/* Content Sections */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="wwomi-tab-content"
          >
            <div className="wwomi-charts-grid">
              {/* Status Distribution */}
              <div className="wwomi-chart-card">
                <h3 className="wwomi-chart-title">Purchase Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => value.toLocaleString()} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Monthly Trend */}
              <div className="wwomi-chart-card">
                <h3 className="wwomi-chart-title">Monthly Revenue Trend</h3>
                {monthlyTrend.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyTrend}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="month" stroke="#999" />
                      <YAxis stroke="#999" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #0ea5e9" }}
                        formatter={(value) => `₱${value.toLocaleString()}`}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#0ea5e9"
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="wwomi-empty-state">No monthly data available</div>
                )}
              </div>

              {/* Top Products */}
              <div className="wwomi-chart-card wwomi-chart-card-full">
                <h3 className="wwomi-chart-title">Top Products by Revenue</h3>
                {topProducts.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topProducts}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" stroke="#999" angle={-45} textAnchor="end" height={80} />
                      <YAxis stroke="#999" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #0ea5e9" }}
                        formatter={(value) => `₱${value.toLocaleString()}`}
                      />
                      <Legend />
                      <Bar dataKey="revenue" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="profit" fill="#10b981" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="wwomi-empty-state">No product data available</div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "financial" && (
          <motion.div
            key="financial"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="wwomi-tab-content"
          >
            <div className="wwomi-charts-grid">
              {/* Category Performance */}
              <div className="wwomi-chart-card wwomi-chart-card-full">
                <h3 className="wwomi-chart-title">Category Performance Analysis</h3>
                {categoryPerformance.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={categoryPerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="category" stroke="#999" />
                      <YAxis stroke="#999" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #0ea5e9" }}
                        formatter={(value) => `₱${value.toLocaleString()}`}
                      />
                      <Legend />
                      <Bar dataKey="revenue" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="profit" fill="#10b981" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="orders" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="wwomi-empty-state">No category data available</div>
                )}
              </div>

              {/* Profit Margin Analysis */}
              <div className="wwomi-chart-card wwomi-chart-card-full">
                <h3 className="wwomi-chart-title">Profit Margin by Product</h3>
                {profitMarginData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={profitMarginData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" stroke="#999" angle={-45} textAnchor="end" height={80} />
                      <YAxis stroke="#999" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #0ea5e9" }}
                        formatter={(value) => `${value}%`}
                      />
                      <Bar dataKey="margin" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="wwomi-empty-state">No profit margin data available</div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "performance" && (
          <motion.div
            key="performance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="wwomi-tab-content"
          >
            <div className="wwomi-metrics-breakdown">
              <MetricsComparison metrics={metrics} />
            </div>
          </motion.div>
        )}

        {activeTab === "details" && (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="wwomi-tab-content"
          >
            <div className="wwomi-details-tab-navigation">
              {[
                { key: "total", label: "Total", count: allPurchases.length },
                { key: "accepted", label: "Accepted", count: acceptedPurchases.length },
                { key: "pending", label: "Pending", count: pendingPurchases.length },
                { key: "rejected", label: "Rejected", count: rejectedPurchases.length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  className={`wwomi-details-tab-button ${detailsTab === tab.key ? "active" : ""}`}
                  onClick={() => setDetailsTab(tab.key)}
                >
                  {tab.label} <span className="wwomi-tab-count">{tab.count}</span>
                </button>
              ))}
            </div>

            <DetailedPurchaseList
              purchases={
                detailsTab === "total"
                  ? allPurchases
                  : detailsTab === "accepted"
                    ? acceptedPurchases
                    : detailsTab === "pending"
                      ? pendingPurchases
                      : rejectedPurchases
              }
              status={detailsTab}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              setSelectedMonth={setSelectedMonth}
              setSelectedYear={setSelectedYear}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const KPICard = ({ icon, label, value, trend, color, isPositive }) => (
  <motion.div
    className={`wwomi-kpi-card bg-gradient-to-br ${color}`}
    whileHover={{ scale: 1.05, y: -5 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="wwomi-kpi-icon">{icon}</div>
    <div className="wwomi-kpi-content">
      <p className="wwomi-kpi-label">{label}</p>
      <h3 className="wwomi-kpi-value">{value}</h3>
      <span className={`wwomi-kpi-trend ${isPositive ? "positive" : "negative"}`}>
        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {trend}
      </span>
    </div>
  </motion.div>
)

const MetricsComparison = ({ metrics }) => (
  <div className="wwomi-metrics-grid">
    {Object.entries(metrics).map(([status, data]) => (
      <motion.div
        key={status}
        className="wwomi-metrics-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="wwomi-metrics-header">
          <h3 className="wwomi-metrics-title capitalize">{status} Purchases</h3>
          <span className="wwomi-metrics-count">{data.count}</span>
        </div>
        <div className="wwomi-metrics-items">
          <MetricItem
            label="Revenue"
            value={`₱${data.merchandiseTotal.toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
            highlight
          />
          <MetricItem
            label="Profit"
            value={`₱${data.totalProfit.toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
            highlight
          />
          <MetricItem
            label="Shipping"
            value={`₱${data.shippingTotal.toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
          />
          <MetricItem
            label="Capital"
            value={`₱${data.totalCapital.toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
          />
          <MetricItem label="Items" value={data.totalItems} />
          <MetricItem label="Weight" value={`${(data.totalWeight / 1000).toFixed(2)}kg`} />
          <MetricItem
            label="Giveaway"
            value={`₱${data.totalGiveaway.toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
          />
          <MetricItem
            label="Fee"
            value={`₱${data.processingFee.toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
          />
        </div>
      </motion.div>
    ))}
  </div>
)

const MetricItem = ({ label, value, highlight }) => (
  <motion.div className={`wwomi-metric-item ${highlight ? "highlight" : ""}`} whileHover={{ x: 5 }}>
    <span className="wwomi-metric-label">{label}</span>
    <span className="wwomi-metric-value">{value}</span>
  </motion.div>
)

const DetailedPurchaseList = ({
  purchases,
  status,
  selectedMonth,
  selectedYear,
  setSelectedMonth,
  setSelectedYear,
}) => {
  const filteredPurchases = useMemo(() => {
    return purchases.filter((p) => {
      const monthMatch = selectedMonth === "All" || p.date?.month === selectedMonth
      const yearMatch = selectedYear === "All" || p.date?.year === selectedYear
      return monthMatch && yearMatch
    })
  }, [purchases, selectedMonth, selectedYear])

  const months = useMemo(() => {
    const unique = new Set(purchases.map((p) => p.date?.month).filter(Boolean))
    return ["All", ...Array.from(unique).sort()]
  }, [purchases])

  const years = useMemo(() => {
    const unique = new Set(purchases.map((p) => p.date?.year).filter(Boolean))
    return ["All", ...Array.from(unique).sort()]
  }, [purchases])

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "border-l-green-500"
      case "pending":
        return "border-l-yellow-500"
      case "rejected":
        return "border-l-red-500"
      default:
        return "border-l-blue-500"
    }
  }

  return (
    <div className="wwomi-purchase-list-container">
      <div className="wwomi-filter-bar">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="wwomi-filter-select"
        >
          {months.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="wwomi-filter-select">
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <div className="wwomi-filter-info">
          Showing {filteredPurchases.length} of {purchases.length} purchases
        </div>
      </div>

      {filteredPurchases.length > 0 ? (
        <div className="wwomi-purchase-cards">
          {filteredPurchases.map((purchase, idx) => (
            <motion.div
              key={idx}
              className={`wwomi-purchase-card-detailed ${getStatusColor(status)}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              whileHover={{ y: -5 }}
            >
              <div className="wwomi-purchase-header-detailed">
                <div>
                  <h4>
                    {purchase.identification?.name?.firstname} {purchase.identification?.name?.lastname}
                  </h4>
                  <span className="wwomi-purchase-date">
                    {purchase.date?.month} {purchase.date?.date}, {purchase.date?.year}
                  </span>
                </div>
                <span className={`wwomi-status-badge wwomi-status-${status}`}>{status.toUpperCase()}</span>
              </div>
              <div className="wwomi-purchase-details-grid">
                <div className="wwomi-detail-item">
                  <span>Product</span>
                  <p>{purchase.productName}</p>
                </div>
                <div className="wwomi-detail-item">
                  <span>Category</span>
                  <p>{purchase.productCategory}</p>
                </div>
                <div className="wwomi-detail-item">
                  <span>Location</span>
                  <p>
                    {purchase.location?.city}, {purchase.location?.province}
                  </p>
                </div>
                <div className="wwomi-detail-item">
                  <span>Items</span>
                  <p>{purchase.ordersummary?.totalitems}</p>
                </div>
                <div className="wwomi-detail-item">
                  <span>Revenue</span>
                  <p className="wwomi-value-highlight">
                    ₱
                    {(purchase.ordersummary?.merchandisetotal || 0).toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="wwomi-detail-item">
                  <span>Profit</span>
                  <p className="wwomi-value-profit">
                    ₱{(purchase.ordersummary?.totalprofit || 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="wwomi-detail-item">
                  <span>Shipping</span>
                  <p>
                    ₱{(purchase.ordersummary?.shippingtotal || 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="wwomi-detail-item">
                  <span>Capital</span>
                  <p>
                    ₱{(purchase.ordersummary?.totalcapital || 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="wwomi-empty-state">No purchases found for the selected filters</div>
      )}
    </div>
  )
}

export default WorldWideOmsiapMarketInsights
