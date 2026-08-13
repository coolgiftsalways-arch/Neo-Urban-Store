import Order from "../models/Order.js";

/* =========================================================
   GET CUSTOMERS FROM ORDERS
========================================================= */

export const getAllCustomers = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .lean();

    const customerMap = new Map();

    orders.forEach((order) => {
      const email = order.email?.toLowerCase().trim();

      if (!email) return;

      if (!customerMap.has(email)) {
        customerMap.set(email, {
          _id: email,

          name:
            order.customerName ||
            "Guest Customer",

          email: order.email,

          phone:
            order.phone ||
            "Not provided",

          address:
            order.address ||
            "",

          landmark:
            order.landmark ||
            "",

          city:
            order.city ||
            "",

          state:
            order.state ||
            "",

          pincode:
            order.pincode ||
            "",

          orders: 1,

          totalSpent:
            Number(order.total) || 0,

          createdAt:
            order.createdAt,
        });
      } else {
        const customer =
          customerMap.get(email);

        customer.orders += 1;

        customer.totalSpent +=
          Number(order.total) || 0;
      }
    });

    const customers =
      Array.from(customerMap.values());

    res.json(customers);

  } catch (error) {
    console.error(
      "Get customers error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch customers",
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
      totalCustomers:
        uniqueEmails.size,
    });

  } catch (error) {
    console.error(
      "Customer count error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to get customer count",
    });
  }
};