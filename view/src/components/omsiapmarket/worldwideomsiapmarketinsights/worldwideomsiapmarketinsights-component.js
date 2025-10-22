  import { useState, useEffect, useMemo } from "react";
  import { useNavigate } from "react-router-dom";
  import { motion, AnimatePresence } from "framer-motion";
  import { X } from "lucide-react";

  import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
  } from "recharts";

  import "../../../styles/omsiapmarket/worldwideomsiapmarketinsights/worldwideomsiapmarketinsights.scss";

  export default function WorldWideOmsiapMarketInsights({ alloftheproducts = [] }) {
    const navigate = useNavigate();
    const [activeModal, setActiveModal] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState("All");
    const [selectedYear, setSelectedYear] = useState("All");

    const closeModal = () => setActiveModal(null);
    const handleNavigateBack = () => navigate("/omsiapmarket");

    return (
      <div className="wwomi-root">
        {/* Back Button */}
        <button className="wwomi-back-button" onClick={handleNavigateBack} aria-label="Go back">
          &#x25c0;
        </button>

        {/* Header */}
        <header className="wwomi-header">
          <h1 className="wwomi-main-title">
            Welcome to <span className="wwomi-title-highlight">OMSIAP Market</span> Worldwide Insights
          </h1>
          <p className="wwomi-subtitle">
            Experience full market <span className="wwomi-accent">transparency</span> — explore the
            insights everyone deserves to see.
          </p>
        </header>

        {/* Content Grid */}
        <div className="wwomi-grid">
          {[
            { key: "sales", title: "Sales", desc: "Discover which products perform best each month.", cta: "Sales Insights" },
            { key: "locations", title: "Locations", desc: "Track the heartbeat of each market.", cta: "Location Insights" },
            { key: "people", title: "People", desc: "Gain insight into consumer behavior.", cta: "People Insights" },
          ].map((card) => (
            <div key={card.key} className="wwomi-card">
              <div className="wwomi-card-glow"></div>
              <h2 className="wwomi-card-title">{card.title}</h2>
              <p className="wwomi-card-description">
                {card.desc} <br />
                Click below to open the <span className="wwomi-accent-highlight">{card.cta}</span> panel.
              </p>
              <button className="wwomi-button" onClick={() => setActiveModal(card.key)}>
                {card.cta.toUpperCase()}
              </button>
            </div>
          ))}
        </div>

        {/* SALES MODAL */}
        {activeModal === "sales" && (
          <Modal title="Sales Insights" onClose={closeModal}>
            <SalesInsightsDisplay
              alloftheproducts={alloftheproducts}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              setSelectedMonth={setSelectedMonth}
              setSelectedYear={setSelectedYear}
            />
          </Modal>
        )}

          {/* LOCATIONS MODAL */}
          {activeModal === "locations" && (
          <Modal title="Location Insights" onClose={closeModal}>
              <LocationInsightsDisplay
              alloftheproducts={alloftheproducts}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              setSelectedMonth={setSelectedMonth}
              setSelectedYear={setSelectedYear}
              />
          </Modal>
        )}

        {/* PEOPLE MODAL */}
          {activeModal === "people" && (
          <Modal title="People Insights" onClose={closeModal}>
              <PeopleInsightsDisplay
              alloftheproducts={alloftheproducts}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              setSelectedMonth={setSelectedMonth}
              setSelectedYear={setSelectedYear}
              />
          </Modal>
          )}

      </div>
    );
  }

  function Modal({ title, onClose, children }) {
    return (
      <div className="wwomi-modal-overlay" onClick={onClose}>
        <div className="wwomi-modal-box" onClick={(e) => e.stopPropagation()}>
          <div className="wwomi-modal-header">
            <h2 className="wwomi-modal-title">{title}</h2>
            <button className="wwomi-modal-close" onClick={onClose} aria-label="Close modal">
              <X size={20} />
            </button>
          </div>
          <div className="wwomi-modal-body">{children}</div>
        </div>
      </div>
    );
  }

  /* --------------------------------------------- */
  /* SALES INSIGHTS DISPLAY COMPONENT */
  /* --------------------------------------------- */
  function SalesInsightsDisplay({
    alloftheproducts,
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
  }) {
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [expandedProduct, setExpandedProduct] = useState(null);

    // Extract dynamic month/year sets
    const months = useMemo(
      () => [
        "All",
        ...new Set(
          alloftheproducts.flatMap((p) =>
            p.system?.purchases?.accepted?.map((s) => s.date?.month || "")
          )
        ),
      ],
      [alloftheproducts]
    );

    const years = useMemo(
      () => [
        "All",
        ...new Set(
          alloftheproducts.flatMap((p) =>
            p.system?.purchases?.accepted?.map((s) => s.date?.year || "")
          )
        ),
      ],
      [alloftheproducts]
    );

    // Helper functions
    const getFilteredPurchases = (purchases) =>
      purchases.filter(
        (pur) =>
          (selectedMonth === "All" || pur.date?.month === selectedMonth) &&
          (selectedYear === "All" || pur.date?.year === selectedYear)
      );

    const getMerchandiseTotal = (purchases) =>
      purchases.reduce((sum, pur) => sum + (pur.ordersummary?.merchandisetotal || 0), 0);

    // Group data by category
    const categories = useMemo(() => {
      const result = {};
      alloftheproducts.forEach((p) => {
        const cat = p.details?.category || "Uncategorized";
        if (!result[cat]) result[cat] = [];
        result[cat].push(p);
      });
      return result;
    }, [alloftheproducts]);

    // Prepare chart data for categories
    const categoryChartData = useMemo(() => {
      return Object.entries(categories).map(([category, products]) => {
        const total = products.reduce((sum, p) => {
          const accepted = getFilteredPurchases(p.system?.purchases?.accepted || []);
          return sum + getMerchandiseTotal(accepted);
        }, 0);
        return { category, total };
      });
    }, [categories, selectedMonth, selectedYear]);

    // Trend data (monthly across all categories)
    const trendData = useMemo(() => {
      const monthTotals = {};
      alloftheproducts.forEach((product) => {
        (product.system?.purchases?.accepted || []).forEach((purchase) => {
          if (selectedYear !== "All" && purchase.date?.year !== selectedYear) return;
          const month = purchase.date?.month || "Unknown";
          monthTotals[month] =
            (monthTotals[month] || 0) + (purchase.ordersummary?.merchandisetotal || 0);
        });
      });
      return Object.entries(monthTotals).map(([month, total]) => ({ month, total }));
    }, [alloftheproducts, selectedYear]);

    return (
      <div className="sales-display-container">
        {/* Sort Header */}
        <div className="sales-sort-header">
          <div>
            <label>Month:</label>
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
              {months.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Year:</label>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              {years.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Charts Section */}
        <div className="sales-charts-container">
          <div className="sales-chart-card">
            <h3>Category Sales Overview</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={categoryChartData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="category" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#00ffb2" barSize={25} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="sales-chart-card">
            <h3>Monthly Sales Trend ({selectedYear !== "All" ? selectedYear : "All Years"})</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={trendData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#00ffb2" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category and Products */}
        <div className="sales-category-list">
          {Object.entries(categories).map(([category, products]) => {
            const categoryPurchases = products.flatMap(
              (p) => getFilteredPurchases(p.system?.purchases?.accepted || [])
            );
            const categoryTotal = getMerchandiseTotal(categoryPurchases);

            return (
              <div key={category} className="sales-category">
                <div
                  className="sales-category-header"
                  onClick={() =>
                    setExpandedCategory(expandedCategory === category ? null : category)
                  }
                >
                  <span className="sales-total">₱{categoryTotal.toLocaleString()}</span>
                  <span className="sales-name">{category}</span>
                </div>

                <AnimatePresence>
                  {expandedCategory === category && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="sales-product-list"
                    >
                      {products.map((product) => {
                        const productPurchases = getFilteredPurchases(
                          product.system?.purchases?.accepted || []
                        );
                        const productTotal = getMerchandiseTotal(productPurchases);

                        return (
                          <div key={product.details?.productname} className="sales-product">
                            <div
                              className="sales-product-header"
                              onClick={() =>
                                setExpandedProduct(
                                  expandedProduct === product.details?.productname
                                    ? null
                                    : product.details?.productname
                                )
                              }
                            >
                              <span className="sales-total">₱{productTotal.toLocaleString()}</span>
                              <span className="sales-name">{product.details?.productname}</span>
                            </div>

                            <AnimatePresence>
                              {expandedProduct === product.details?.productname && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="sales-spec-list"
                                >
                                  {/* PURCHASE ORDER SUMMARY INSERTION */}
                                  {productPurchases.map((purchase, i) => (
                                    <div key={i} className="wwomi-purchase-summary">
                                      <h4>Purchase Summary</h4>
                                      <div className="wwomi-summary-grid">
                                        <div className="item">
                                          <span>Merchandise Total:</span>
                                          <p>₱{purchase.ordersummary?.merchandisetotal?.toFixed(2)}</p>
                                        </div>
                                        <div className="item">
                                          <span>Shipping Total:</span>
                                          <p>₱{purchase.ordersummary?.shippingtotal?.toFixed(2)}</p>
                                        </div>
                                        <div className="item">
                                          <span>Processing Fee:</span>
                                          <p>₱{purchase.ordersummary?.processingfee?.toFixed(2)}</p>
                                        </div>
                                        <div className="item">
                                          <span>Total Capital:</span>
                                          <p>₱{purchase.ordersummary?.totalcapital?.toFixed(2)}</p>
                                        </div>
                                        <div className="item">
                                          <span>Transaction Giveaway:</span>
                                          <p>₱{purchase.ordersummary?.totaltransactiongiveaway?.toFixed(2)}</p>
                                        </div>
                                        <div className="item highlight">
                                          <span>Total Profit:</span>
                                          <p>₱{purchase.ordersummary?.totalprofit?.toFixed(2)}</p>
                                        </div>
                                        <div className="item">
                                          <span>Total Items:</span>
                                          <p>{purchase.ordersummary?.totalitems}</p>
                                        </div>
                                        <div className="item">
                                          <span>Total Weight:</span>
                                          <p>
                                            {purchase.ordersummary?.totalweightgrams}g (
                                            {purchase.ordersummary?.totalweightkilos}kg)
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function LocationInsightsDisplay({
    alloftheproducts,
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear
  }) {
    // 🧮 Aggregate purchase data by city or province
    const locationSummary = useMemo(() => {
      const summary = {};

      alloftheproducts.forEach((product) => {
        product.system?.purchases?.accepted?.forEach((purchase) => {
          const { city, province, country } = purchase.location || {};
          const key = `${city || "Unknown City"}, ${province || "Unknown Province"}, ${country || "Unknown Country"}`;
          const month = purchase.date?.month || "Unknown";
          const year = purchase.date?.year || "Unknown";

          // Only include matching month/year
          if (
            (!selectedMonth || month === selectedMonth) &&
            (!selectedYear || year === selectedYear)
          ) {
            if (!summary[key]) {
              summary[key] = {
                totalMerchandise: 0,
                totalShipping: 0,
                totalProfit: 0,
                totalCapital: 0,
                totalOrders: 0,
                totalItems: 0,
                purchases: []
              };
            }

            const order = purchase.ordersummary || {};
            summary[key].totalMerchandise += order.merchandisetotal || 0;
            summary[key].totalShipping += order.shippingtotal || 0;
            summary[key].totalProfit += order.totalprofit || 0;
            summary[key].totalCapital += order.totalcapital || 0;
            summary[key].totalItems += order.totalitems || 0;
            summary[key].totalOrders += 1;
            summary[key].purchases.push(purchase);
          }
        });
      });

      // Sort by total merchandise (highest first)
      return Object.entries(summary)
        .sort(([, a], [, b]) => b.totalMerchandise - a.totalMerchandise)
        .map(([location, stats]) => ({ location, ...stats }));
    }, [alloftheproducts, selectedMonth, selectedYear]);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="wwomi-location-insights"
      >
        {/* Filter Controls */}
        <div className="wwomi-filter-controls">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">All Months</option>
            {[
              "January","February","March","April","May","June",
              "July","August","September","October","November","December"
            ].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">All Years</option>
            {["2023","2024","2025","2026"].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Insights Summary */}
        {locationSummary.length === 0 ? (
          <p className="wwomi-empty">No purchases found for the selected filters.</p>
        ) : (
          <div className="wwomi-location-list">
            {locationSummary.map((loc, index) => (
              <motion.div
                key={index}
                className="wwomi-location-card"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="wwomi-location-title">{loc.location}</h3>
                <div className="wwomi-location-details">
                  <p><strong>Total Orders:</strong> {loc.totalOrders}</p>
                  <p><strong>Total Items:</strong> {loc.totalItems}</p>
                  <p><strong>Merchandise Total:</strong> ₱{loc.totalMerchandise.toFixed(2)}</p>
                  <p><strong>Shipping Total:</strong> ₱{loc.totalShipping.toFixed(2)}</p>
                  <p><strong>Total Capital:</strong> ₱{loc.totalCapital.toFixed(2)}</p>
                  <p><strong>Total Profit:</strong> ₱{loc.totalProfit.toFixed(2)}</p>
                </div>

                {/* Detailed purchases */}
                <div className="wwomi-location-purchases">
                  {loc.purchases.map((p, i) => (
                    <div key={i} className="wwomi-purchase-row">
                      <span>
                        <strong>{p.name.firstname} {p.name.lastname}</strong> — {p.date?.month} {p.date?.date}, {p.date?.year}
                      </span>
                      <span>₱{p.ordersummary?.merchandisetotal?.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    );
  }

  function PeopleInsightsDisplay({
    alloftheproducts,
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear
  }) {
    // Collect all accepted purchases from every product
    const allPurchases = useMemo(() => {
      if (!Array.isArray(alloftheproducts)) return [];
      return alloftheproducts.flatMap((product) => {
        const accepted = product.system?.purchases?.accepted || [];
        return accepted.map((purchase) => ({
          ...purchase,
          productName: product.details?.productname || "Unnamed Product"
        }));
      });
    }, [alloftheproducts]);

    // Filter by month/year (with “All” fallback)
    const filteredPurchases = useMemo(() => {
      return allPurchases.filter((purchase) => {
        const matchesMonth =
          selectedMonth.toLowerCase() === "all" ||
          purchase.date?.month?.toLowerCase() === selectedMonth.toLowerCase();

        const matchesYear =
          selectedYear.toLowerCase() === "all" ||
          purchase.date?.year?.toString() === selectedYear.toString();

        return matchesMonth && matchesYear;
      });
    }, [allPurchases, selectedMonth, selectedYear]);

    // Sort newest first
    const sortedPurchases = useMemo(() => {
      return [...filteredPurchases].sort((a, b) => {
        const dateA = new Date(`${a.date?.month} ${a.date?.date}, ${a.date?.year}`);
        const dateB = new Date(`${b.date?.month} ${b.date?.date}, ${b.date?.year}`);
        return dateB - dateA;
      });
    }, [filteredPurchases]);

    // Debug log
    useEffect(() => {
      console.log("People Insights Purchases:", sortedPurchases);
    }, [sortedPurchases]);

    return (
      <div className="wwomi-people-insights-container">
        <h2 className="wwomi-modal-title">People Insights</h2>

        {/* Filters */}
        <div className="wwomi-filter-bar">
          <div className="wwomi-filter-group">
            <label>Month:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {[
                "All",
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
              ].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="wwomi-filter-group">
            <label>Year:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {["All", "2023", "2024", "2025", "2026"].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="wwomi-purchases-list">
          {sortedPurchases.length === 0 ? (
            <p className="wwomi-no-data">
              No purchases found for {selectedMonth} {selectedYear}
            </p>
          ) : (
            sortedPurchases.map((purchase, idx) => (
              <div key={idx} className="wwomi-purchase-card">
                <div className="wwomi-purchase-header">
                  <h3>{purchase.name.firstname} {purchase.name.lastname}</h3>
                  <span className="wwomi-date">
                    {purchase.date.month} {purchase.date.date}, {purchase.date.year}
                  </span>
                </div>
                <p>
                  <strong>Product:</strong> {purchase.productName}
                </p>
                <p>
                  <strong>Location:</strong> {purchase.location.city},{" "}
                  {purchase.location.province}
                </p>
                <p>
                  <strong>Items:</strong> {purchase.ordersummary.totalitems}
                </p>
                <p>
                  <strong>Total:</strong> ₱
                  {purchase.ordersummary.merchandisetotal.toLocaleString()}
                </p>
                <p>
                  <strong>Profit:</strong> ₱
                  {purchase.ordersummary.totalprofit.toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }


