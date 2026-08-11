import "../styles/products.css";

import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";

export default function Products() {
  return (
    <div className="products-page">

      <div className="products-header">

        <div>
          <h1>Products</h1>
          <p>Manage all your store products</p>
        </div>

        <button className="add-product-btn">
          <FiPlus />
          Add Product
        </button>

      </div>

      {/* Search */}

      <div className="product-toolbar">

        <div className="product-search">

          <FiSearch />

          <input
            type="text"
            placeholder="Search products..."
          />

        </div>

      </div>

      {/* Table */}

      <div className="products-table">

        <table>

          <thead>

            <tr>

              <th>Image</th>

              <th>Name</th>

              <th>Category</th>

              <th>Price</th>

              <th>Stock</th>

              <th>Status</th>

              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            <tr>

              <td>

                <img
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200"
                  alt=""
                />

              </td>

              <td>Nike Air Max</td>

              <td>Shoes</td>

              <td>₹8,999</td>

              <td>18</td>

              <td>
                <span className="status active">
                  Active
                </span>
              </td>

              <td>

                <button className="icon-btn">
                  <FiEdit2 />
                </button>

                <button className="icon-btn delete">
                  <FiTrash2 />
                </button>

              </td>

            </tr>

            <tr>

              <td>

                <img
                  src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200"
                  alt=""
                />

              </td>

              <td>Oversized Hoodie</td>

              <td>Clothing</td>

              <td>₹2,499</td>

              <td>35</td>

              <td>
                <span className="status active">
                  Active
                </span>
              </td>

              <td>

                <button className="icon-btn">
                  <FiEdit2 />
                </button>

                <button className="icon-btn delete">
                  <FiTrash2 />
                </button>

              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}