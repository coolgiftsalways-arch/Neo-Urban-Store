import "../styles/orders.css";

import {
  FiSearch,
  FiEye,
  FiTruck,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";

export default function Orders() {
  return (
    <div className="orders-page">

      <div className="orders-header">

        <div>

          <h1>Orders</h1>

          <p>
            Manage all customer orders
          </p>

        </div>

      </div>

      {/* SEARCH */}

      <div className="orders-toolbar">

        <div className="orders-search">

          <FiSearch />

          <input
            type="text"
            placeholder="Search Order ID..."
          />

        </div>

      </div>

      {/* TABLE */}

      <div className="orders-table">

        <table>

          <thead>

            <tr>

              <th>Order ID</th>

              <th>Customer</th>

              <th>Date</th>

              <th>Total</th>

              <th>Status</th>

              <th>Payment</th>

              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            <tr>

              <td>#1001</td>

              <td>Nikita</td>

              <td>03 Aug 2026</td>

              <td>₹2,499</td>

              <td>

                <span className="status processing">

                  <FiClock />

                  Processing

                </span>

              </td>

              <td>Paid</td>

              <td>

                <button className="action-btn">

                  <FiEye />

                </button>

              </td>

            </tr>

            <tr>

              <td>#1002</td>

              <td>Rahul</td>

              <td>02 Aug 2026</td>

              <td>₹7,999</td>

              <td>

                <span className="status shipped">

                  <FiTruck />

                  Shipped

                </span>

              </td>

              <td>Paid</td>

              <td>

                <button className="action-btn">

                  <FiEye />

                </button>

              </td>

            </tr>

            <tr>

              <td>#1003</td>

              <td>Priya</td>

              <td>01 Aug 2026</td>

              <td>₹1,499</td>

              <td>

                <span className="status delivered">

                  <FiCheckCircle />

                  Delivered

                </span>

              </td>

              <td>Paid</td>

              <td>

                <button className="action-btn">

                  <FiEye />

                </button>

              </td>

            </tr>

            <tr>

              <td>#1004</td>

              <td>Aman</td>

              <td>31 Jul 2026</td>

              <td>₹4,799</td>

              <td>

                <span className="status processing">

                  <FiClock />

                  Processing

                </span>

              </td>

              <td>Pending</td>

              <td>

                <button className="action-btn">

                  <FiEye />

                </button>

              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}