
<header className="database-header">
<h1>Database Management System</h1>
<div className="date-display">
  <Clock size={18} />
  <span>
    {new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}
  </span>
</div>
</header>

<div className="stats-container">
<div className="stat-card clickable" onClick={() => openModal("mfatipRegistrants")}>
  <Users size={24} />
  <div className="stat-info">
    <h3>MFATIP Registrants</h3>
    <p>{stats.mfatipRegistrants}</p>
  </div>
</div>
<div className="stat-card clickable" onClick={() => openModal("publicCitizens")}>
  <Users size={24} />
  <div className="stat-info">
    <h3>Public Citizens</h3>
    <p>{stats.publicCitizens}</p>
  </div>
</div>
<div className="stat-card clickable" onClick={() => openModal("privateCitizens")}>
  <Users size={24} />
  <div className="stat-info">
    <h3>Private Citizens</h3>
    <p>{stats.privateCitizens}</p>
  </div>
</div>
<div className="stat-card clickable" onClick={() => openModal("pendingProductOrders")}>
  <Package size={24} />
  <div className="stat-info">
    <h3>Pending Orders</h3>
    <p>{stats.pendingProductOrders}</p>
  </div>
</div>
<div className="stat-card clickable" onClick={() => openModal("pendingDeposits")}>
  <DollarSign size={24} />
  <div className="stat-info">
    <h3>Pending Deposits</h3>
    <p>{stats.pendingDeposits}</p>
  </div>
</div>
<div className="stat-card clickable" onClick={() => openModal("pendingWithdrawals")}>
  <DollarSign size={24} />
  <div className="stat-info">
    <h3>Pending Withdrawals</h3>
    <p>{stats.pendingWithdrawals}</p>
  </div>
</div>
<div className="stat-card clickable" onClick={() => openAnalyticsModal("acceptedOrders")}>
  <BarChart size={24} />
  <div className="stat-info">
    <h3>Accepted Orders</h3>
    <p>{stats.acceptedOrders}</p>
  </div>
</div>
<div className="stat-card clickable" onClick={() => openAnalyticsModal("successfulDeposits")}>
  <TrendingUp size={24} />
  <div className="stat-info">
    <h3>Successful Deposits</h3>
    <p>{stats.successfulDeposits}</p>
  </div>
</div>
<div className="stat-card clickable" onClick={() => openAnalyticsModal("successfulWithdrawals")}>
  <Calendar size={24} />
  <div className="stat-info">
    <h3>Successful Withdrawals</h3>
    <p>{stats.successfulWithdrawals}</p>
  </div>
</div>
</div>

<div className="tabs-container">
<button
  className={`tab-button ${activeTab === "dashboard" ? "active" : ""}`}
  onClick={() => setActiveTab("dashboard")}
>
  Dashboard
</button>
<button
  className={`tab-button ${activeTab === "products" ? "active" : ""}`}
  onClick={() => setActiveTab("products")}
>
  Products
</button>
<button className={`tab-button ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
  Users
</button>
<button
  className={`tab-button ${activeTab === "transactions" ? "active" : ""}`}
  onClick={() => setActiveTab("transactions")}
>
  Transactions
</button>
<button
  className={`tab-button ${activeTab === "orders" ? "active" : ""}`}
  onClick={() => setActiveTab("orders")}
>
  Orders
</button>
</div>

<div className="tab-content">
{/* Dashboard Tab */}
{activeTab === "dashboard" && (
  <div className="dashboard-container">
    <h2>Dashboard Overview</h2>

    <div className="dashboard-cards">
      <div className="dashboard-card">
        <h3>Recent Registrations</h3>
        <div className="dashboard-list">
          {users.slice(0, 5).map((user) => (
            <div key={user.id} className="dashboard-list-item">
              <div className="dashboard-item-info">
                <p className="item-title">
                  {user.name.firstname} {user.name.lastname}
                </p>
                <p className="item-subtitle">
                  {user.status.type} • {user.status.indication}
                </p>
              </div>
              <span className="dashboard-item-date">
                {user.status.requests.length > 0 ? formatDate(user.status.requests[0].date) : "N/A"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-card">
        <h3>Recent Transactions</h3>
        <div className="dashboard-list">
          {transactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="dashboard-list-item">
              <div className="dashboard-item-info">
                <p className="item-title">
                  {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                </p>
                <p className="item-subtitle">
                  ₱{transaction.amount.toLocaleString()} • {transaction.status}
                </p>
              </div>
              <span className="dashboard-item-date">{formatDate(transaction.date)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-card">
        <h3>Low Stock Products</h3>
        <div className="dashboard-list">
          {products
            .filter((p) => p.stock < 10)
            .map((product) => (
              <div key={product.id} className="dashboard-list-item">
                <div className="dashboard-item-info">
                  <p className="item-title">{product.name}</p>
                  <p className="item-subtitle">
                    Stock: {product.stock} • ₱{product.price.toLocaleString()}
                  </p>
                </div>
                <span className={`stock-indicator ${product.stock < 5 ? "critical" : "warning"}`}>
                  {product.stock < 5 ? "Critical" : "Low"}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  </div>
)}

{/* Products Tab */}
{activeTab === "products" && (
  <div className="products-container">
    <div className="tab-header">
      <h2>Products Management</h2>
      <div className="action-buttons">
        <div className="search-container">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={productSearchTerm}
            onChange={(e) => setProductSearchTerm(e.target.value)}
          />
        </div>
        <button
          className="add-button"
          onClick={() => {
            setCurrentProduct(null)
            setShowProductForm(true)
          }}
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>
    </div>

    {showProductForm && (
      <div className="form-overlay">
        <div className="form-container">
          <h3>{currentProduct ? "Edit Product" : "Add New Product"}</h3>
          <form onSubmit={handleProductSubmit}>
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <input type="text" id="name" name="name" defaultValue={currentProduct?.name || ""} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price (₱)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  step="0.01"
                  defaultValue={currentProduct?.price || ""}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  defaultValue={currentProduct?.category || ""}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                defaultValue={currentProduct?.description || ""}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="weight">Weight (grams)</label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  defaultValue={currentProduct?.weightingrams || ""}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="stock">Stock</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  defaultValue={currentProduct?.stock || ""}
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" onClick={() => setShowProductForm(false)}>
                Cancel
              </button>
              <button type="submit">{currentProduct ? "Update" : "Add"} Product</button>
            </div>
          </form>
        </div>
      </div>
    )}

    <div className="data-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>₱{product.price.toLocaleString()}</td>
              <td className={product.stock < 10 ? "low-stock" : ""}>{product.stock}</td>
              <td>
                <div className="action-icons">
                  <button
                    className="edit-icon"
                    onClick={() => {
                      setCurrentProduct(product)
                      setShowProductForm(true)
                    }}
                  >
                    <Edit size={16} />
                  </button>
                  <button className="delete-icon" onClick={() => deleteProduct(product.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

{/* Users Tab */}
{activeTab === "users" && (
  <div className="users-container">
    <div className="tab-header">
      <h2>Users Management</h2>
      <div className="action-buttons">
        <div className="search-container">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search users..."
            value={userSearchTerm}
            onChange={(e) => setUserSearchTerm(e.target.value)}
          />
        </div>
        <button
          className="add-button"
          onClick={() => {
            setCurrentUser(null)
            setShowUserForm(true)
          }}
        >
          <Plus size={18} />
          Add User
        </button>
      </div>
    </div>

    {showUserForm && (
      <div className="form-overlay">
        <div className="form-container">
          <h3>{currentUser ? "Edit User" : "Add New User"}</h3>
          <form onSubmit={handleUserSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstname">First Name</label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  defaultValue={currentUser?.name.firstname || ""}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastname">Last Name</label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  defaultValue={currentUser?.name.lastname || ""}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="middlename">Middle Name</label>
                <input
                  type="text"
                  id="middlename"
                  name="middlename"
                  defaultValue={currentUser?.name.middlename || ""}
                />
              </div>
              <div className="form-group">
                <label htmlFor="nickname">Nickname</label>
                <input
                  type="text"
                  id="nickname"
                  name="nickname"
                  defaultValue={currentUser?.name.nickname || ""}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  defaultValue={currentUser?.contact.emailaddress || ""}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phonenumber">Phone Number</label>
                <input
                  type="text"
                  id="phonenumber"
                  name="phonenumber"
                  defaultValue={currentUser?.contact.phonenumber || ""}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="usertype">User Type</label>
              <select id="usertype" name="usertype" defaultValue={currentUser?.status.type || "MFATIP"}>
                <option value="MFATIP">MFATIP</option>
                <option value="Public Citizen">Public Citizen</option>
                <option value="Private Citizen">Private Citizen</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="button" onClick={() => setShowUserForm(false)}>
                Cancel
              </button>
              <button type="submit">{currentUser ? "Update" : "Add"} User</button>
            </div>
          </form>
        </div>
      </div>
    )}

    <div className="data-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                {user.name.firstname} {user.name.lastname}
              </td>
              <td>{user.contact.emailaddress}</td>
              <td>{user.status.type}</td>
              <td>{user.status.indication}</td>
              <td>
                <div className="action-icons">
                  <button
                    className="edit-icon"
                    onClick={() => {
                      setCurrentUser(user)
                      setShowUserForm(true)
                    }}
                  >
                    <Edit size={16} />
                  </button>
                  <button className="delete-icon" onClick={() => deleteUser(user.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

{/* Transactions Tab */}
{activeTab === "transactions" && (
  <div className="transactions-container">
    <div className="tab-header">
      <h2>Transactions Management</h2>
      <div className="action-buttons">
        <div className="search-container">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={transactionSearchTerm}
            onChange={(e) => setTransactionSearchTerm(e.target.value)}
          />
        </div>
        <button
          className="add-button"
          onClick={() => {
            setCurrentTransaction(null)
            setShowTransactionForm(true)
          }}
        >
          <Plus size={18} />
          Add Transaction
        </button>
      </div>
    </div>

    {showTransactionForm && (
      <div className="form-overlay">
        <div className="form-container">
          <h3>{currentTransaction ? "Edit Transaction" : "Add New Transaction"}</h3>
          <form onSubmit={handleTransactionSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  defaultValue={currentTransaction?.date || new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="type">Type</label>
                <select id="type" name="type" defaultValue={currentTransaction?.type || "deposit"}>
                  <option value="deposit">Deposit</option>
                  <option value="withdrawal">Withdrawal</option>
                  <option value="purchase">Purchase</option>
                  <option value="refund">Refund</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="amount">Amount (₱)</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  step="0.01"
                  defaultValue={currentTransaction?.amount || ""}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select id="status" name="status" defaultValue={currentTransaction?.status || "pending"}>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="paymentmethod">Payment Method</label>
              <select
                id="paymentmethod"
                name="paymentmethod"
                defaultValue={currentTransaction?.paymentmethod || "bank transfer"}
              >
                <option value="bank transfer">Bank Transfer</option>
                <option value="credit card">Credit Card</option>
                <option value="cash">Cash</option>
                <option value="e-wallet">E-Wallet</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="button" onClick={() => setShowTransactionForm(false)}>
                Cancel
              </button>
              <button type="submit">{currentTransaction ? "Update" : "Add"} Transaction</button>
            </div>
          </form>
        </div>
      </div>
    )}

    <div className="data-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Payment Method</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{formatDate(transaction.date)}</td>
              <td className={`transaction-type ${transaction.type}`}>
                {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
              </td>
              <td>₱{transaction.amount.toLocaleString()}</td>
              <td className={`transaction-status ${transaction.status}`}>
                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
              </td>
              <td>{transaction.paymentmethod}</td>
              <td>
                <div className="action-icons">
                  <button
                    className="edit-icon"
                    onClick={() => {
                      setCurrentTransaction(transaction)
                      setShowTransactionForm(true)
                    }}
                  >
                    <Edit size={16} />
                  </button>
                  <button className="delete-icon" onClick={() => deleteTransaction(transaction.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

{/* Orders Tab */}
{activeTab === "orders" && (
  <div className="orders-container">
    <div className="tab-header">
      <h2>Orders Management</h2>
      <div className="action-buttons">
        <div className="search-container">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search orders..."
            value={transactionSearchTerm}
            onChange={(e) => setTransactionSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </div>

    <div className="data-table">
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions
            .filter((transaction) => transaction.type === "order")
            .map((order) => {
              const customer = users.find((user) => user.id === order.userId) || {
                name: { firstname: "Unknown", lastname: "Customer" },
              }
              return (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{formatDate(order.date)}</td>
                  <td>
                    {customer.name.firstname} {customer.name.lastname}
                  </td>
                  <td>₱{order.amount.toLocaleString()}</td>
                  <td className={`transaction-status ${order.status}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </td>
                  <td>
                    <div className="action-icons">
                      <button
                        className="view-icon"
                        onClick={() => {
                          setSelectedOrder(order)
                          setShowOrderDetails(true)
                        }}
                      >
                        <Eye size={16} />
                      </button>
                      {order.status === "pending" && (
                        <>
                          <button className="accept-icon" onClick={() => confirmAcceptOrder(order.id)}>
                            <Check size={16} />
                          </button>
                          <button className="reject-icon" onClick={() => confirmRejectOrder(order.id)}>
                            <X size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>
    </div>
  </div>
)}
</div>

{/* Order Details Modal */}
{showOrderDetails && selectedOrder && (
<div className="form-overlay">
  <div className="form-container order-details-container">
    <div className="order-details-header">
      <h3>Order Details</h3>
      <div className={`order-status ${selectedOrder.status}`}>
        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
      </div>
    </div>

    <div className="order-details-section">
      <h4>Order Information</h4>
      <div className="order-info-grid">
        <div className="order-info-item">
          <span className="info-label">Order ID:</span>
          <span className="info-value">{selectedOrder.id}</span>
        </div>
        <div className="order-info-item">
          <span className="info-label">Date:</span>
          <span className="info-value">{formatDate(selectedOrder.date)}</span>
        </div>
        <div className="order-info-item">
          <span className="info-label">Payment Method:</span>
          <span className="info-value">{selectedOrder.paymentmethod}</span>
        </div>
        <div className="order-info-item">
          <span className="info-label">Total Amount:</span>
          <span className="info-value">₱{selectedOrder.amount.toLocaleString()}</span>
        </div>
      </div>
    </div>

    <div className="order-details-section">
      <h4>Products</h4>
      <div className="order-products-list">
        {selectedOrder.details.products.map((product, index) => (
          <div key={index} className="order-product-item">
            <div className="product-info">
              <h5>{product.name}</h5>
              <div className="product-details">
                <span>Quantity: {product.quantity}</span>
                <span>Price: ₱{product.price.toLocaleString()}</span>
              </div>
            </div>
            <div className="product-total">₱{(product.price * product.quantity).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>

    <div className="order-details-section">
      <h4>Shipping Information</h4>
      <div className="shipping-info">
        <p>{selectedOrder.details.shippingInfo.address}</p>
        <p>
          {selectedOrder.details.shippingInfo.city}, {selectedOrder.details.shippingInfo.state}{" "}
          {selectedOrder.details.shippingInfo.zipCode}
        </p>
        <p>{selectedOrder.details.shippingInfo.country}</p>
      </div>
    </div>

    <div className="order-details-section">
      <h4>Order Summary</h4>
      <div className="order-summary">
        <div className="summary-item">
          <span>Merchandise Total:</span>
          <span>₱{selectedOrder.details.orderSummary.merchandiseTotal.toLocaleString()}</span>
        </div>
        <div className="summary-item">
          <span>Shipping Total:</span>
          <span>₱{selectedOrder.details.orderSummary.shippingTotal.toLocaleString()}</span>
        </div>
        <div className="summary-item">
          <span>Transaction Giveaway:</span>
          <span>₱{selectedOrder.details.orderSummary.totalTransactionGiveaway.toLocaleString()}</span>
        </div>
        <div className="summary-item">
          <span>Omsia Profit:</span>
          <span>₱{selectedOrder.details.orderSummary.totalOmsiaProfit.toLocaleString()}</span>
        </div>
        <div className="summary-item">
          <span>Capital:</span>
          <span>₱{selectedOrder.details.orderSummary.totalCapital.toLocaleString()}</span>
        </div>
        <div className="summary-item total">
          <span>Total:</span>
          <span>₱{selectedOrder.details.orderSummary.total.toLocaleString()}</span>
        </div>
      </div>
    </div>

    <div className="order-actions">
      {selectedOrder.status === "pending" && (
        <>
          <button className="reject-button" onClick={() => confirmRejectOrder(selectedOrder.id)}>
            <X size={16} />
            Reject Order
          </button>
          <button className="accept-button" onClick={() => confirmAcceptOrder(selectedOrder.id)}>
            <Check size={16} />
            Accept Order
          </button>
        </>
      )}
      <button
        className="close-button"
        onClick={() => {
          setShowOrderDetails(false)
          setSelectedOrder(null)
        }}
      >
        Close
      </button>
    </div>
  </div>
</div>
)}

{/* Fullscreen Analytics Modal */}
{showFullscreenModal && (
<div className="fullscreen-modal-overlay">
  <div className="fullscreen-modal-container">
    <div className="fullscreen-modal-header">
      <h2>{modalTitle}</h2>
      <button className="close-fullscreen-button" onClick={() => setShowFullscreenModal(false)}>
        <X size={24} />
      </button>
    </div>

    {/* MFATIP Registrants, Public Citizens, Private Citizens */}
    {(modalType === "mfatipRegistrants" ||
      modalType === "publicCitizens" ||
      modalType === "privateCitizens") && (
      <div className="fullscreen-modal-content">
        <div className="user-stats-summary">
          <div className="user-stat-card">
            <h3>Total {modalTitle}</h3>
            <p className="user-stat-value">{modalData.length}</p>
          </div>
          <div className="user-stat-card">
            <h3>Active Users</h3>
            <p className="user-stat-value">
              {modalData.filter((user) => user.loginstatus === "logged in").length}
            </p>
          </div>
          <div className="user-stat-card">
            <h3>Average Credits</h3>
            <p className="user-stat-value">
              ₱
              {(
                modalData.reduce((sum, user) => sum + user.credits.omsiapawasto.amount, 0) / modalData.length ||
                0
              ).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="user-management-controls">
          <div className="search-container">
            <Search size={18} />
            <input
              type="text"
              placeholder={`Search ${modalTitle}...`}
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="add-button"
            onClick={() =>
              addUserOfType(
                modalType === "mfatipRegistrants"
                  ? "MFATIP"
                  : modalType === "publicCitizens"
                    ? "Public Citizen"
                    : "Private Citizen",
              )
            }
          >
            <Plus size={18} />
            Add{" "}
            {modalType === "mfatipRegistrants"
              ? "MFATIP User"
              : modalType === "publicCitizens"
                ? "Public Citizen"
                : "Private Citizen"}
          </button>
        </div>

        <div className="user-list-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Credits</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {modalData
                .filter(
                  (user) =>
                    `${user.name.firstname} ${user.name.lastname}`
                      .toLowerCase()
                      .includes(userSearchTerm.toLowerCase()) ||
                    user.contact.emailaddress.toLowerCase().includes(userSearchTerm.toLowerCase()),
                )
                .map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>
                      {user.name.firstname} {user.name.lastname}
                    </td>
                    <td>{user.contact.emailaddress}</td>
                    <td>{user.contact.phonenumber}</td>
                    <td>{user.status.indication}</td>
                    <td>₱{user.credits.omsiapawasto.amount}</td>
                    <td>
                      <div className="action-icons">
                        <button
                          className="view-icon"
                          title="View Details"
                          onClick={() => viewUserDetails(user)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="edit-icon"
                          title="Edit User"
                          onClick={() => {
                            setCurrentUser(user)
                            setShowUserForm(true)
                            setShowFullscreenModal(false)
                          }}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="delete-icon"
                          title="Delete User"
                          onClick={() => {
                            setConfirmationTitle("Delete User")
                            setConfirmationMessage(
                              `Are you sure you want to delete ${user.name.firstname} ${user.name.lastname}?`,
                            )
                            setConfirmationAction(() => () => {
                              deleteUser(user.id)
                              setModalData(modalData.filter((item) => item.id !== user.id))

                              // Update stats based on user type
                              if (user.status.type === "MFATIP") {
                                setStats({
                                  ...stats,
                                  mfatipRegistrants: stats.mfatipRegistrants - 1,
                                })
                              } else if (user.status.type === "Public Citizen") {
                                setStats({
                                  ...stats,
                                  publicCitizens: stats.publicCitizens - 1,
                                })
                              } else if (user.status.type === "Private Citizen") {
                                setStats({
                                  ...stats,
                                  privateCitizens: stats.privateCitizens - 1,
                                })
                              }
                              setShowConfirmationModal(false)
                            })
                            setShowConfirmationModal(true)
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    )}

    {/* Pending Product Orders */}
    {modalType === "pendingProductOrders" && (
      <div className="fullscreen-modal-content">
        <div className="orders-summary">
          <div className="order-stat-card">
            <h3>Pending Orders</h3>
            <p className="order-stat-value">{modalData.length}</p>
          </div>
          <div className="order-stat-card">
            <h3>Total Value</h3>
            <p className="order-stat-value">
              ₱{modalData.reduce((sum, order) => sum + order.amount, 0).toLocaleString()}
            </p>
          </div>
          <div className="order-stat-card">
            <h3>Avg. Order Value</h3>
            <p className="order-stat-value">
              ₱
              {(
                modalData.reduce((sum, order) => sum + order.amount, 0) / (modalData.length || 1)
              ).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="orders-list-container">
          <div className="search-container">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search orders by ID..."
              value={transactionSearchTerm}
              onChange={(e) => setTransactionSearchTerm(e.target.value)}
            />
          </div>

          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Products</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {modalData
                .filter((order) => order.id.toLowerCase().includes(transactionSearchTerm.toLowerCase()))
                .map((order) => {
                  const customer = users.find((user) => user.id === order.userId) || {
                    name: { firstname: "Unknown", lastname: "Customer" },
                  }
                  return (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{formatDate(order.date)}</td>
                      <td>
                        {customer.name.firstname} {customer.name.lastname}
                      </td>
                      <td>{order.details.products.map((product) => product.name).join(", ")}</td>
                      <td>₱{order.amount.toLocaleString()}</td>
                      <td>
                        <div className="action-icons">
                          <button
                            className="view-icon"
                            title="View Details"
                            onClick={() => {
                              setSelectedOrder(order)
                              setShowOrderDetails(true)
                              setShowFullscreenModal(false)
                            }}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="accept-icon"
                            title="Accept Order"
                            onClick={() => {
                              confirmAcceptOrder(order.id)
                            }}
                          >
                            <Check size={16} />
                          </button>
                          <button
                            className="reject-icon"
                            title="Reject Order"
                            onClick={() => {
                              confirmRejectOrder(order.id)
                            }}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </div>
    )}

    {/* Pending Deposits */}
    {modalType === "pendingDeposits" && (
      <div className="fullscreen-modal-content">
        <div className="deposits-summary">
          <div className="deposit-stat-card">
            <h3>Pending Deposits</h3>
            <p className="deposit-stat-value">{modalData.length}</p>
          </div>
          <div className="deposit-stat-card">
            <h3>Total Value</h3>
            <p className="deposit-stat-value">
              ₱{modalData.reduce((sum, deposit) => sum + deposit.amount, 0).toLocaleString()}
            </p>
          </div>
          <div className="deposit-stat-card">
            <h3>Avg. Deposit</h3>
            <p className="deposit-stat-value">
              ₱
              {(
                modalData.reduce((sum, deposit) => sum + deposit.amount, 0) / (modalData.length || 1)
              ).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="deposits-by-method">
          <h3>Deposits by Payment Method</h3>
          <div className="payment-method-bars">
            {Object.entries(
              modalData.reduce((acc, deposit) => {
                acc[deposit.paymentmethod] = (acc[deposit.paymentmethod] || 0) + 1
                return acc
              }, {}),
            ).map(([method, count]) => (
              <div key={method} className="payment-method-bar">
                <div className="method-label">{method}</div>
                <div className="method-bar-container">
                  <div
                    className="method-bar"
                    style={{
                      width: `${(count / modalData.length) * 100}%`,
                    }}
                  ></div>
                  <span className="method-count">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="deposits-list-container">
          <div className="search-container">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search deposits..."
              value={transactionSearchTerm}
              onChange={(e) => setTransactionSearchTerm(e.target.value)}
            />
          </div>

          <table>
            <thead>
              <tr>
                <th>Deposit ID</th>
                <th>Date</th>
                <th>User</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {modalData
                .filter((deposit) => deposit.id.toLowerCase().includes(transactionSearchTerm.toLowerCase()))
                .map((deposit) => {
                  const user = users.find((user) => user.id === deposit.userId) || {
                    name: { firstname: "Unknown", lastname: "User" },
                  }
                  return (
                    <tr key={deposit.id}>
                      <td>{deposit.id}</td>
                      <td>{formatDate(deposit.date)}</td>
                      <td>
                        {user.name.firstname} {user.name.lastname}
                      </td>
                      <td>₱{deposit.amount.toLocaleString()}</td>
                      <td>{deposit.paymentmethod}</td>
                      <td>
                        <div className="action-icons">
                          <button
                            className="accept-icon"
                            title="Accept Deposit"
                            onClick={() => {
                              confirmAcceptDeposit(deposit.id)
                            }}
                          >
                            <Check size={16} />
                          </button>
                          <button
                            className="reject-icon"
                            title="Reject Deposit"
                            onClick={() => {
                              confirmRejectDeposit(deposit.id)
                            }}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </div>
    )}

    {/* Pending Withdrawals */}
    {modalType === "pendingWithdrawals" && (
      <div className="fullscreen-modal-content">
        <div className="withdrawals-summary">
          <div className="withdrawal-stat-card">
            <h3>Pending Withdrawals</h3>
            <p className="withdrawal-stat-value">{modalData.length}</p>
          </div>
          <div className="withdrawal-stat-card">
            <h3>Total Value</h3>
            <p className="withdrawal-stat-value">
              ₱{modalData.reduce((sum, withdrawal) => sum + withdrawal.amount, 0).toLocaleString()}
            </p>
          </div>
          <div className="withdrawal-stat-card">
            <h3>Avg. Withdrawal</h3>
            <p className="withdrawal-stat-value">
              ₱
              {(
                modalData.reduce((sum, withdrawal) => sum + withdrawal.amount, 0) / (modalData.length || 1)
              ).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="withdrawals-timeline">
          <h3>Withdrawal Requests Timeline</h3>
          <div className="timeline-container">
            {modalData
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map((withdrawal, index) => (
                <div key={withdrawal.id} className="timeline-item">
                  <div className="timeline-date">{formatDate(withdrawal.date)}</div>
                  <div className="timeline-connector"></div>
                  <div className="timeline-content">
                    <div className="timeline-id">{withdrawal.id}</div>
                    <div className="timeline-amount">₱{withdrawal.amount.toLocaleString()}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="withdrawals-list-container">
          <div className="search-container">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search withdrawals..."
              value={transactionSearchTerm}
              onChange={(e) => setTransactionSearchTerm(e.target.value)}
            />
          </div>

          <table>
            <thead>
              <tr>
                <th>Withdrawal ID</th>
                <th>Date</th>
                <th>User</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {modalData
                .filter((withdrawal) =>
                  withdrawal.id.toLowerCase().includes(transactionSearchTerm.toLowerCase()),
                )
                .map((withdrawal) => {
                  const user = users.find((user) => user.id === withdrawal.userId) || {
                    name: { firstname: "Unknown", lastname: "User" },
                  }
                  return (
                    <tr key={withdrawal.id}>
                      <td>{withdrawal.id}</td>
                      <td>{formatDate(withdrawal.date)}</td>
                      <td>
                        {user.name.firstname} {user.name.lastname}
                      </td>
                      <td>₱{withdrawal.amount.toLocaleString()}</td>
                      <td>{withdrawal.paymentmethod}</td>
                      <td>
                        <div className="action-icons">
                          <button
                            className="accept-icon"
                            title="Accept Withdrawal"
                            onClick={() => {
                              confirmAcceptWithdrawal(withdrawal.id)
                            }}
                          >
                            <Check size={16} />
                          </button>
                          <button
                            className="reject-icon"
                            title="Reject Withdrawal"
                            onClick={() => {
                              confirmRejectWithdrawal(withdrawal.id)
                            }}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </div>
    )}

    {/* Analytics Modals (acceptedOrders, successfulDeposits, successfulWithdrawals) */}
    {(modalType === "acceptedOrders" ||
      modalType === "successfulDeposits" ||
      modalType === "successfulWithdrawals") && (
      <div className="fullscreen-modal-content">
        <div className="analytics-controls">
          <div className="analytics-type-selector">
            <button
              className={`analytics-type-button ${analyticsType === "daily" ? "active" : ""}`}
              onClick={() => setAnalyticsType("daily")}
            >
              Daily
            </button>
            <button
              className={`analytics-type-button ${analyticsType === "monthly" ? "active" : ""}`}
              onClick={() => setAnalyticsType("monthly")}
            >
              Monthly
            </button>
            <button
              className={`analytics-type-button ${analyticsType === "yearly" ? "active" : ""}`}
              onClick={() => setAnalyticsType("yearly")}
            >
              Yearly
            </button>
          </div>

          {analyticsType !== "yearly" && (
            <div className="year-selector">
              <button onClick={() => setAnalyticsYear(analyticsYear - 1)}>
                <ChevronLeft size={18} />
              </button>
              <span>{analyticsYear}</span>
              <button onClick={() => setAnalyticsYear(analyticsYear + 1)}>
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          {analyticsType === "daily" && (
            <div className="month-selector">
              <button onClick={() => setAnalyticsMonth(analyticsMonth > 0 ? analyticsMonth - 1 : 11)}>
                <ChevronLeft size={18} />
              </button>
              <span>
                {new Date(analyticsYear, analyticsMonth, 1).toLocaleString("default", { month: "long" })}
              </span>
              <button onClick={() => setAnalyticsMonth(analyticsMonth < 11 ? analyticsMonth + 1 : 0)}>
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        <div className="analytics-summary">
          <div className="analytics-card">
            <h3>Total Transactions</h3>
            <p className="analytics-value">{modalData.length}</p>
          </div>
          <div className="analytics-card">
            <h3>Total Amount</h3>
            <p className="analytics-value">
              ₱{modalData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
            </p>
          </div>
          <div className="analytics-card">
            <h3>Average Amount</h3>
            <p className="analytics-value">
              ₱
              {(modalData.reduce((sum, item) => sum + item.amount, 0) / (modalData.length || 1)).toLocaleString(
                undefined,
                { maximumFractionDigits: 2 },
              )}
            </p>
          </div>
        </div>

        <div className="analytics-chart-container">
          <h3>
            {modalTitle} by {analyticsType === "daily" ? "Day" : analyticsType === "monthly" ? "Month" : "Year"}
          </h3>
          <div className="analytics-chart">
            {Object.entries(generateAnalyticsData()).map(([key, data]) => (
              <div key={key} className="chart-bar-container">
                <div
                  className="chart-bar"
                  style={{
                    height: `${Math.max(5, (data.total / (modalData.reduce((max, item) => Math.max(max, item.amount), 0) || 1)) * 100)}%`,
                  }}
                >
                  <span className="chart-value">₱{data.total.toLocaleString()}</span>
                </div>
                <span className="chart-label">{getAnalyticsPeriodLabel(key)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-table-container">
          <h3>Detailed Transactions</h3>
          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {modalData.map((item) => {
                  const itemDate = new Date(item.date)
                  // Filter based on selected time period
                  if (
                    analyticsType === "yearly" ||
                    (analyticsType === "monthly" && itemDate.getFullYear() === analyticsYear) ||
                    (analyticsType === "daily" &&
                      itemDate.getFullYear() === analyticsYear &&
                      itemDate.getMonth() === analyticsMonth)
                  ) {
                    return (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{formatDate(item.date)}</td>
                        <td>₱{item.amount.toLocaleString()}</td>
                        <td>{item.paymentmethod}</td>
                        <td>
                          <button
                            className="view-icon"
                            onClick={() => {
                              if (modalType === "acceptedOrders") {
                                setSelectedOrder(item)
                                setShowOrderDetails(true)
                                setShowFullscreenModal(false)
                              }
                            }}
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    )
                  }
                  return null
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )}
  </div>
</div>
)}

{/* User Details Modal */}
{showUserDetailsModal && selectedUser && (
<div className="form-overlay">
  <div className="form-container user-details-container">
    <div className="user-details-header">
      <h3>User Details</h3>
      <div className={`user-status ${selectedUser.status.indication.toLowerCase()}`}>
        {selectedUser.status.type} - {selectedUser.status.indication}
      </div>
    </div>

    <div className="user-details-content">
      <div className="user-details-section">
        <h4>Personal Information</h4>
        <div className="user-info-grid">
          <div className="user-info-item">
            <span className="info-label">Full Name:</span>
            <span className="info-value">
              {selectedUser.name.firstname} {selectedUser.name.middlename} {selectedUser.name.lastname}
            </span>
          </div>
          <div className="user-info-item">
            <span className="info-label">Nickname:</span>
            <span className="info-value">{selectedUser.name.nickname || "N/A"}</span>
          </div>
          <div className="user-info-item">
            <span className="info-label">Age:</span>
            <span className="info-value">{selectedUser.personalinformation?.age || "N/A"}</span>
          </div>
          <div className="user-info-item">
            <span className="info-label">Gender:</span>
            <span className="info-value">{selectedUser.personalinformation?.sex || "N/A"}</span>
          </div>
          <div className="user-info-item">
            <span className="info-label">Date of Birth:</span>
            <span className="info-value">
              {selectedUser.personalinformation?.dob ? formatDate(selectedUser.personalinformation.dob) : "N/A"}
            </span>
          </div>
          <div className="user-info-item">
            <span className="info-label">Blood Type:</span>
            <span className="info-value">{selectedUser.personalinformation?.bloodtype || "N/A"}</span>
          </div>
          <div className="user-info-item">
            <span className="info-label">Citizenship:</span>
            <span className="info-value">{selectedUser.personalinformation?.citizenship || "N/A"}</span>
          </div>
          <div className="user-info-item">
            <span className="info-label">Civil Status:</span>
            <span className="info-value">{selectedUser.personalinformation?.civil_status || "N/A"}</span>
          </div>
          <div className="user-info-item">
            <span className="info-label">ID Type:</span>
            <span className="info-value">
              {selectedUser.personalinformation?.government_issued_identification || "N/A"}
            </span>
          </div>
        </div>
      </div>

      <div className="user-details-section">
        <h4>Contact Information</h4>
        <div className="user-info-grid">
          <div className="user-info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{selectedUser.contact.emailaddress}</span>
          </div>
          <div className="user-info-item">
            <span className="info-label">Phone Number:</span>
            <span className="info-value">{selectedUser.contact.phonenumber}</span>
          </div>
          <div className="user-info-item">
            <span className="info-label">Telephone:</span>
            <span className="info-value">{selectedUser.contact.telephonenumber || "N/A"}</span>
          </div>
          <div className="user-info-item full-width">
            <span className="info-label">Address:</span>
            <span className="info-value">
              {selectedUser.contact.address.street ? (
                <>
                  {selectedUser.contact.address.street}, {selectedUser.contact.address.baranggay},
                  {selectedUser.contact.address.city}, {selectedUser.contact.address.province},
                  {selectedUser.contact.address.country}
                </>
              ) : (
                "No address provided"
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="user-details-section">
        <h4>Account Information</h4>
        <div className="user-info-grid">
          <div className="user-info-item">
            <span className="info-label">User ID:</span>
            <span className="info-value">{selectedUser.id}</span>
          </div>
          <div className="user-info-item">
            <span className="info-label">Login Status:</span>
            <span className="info-value status-indicator">
              <span
                className={`status-dot ${selectedUser.loginstatus === "logged in" ? "active" : "inactive"}`}
              ></span>
              {selectedUser.loginstatus === "logged in" ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="user-info-item">
            <span className="info-label">OMSIA Credit ID:</span>
            <span className="info-value">{selectedUser.credits.omsiapawasto.id}</span>
          </div>
          <div className="user-info-item">
            <span className="info-label">Credit Balance:</span>
            <span className="info-value credit-balance">₱{selectedUser.credits.omsiapawasto.amount}</span>
          </div>
        </div>
      </div>

      <div className="user-details-section">
        <h4>Registration History</h4>
        <div className="registration-timeline">
          {selectedUser.status.requests.map((request, index) => (
            <div key={index} className="timeline-event">
              <div className="timeline-date">{formatDate(request.date)}</div>
              <div className="timeline-content">
                <div className="timeline-title">{request.purpose}</div>
                <div className="timeline-message">{request.message}</div>
                <div className="timeline-status">{request.status}</div>
              </div>
            </div>
          ))}
          {selectedUser.status.requests.length === 0 && (
            <p className="no-data-message">No registration history available</p>
          )}
        </div>
      </div>

      <div className="user-details-section">
        <h4>Transaction History</h4>
        <div className="transaction-history">
          {transactions
            .filter((transaction) => transaction.userId === selectedUser.id)
            .map((transaction, index) => (
              <div key={index} className="transaction-item">
                <div className="transaction-header">
                  <span className={`transaction-type ${transaction.type}`}>
                    {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                  </span>
                  <span className="transaction-date">{formatDate(transaction.date)}</span>
                </div>
                <div className="transaction-details">
                  <div className="transaction-id">ID: {transaction.id}</div>
                  <div className="transaction-amount">₱{transaction.amount.toLocaleString()}</div>
                  <div className={`transaction-status ${transaction.status}`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </div>
                </div>
              </div>
            ))}
          {transactions.filter((transaction) => transaction.userId === selectedUser.id).length === 0 && (
            <p className="no-data-message">No transaction history available</p>
          )}
        </div>
      </div>
    </div>

    <div className="user-details-actions">
      <button
        className="edit-button"
        onClick={() => {
          setCurrentUser(selectedUser)
          setShowUserForm(true)
          setShowUserDetailsModal(false)
        }}
      >
        <Edit size={16} />
        Edit User
      </button>
      <button
        className="close-button"
        onClick={() => {
          setShowUserDetailsModal(false)
          setSelectedUser(null)
        }}
      >
        Close
      </button>
    </div>
  </div>
</div>
)}

{/* Confirmation Modal */}
{showConfirmationModal && (
<div className="form-overlay">
  <div className="form-container confirmation-modal">
    <h3>{confirmationTitle}</h3>
    <p className="confirmation-message">{confirmationMessage}</p>
    <div className="confirmation-actions">
      <button className="cancel-button" onClick={() => setShowConfirmationModal(false)}>
        Cancel
      </button>
      <button className="confirm-button" onClick={confirmationAction}>
        Confirm
      </button>
    </div>
  </div>
</div>
)}