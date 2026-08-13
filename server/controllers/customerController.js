import Order from "../models/Order.js";

// =====================================================
// PLACEHOLDER NAMES WE NEVER WANT TO DISPLAY
// =====================================================

const invalidNames = [
  "guest customer",
  "unknown customer",
  "customer",
  "guest",
];

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

    // ===================================================
    // GET ALL ORDERS
    // ===================================================

    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .lean();

    console.log(`📦 Orders found: ${orders.length}`);

    // ===================================================
    // GROUP ORDERS BY CUSTOMER
    // ===================================================

    const customersMap = new Map();

    for (const order of orders) {

      // =================================================
      // CUSTOMER NAME
      // =================================================

      let name =
        order.customerName ||
        order.fullName ||
        order.shippingAddress?.fullName ||
        "";

      name = String(name).trim();

      // =================================================
      // REMOVE PLACEHOLDER CUSTOMER NAMES
      // =================================================

      if (
        !name ||
        invalidNames.includes(
          name.toLowerCase()
        )
      ) {
        name = "";
      }

      // =================================================
      // EMAIL
      // =================================================

      let email =
        order.email ||
        order.shippingAddress?.email ||
        "";

      email = String(email).trim();

      // =================================================
      // PHONE
      // =================================================

      let phone =
        order.phone ||
        order.phoneNumber ||
        order.shippingAddress?.phone ||
        "";

      phone = String(phone).trim();

      // =================================================
      // ADDRESS
      // =================================================

      const address =
        order.address ||
        order.shippingAddress?.address ||
        "";

      // =================================================
      // LANDMARK
      // =================================================

      const landmark =
        order.landmark ||
        order.shippingAddress?.landmark ||
        "";

      // =================================================
      // CITY
      // =================================================

      const city =
        order.city ||
        order.shippingAddress?.city ||
        "";

      // =================================================
      // STATE
      // =================================================

      const state =
        order.state ||
        order.shippingAddress?.state ||
        "";

      // =================================================
      // PINCODE
      // =================================================

      const pincode =
        order.pincode ||
        order.postalCode ||
        order.shippingAddress?.pincode ||
        order.shippingAddress?.postalCode ||
        "";

      // =================================================
      // COUNTRY
      // =================================================

      const country =
        order.country ||
        order.shippingAddress?.country ||
        "India";

      // =================================================
      // CREATE CUSTOMER KEY
      // =================================================

      let customerKey = "";

      if (email) {

        customerKey =
          `email:${email.toLowerCase()}`;

      } else if (phone) {

        customerKey =
          `phone:${phone}`;

      } else if (name) {

        customerKey =
          `name:${name.toLowerCase()}`;

      } else {

        // No usable customer information
        continue;
      }

      // =================================================
      // CREATE CUSTOMER IF NOT EXISTS
      // =================================================

      if (!customersMap.has(customerKey)) {

        customersMap.set(
          customerKey,
          {
            _id: customerKey,

            name: name,

            email:
              email || "N/A",

            phone:
              phone || "N/A",

            ordersCount: 0,

            totalSpent: 0,

            address: address,

            landmark: landmark,

            city: city,

            state: state,

            pincode: pincode,

            country: country,

            lastOrderDate:
              order.createdAt || null,
          }
        );
      }

      // =================================================
      // GET CUSTOMER
      // =================================================

      const customer =
        customersMap.get(customerKey);

      // =================================================
      // IMPORTANT:
      // IF CURRENT CUSTOMER HAS NO REAL NAME,
      // BUT THIS ORDER HAS ONE,
      // USE THE REAL NAME.
      // =================================================

      if (
        !customer.name &&
        name
      ) {
        customer.name = name;
      }

      // =================================================
      // PHONE
      // =================================================

      if (
        (!customer.phone ||
          customer.phone === "N/A") &&
        phone
      ) {
        customer.phone = phone;
      }

      // =================================================
      // EMAIL
      // =================================================

      if (
        (!customer.email ||
          customer.email === "N/A") &&
        email
      ) {
        customer.email = email;
      }

      // =================================================
      // ADDRESS
      // =================================================

      if (
        !customer.address &&
        address
      ) {
        customer.address = address;
      }

      // =================================================
      // LANDMARK
      // =================================================

      if (
        !customer.landmark &&
        landmark
      ) {
        customer.landmark = landmark;
      }

      // =================================================
      // CITY
      // =================================================

      if (
        !customer.city &&
        city
      ) {
        customer.city = city;
      }

      // =================================================
      // STATE
      // =================================================

      if (
        !customer.state &&
        state
      ) {
        customer.state = state;
      }

      // =================================================
      // PINCODE
      // =================================================

      if (
        !customer.pincode &&
        pincode
      ) {
        customer.pincode = pincode;
      }

      // =================================================
      // COUNTRY
      // =================================================

      if (
        !customer.country &&
        country
      ) {
        customer.country = country;
      }

      // =================================================
      // ADD ORDER COUNT
      // =================================================

      customer.ordersCount += 1;

      // =================================================
      // ADD ORDER TOTAL
      // =================================================

      const orderTotal = Number(
        order.total ??
        order.totalPrice ??
        0
      );

      customer.totalSpent += orderTotal;

      // =================================================
      // UPDATE LAST ORDER DATE
      // =================================================

      if (
        order.createdAt &&
        (
          !customer.lastOrderDate ||
          new Date(order.createdAt) >
            new Date(customer.lastOrderDate)
        )
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
    // FINAL CLEANUP
    // =====================================================

    customers.forEach((customer) => {

      // Never return placeholder names

      if (
        !customer.name ||
        invalidNames.includes(
          String(customer.name)
            .trim()
            .toLowerCase()
        )
      ) {

        customer.name = "N/A";
      }

    });

    // =====================================================
    // SORT BY LATEST ORDER
    // =====================================================

    customers.sort((a, b) => {

      return (
        new Date(
          b.lastOrderDate || 0
        ) -
        new Date(
          a.lastOrderDate || 0
        )
      );

    });

    // =====================================================
    // DEBUG
    // =====================================================

    console.log(
      `👥 Customers found: ${customers.length}`
    );

    console.log(
      "===================================="
    );

    console.log(
      "CUSTOMERS:"
    );

    console.log(
      JSON.stringify(
        customers,
        null,
        2
      )
    );

    console.log(
      "===================================="
    );

    // =====================================================
    // SEND RESPONSE
    // =====================================================

    res.status(200).json(
      customers
    );

  } catch (error) {

    // =====================================================
    // ERROR
    // =====================================================

    console.error(
      "❌ GET CUSTOMERS ERROR:"
    );

    console.error(
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Failed to fetch customers",

      error:
        error.message,

    });
  }
};