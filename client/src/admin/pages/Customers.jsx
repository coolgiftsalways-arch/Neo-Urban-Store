import "../styles/customers.css";

import {
  FiSearch,
  FiEye,
  FiUser,
  FiMail,
  FiPhone,
} from "react-icons/fi";

export default function Customers() {
  return (
    <div className="customers-page">

      <div className="customers-header">

        <div>
          <h1>Customers</h1>
          <p>Manage your customers</p>
        </div>

      </div>

      <div className="customers-toolbar">

        <div className="customers-search">

          <FiSearch />

          <input
            type="text"
            placeholder="Search customer..."
          />

        </div>

      </div>

      <div className="customers-table">

        <table>

          <thead>

            <tr>

              <th>Customer</th>

              <th>Email</th>

              <th>Phone</th>

              <th>Orders</th>

              <th>Total Spent</th>

              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            <tr>

              <td>

                <div className="customer-info">

                  <div className="avatar">
                    N
                  </div>

                  <div>

                    <h4>Nikita</h4>

                    <span>Premium Customer</span>

                  </div>

                </div>

              </td>

              <td>

                <FiMail />

                nikita@gmail.com

              </td>

              <td>

                <FiPhone />

                +91 9876543210

              </td>

              <td>28</td>

              <td>₹48,200</td>

              <td>

                <button className="view-btn">

                  <FiEye />

                </button>

              </td>

            </tr>

            <tr>

              <td>

                <div className="customer-info">

                  <div className="avatar">
                    R
                  </div>

                  <div>

                    <h4>Rahul</h4>

                    <span>Regular</span>

                  </div>

                </div>

              </td>

              <td>

                <FiMail />

                rahul@gmail.com

              </td>

              <td>

                <FiPhone />

                +91 9874512365

              </td>

              <td>12</td>

              <td>₹19,600</td>

              <td>

                <button className="view-btn">

                  <FiEye />

                </button>

              </td>

            </tr>

            <tr>

              <td>

                <div className="customer-info">

                  <div className="avatar">
                    P
                  </div>

                  <div>

                    <h4>Priya</h4>

                    <span>VIP</span>

                  </div>

                </div>

              </td>

              <td>

                <FiMail />

                priya@gmail.com

              </td>

              <td>

                <FiPhone />

                +91 9988776655

              </td>

              <td>42</td>

              <td>₹1,08,700</td>

              <td>

                <button className="view-btn">

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