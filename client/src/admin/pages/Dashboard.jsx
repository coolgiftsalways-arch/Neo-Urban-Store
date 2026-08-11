import "../styles/dashboard.css";

import {
  FiShoppingBag,
  FiUsers,
  FiPackage,
  FiDollarSign,
} from "react-icons/fi";

export default function Dashboard() {
  return (
    <div className="dashboard-content">
      <h1 className="dashboard-title">Dashboard</h1>

      {/* ======================
          STAT CARDS
      ======================= */}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-icon sales">
              <FiDollarSign />
            </div>
            <span className="stat-growth positive">+18%</span>
          </div>

          <p className="stat-label">Total Revenue</p>

          <h2 className="stat-value">₹4,82,340</h2>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-icon orders">
              <FiShoppingBag />
            </div>
            <span className="stat-growth positive">+12%</span>
          </div>

          <p className="stat-label">Orders</p>

          <h2 className="stat-value">1,286</h2>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-icon customers">
              <FiUsers />
            </div>
            <span className="stat-growth positive">+7%</span>
          </div>

          <p className="stat-label">Customers</p>

          <h2 className="stat-value">834</h2>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-icon products">
              <FiPackage />
            </div>
            <span className="stat-growth negative">-2%</span>
          </div>

          <p className="stat-label">Products</p>

          <h2 className="stat-value">72</h2>
        </div>
      </div>

      {/* ======================
          SALES
      ======================= */}

      <div className="chart-card">
        <h2>Sales Overview</h2>

        <p className="chart-subtitle">Monthly revenue is growing steadily.</p>

        <div className="chart-placeholder">Chart Coming Soon 📈</div>
      </div>

      {/* ======================
          TABLE
      ======================= */}

      <div className="table-card">
        <h2 className="table-title">Recent Orders</h2>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>#1082</td>
                <td>Nikita</td>
                <td>₹2,340</td>
                <td>
                  <span className="badge delivered">Delivered</span>
                </td>
              </tr>

              <tr>
                <td>#1081</td>
                <td>Rahul</td>
                <td>₹890</td>
                <td>
                  <span className="badge processing">Processing</span>
                </td>
              </tr>

              <tr>
                <td>#1080</td>
                <td>Priya</td>
                <td>₹4,100</td>
                <td>
                  <span className="badge shipped">Shipped</span>
                </td>
              </tr>

              <tr>
                <td>#1079</td>
                <td>Aman</td>
                <td>₹1,560</td>
                <td>
                  <span className="badge pending">Pending</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
