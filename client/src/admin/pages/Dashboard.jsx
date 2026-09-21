import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  FiDollarSign,
  FiShoppingBag,
  FiClock,
  FiTrendingUp,
  FiRefreshCw,
  FiArrowRight,
  FiUsers,
  FiPackage,
  FiAlertTriangle,
  FiCheckCircle,
  FiTruck,
  FiXCircle,
  FiCreditCard,
  FiBox,
  FiActivity,
} from "react-icons/fi";

import api from "../../config/api";

import "../styles/dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");
  const [productsError, setProductsError] = useState("");
  const [ordersError, setOrdersError] = useState("");

  // =====================================================
  // HELPERS
  // =====================================================

  const getCustomerName = (order) => {
    return (
      order?.customerName ||
      order?.fullName ||
      order?.name ||
      order?.shippingAddress?.customerName ||
      order?.shippingAddress?.fullName ||
      order?.shippingAddress?.name ||
      order?.billingAddress?.customerName ||
      order?.billingAddress?.fullName ||
      order?.billingAddress?.name ||
      "Customer"
    );
  };

  const getCustomerEmail = (order) => {
    return (
      order?.email ||
      order?.shippingAddress?.email ||
      order?.billingAddress?.email ||
      ""
    );
  };

  const getCustomerPhone = (order) => {
    return (
      order?.phone ||
      order?.phoneNumber ||
      order?.shippingAddress?.phone ||
      order?.shippingAddress?.phoneNumber ||
      order?.billingAddress?.phone ||
      order?.billingAddress?.phoneNumber ||
      ""
    );
  };

  const getOrderTotal = (order) => {
    return Number(
      order?.totalPrice ??
        order?.total ??
        order?.grandTotal ??
        0
    );
  };

  const getOrderStatus = (order) => {
    return (
      order?.orderStatus ||
      order?.status ||
      "Pending"
    );
  };

  const normalizeStatus = (order) => {
    return String(
      getOrderStatus(order)
    )
      .trim()
      .toLowerCase();
  };

  const formatMoney = (amount) => {
    return Number(
      amount || 0
    ).toLocaleString("en-IN");
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "—";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getApiErrorMessage = (
    reason,
    fallback
  ) => {
    if (!reason) {
      return fallback;
    }

    if (
      reason.code === "ECONNABORTED"
    ) {
      return `${fallback} Request timed out.`;
    }

    if (
      reason.response?.status === 401 ||
      reason.response?.status === 403
    ) {
      return (
        reason.response?.data?.message ||
        "Admin session expired. Please login again."
      );
    }

    if (reason.response) {
      return (
        reason.response?.data?.message ||
        `${fallback} Server returned ${reason.response.status}.`
      );
    }

    if (reason.request) {
      return `${fallback} Cannot connect to backend.`;
    }

    return (
      reason.message ||
      fallback
    );
  };

  // =====================================================
  // FETCH DASHBOARD
  // =====================================================

  const fetchDashboardData = async (
    isRefresh = false
  ) => {
    try {
      setError("");
      setProductsError("");
      setOrdersError("");

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      console.log(
        "📊 Loading dashboard..."
      );

      console.log(
        "API Base URL:",
        api.defaults.baseURL
      );

      // =================================================
      // BOTH REQUESTS RUN TOGETHER
      // EACH REQUEST HAS 10 SECOND TIMEOUT
      // =================================================

      const results =
        await Promise.allSettled([
          api.get("/products", {
            timeout: 10000,
          }),

          api.get("/orders", {
            timeout: 10000,
          }),
        ]);

      const productsResult =
        results[0];

      const ordersResult =
        results[1];

      let productsData = [];
      let ordersData = [];

      // =================================================
      // PRODUCTS RESULT
      // =================================================

      if (
        productsResult.status ===
        "fulfilled"
      ) {
        const response =
          productsResult.value;

        console.log(
          "✅ Products response:",
          response.data
        );

        if (
          Array.isArray(
            response.data
          )
        ) {
          productsData =
            response.data;
        } else if (
          Array.isArray(
            response.data?.products
          )
        ) {
          productsData =
            response.data.products;
        } else if (
          Array.isArray(
            response.data?.data
          )
        ) {
          productsData =
            response.data.data;
        }
      } else {
        console.error(
          "❌ Products API failed:",
          productsResult.reason
        );

        setProductsError(
          getApiErrorMessage(
            productsResult.reason,
            "Products could not be loaded."
          )
        );
      }

      // =================================================
      // ORDERS RESULT
      // =================================================

      if (
        ordersResult.status ===
        "fulfilled"
      ) {
        const response =
          ordersResult.value;

        console.log(
          "✅ Orders response:",
          response.data
        );

        if (
          Array.isArray(
            response.data
          )
        ) {
          ordersData =
            response.data;
        } else if (
          Array.isArray(
            response.data?.orders
          )
        ) {
          ordersData =
            response.data.orders;
        } else if (
          Array.isArray(
            response.data?.data
          )
        ) {
          ordersData =
            response.data.data;
        }
      } else {
        console.error(
          "❌ Orders API failed:",
          ordersResult.reason
        );

        setOrdersError(
          getApiErrorMessage(
            ordersResult.reason,
            "Orders could not be loaded."
          )
        );
      }

      // =================================================
      // SAVE WHATEVER SUCCESSFULLY LOADED
      // =================================================

      setProducts(productsData);
      setOrders(ordersData);

      // =================================================
      // BOTH FAILED
      // =================================================

      if (
        productsResult.status ===
          "rejected" &&
        ordersResult.status ===
          "rejected"
      ) {
        setError(
          "Dashboard data could not be loaded. Check your backend/API connection."
        );
      }

      console.log(
        "📦 Products loaded:",
        productsData.length
      );

      console.log(
        "🛍 Orders loaded:",
        ordersData.length
      );
    } catch (err) {
      console.error(
        "❌ Unexpected dashboard error:",
        err
      );

      setError(
        getApiErrorMessage(
          err,
          "Failed to load dashboard."
        )
      );
    } finally {
      // IMPORTANT:
      // Loader ALWAYS stops
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =====================================================
  // INITIAL FETCH
  // =====================================================

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // =====================================================
  // UNIQUE CUSTOMERS
  // =====================================================

  const customers = useMemo(() => {
    const customerMap =
      new Map();

    orders.forEach(
      (order) => {
        const email =
          getCustomerEmail(order)
            ?.trim()
            .toLowerCase();

        const phone =
          getCustomerPhone(order)
            ?.trim();

        const name =
          getCustomerName(order)
            ?.trim();

        const key =
          email ||
          phone ||
          null;

        if (!key) {
          return;
        }

        if (
          !customerMap.has(key)
        ) {
          customerMap.set(
            key,
            {
              _id: key,

              name:
                name ||
                "Customer",

              email,

              phone,

              firstOrder:
                order.createdAt,

              lastOrder:
                order.createdAt,

              orders: 0,

              totalSpent: 0,
            }
          );
        }

        const customer =
          customerMap.get(key);

        customer.orders += 1;

        customer.totalSpent +=
          getOrderTotal(order);

        const newOrderDate =
          new Date(
            order.createdAt ||
              0
          );

        const lastOrderDate =
          new Date(
            customer.lastOrder ||
              0
          );

        if (
          newOrderDate >
          lastOrderDate
        ) {
          customer.lastOrder =
            order.createdAt;
        }
      }
    );

    return Array.from(
      customerMap.values()
    );
  }, [orders]);

  // =====================================================
  // TOTAL REVENUE
  // =====================================================

  const totalRevenue =
    useMemo(() => {
      return orders.reduce(
        (
          total,
          order
        ) => {
          return (
            total +
            getOrderTotal(
              order
            )
          );
        },
        0
      );
    }, [orders]);

  // =====================================================
  // AVERAGE ORDER VALUE
  // =====================================================

  const averageOrderValue =
    orders.length > 0
      ? totalRevenue /
        orders.length
      : 0;

  // =====================================================
  // STATUS COUNTS
  // =====================================================

  const statusCounts =
    useMemo(() => {
      const counts = {
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
      };

      orders.forEach(
        (order) => {
          const status =
            normalizeStatus(
              order
            );

          if (
            status ===
              "pending" ||
            status ===
              "placed"
          ) {
            counts.pending +=
              1;
          } else if (
            status ===
              "processing" ||
            status ===
              "confirmed"
          ) {
            counts.processing +=
              1;
          } else if (
            status ===
              "shipped" ||
            status ===
              "out for delivery"
          ) {
            counts.shipped +=
              1;
          } else if (
            status ===
            "delivered"
          ) {
            counts.delivered +=
              1;
          } else if (
            status ===
              "cancelled" ||
            status ===
              "canceled"
          ) {
            counts.cancelled +=
              1;
          } else {
            counts.pending +=
              1;
          }
        }
      );

      return counts;
    }, [orders]);

  // =====================================================
  // TODAY ORDERS
  // =====================================================

  const todayOrders =
    useMemo(() => {
      const today =
        new Date();

      return orders.filter(
        (order) => {
          if (
            !order.createdAt
          ) {
            return false;
          }

          const orderDate =
            new Date(
              order.createdAt
            );

          return (
            orderDate.getDate() ===
              today.getDate() &&
            orderDate.getMonth() ===
              today.getMonth() &&
            orderDate.getFullYear() ===
              today.getFullYear()
          );
        }
      );
    }, [orders]);

  // =====================================================
  // TODAY REVENUE
  // =====================================================

  const todayRevenue =
    useMemo(() => {
      return todayOrders.reduce(
        (
          total,
          order
        ) => {
          return (
            total +
            getOrderTotal(
              order
            )
          );
        },
        0
      );
    }, [todayOrders]);

  // =====================================================
  // PAYMENT COUNTS
  // =====================================================

  const paymentCounts =
    useMemo(() => {
      let cod = 0;
      let online = 0;

      orders.forEach(
        (order) => {
          const payment =
            String(
              order?.paymentMethod ||
                "cod"
            )
              .trim()
              .toLowerCase();

          if (
            payment ===
              "cod" ||
            payment.includes(
              "cash"
            )
          ) {
            cod += 1;
          } else {
            online += 1;
          }
        }
      );

      return {
        cod,
        online,
      };
    }, [orders]);

  // =====================================================
  // LOW STOCK
  // =====================================================

  const lowStockProducts =
    useMemo(() => {
      return products
        .filter(
          (product) => {
            const stock =
              Number(
                product?.stock ??
                  0
              );

            return (
              stock <= 10
            );
          }
        )
        .sort(
          (a, b) => {
            return (
              Number(
                a?.stock ??
                  0
              ) -
              Number(
                b?.stock ??
                  0
              )
            );
          }
        );
    }, [products]);

  // =====================================================
  // RECENT ORDERS
  // =====================================================

  const recentOrders =
    useMemo(() => {
      return [
        ...orders,
      ]
        .sort(
          (a, b) => {
            return (
              new Date(
                b.createdAt ||
                  0
              ) -
              new Date(
                a.createdAt ||
                  0
              )
            );
          }
        )
        .slice(
          0,
          6
        );
    }, [orders]);

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (
    status
  ) => {
    const value =
      String(
        status || ""
      )
        .trim()
        .toLowerCase();

    if (
      value ===
      "delivered"
    ) {
      return "neo-status-delivered";
    }

    if (
      value ===
        "shipped" ||
      value ===
        "out for delivery"
    ) {
      return "neo-status-shipped";
    }

    if (
      value ===
        "cancelled" ||
      value ===
        "canceled"
    ) {
      return "neo-status-cancelled";
    }

    if (
      value ===
        "processing" ||
      value ===
        "confirmed"
    ) {
      return "neo-status-processing";
    }

    return "neo-status-pending";
  };

  // =====================================================
  // DATE
  // =====================================================

  const todayTitle =
    new Date().toLocaleDateString(
      "en-IN",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );

  // =====================================================
  // INITIAL LOADER
  // =====================================================

  if (loading) {
    return (
      <div className="neo-dashboard">
        <div className="neo-loading">
          <div className="neo-loader" />

          <h2>
            Loading dashboard
          </h2>

          <p>
            Getting your latest
            store information...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // JSX
  // =====================================================

  return (
    <div className="neo-dashboard">
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="neo-dashboard-header">
        <div>
          <p className="neo-dashboard-eyebrow">
            ADMIN OVERVIEW
          </p>

          <h1>
            Dashboard
          </h1>

          <p className="neo-dashboard-date">
            {todayTitle}
          </p>
        </div>

        <button
          type="button"
          className="neo-refresh-btn"
          disabled={refreshing}
          onClick={() =>
            fetchDashboardData(
              true
            )
          }
        >
          <FiRefreshCw
            className={
              refreshing
                ? "neo-spin"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}
        </button>
      </header>

      {/* =================================================
          MAIN ERROR
      ================================================= */}

      {error && (
        <div className="neo-error-box">
          <FiAlertTriangle />

          <div>
            <strong>
              Dashboard Error
            </strong>

            <p>
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              fetchDashboardData(
                true
              )
            }
          >
            Try Again
          </button>
        </div>
      )}

      {/* =================================================
          PARTIAL API WARNINGS
      ================================================= */}

      {!error &&
        (productsError ||
          ordersError) && (
          <div className="neo-api-warning">
            <FiAlertTriangle />

            <div>
              <strong>
                Some dashboard data
                could not be loaded
              </strong>

              {ordersError && (
                <p>
                  Orders:{" "}
                  {ordersError}
                </p>
              )}

              {productsError && (
                <p>
                  Products:{" "}
                  {productsError}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                fetchDashboardData(
                  true
                )
              }
            >
              Retry
            </button>
          </div>
        )}

      {/* =================================================
          KPI CARDS
      ================================================= */}

      <section className="neo-kpi-grid">
        {/* REVENUE */}

        <button
          type="button"
          className="neo-kpi-card"
          onClick={() =>
            navigate(
              "/admin/orders"
            )
          }
        >
          <div className="neo-kpi-top">
            <div className="neo-kpi-icon neo-kpi-green">
              <FiDollarSign />
            </div>

            <span className="neo-kpi-arrow">
              <FiArrowRight />
            </span>
          </div>

          <p className="neo-kpi-label">
            Total Revenue
          </p>

          <h2>
            ₹
            {formatMoney(
              totalRevenue
            )}
          </h2>

          <div className="neo-kpi-bottom">
            <span className="neo-positive">
              <FiTrendingUp />

              ₹
              {formatMoney(
                todayRevenue
              )}{" "}
              today
            </span>

            <span>
              View orders
            </span>
          </div>
        </button>

        {/* ORDERS */}

        <button
          type="button"
          className="neo-kpi-card"
          onClick={() =>
            navigate(
              "/admin/orders"
            )
          }
        >
          <div className="neo-kpi-top">
            <div className="neo-kpi-icon neo-kpi-purple">
              <FiShoppingBag />
            </div>

            <span className="neo-kpi-arrow">
              <FiArrowRight />
            </span>
          </div>

          <p className="neo-kpi-label">
            Total Orders
          </p>

          <h2>
            {orders.length}
          </h2>

          <div className="neo-kpi-bottom">
            <span className="neo-positive">
              <FiActivity />

              {todayOrders.length}{" "}
              today
            </span>

            <span>
              Manage
            </span>
          </div>
        </button>

        {/* PENDING */}

        <button
          type="button"
          className="neo-kpi-card"
          onClick={() =>
            navigate(
              "/admin/orders"
            )
          }
        >
          <div className="neo-kpi-top">
            <div className="neo-kpi-icon neo-kpi-orange">
              <FiClock />
            </div>

            <span className="neo-kpi-arrow">
              <FiArrowRight />
            </span>
          </div>

          <p className="neo-kpi-label">
            Pending Orders
          </p>

          <h2>
            {
              statusCounts.pending
            }
          </h2>

          <div className="neo-kpi-bottom">
            <span className="neo-warning-text">
              Needs attention
            </span>

            <span>
              Handle
            </span>
          </div>
        </button>

        {/* AVG ORDER */}

        <button
          type="button"
          className="neo-kpi-card"
          onClick={() =>
            navigate(
              "/admin/orders"
            )
          }
        >
          <div className="neo-kpi-top">
            <div className="neo-kpi-icon neo-kpi-blue">
              <FiTrendingUp />
            </div>

            <span className="neo-kpi-arrow">
              <FiArrowRight />
            </span>
          </div>

          <p className="neo-kpi-label">
            Average Order
          </p>

          <h2>
            ₹
            {formatMoney(
              Math.round(
                averageOrderValue
              )
            )}
          </h2>

          <div className="neo-kpi-bottom">
            <span>
              From{" "}
              {orders.length}{" "}
              orders
            </span>

            <span>
              Details
            </span>
          </div>
        </button>
      </section>

      {/* =================================================
          MAIN GRID
      ================================================= */}

      <section className="neo-dashboard-main-grid">
        {/* =================================================
            RECENT ORDERS
        ================================================= */}

        <div className="neo-panel neo-recent-orders-panel">
          <div className="neo-panel-header">
            <div>
              <p className="neo-panel-eyebrow">
                LIVE ACTIVITY
              </p>

              <h2>
                Recent Orders
              </h2>

              <p>
                Latest customer
                purchases
              </p>
            </div>

            <button
              type="button"
              className="neo-text-btn"
              onClick={() =>
                navigate(
                  "/admin/orders"
                )
              }
            >
              View all

              <FiArrowRight />
            </button>
          </div>

          {ordersError ? (
            <div className="neo-section-error">
              <FiAlertTriangle />

              <p>
                Orders could not be
                loaded.
              </p>

              <button
                type="button"
                onClick={() =>
                  fetchDashboardData(
                    true
                  )
                }
              >
                Try again
              </button>
            </div>
          ) : (
            <div className="neo-table-wrapper">
              <table className="neo-orders-table">
                <thead>
                  <tr>
                    <th>
                      Order
                    </th>

                    <th>
                      Customer
                    </th>

                    <th>
                      Total
                    </th>

                    <th>
                      Payment
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentOrders.length >
                  0 ? (
                    recentOrders.map(
                      (order) => {
                        const status =
                          getOrderStatus(
                            order
                          );

                        const payment =
                          String(
                            order?.paymentMethod ||
                              "cod"
                          )
                            .trim()
                            .toLowerCase();

                        return (
                          <tr
                            key={
                              order._id
                            }
                            className="neo-order-row"
                            onClick={() =>
                              navigate(
                                "/admin/orders",
                                {
                                  state: {
                                    openOrderId:
                                      order._id,
                                  },
                                }
                              )
                            }
                          >
                            <td>
                              <strong className="neo-order-id">
                                #
                                {order._id
                                  ?.slice(
                                    -6
                                  )
                                  .toUpperCase()}
                              </strong>
                            </td>

                            <td>
                              <div className="neo-customer-cell">
                                <strong>
                                  {getCustomerName(
                                    order
                                  )}
                                </strong>

                                <span>
                                  {getCustomerEmail(
                                    order
                                  ) ||
                                    "No email"}
                                </span>
                              </div>
                            </td>

                            <td>
                              <strong>
                                ₹
                                {formatMoney(
                                  getOrderTotal(
                                    order
                                  )
                                )}
                              </strong>
                            </td>

                            <td>
                              <span
                                className={`neo-payment ${
                                  payment ===
                                  "cod"
                                    ? "neo-payment-cod"
                                    : "neo-payment-online"
                                }`}
                              >
                                {payment ===
                                "cod"
                                  ? "COD"
                                  : "Online"}
                              </span>
                            </td>

                            <td>
                              <span
                                className={`neo-status ${getStatusClass(
                                  status
                                )}`}
                              >
                                {status}
                              </span>
                            </td>

                            <td>
                              <span className="neo-table-date">
                                {formatDate(
                                  order.createdAt
                                )}
                              </span>
                            </td>
                          </tr>
                        );
                      }
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="neo-empty-table"
                      >
                        No orders
                        found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* =================================================
            ORDER STATUS
        ================================================= */}

        <div className="neo-panel neo-status-panel">
          <div className="neo-panel-header">
            <div>
              <p className="neo-panel-eyebrow">
                ORDERS
              </p>

              <h2>
                Order Status
              </h2>

              <p>
                Current fulfillment
                overview
              </p>
            </div>
          </div>

          <div className="neo-status-list">
            <button
              type="button"
              className="neo-status-item"
              onClick={() =>
                navigate(
                  "/admin/orders"
                )
              }
            >
              <span className="neo-status-icon status-pending-icon">
                <FiClock />
              </span>

              <div>
                <strong>
                  Pending
                </strong>

                <small>
                  Waiting to
                  process
                </small>
              </div>

              <b>
                {
                  statusCounts.pending
                }
              </b>
            </button>

            <button
              type="button"
              className="neo-status-item"
              onClick={() =>
                navigate(
                  "/admin/orders"
                )
              }
            >
              <span className="neo-status-icon status-processing-icon">
                <FiActivity />
              </span>

              <div>
                <strong>
                  Processing
                </strong>

                <small>
                  Being prepared
                </small>
              </div>

              <b>
                {
                  statusCounts.processing
                }
              </b>
            </button>

            <button
              type="button"
              className="neo-status-item"
              onClick={() =>
                navigate(
                  "/admin/orders"
                )
              }
            >
              <span className="neo-status-icon status-shipped-icon">
                <FiTruck />
              </span>

              <div>
                <strong>
                  Shipped
                </strong>

                <small>
                  On the way
                </small>
              </div>

              <b>
                {
                  statusCounts.shipped
                }
              </b>
            </button>

            <button
              type="button"
              className="neo-status-item"
              onClick={() =>
                navigate(
                  "/admin/orders"
                )
              }
            >
              <span className="neo-status-icon status-delivered-icon">
                <FiCheckCircle />
              </span>

              <div>
                <strong>
                  Delivered
                </strong>

                <small>
                  Completed
                </small>
              </div>

              <b>
                {
                  statusCounts.delivered
                }
              </b>
            </button>

            <button
              type="button"
              className="neo-status-item"
              onClick={() =>
                navigate(
                  "/admin/orders"
                )
              }
            >
              <span className="neo-status-icon status-cancelled-icon">
                <FiXCircle />
              </span>

              <div>
                <strong>
                  Cancelled
                </strong>

                <small>
                  Cancelled orders
                </small>
              </div>

              <b>
                {
                  statusCounts.cancelled
                }
              </b>
            </button>
          </div>
        </div>
      </section>

      {/* =================================================
          BOTTOM GRID
      ================================================= */}

      <section className="neo-dashboard-bottom-grid">
        {/* =================================================
            STOCK HEALTH
        ================================================= */}

        <div className="neo-panel">
          <div className="neo-panel-header">
            <div>
              <p className="neo-panel-eyebrow">
                INVENTORY
              </p>

              <h2>
                Stock Health
              </h2>

              <p>
                Products that may
                require attention
              </p>
            </div>

            <button
              type="button"
              className="neo-text-btn"
              onClick={() =>
                navigate(
                  "/admin/products"
                )
              }
            >
              Products

              <FiArrowRight />
            </button>
          </div>

          {productsError ? (
            <div className="neo-section-error">
              <FiAlertTriangle />

              <p>
                Products could not
                be loaded.
              </p>

              <button
                type="button"
                onClick={() =>
                  fetchDashboardData(
                    true
                  )
                }
              >
                Try again
              </button>
            </div>
          ) : lowStockProducts.length ===
            0 ? (
            <button
              type="button"
              className="neo-stock-healthy"
              onClick={() =>
                navigate(
                  "/admin/products"
                )
              }
            >
              <span className="neo-stock-healthy-icon">
                <FiCheckCircle />
              </span>

              <div>
                <strong>
                  Inventory Healthy
                </strong>

                <p>
                  All products have
                  more than 10 units
                  in stock.
                </p>
              </div>

              <FiArrowRight className="neo-stock-arrow" />
            </button>
          ) : (
            <div className="neo-low-stock-list">
              {lowStockProducts
                .slice(0, 5)
                .map(
                  (product) => {
                    const stock =
                      Number(
                        product?.stock ??
                          0
                      );

                    return (
                      <button
                        type="button"
                        key={
                          product?._id ||
                          product?.id ||
                          product?.name
                        }
                        className="neo-low-stock-item"
                        onClick={() =>
                          navigate(
                            "/admin/products"
                          )
                        }
                      >
                        <span className="neo-stock-product-icon">
                          <FiPackage />
                        </span>

                        <div>
                          <strong>
                            {product?.name ||
                              "Unnamed Product"}
                          </strong>

                          <small>
                            {stock <= 0
                              ? "Out of stock"
                              : stock <=
                                  5
                                ? "Critical stock"
                                : "Low stock"}
                          </small>
                        </div>

                        <span
                          className={`neo-stock-count ${
                            stock <= 0
                              ? "stock-zero"
                              : stock <=
                                  5
                                ? "stock-critical"
                                : ""
                          }`}
                        >
                          {stock} left
                        </span>
                      </button>
                    );
                  }
                )}

              {lowStockProducts.length >
                5 && (
                <button
                  type="button"
                  className="neo-show-more"
                  onClick={() =>
                    navigate(
                      "/admin/products"
                    )
                  }
                >
                  +
                  {lowStockProducts.length -
                    5}{" "}
                  more products
                </button>
              )}
            </div>
          )}
        </div>

        {/* =================================================
            QUICK OVERVIEW
        ================================================= */}

        <div className="neo-panel">
          <div className="neo-panel-header">
            <div>
              <p className="neo-panel-eyebrow">
                STORE
              </p>

              <h2>
                Quick Overview
              </h2>

              <p>
                Important store
                numbers
              </p>
            </div>
          </div>

          <div className="neo-overview-grid">
            <button
              type="button"
              className="neo-overview-card"
              onClick={() =>
                navigate(
                  "/admin/customers"
                )
              }
            >
              <span className="neo-overview-icon overview-users">
                <FiUsers />
              </span>

              <div>
                <span>
                  Customers
                </span>

                <strong>
                  {
                    customers.length
                  }
                </strong>
              </div>

              <FiArrowRight />
            </button>

            <button
              type="button"
              className="neo-overview-card"
              onClick={() =>
                navigate(
                  "/admin/products"
                )
              }
            >
              <span className="neo-overview-icon overview-products">
                <FiBox />
              </span>

              <div>
                <span>
                  Products
                </span>

                <strong>
                  {
                    products.length
                  }
                </strong>
              </div>

              <FiArrowRight />
            </button>

            <button
              type="button"
              className="neo-overview-card"
              onClick={() =>
                navigate(
                  "/admin/orders"
                )
              }
            >
              <span className="neo-overview-icon overview-cod">
                <FiShoppingBag />
              </span>

              <div>
                <span>
                  COD Orders
                </span>

                <strong>
                  {
                    paymentCounts.cod
                  }
                </strong>
              </div>

              <FiArrowRight />
            </button>

            <button
              type="button"
              className="neo-overview-card"
              onClick={() =>
                navigate(
                  "/admin/orders"
                )
              }
            >
              <span className="neo-overview-icon overview-online">
                <FiCreditCard />
              </span>

              <div>
                <span>
                  Online
                </span>

                <strong>
                  {
                    paymentCounts.online
                  }
                </strong>
              </div>

              <FiArrowRight />
            </button>
          </div>
        </div>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <div className="neo-panel">
          <div className="neo-panel-header">
            <div>
              <p className="neo-panel-eyebrow">
                SHORTCUTS
              </p>

              <h2>
                Quick Actions
              </h2>

              <p>
                Get things done
                faster
              </p>
            </div>
          </div>

          <div className="neo-actions-grid">
            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/orders"
                )
              }
            >
              <span className="neo-action-icon">
                <FiShoppingBag />
              </span>

              <div>
                <strong>
                  Manage Orders
                </strong>

                <small>
                  View and update
                  orders
                </small>
              </div>

              <FiArrowRight />
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/products"
                )
              }
            >
              <span className="neo-action-icon">
                <FiPackage />
              </span>

              <div>
                <strong>
                  Manage Products
                </strong>

                <small>
                  Products and
                  inventory
                </small>
              </div>

              <FiArrowRight />
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/customers"
                )
              }
            >
              <span className="neo-action-icon">
                <FiUsers />
              </span>

              <div>
                <strong>
                  Customers
                </strong>

                <small>
                  Customer
                  information
                </small>
              </div>

              <FiArrowRight />
            </button>

            <button
              type="button"
              disabled={refreshing}
              onClick={() =>
                fetchDashboardData(
                  true
                )
              }
            >
              <span className="neo-action-icon">
                <FiRefreshCw
                  className={
                    refreshing
                      ? "neo-spin"
                      : ""
                  }
                />
              </span>

              <div>
                <strong>
                  Refresh Data
                </strong>

                <small>
                  Get latest
                  information
                </small>
              </div>

              <FiArrowRight />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}