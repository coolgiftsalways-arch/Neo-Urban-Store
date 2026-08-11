import "../styles/analytics.css";

import {
  FiDollarSign,
  FiShoppingBag,
  FiUsers,
  FiTrendingUp,
  FiArrowUpRight,
} from "react-icons/fi";

export default function Analytics() {
  return (
    <div className="analytics-page">

      {/* Header */}

      <div className="analytics-header">

        <div>

          <h1>Analytics</h1>

          <p>
            Track your store performance and business growth.
          </p>

        </div>

      </div>

      {/* KPI CARDS */}

      <div className="analytics-cards">

        <div className="analytics-card revenue">

          <div className="analytics-icon">
            <FiDollarSign />
          </div>

          <div>

            <span>Total Revenue</span>

            <h2>₹4,82,340</h2>

            <p className="positive">
              <FiArrowUpRight />
              +18.4% this month
            </p>

          </div>

        </div>

        <div className="analytics-card orders">

          <div className="analytics-icon">
            <FiShoppingBag />
          </div>

          <div>

            <span>Total Orders</span>

            <h2>1,286</h2>

            <p className="positive">
              <FiArrowUpRight />
              +12.7%
            </p>

          </div>

        </div>

        <div className="analytics-card customers">

          <div className="analytics-icon">
            <FiUsers />
          </div>

          <div>

            <span>Customers</span>

            <h2>834</h2>

            <p className="positive">
              <FiArrowUpRight />
              +9.2%
            </p>

          </div>

        </div>

        <div className="analytics-card growth">

          <div className="analytics-icon">
            <FiTrendingUp />
          </div>

          <div>

            <span>Growth Rate</span>

            <h2>34%</h2>

            <p className="positive">
              <FiArrowUpRight />
              +6.8%
            </p>

          </div>

        </div>

      </div>

      {/* CHARTS */}

      <div className="analytics-grid">

        <div className="chart-card">

          <div className="section-header">

            <h2>Revenue Overview</h2>

            <button>
              This Month
            </button>

          </div>

          <div className="chart-placeholder">

            <div className="chart-icon">

              📈

            </div>

            <h3>Revenue Chart</h3>

            <p>
              Replace this with ApexCharts or Chart.js later.
            </p>

          </div>

        </div>

        <div className="mini-card">

          <h2>Top Selling Products</h2>

          <ul>

            <li>

              <span>Monster Energy</span>

              <strong>420 Sold</strong>

            </li>

            <li>

              <span>Red Bull</span>

              <strong>390 Sold</strong>

            </li>

            <li>

              <span>Monster Zero</span>

              <strong>280 Sold</strong>

            </li>

            <li>

              <span>Sparkling Water</span>

              <strong>240 Sold</strong>

            </li>

          </ul>

        </div>

      </div>

      {/* PERFORMANCE */}

      <div className="performance-card">

        <div className="section-header">

          <h2>Weekly Performance</h2>

        </div>

        <table>

          <thead>

            <tr>

              <th>Day</th>

              <th>Orders</th>

              <th>Revenue</th>

              <th>Growth</th>

            </tr>

          </thead>

          <tbody>

            <tr>

              <td>Monday</td>

              <td>86</td>

              <td>₹23,400</td>

              <td className="positive">
                +4%
              </td>

            </tr>

            <tr>

              <td>Tuesday</td>

              <td>103</td>

              <td>₹28,900</td>

              <td className="positive">
                +8%
              </td>

            </tr>

            <tr>

              <td>Wednesday</td>

              <td>91</td>

              <td>₹25,300</td>

              <td className="positive">
                +6%
              </td>

            </tr>

            <tr>

              <td>Thursday</td>

              <td>118</td>

              <td>₹34,700</td>

              <td className="positive">
                +11%
              </td>

            </tr>

            <tr>

              <td>Friday</td>

              <td>132</td>

              <td>₹39,800</td>

              <td className="positive">
                +16%
              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}