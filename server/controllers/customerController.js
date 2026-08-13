import Order from "../models/Order.js";

// =====================================================
// GET ALL CUSTOMERS
// GET /api/orders/customers/all
// =====================================================

export const getCustomers = async (req, res) => {
  try {
    console.log("====================================");
    console.log("👥 GET /api/orders/customers/all");
    console.log("Fetching customers from orders...");
    console.log("====================================");

    // Get all orders
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .lean();

    console.log(`📦 Orders found: ${orders.length}`);

    // =====================================================
    // GROUP ORDERS BY CUSTOMER
    // =====================================================

    const customersMap = new Map();

    for (const order of orders) {
      // ---------------------------------------------------
      // CUSTOMER NAME
      // ---------------------------------------------------

      const name =
        order.customerName ||
        order.fullName ||
        order.shippingAddress?.fullName ||
        "Unknown Customer";

      // ---------------------------------------------------
      // EMAIL
      // ---------------------------------------------------

      const email =
        order.email ||
        order.shippingAddress?.email ||
        "";

      // ---------------------------------------------------
      // PHONE
      // ---------------------------------------------------

      const phone =
        order.phone ||
        order.phoneNumber ||
        order.shippingAddress?.phone ||
        "";

      // ---------------------------------------------------
      // CREATE UNIQUE CUSTOMER KEY
      // ---------------------------------------------------

      let customerKey;

      if (email.trim()) {
        customerKey = `email:${email
          .trim()
          .toLowerCase()}`;
      } else if (phone.trim()) {
        customerKey = `phone:${phone.trim()}`;
      } else {
        customerKey = `name:${name
          .trim()
          .toLowerCase()}`;
      }

      // =====================================================
      // CREATE CUSTOMER IF NOT EXISTS
      // =====================================================

      if (!customersMap.has(customerKey)) {
        customersMap.set(customerKey, {
          _id: customerKey,

          name: name,

          email: email || "N/A",

          phone: phone || "N/A",

          ordersCount: 0,

          totalSpent: 0,

          // Address information
          address:
            order.address ||
            order.shippingAddress?.address ||
            "",

          landmark:
            order.landmark ||
            order.shippingAddress?.landmark ||
            "",

          city:
            order.city ||
            order.shippingAddress?.city ||
            "",

          state:
            order.state ||
            order.shippingAddress?.state ||
            "",

          pincode:
            order.pincode ||
            order.postalCode ||
            order.shippingAddress?.pincode ||
            order.shippingAddress?.postalCode ||
            "",

          country:
            order.country ||
            order.shippingAddress?.country ||
            "India",

          lastOrderDate:
            order.createdAt || null,
        });
      }

      // =====================================================
      // GET EXISTING CUSTOMER
      // =====================================================

      const customer =
        customersMap.get(customerKey);

      // =====================================================
      // ADD THIS ORDER TO CUSTOMER
      // =====================================================

      customer.ordersCount += 1;

      // ---------------------------------------------------
      // ADD ORDER TOTAL
      // ---------------------------------------------------

      const orderTotal = Number(
        order.total ??
        order.totalPrice ??
        0
      );

      customer.totalSpent += orderTotal;

      // ---------------------------------------------------
      // UPDATE LAST ORDER DATE
      // ---------------------------------------------------

      if (
        order.createdAt &&
        (!customer.lastOrderDate ||
          new Date(order.createdAt) >
            new Date(customer.lastOrderDate))
      ) {
        customer.lastOrderDate =
          order.createdAt;
      }
    }

    // =====================================================
    // CONVERT MAP TO ARRAY
    // =====================================================

    const customers =
      Array.from(
        customersMap.values()
      );

    // =====================================================
    // SORT CUSTOMERS
    // Latest customers first
    // =====================================================

    customers.sort((a, b) => {
      return (
        new Date(b.lastOrderDate || 0) -
        new Date(a.lastOrderDate || 0)
      );
    });

    console.log(
      `👥 Customers found: ${customers.length}`
    );

    console.log(
      "Customer data:",
      customers
    );

    // =====================================================
    // RESPONSE
    // =====================================================

    res.status(200).json(customers);

  } catch (error) {
    console.error(
      "❌ GET CUSTOMERS ERROR:"
    );

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch customers",
      error: error.message,
    });
  }
};