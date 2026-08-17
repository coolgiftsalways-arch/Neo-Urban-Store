import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../config/api";

import "../styles/analytics.css";

import {
  FiDollarSign,
  FiShoppingBag,
  FiUsers,
  FiTrendingUp,
  FiArrowUpRight,
} from "react-icons/fi";

export default function Analytics() {
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    growthRate: 0,
    revenueChart: [],
    topProducts: [],
    weeklyPerformance: [],
  });

  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH ANALYTICS
  // ==========================================

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get(
  "/analytics/dashboard"
);

        console.log("ANALYTICS DATA:", response.data);

        setAnalytics({
          totalRevenue: response.data.totalRevenue || 0,
          totalOrders: response.data.totalOrders || 0,
          totalCustomers:
            response.data.totalCustomers || 0,

          growthRate:
            response.data.growthRate || 0,

          revenueChart:
            response.data.revenueChart || [],

          topProducts:
            response.data.topProducts || [],

          weeklyPerformance:
            response.data.weeklyPerformance || [],
        });
      } catch (error) {
        console.error(
          "Analytics fetch error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // ==========================================
  // FORMAT MONEY
  // ==========================================

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString(
      "en-IN"
    );
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDay = (date) => {
    const d = new Date(date);

    return d.toLocaleDateString("en-IN", {
      weekday: "long",
    });
  };

  // ==========================================
  // GET GROWTH
  // ==========================================

  const growth =
    analytics.growthRate >= 0
      ? `+${analytics.growthRate}%`
      : `${analytics.growthRate}%`;

  if (loading) {
    return (
      <div className="cgt-custom-analytics-page">
        <div
          style={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            fontWeight: "700",
          }}
        >
          Loading analytics...
        </div>
      </div>
    );
  }

  return (
    <div className="cgt-custom-analytics-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="cgt-custom-analytics-header">
        <div>
          <h1>Analytics</h1>

          <p>
            Track your store performance and
            business growth.
          </p>
        </div>
      </div>


      {/* ======================================
          KPI CARDS
      ====================================== */}

      <div className="cgt-custom-analytics-cards">

        {/* REVENUE */}

        <div className="cgt-custom-analytics-card cgt-custom-analytics-revenue">

          <div className="cgt-custom-analytics-icon">
            <FiDollarSign />
          </div>

          <div>
            <span>Total Revenue</span>

            <h2>
              ₹{formatMoney(
                analytics.totalRevenue
              )}
            </h2>

            <p className="cgt-custom-positive">
              <FiArrowUpRight />

              {growth} this month
            </p>
          </div>

        </div>


        {/* ORDERS */}

        <div className="cgt-custom-analytics-card cgt-custom-analytics-orders">

          <div className="cgt-custom-analytics-icon">
            <FiShoppingBag />
          </div>

          <div>
            <span>Total Orders</span>

            <h2>
              {analytics.totalOrders.toLocaleString(
                "en-IN"
              )}
            </h2>

            <p className="cgt-custom-positive">
              <FiArrowUpRight />

              Live from MongoDB
            </p>
          </div>

        </div>


        {/* CUSTOMERS */}

        <div className="cgt-custom-analytics-card cgt-custom-analytics-customers">

          <div className="cgt-custom-analytics-icon">
            <FiUsers />
          </div>

          <div>
            <span>Customers</span>

            <h2>
              {analytics.totalCustomers.toLocaleString(
                "en-IN"
              )}
            </h2>

            <p className="cgt-custom-positive">
              <FiArrowUpRight />

              Unique customers
            </p>
          </div>

        </div>


        {/* GROWTH */}

        <div className="cgt-custom-analytics-card cgt-custom-analytics-growth">

          <div className="cgt-custom-analytics-icon">
            <FiTrendingUp />
          </div>

          <div>
            <span>Growth Rate</span>

            <h2>
              {analytics.growthRate}%
            </h2>

            <p className="cgt-custom-positive">
              <FiArrowUpRight />

              vs previous month
            </p>
          </div>

        </div>

      </div>


      {/* ======================================
          REVENUE + TOP PRODUCTS
      ====================================== */}

      <div className="cgt-custom-analytics-grid">


        {/* REVENUE */}

        <div className="cgt-custom-chart-card">

          <div className="cgt-custom-section-header">

            <div>
              <h2>Revenue Overview</h2>

              <p>
                Paid orders from the last 7 days
              </p>
            </div>

            <button>
              Last 7 Days
            </button>

          </div>


          <div className="cgt-custom-real-chart">

            {analytics.revenueChart.length > 0 ? (

              analytics.revenueChart.map(
                (item, index) => {

                  const maxRevenue =
                    Math.max(
                      ...analytics.revenueChart.map(
                        (x) =>
                          Number(
                            x.revenue || 0
                          )
                      ),
                      1
                    );

                  const height =
                    (Number(item.revenue || 0) /
                      maxRevenue) *
                    100;

                  return (
                    <div
                      key={index}
                      className="cgt-custom-chart-column"
                    >

                      <div className="cgt-custom-chart-value">
                        ₹
                        {formatMoney(
                          item.revenue
                        )}
                      </div>

                      <div className="cgt-custom-chart-bar-wrapper">

                        <div
                          className="cgt-custom-chart-bar"
                          style={{
                            height: `${Math.max(
                              height,
                              4
                            )}%`,
                          }}
                        />

                      </div>

                      <span>
                        {new Date(
                          item._id
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                          }
                        )}
                      </span>

                    </div>
                  );
                }
              )

            ) : (

              <div className="cgt-custom-empty">
                No paid sales recorded yet.
              </div>

            )}

          </div>

        </div>


        {/* TOP PRODUCTS */}

        <div className="cgt-custom-mini-card">

          <h2>Top Selling Products</h2>

          <ul>

            {analytics.topProducts.length > 0 ? (

              analytics.topProducts.map(
                (product, index) => (

                  <li key={index}>

                    <span>
                      <b>
                        #{index + 1}
                      </b>

                      {product.name}
                    </span>

                    <strong>
                      {product.sold} Sold
                    </strong>

                  </li>

                )
              )

            ) : (

              <li>
                <span>No products sold yet</span>
              </li>

            )}

          </ul>

        </div>

      </div>


      {/* ======================================
          WEEKLY PERFORMANCE
      ====================================== */}

      <div className="cgt-custom-performance-card">

        <div className="cgt-custom-section-header">

          <div>
            <h2>Weekly Performance</h2>

            <p>
              Daily paid-order performance
            </p>
          </div>

        </div>


        <div className="cgt-custom-table-wrapper">

          <table className="cgt-custom-perf-table">

            <thead>

              <tr>
                <th>Day</th>
                <th>Orders</th>
                <th>Revenue</th>
              </tr>

            </thead>


            <tbody>

              {analytics.weeklyPerformance.length >
              0 ? (

                analytics.weeklyPerformance.map(
                  (day, index) => (

                    <tr key={index}>

                      <td>
                        {formatDay(day._id)}
                      </td>

                      <td>
                        {day.orders}
                      </td>

                      <td>
                        ₹
                        {formatMoney(
                          day.revenue
                        )}
                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>
                  <td colSpan="3">
                    No weekly sales yet.
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}