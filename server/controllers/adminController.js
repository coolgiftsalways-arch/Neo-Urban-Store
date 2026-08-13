import Order from "../models/Order.js";

/* =========================================================
   GET ALL CUSTOMERS FROM ORDERS
========================================================= */

export const getAllCustomers = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .lean();

    const customerMap = new Map();

    orders.forEach((order) => {
      const email = order.email?.toLowerCase().trim();

      // Skip orders without an email
      if (!email) return;

      // =====================================================
      // GET CUSTOMER NAME
      // =====================================================

      const customerName =
        order.customerName ||
        order.fullName ||
        order.name ||
        order.shippingAddress?.fullName ||
        order.shippingAddress?.name ||
        "";

      // =====================================================
      // GET CUSTOMER PHONE
      // =====================================================

      const customerPhone =
        order.phone ||
        order.shippingAddress?.phone ||
        "";

      // =====================================================
      // GET CUSTOMER ADDRESS
      // =====================================================

      const customerAddress =
        order.address ||
        order.shippingAddress?.address ||
        "";

      // =====================================================
      // GET LANDMARK
      // =====================================================

      const customerLandmark =
        order.landmark ||
        order.shippingAddress?.landmark ||
        "";

      // =====================================================
      // GET CITY
      // =====================================================

      const customerCity =
        order.city ||
        order.shippingAddress?.city ||
        "";

      // =====================================================
      // GET STATE
      // =====================================================

      const customerState =
        order.state ||
        order.shippingAddress?.state ||
        "";

      // =====================================================
      // GET PINCODE
      // =====================================================

      const customerPincode =
        order.pincode ||
        order.shippingAddress?.pincode ||
        order.shippingAddress?.postalCode ||
        "";

      // =====================================================
      // FIRST ORDER FOR THIS CUSTOMER
      // =====================================================

      if (!customerMap.has(email)) {
        customerMap.set(email, {
          _id: email,

          // NO "GUEST CUSTOMER" FALLBACK
          name: customerName,

          email: order.email,

          phone: customerPhone,

          address: customerAddress,

          landmark: customerLandmark,

          city: customerCity,

          state: customerState,

          pincode: customerPincode,

          orders: 1,

          totalSpent:
            Number(order.total) || 0,

          createdAt: order.createdAt,

          lastOrderDate:
            order.createdAt,
        });
      } else {
        // ===================================================
        // EXISTING CUSTOMER
        // ===================================================

        const customer =
          customerMap.get(email);

        customer.orders += 1;

        customer.totalSpent +=
          Number(order.total) || 0;

        // ===================================================
        // IF FIRST ORDER DIDN'T HAVE NAME,
        // USE NAME FROM ANOTHER ORDER
        // ===================================================

        if (
          !customer.name &&
          customerName
        ) {
          customer.name =
            customerName;
        }

        // ===================================================
        // FILL MISSING PHONE
        // ===================================================

        if (
          !customer.phone &&
          customerPhone
        ) {
          customer.phone =
            customerPhone;
        }

        // ===================================================
        // FILL MISSING ADDRESS
        // ===================================================

        if (
          !customer.address &&
          customerAddress
        ) {
          customer.address =
            customerAddress;
        }

        // ===================================================
        // FILL MISSING LANDMARK
        // ===================================================

        if (
          !customer.landmark &&
          customerLandmark
        ) {
          customer.landmark =
            customerLandmark;
        }

        // ===================================================
        // FILL MISSING CITY
        // ===================================================

        if (
          !customer.city &&
          customerCity
        ) {
          customer.city =
            customerCity;
        }

        // ===================================================
        // FILL MISSING STATE
        // ===================================================

        if (
          !customer.state &&
          customerState
        ) {
          customer.state =
            customerState;
        }

        // ===================================================
        // FILL MISSING PINCODE
        // ===================================================

        if (
          !customer.pincode &&
          customerPincode
        ) {
          customer.pincode =
            customerPincode;
        }
      }
    });

    // =======================================================
    // CONVERT MAP → ARRAY
    // =======================================================

    const customers =
      Array.from(
        customerMap.values()
      );

    res.json(customers);

  } catch (error) {
    console.error(
      "❌ Get customers error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch customers",
      error: error.message,
    });
  }
};


/* =========================================================
   CUSTOMER COUNT
========================================================= */

export const getCustomerCount = async (
  req,
  res
) => {
  try {
    const orders = await Order.find({})
      .select("email")
      .lean();

    const uniqueEmails =
      new Set();

    orders.forEach((order) => {
      if (order.email) {
        uniqueEmails.add(
          order.email
            .toLowerCase()
            .trim()
        );
      }
    });

    res.json({
      success: true,

      totalCustomers:
        uniqueEmails.size,
    });

  } catch (error) {
    console.error(
      "❌ Customer count error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to get customer count",
      error: error.message,
    });
  }
};