import { useState, useEffect } from "react";
import axios from "axios";

import "../styles/customers.css";

import {
  FiSearch,
  FiEye,
  FiMail,
  FiPhone,
  FiRefreshCw,
  FiX,
  FiMapPin,
  FiHome,
  FiCalendar,
  FiShoppingBag,
  FiDollarSign,
} from "react-icons/fi";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  const [selectedCustomer, setSelectedCustomer] =
    useState(null);

  // =====================================================
  // FETCH CUSTOMERS
  // =====================================================

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:5000/api/orders/customers/all"
      );

      console.log(
        "CUSTOMERS:",
        response.data
      );

      if (Array.isArray(response.data)) {
        setCustomers(response.data);
      } else if (
        Array.isArray(response.data.customers)
      ) {
        setCustomers(
          response.data.customers
        );
      } else {
        setCustomers([]);
        setError(
          "Invalid customer data received."
        );
      }
    } catch (err) {
      console.error(
        "Customer fetch error:",
        err
      );

      setCustomers([]);

      setError(
        err.response?.data?.message ||
        "Unable to load customers."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD CUSTOMERS
  // =====================================================

  useEffect(() => {
    fetchCustomers();
  }, []);

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredCustomers =
    customers.filter((customer) => {
      const query =
        searchQuery
          .toLowerCase()
          .trim();

      if (!query) return true;

      return (
        customer.name
          ?.toLowerCase()
          .includes(query) ||

        customer.email
          ?.toLowerCase()
          .includes(query) ||

        customer.phone
          ?.toLowerCase()
          .includes(query) ||

        customer.city
          ?.toLowerCase()
          .includes(query)
      );
    });

  // =====================================================
  // CUSTOMER BADGE
  // =====================================================

  const getCustomerBadge = (orders) => {
    if (orders > 5)
      return "VIP Customer";

    if (orders > 2)
      return "Premium Customer";

    return "Regular";
  };

  // =====================================================
  // MONEY
  // =====================================================

  const formatMoney = (amount) => {
    return Number(
      amount || 0
    ).toLocaleString("en-IN");
  };

  // =====================================================
  // DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // OPEN CUSTOMER
  // =====================================================

  const openCustomer = (customer) => {
    setSelectedCustomer(customer);
  };

  // =====================================================
  // CLOSE CUSTOMER
  // =====================================================

  const closeCustomer = () => {
    setSelectedCustomer(null);
  };

  return (
    <div className="cgt-cust-main-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="cgt-cust-page-header">

        <div>
          <h1>Customers</h1>

          <p>
            Manage your customers
          </p>
        </div>

        <button
          className="cgt-cust-refresh-btn"
          onClick={fetchCustomers}
          disabled={loading}
        >
          <FiRefreshCw
            className={
              loading
                ? "cgt-cust-refresh-spin"
                : ""
            }
          />

          <span>
            Refresh
          </span>
        </button>

      </div>

      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="cgt-cust-filter-toolbar">

        <div className="cgt-cust-search-box">

          <FiSearch />

          <input
            type="text"
            placeholder="Search customer..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(
                e.target.value
              )
            }
          />

        </div>

      </div>

      {/* =================================================
          COUNT
      ================================================= */}

      <div className="cgt-cust-count">

        {loading
          ? "Loading customers..."
          : `${filteredCustomers.length} ${
              filteredCustomers.length === 1
                ? "Customer"
                : "Customers"
            }`
        }

      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="cgt-cust-table-panel">

        {/* LOADING */}

        {loading && (

          <div className="cgt-cust-state">

            <div className="cgt-cust-loader"></div>

            <h3>
              Loading customers...
            </h3>

            <p>
              Fetching customer data
            </p>

          </div>

        )}

        {/* ERROR */}

        {!loading &&
          error && (

            <div className="cgt-cust-state">

              <div className="cgt-cust-error-icon">
                !
              </div>

              <h3>
                Failed to load customers
              </h3>

              <p>
                {error}
              </p>

              <button
                className="cgt-cust-retry-btn"
                onClick={
                  fetchCustomers
                }
              >
                Try Again
              </button>

            </div>

          )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          filteredCustomers.length === 0 && (

            <div className="cgt-cust-state">

              <FiSearch />

              <h3>
                No customers found
              </h3>

              <p>
                Try searching with another
                name, email or phone number.
              </p>

            </div>

          )}

        {/* TABLE */}

        {!loading &&
          !error &&
          filteredCustomers.length > 0 && (

            <div className="cgt-cust-table-wrapper">

              <table className="cgt-cust-data-grid">

                <thead>

                  <tr>

                    <th>
                      Customer
                    </th>

                    <th>
                      Email
                    </th>

                    <th>
                      Phone
                    </th>

                    <th>
                      Orders
                    </th>

                    <th>
                      Total Spent
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredCustomers.map(
                    (customer, index) => {

                      // NO GUEST CUSTOMER FALLBACK
                      const name =
                        customer.name?.trim() ||
                        "";

                      const initial =
                        name
                          ? name
                              .charAt(0)
                              .toUpperCase()
                          : "?";

                      const ordersCount =
                        Number(
                          customer.ordersCount ||
                          0
                        );

                      const totalSpent =
                        Number(
                          customer.totalSpent ||
                          0
                        );

                      const badge =
                        getCustomerBadge(
                          ordersCount
                        );

                      return (

                        <tr
                          key={
                            customer._id ||
                            customer.email ||
                            index
                          }
                        >

                          {/* CUSTOMER */}

                          <td>

                            <div className="cgt-cust-profile-info">

                              <div className="cgt-cust-user-avatar">
                                {initial}
                              </div>

                              <div>

                                {/* ONLY SHOW NAME IF AVAILABLE */}

                                {name && (
                                  <h4>
                                    {name}
                                  </h4>
                                )}

                                <span>
                                  {badge}
                                </span>

                              </div>

                            </div>

                          </td>

                          {/* EMAIL */}

                          <td>

                            <div className="cgt-cust-contact">

                              <FiMail />

                              <span>
                                {customer.email ||
                                  "N/A"}
                              </span>

                            </div>

                          </td>

                          {/* PHONE */}

                          <td>

                            <div className="cgt-cust-contact">

                              <FiPhone />

                              <span>
                                {customer.phone &&
                                customer.phone !==
                                  "N/A"
                                  ? customer.phone
                                  : "N/A"}
                              </span>

                            </div>

                          </td>

                          {/* ORDERS */}

                          <td>

                            <span className="cgt-cust-orders-count">

                              {ordersCount}

                            </span>

                          </td>

                          {/* TOTAL */}

                          <td>

                            <strong className="cgt-cust-total">

                              ₹
                              {formatMoney(
                                totalSpent
                              )}

                            </strong>

                          </td>

                          {/* ACTION */}

                          <td>

                            <button
                              className="cgt-cust-action-view"
                              title="View customer"
                              onClick={() =>
                                openCustomer(
                                  customer
                                )
                              }
                            >

                              <FiEye />

                            </button>

                          </td>

                        </tr>

                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

      </div>

      {/* =================================================
          CUSTOMER DETAILS MODAL
      ================================================= */}

      {selectedCustomer && (

        <div
          className="cgt-customer-modal-overlay"
          onClick={closeCustomer}
        >

          <div
            className="cgt-customer-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="cgt-customer-modal-header">

              <div>

                <h2>
                  Customer Details
                </h2>

                <p>
                  Complete customer information
                </p>

              </div>

              <button
                className="cgt-customer-modal-close"
                onClick={closeCustomer}
              >
                <FiX />
              </button>

            </div>

            {/* PROFILE */}

            <div className="cgt-customer-modal-profile">

              <div className="cgt-customer-big-avatar">

                {selectedCustomer.name
                  ? selectedCustomer.name
                      .charAt(0)
                      .toUpperCase()
                  : "?"}

              </div>

              <div>

                {/* NO GUEST CUSTOMER TEXT */}

                {selectedCustomer.name && (
                  <h3>
                    {selectedCustomer.name}
                  </h3>
                )}

                <span>
                  {getCustomerBadge(
                    Number(
                      selectedCustomer.ordersCount ||
                      0
                    )
                  )}
                </span>

              </div>

            </div>

            {/* INFORMATION */}

            <div className="cgt-customer-info-grid">

              {/* EMAIL */}

              <div className="cgt-customer-info-card">

                <div className="cgt-customer-info-icon">
                  <FiMail />
                </div>

                <div>

                  <small>
                    Email
                  </small>

                  <strong>
                    {selectedCustomer.email ||
                      "N/A"}
                  </strong>

                </div>

              </div>

              {/* PHONE */}

              <div className="cgt-customer-info-card">

                <div className="cgt-customer-info-icon">
                  <FiPhone />
                </div>

                <div>

                  <small>
                    Phone
                  </small>

                  <strong>
                    {selectedCustomer.phone &&
                    selectedCustomer.phone !==
                      "N/A"
                      ? selectedCustomer.phone
                      : "Not available"}
                  </strong>

                </div>

              </div>

              {/* ORDERS */}

              <div className="cgt-customer-info-card">

                <div className="cgt-customer-info-icon">
                  <FiShoppingBag />
                </div>

                <div>

                  <small>
                    Total Orders
                  </small>

                  <strong>
                    {
                      selectedCustomer.ordersCount ||
                      0
                    }
                  </strong>

                </div>

              </div>

              {/* SPENT */}

              <div className="cgt-customer-info-card">

                <div className="cgt-customer-info-icon">
                  <FiDollarSign />
                </div>

                <div>

                  <small>
                    Total Spent
                  </small>

                  <strong>

                    ₹
                    {formatMoney(
                      selectedCustomer.totalSpent
                    )}

                  </strong>

                </div>

              </div>

            </div>

            {/* ADDRESS */}

            <div className="cgt-customer-address-section">

              <div className="cgt-customer-section-title">

                <FiHome />

                <h3>
                  Delivery Address
                </h3>

              </div>

              <div className="cgt-customer-address-box">

                <p>

                  {selectedCustomer.address ||
                    "Address not available"}

                </p>

                {selectedCustomer.landmark && (

                  <div>

                    <strong>
                      Landmark:
                    </strong>

                    <span>
                      {selectedCustomer.landmark}
                    </span>

                  </div>

                )}

                <div className="cgt-customer-location-row">

                  {selectedCustomer.city && (
                    <span>
                      {selectedCustomer.city}
                    </span>
                  )}

                  {selectedCustomer.state && (
                    <span>
                      {selectedCustomer.state}
                    </span>
                  )}

                  {selectedCustomer.pincode && (
                    <span>
                      {selectedCustomer.pincode}
                    </span>
                  )}

                </div>

                {selectedCustomer.country && (

                  <div className="cgt-customer-country">

                    <FiMapPin />

                    {selectedCustomer.country}

                  </div>

                )}

              </div>

            </div>

            {/* LAST ORDER */}

            <div className="cgt-customer-last-order">

              <FiCalendar />

              <div>

                <small>
                  Last Order
                </small>

                <strong>
                  {formatDate(
                    selectedCustomer.lastOrderDate
                  )}
                </strong>

              </div>

            </div>

            {/* FOOTER */}

            <div className="cgt-customer-modal-footer">

              <button
                onClick={closeCustomer}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}