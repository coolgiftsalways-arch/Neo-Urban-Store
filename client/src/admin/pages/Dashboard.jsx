import { useEffect, useState } from "react";

import {
  FiShoppingBag,
  FiUsers,
  FiPackage,
  FiDollarSign,
  FiSearch,
  FiRefreshCw,
} from "react-icons/fi";

import api from "../../config/api";

import "../styles/dashboard.css";


// =====================================================
// DASHBOARD
// =====================================================

export default function Dashboard() {

  // ===================================================
  // STATES
  // ===================================================

  const [stats, setStats] = useState({

    totalRevenue: 0,

    totalOrders: 0,

    totalCustomers: 0,

    totalProducts: 0,

  });


  const [orders, setOrders] =
    useState([]);


  // ===================================================
  // PRODUCTS
  // ===================================================

  const [products, setProducts] =
    useState([]);


  const [customers, setCustomers] =
    useState([]);


  const [customerSearch, setCustomerSearch] =
    useState("");


  const [loading, setLoading] =
    useState(true);


  const [refreshing, setRefreshing] =
    useState(false);


  const [error, setError] =
    useState("");


  // ===================================================
  // GET CUSTOMER NAME
  // ===================================================

  const getCustomerName = (order) => {
  return (
    order?.customerName ||
    order?.fullName ||
    order?.shippingAddress?.customerName ||
    order?.shippingAddress?.fullName ||
    ""
  );
};


  // ===================================================
  // GET CUSTOMER EMAIL
  // ===================================================

  const getCustomerEmail = (order) => {

    return (

      order?.email ||

      order?.shippingAddress?.email ||

      "No email"

    );

  };


  // ===================================================
  // GET CUSTOMER PHONE
  // ===================================================

  const getCustomerPhone = (order) => {

    return (

      order?.phone ||

      order?.phoneNumber ||

      order?.shippingAddress?.phone ||

      "Not provided"

    );

  };


  // ===================================================
  // GET ORDER TOTAL
  // ===================================================

  const getOrderTotal = (order) => {

    return Number(

      order?.total ??

      order?.totalPrice ??

      0

    );

  };


  // ===================================================
  // GET ORDER STATUS
  // ===================================================

  const getOrderStatus = (order) => {

    return (

      order?.orderStatus ||

      order?.status ||

      "Pending"

    );

  };


  // ===================================================
  // FETCH DASHBOARD DATA
  // ===================================================

  const fetchDashboardData = async () => {

    try {

      setError("");


      console.log(
        "===================================="
      );

      console.log(
        "📊 DASHBOARD API"
      );

      console.log(
        "API BASE:",
        api.defaults.baseURL
      );

      console.log(
        "ORDERS:",
        `${api.defaults.baseURL}/orders`
      );

      console.log(
        "PRODUCTS:",
        `${api.defaults.baseURL}/products`
      );

      console.log(
        "===================================="
      );


      // =================================================
      // PRODUCTS
      // =================================================

      const productsResponse =
        await api.get(
          "/products"
        );


      console.log(
        "✅ PRODUCTS RESPONSE:",
        productsResponse.data
      );


      let productsData = [];


      if (
        Array.isArray(
          productsResponse.data
        )
      ) {

        productsData =
          productsResponse.data;

      }

      else if (
        Array.isArray(
          productsResponse.data?.products
        )
      ) {

        productsData =
          productsResponse.data.products;

      }


      // =================================================
      // SAVE PRODUCTS
      // =================================================

      setProducts(
        productsData
      );


      // =================================================
      // ORDERS
      // =================================================

      const ordersResponse =
        await api.get(
          "/orders"
        );


      console.log(
        "✅ ORDERS RESPONSE:",
        ordersResponse.data
      );


      let ordersData = [];


      if (
        Array.isArray(
          ordersResponse.data
        )
      ) {

        ordersData =
          ordersResponse.data;

      }

      else if (
        Array.isArray(
          ordersResponse.data?.orders
        )
      ) {

        ordersData =
          ordersResponse.data.orders;

      }


      // =================================================
      // SAVE ORDERS
      // =================================================

      setOrders(
        ordersData
      );


      // =================================================
      // CALCULATE REVENUE
      // =================================================

      const totalRevenue =
        ordersData.reduce(
          (
            sum,
            order
          ) => {

            return (

              sum +
              getOrderTotal(
                order
              )

            );

          },
          0
        );


      // =================================================
      // CREATE UNIQUE CUSTOMERS
      // =================================================

      const customerMap =
        new Map();


      ordersData.forEach((order) => {

  const name =
    getCustomerName(order)
      .trim();

  const email =
    getCustomerEmail(order)
      .trim()
      .toLowerCase();


  // -----------------------------------------------
  // NO CUSTOMER NAME = NOT A CUSTOMER
  // -----------------------------------------------

  if (!name) {
    return;
  }


  // -----------------------------------------------
  // NO EMAIL = NOT A VALID CUSTOMER
  // -----------------------------------------------

  if (
    !email ||
    email === "no email"
  ) {
    return;
  }


  // -----------------------------------------------
  // CREATE CUSTOMER
  // -----------------------------------------------

  if (!customerMap.has(email)) {

    customerMap.set(
      email,
      {
        _id: email,

        name,

        email,

        phone:
          getCustomerPhone(order),

        createdAt:
          order.createdAt,
      }
    );

  }

});


      const customerList =
        Array.from(
          customerMap.values()
        );


      setCustomers(
        customerList
      );


      // =================================================
      // UPDATE STATS
      // =================================================

      setStats({

        totalRevenue:
          totalRevenue,

        totalOrders:
          ordersData.length,

        totalCustomers:
          customerList.length,

        totalProducts:
          productsData.length,

      });


      console.log(
        "===================================="
      );

      console.log(
        "📊 FINAL DASHBOARD STATS"
      );

      console.log({

        revenue:
          totalRevenue,

        orders:
          ordersData.length,

        customers:
          customerList.length,

        products:
          productsData.length,

      });

      console.log(
        "===================================="
      );


    }

    catch (err) {

      console.error(
        "❌ DASHBOARD ERROR:",
        err
      );


      if (
        err.response
      ) {

        console.error(
          "STATUS:",
          err.response.status
        );

        console.error(
          "RESPONSE:",
          err.response.data
        );


        setError(
          `Backend returned ${err.response.status}`
        );

      }

      else if (
        err.request
      ) {

        setError(
          "Cannot connect to backend."
        );

      }

      else {

        setError(
          err.message ||
          "Failed to load dashboard."
        );

      }

    }

    finally {

      setLoading(false);

      setRefreshing(false);

    }

  };


  // ===================================================
  // INITIAL FETCH
  // ===================================================

  useEffect(
    () => {

      fetchDashboardData();

    },
    []
  );


  // ===================================================
  // REFRESH
  // ===================================================

  const handleRefresh =
    async () => {

      setRefreshing(
        true
      );

      await fetchDashboardData();

    };


  // ===================================================
  // CUSTOMER SEARCH
  // ===================================================

  const filteredCustomers =
    customers.filter(
      (customer) => {

        const search =
          customerSearch
            .toLowerCase()
            .trim();


        if (!search) {

          return true;

        }


        return (

          customer.name
            ?.toLowerCase()
            .includes(search)

          ||

          customer.email
            ?.toLowerCase()
            .includes(search)

          ||

          customer.phone
            ?.toLowerCase()
            .includes(search)

        );

      }
    );


  // ===================================================
  // LOW STOCK PRODUCTS
  // ===================================================
  // Products at 10 or below are shown in the admin
  // dashboard so you know when inventory needs attention.
  // ===================================================

  const lowStockProducts =
    products
      .filter((product) => {
        const stock = Number(
          product?.stock ?? 0
        );

        return stock <= 10;
      })
      .sort((a, b) => {
        return (
          Number(a?.stock ?? 0) -
          Number(b?.stock ?? 0)
        );
      });


  // ===================================================
  // RECENT ORDERS
  // ===================================================

  const recentOrders =
    [...orders]

      .sort(
        (a, b) => {

          return (

            new Date(
              b.createdAt || 0
            ) -

            new Date(
              a.createdAt || 0
            )

          );

        }
      )

      .slice(
        0,
        5
      );


  // ===================================================
  // STATUS CLASS
  // ===================================================

  const getStatusClass =
    (status) => {

      const value =
        String(
          status || ""
        )
          .toLowerCase();


      if (
        value ===
        "delivered"
      ) {

        return (
          "cgt-dash-x9-badge-green"
        );

      }


      if (

        value ===
        "shipped"

        ||

        value ===
        "out for delivery"

      ) {

        return (
          "cgt-dash-x9-badge-purple"
        );

      }


      if (

        value ===
        "cancelled"

        ||

        value ===
        "canceled"

      ) {

        return (
          "cgt-dash-x9-badge-red"
        );

      }


      return (
        "cgt-dash-x9-badge-blue"
      );

    };


  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {

    return (

      <div
        className=
          "cgt-dash-x9-wrapper"
      >

        <h1
          className=
            "cgt-dash-x9-heading"
        >
          Dashboard
        </h1>


        <div
          style={{
            padding:
              "60px 20px",
            textAlign:
              "center",
            color:
              "#888",
          }}
        >

          Loading dashboard...

        </div>

      </div>

    );

  }


  // ===================================================
  // RENDER
  // ===================================================

  return (

    <div
      className=
        "cgt-dash-x9-wrapper"
    >


      {/* ================================================
          HEADER
      ================================================= */}

      <div
        style={{
          display:
            "flex",

          justifyContent:
            "space-between",

          alignItems:
            "center",

          gap:
            "15px",

          marginBottom:
            "25px",

          flexWrap:
            "wrap",
        }}
      >

        <h1
          className=
            "cgt-dash-x9-heading"

          style={{
            marginBottom:
              0,
          }}
        >

          Dashboard

        </h1>


        <button
          type="button"

          onClick={
            handleRefresh
          }

          disabled={
            refreshing
          }

          style={{
            display:
              "flex",

            alignItems:
              "center",

            gap:
              "8px",

            padding:
              "10px 15px",

            borderRadius:
              "9px",

            border:
              "1px solid rgba(255,255,255,0.1)",

            background:
              "rgba(255,255,255,0.04)",

            color:
              "#fff",

            cursor:
              refreshing
                ? "not-allowed"
                : "pointer",

            opacity:
              refreshing
                ? 0.6
                : 1,
          }}
        >

          <FiRefreshCw />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}

        </button>

      </div>


      {/* ================================================
          ERROR
      ================================================= */}

      {error && (

        <div
          style={{
            marginBottom:
              "20px",

            padding:
              "14px 18px",

            borderRadius:
              "10px",

            background:
              "rgba(230,0,38,0.1)",

            border:
              "1px solid rgba(230,0,38,0.3)",

            color:
              "#ff6b7d",
          }}
        >

          ⚠️ {error}

        </div>

      )}


      {/* ================================================
          STAT CARDS
      ================================================= */}

      <div
        className=
          "cgt-dash-x9-grid"
      >


        {/* REVENUE */}

        <div
          className=
            "cgt-dash-x9-card"
        >

          <div
            className=
              "cgt-dash-x9-card-header"
          >

            <div
              className=
                "cgt-dash-x9-icon cgt-dash-x9-rev"
            >

              <FiDollarSign />

            </div>


            <span
              className=
                "cgt-dash-x9-pill cgt-dash-x9-pill-green"
            >
              Live
            </span>

          </div>


          <p
            className=
              "cgt-dash-x9-label"
          >
            Total Revenue
          </p>


          <h2
            className=
              "cgt-dash-x9-value"
          >

            ₹
            {stats.totalRevenue.toLocaleString(
              "en-IN"
            )}

          </h2>

        </div>


        {/* ORDERS */}

        <div
          className=
            "cgt-dash-x9-card"
        >

          <div
            className=
              "cgt-dash-x9-card-header"
          >

            <div
              className=
                "cgt-dash-x9-icon cgt-dash-x9-ord"
            >

              <FiShoppingBag />

            </div>


            <span
              className=
                "cgt-dash-x9-pill cgt-dash-x9-pill-green"
            >
              Live
            </span>

          </div>


          <p
            className=
              "cgt-dash-x9-label"
          >
            Orders
          </p>


          <h2
            className=
              "cgt-dash-x9-value"
          >

            {
              stats.totalOrders
            }

          </h2>

        </div>


        {/* CUSTOMERS */}

        <div
          className=
            "cgt-dash-x9-card"
        >

          <div
            className=
              "cgt-dash-x9-card-header"
          >

            <div
              className=
                "cgt-dash-x9-icon cgt-dash-x9-cust"
            >

              <FiUsers />

            </div>


            <span
              className=
                "cgt-dash-x9-pill cgt-dash-x9-pill-green"
            >
              Live
            </span>

          </div>


          <p
            className=
              "cgt-dash-x9-label"
          >
            Customers
          </p>


          <h2
            className=
              "cgt-dash-x9-value"
          >

            {
              stats.totalCustomers
            }

          </h2>

        </div>


        {/* PRODUCTS */}

        <div
          className=
            "cgt-dash-x9-card"
        >

          <div
            className=
              "cgt-dash-x9-card-header"
          >

            <div
              className=
                "cgt-dash-x9-icon cgt-dash-x9-prod"
            >

              <FiPackage />

            </div>


            <span
              className=
                "cgt-dash-x9-pill cgt-dash-x9-pill-green"
            >
              Active
            </span>

          </div>


          <p
            className=
              "cgt-dash-x9-label"
          >
            Products
          </p>


          <h2
            className=
              "cgt-dash-x9-value"
          >

            {
              stats.totalProducts
            }

          </h2>

        </div>

      </div>


     

      {/* ================================================
          LOW STOCK ALERTS
      ================================================= */}

      <div
        className="cgt-dash-x9-table-box"
        style={{
          marginBottom: "25px",
          border: lowStockProducts.length > 0
            ? "1px solid rgba(255, 179, 71, 0.35)"
            : "1px solid rgba(255,255,255,0.08)",
          background: lowStockProducts.length > 0
            ? "rgba(255,179,71,0.04)"
            : undefined,
        }}
      >

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >

          <div>

            <h2
              className="cgt-dash-x9-table-title"
              style={{ marginBottom: 0 }}
            >
              ⚠️ Low Stock Alerts
            </h2>

            <p
              style={{
                margin: "6px 0 0",
                color: "#7d8490",
                fontSize: "13px",
              }}
            >
              Products with 10 or fewer units remaining
            </p>

          </div>

          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "34px",
              height: "30px",
              padding: "0 10px",
              borderRadius: "999px",
              background: lowStockProducts.length > 0
                ? "rgba(255,179,71,0.14)"
                : "rgba(110,231,183,0.12)",
              color: lowStockProducts.length > 0
                ? "#ffb347"
                : "#6ee7b7",
              fontWeight: "800",
              fontSize: "13px",
            }}
          >
            {lowStockProducts.length}
          </span>

        </div>


        {lowStockProducts.length === 0 ? (

          <div
            style={{
              padding: "24px",
              borderRadius: "10px",
              background: "rgba(110,231,183,0.05)",
              border: "1px solid rgba(110,231,183,0.12)",
              color: "#6ee7b7",
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            ✅ All products have more than 10 units in stock.
          </div>

        ) : (

          <div
            className="cgt-dash-x9-table-scroll"
          >

            <table
              className="cgt-dash-x9-core-table"
            >

              <thead>
                <tr>
                  <th>Product</th>
                  <th>Product ID</th>
                  <th>Current Stock</th>
                  <th>Alert</th>
                </tr>
              </thead>

              <tbody>

                {lowStockProducts.map((product) => {

                  const stock = Number(
                    product?.stock ?? 0
                  );

                  const isOutOfStock = stock <= 0;
                  const isCritical = stock > 0 && stock <= 5;

                  return (

                    <tr key={product?._id || product?.id || product?.name}>

                      <td>
                        <strong>
                          {product?.name || "Unnamed Product"}
                        </strong>
                      </td>

                      <td>
                        <span
                          style={{
                            color: "#888",
                            fontSize: "12px",
                          }}
                        >
                          {product?.id || product?._id || "—"}
                        </span>
                      </td>

                      <td>
                        <strong
                          style={{
                            color: isOutOfStock
                              ? "#ff5c70"
                              : isCritical
                                ? "#ff6b7d"
                                : "#ffb347",
                            fontSize: "16px",
                          }}
                        >
                          {stock}
                        </strong>
                      </td>

                      <td>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "6px 10px",
                            borderRadius: "999px",
                            background: isOutOfStock
                              ? "rgba(230,0,38,0.15)"
                              : isCritical
                                ? "rgba(255,107,125,0.12)"
                                : "rgba(255,179,71,0.12)",
                            color: isOutOfStock
                              ? "#ff5c70"
                              : isCritical
                                ? "#ff6b7d"
                                : "#ffb347",
                            fontWeight: "700",
                            fontSize: "12px",
                          }}
                        >
                          {isOutOfStock
                            ? "🚨 OUT OF STOCK"
                            : isCritical
                              ? "🔴 CRITICAL"
                              : "⚠️ LOW STOCK"}
                        </span>
                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* ================================================
          CUSTOMERS
      ================================================= */}

      <div
        className=
          "cgt-dash-x9-table-box"
      >

        <div
          style={{
            display:
              "flex",

            justifyContent:
              "space-between",

            alignItems:
              "center",

            gap:
              "15px",

            marginBottom:
              "20px",

            flexWrap:
              "wrap",
          }}
        >

          <div>

            <h2
              className=
                "cgt-dash-x9-table-title"
            >
              Customers
            </h2>


            <p
              style={{
                margin:
                  "5px 0 0",

                color:
                  "#7d8490",

                fontSize:
                  "13px",
              }}
            >

              {
                customers.length
              }
              {" "}
              registered customers

            </p>

          </div>


          {/* SEARCH */}

          <div
            style={{
              position:
                "relative",

              width:
                "280px",

              maxWidth:
                "100%",
            }}
          >

            <FiSearch
              style={{
                position:
                  "absolute",

                left:
                  "12px",

                top:
                  "50%",

                transform:
                  "translateY(-50%)",

                color:
                  "#777",
              }}
            />


            <input
              type="text"

              placeholder=
                "Search customers..."

              value={
                customerSearch
              }

              onChange={
                (e) =>
                  setCustomerSearch(
                    e.target.value
                  )
              }

              style={{
                width:
                  "100%",

                boxSizing:
                  "border-box",

                padding:
                  "11px 12px 11px 38px",

                borderRadius:
                  "9px",

                border:
                  "1px solid rgba(255,255,255,0.1)",

                background:
                  "#111318",

                color:
                  "#fff",

                outline:
                  "none",
              }}
            />

          </div>

        </div>


        <div
          className=
            "cgt-dash-x9-table-scroll"
        >

          <table
            className=
              "cgt-dash-x9-core-table"
          >

            <thead>

              <tr>

                <th>
                  Name
                </th>

                <th>
                  Email
                </th>

                <th>
                  Phone
                </th>

                <th>
                  Joined
                </th>

              </tr>

            </thead>


            <tbody>

              {
                filteredCustomers.length >
                0

                  ? (

                    filteredCustomers.map(
                      (customer) => (

                        <tr
                          key={
                            customer._id
                          }
                        >

                          <td>

                            <strong>

                              {
                                customer.name ||
                                "Guest Customer"
                              }

                            </strong>

                          </td>


                          <td>

                            {
                              customer.email ||
                              "No email"
                            }

                          </td>


                          <td>

                            {
                              customer.phone ||
                              "Not provided"
                            }

                          </td>


                          <td>

                            {
                              customer.createdAt

                                ? new Date(
                                    customer.createdAt
                                  ).toLocaleDateString(
                                    "en-IN",
                                    {
                                      day:
                                        "2-digit",

                                      month:
                                        "short",

                                      year:
                                        "numeric",
                                    }
                                  )

                                : "—"
                            }

                          </td>

                        </tr>

                      )
                    )

                  )

                  : (

                    <tr>

                      <td
                        colSpan="4"

                        style={{
                          textAlign:
                            "center",

                          padding:
                            "30px",

                          color:
                            "#777",
                        }}
                      >

                        {
                          customerSearch
                            ? "No customers found."
                            : "No customers yet."
                        }

                      </td>

                    </tr>

                  )
              }

            </tbody>

          </table>

        </div>

      </div>


      {/* ================================================
          RECENT ORDERS
      ================================================= */}

      <div
        className=
          "cgt-dash-x9-table-box"
      >

        <h2
          className=
            "cgt-dash-x9-table-title"
        >
          Recent Orders
        </h2>


        <div
          className=
            "cgt-dash-x9-table-scroll"
        >

          <table
            className=
              "cgt-dash-x9-core-table"
          >

            <thead>

              <tr>

                <th>
                  Order
                </th>

                <th>
                  Customer
                </th>

                <th>
                  Payment
                </th>

                <th>
                  Total
                </th>

                <th>
                  Status
                </th>

              </tr>

            </thead>


            <tbody>

              {
                recentOrders.length >
                0

                  ? (

                    recentOrders.map(
                      (order) => {

                        const status =
                          getOrderStatus(
                            order
                          );


                        const payment =
                          String(
                            order.paymentMethod ||
                            "cod"
                          ).toLowerCase();


                        return (

                          <tr
                            key={
                              order._id
                            }
                          >

                            {/* ORDER */}

                            <td>

                              #
                              {
                                order._id
                                  ?.slice(-6)
                                  .toUpperCase()
                              }

                            </td>


                            {/* CUSTOMER */}

                            <td>

                              <strong>

                                {
                                  getCustomerName(
                                    order
                                  )
                                }

                              </strong>


                              <div
                                style={{
                                  marginTop:
                                    "4px",

                                  fontSize:
                                    "11px",

                                  color:
                                    "#777",
                                }}
                              >

                                {
                                  getCustomerEmail(
                                    order
                                  )
                                }

                              </div>

                            </td>


                            {/* PAYMENT */}

                            <td>

                              <span
                                style={{
                                  color:
                                    payment ===
                                    "cod"
                                      ? "#ffb347"
                                      : "#6ee7b7",

                                  fontWeight:
                                    "700",

                                  fontSize:
                                    "12px",
                                }}
                              >

                                {
                                  payment ===
                                  "cod"
                                    ? "COD"
                                    : "Online"
                                }

                              </span>

                            </td>


                            {/* TOTAL */}

                            <td>

                              ₹
                              {
                                getOrderTotal(
                                  order
                                ).toLocaleString(
                                  "en-IN"
                                )
                              }

                            </td>


                            {/* STATUS */}

                            <td>

                              <span
                                className={`
                                  cgt-dash-x9-badge
                                  ${getStatusClass(
                                    status
                                  )}
                                `}
                              >

                                {
                                  status
                                }

                              </span>

                            </td>

                          </tr>

                        );

                      }
                    )

                  )

                  : (

                    <tr>

                      <td
                        colSpan="5"

                        style={{
                          textAlign:
                            "center",

                          padding:
                            "30px",

                          color:
                            "#777",
                        }}
                      >

                        No orders found.

                      </td>

                    </tr>

                  )
              }

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}