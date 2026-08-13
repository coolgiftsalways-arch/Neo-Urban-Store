import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/orders.css";

import {
  FiSearch,
  FiEye,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiRefreshCw,
} from "react-icons/fi";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // =====================================================
  // FETCH ORDERS
  // =====================================================

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:5000/api/orders"
      );

      console.log("📦 ORDERS FROM BACKEND:", response.data);

      setOrders(response.data || []);
    } catch (error) {
      console.error("❌ Error fetching orders:", error);

      if (error.response) {
        console.error(
          "Backend response:",
          error.response.data
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD ORDERS
  // =====================================================

  useEffect(() => {
    fetchOrders();
  }, []);

  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================

  const updateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);

      const response = await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          status: newStatus,
        }
      );

      console.log(
        "✅ STATUS UPDATED:",
        response.data
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: newStatus,
                orderStatus: newStatus,
              }
            : order
        )
      );
    } catch (error) {
      console.error(
        "❌ Error updating order status:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update order status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =====================================================
  // CUSTOMER NAME
  // =====================================================

  const getCustomerName = (order) => {
    if (!order) return "N/A";

    const possibleNames = [
      order.customerName,
      order.fullName,
      order.name,

      order.shippingAddress?.customerName,
      order.shippingAddress?.fullName,
      order.shippingAddress?.name,

      order.billingAddress?.customerName,
      order.billingAddress?.fullName,
      order.billingAddress?.name,
    ];

    const validName = possibleNames.find((name) => {
      if (name === null || name === undefined) {
        return false;
      }

      const value = String(name).trim();

      if (!value) {
        return false;
      }

      const lowerValue = value.toLowerCase();

      // Never show these placeholder names
      if (
        lowerValue === "guest customer" ||
        lowerValue === "unknown customer" ||
        lowerValue === "guest" ||
        lowerValue === "customer" ||
        lowerValue === "n/a" ||
        lowerValue === "na"
      ) {
        return false;
      }

      return true;
    });

    return validName
      ? String(validName).trim()
      : "N/A";
  };

  // =====================================================
  // CUSTOMER EMAIL
  // =====================================================

  const getCustomerEmail = (order) => {
    return (
      order?.email ||
      order?.shippingAddress?.email ||
      order?.billingAddress?.email ||
      ""
    );
  };

  // =====================================================
  // CUSTOMER PHONE
  // =====================================================

  const getCustomerPhone = (order) => {
    return (
      order?.phone ||
      order?.phoneNumber ||
      order?.shippingAddress?.phone ||
      order?.shippingAddress?.phoneNumber ||
      order?.billingAddress?.phone ||
      ""
    );
  };

  // =====================================================
  // CUSTOMER ADDRESS
  // =====================================================

  const getCustomerAddress = (order) => {
    return (
      order?.address ||
      order?.shippingAddress?.address ||
      order?.shippingAddress?.street ||
      ""
    );
  };

  // =====================================================
  // CUSTOMER LANDMARK
  // =====================================================

  const getCustomerLandmark = (order) => {
    return (
      order?.landmark ||
      order?.shippingAddress?.landmark ||
      ""
    );
  };

  // =====================================================
  // CUSTOMER CITY
  // =====================================================

  const getCustomerCity = (order) => {
    return (
      order?.city ||
      order?.shippingAddress?.city ||
      ""
    );
  };

  // =====================================================
  // CUSTOMER STATE
  // =====================================================

  const getCustomerState = (order) => {
    return (
      order?.state ||
      order?.shippingAddress?.state ||
      ""
    );
  };

  // =====================================================
  // CUSTOMER PINCODE
  // =====================================================

  const getCustomerPincode = (order) => {
    return (
      order?.pincode ||
      order?.postalCode ||
      order?.shippingAddress?.pincode ||
      order?.shippingAddress?.postalCode ||
      ""
    );
  };

  // =====================================================
  // ORDER STATUS
  // =====================================================

  const getOrderStatus = (order) => {
    return (
      order?.orderStatus ||
      order?.status ||
      "Pending"
    );
  };

  // =====================================================
  // ORDER TOTAL
  // =====================================================

  const getOrderTotal = (order) => {
    return Number(
      order?.totalPrice ??
        order?.total ??
        0
    );
  };

  // =====================================================
  // PAYMENT
  // =====================================================

  const getPaymentMethod = (order) => {
    return (
      order?.paymentMethod ||
      "COD"
    ).toUpperCase();
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "delivered";

      case "shipped":
        return "shipped";

      case "cancelled":
      case "canceled":
        return "cancelled";

      case "pending":
      case "processing":
      case "placed":
      default:
        return "processing";
    }
  };

  // =====================================================
  // STATUS ICON
  // =====================================================

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <FiCheckCircle />;

      case "shipped":
        return <FiTruck />;

      case "cancelled":
      case "canceled":
        return <FiXCircle />;

      default:
        return <FiClock />;
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredOrders = orders.filter((order) => {
    const customerName =
      getCustomerName(order);

    const orderId =
      order?._id || "";

    const email =
      getCustomerEmail(order);

    const search =
      searchQuery
        .toLowerCase()
        .trim();

    return (
      customerName
        .toLowerCase()
        .includes(search) ||
      orderId
        .toLowerCase()
        .includes(search) ||
      email
        .toLowerCase()
        .includes(search)
    );
  });

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="orders-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="orders-header">

        <div>

          <h1>
            Orders
          </h1>

          <p>
            Manage all customer orders from MongoDB
          </p>

        </div>

        <button
          className="refresh-btn"
          onClick={fetchOrders}
          disabled={loading}
        >

          <FiRefreshCw
            className={
              loading
                ? "spin"
                : ""
            }
          />

          Refresh

        </button>

      </div>

      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="orders-toolbar">

        <div className="orders-search">

          <FiSearch />

          <input
            type="text"
            placeholder="Search Order ID, Customer or Email..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(
                e.target.value
              )
            }
          />

        </div>

        <div className="orders-count">

          {filteredOrders.length}{" "}

          {filteredOrders.length === 1
            ? "Order"
            : "Orders"}

        </div>

      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="orders-table">

        {loading ? (

          <div
            style={{
              padding: "50px",
              textAlign: "center",
              color: "#888",
            }}
          >
            Loading orders from MongoDB...
          </div>

        ) : filteredOrders.length > 0 ? (

          <table>

            <thead>

              <tr>

                <th>
                  Order ID
                </th>

                <th>
                  Customer
                </th>

                <th>
                  Date
                </th>

                <th>
                  Total
                </th>

                <th>
                  Status
                </th>

                <th>
                  Payment
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredOrders.map(
                (order) => {

                  const status =
                    getOrderStatus(
                      order
                    );

                  const customerName =
                    getCustomerName(
                      order
                    );

                  const total =
                    getOrderTotal(
                      order
                    );

                  const payment =
                    getPaymentMethod(
                      order
                    );

                  const email =
                    getCustomerEmail(
                      order
                    );

                  return (

                    <tr
                      key={
                        order._id
                      }
                    >

                      {/* ORDER ID */}

                      <td>

                        <strong>
                          #
                          {order._id
                            ?.slice(-6)
                            .toUpperCase()}
                        </strong>

                      </td>

                      {/* CUSTOMER */}

                      <td>

                        <div className="customer-info">

                          <strong>
                            {customerName}
                          </strong>

                          {email && (
                            <small>
                              {email}
                            </small>
                          )}

                        </div>

                      </td>

                      {/* DATE */}

                      <td>

                        {order.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "—"}

                      </td>

                      {/* TOTAL */}

                      <td>

                        <strong>
                          ₹
                          {total.toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                      </td>

                      {/* STATUS */}

                      <td>

                        <div className="status-wrapper">

                          <span
                            className={`status ${getStatusClass(
                              status
                            )}`}
                          >

                            {getStatusIcon(
                              status
                            )}

                            {status}

                          </span>

                          <select
                            value={status}
                            disabled={
                              updatingId ===
                              order._id
                            }
                            onChange={(e) =>
                              updateStatus(
                                order._id,
                                e.target.value
                              )
                            }
                          >

                            <option value="Pending">
                              Pending
                            </option>

                            <option value="Processing">
                              Processing
                            </option>

                            <option value="Shipped">
                              Shipped
                            </option>

                            <option value="Delivered">
                              Delivered
                            </option>

                            <option value="Cancelled">
                              Cancelled
                            </option>

                          </select>

                        </div>

                      </td>

                      {/* PAYMENT */}

                      <td>

                        <span className="payment-method">
                          {payment}
                        </span>

                      </td>

                      {/* ACTION */}

                      <td>

                        <button
                          className="action-btn"
                          onClick={() =>
                            setSelectedOrder(
                              order
                            )
                          }
                          title="View Order"
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

        ) : (

          <div
            style={{
              padding: "60px",
              textAlign: "center",
              color: "#888",
            }}
          >

            <h3>
              No orders found
            </h3>

            <p>
              No matching orders exist in MongoDB.
            </p>

          </div>

        )}

      </div>

      {/* =================================================
          ORDER DETAILS MODAL
      ================================================= */}

      {selectedOrder && (

        <div
          className="order-modal-overlay"
          onClick={() =>
            setSelectedOrder(
              null
            )
          }
        >

          <div
            className="order-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="order-modal-header">

              <div>

                <h2>
                  Order #
                  {selectedOrder._id
                    ?.slice(-6)
                    .toUpperCase()}
                </h2>

                <p>
                  Order details
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedOrder(
                    null
                  )
                }
              >
                ×
              </button>

            </div>

            {/* =================================================
                CUSTOMER
            ================================================= */}

            <div className="order-detail-section">

              <h3>
                Customer
              </h3>

              <p>

                <strong>
                  Name:
                </strong>{" "}

                {getCustomerName(
                  selectedOrder
                )}

              </p>

              <p>

                <strong>
                  Email:
                </strong>{" "}

                {getCustomerEmail(
                  selectedOrder
                ) || "Not provided"}

              </p>

              <p>

                <strong>
                  Phone:
                </strong>{" "}

                {getCustomerPhone(
                  selectedOrder
                ) || "Not provided"}

              </p>

            </div>

            {/* =================================================
                ADDRESS
            ================================================= */}

            <div className="order-detail-section">

              <h3>
                Shipping Address
              </h3>

              <p>

                {getCustomerAddress(
                  selectedOrder
                ) || "Not provided"}

              </p>

              {getCustomerLandmark(
                selectedOrder
              ) && (

                <p>

                  <strong>
                    Landmark:
                  </strong>{" "}

                  {getCustomerLandmark(
                    selectedOrder
                  )}

                </p>

              )}

              <p>

                {getCustomerCity(
                  selectedOrder
                )}

                {getCustomerState(
                  selectedOrder
                )
                  ? `, ${getCustomerState(
                      selectedOrder
                    )}`
                  : ""}

              </p>

              <p>

                <strong>
                  PIN:
                </strong>{" "}

                {getCustomerPincode(
                  selectedOrder
                ) || "—"}

              </p>

            </div>

            {/* =================================================
                PAYMENT
            ================================================= */}

            <div className="order-detail-section">

              <h3>
                Payment
              </h3>

              <p>

                <strong>
                  Method:
                </strong>{" "}

                {getPaymentMethod(
                  selectedOrder
                )}

              </p>

            </div>

            {/* =================================================
                TOTAL
            ================================================= */}

            <div className="order-total">

              <span>
                Total
              </span>

              <strong>
                ₹
                {getOrderTotal(
                  selectedOrder
                ).toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}