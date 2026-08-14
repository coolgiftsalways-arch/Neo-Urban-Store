import Order from "../models/Order.js";
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
      const email =
        order.email?.toLowerCase().trim();

      // Skip orders without email
      if (!email) return;

      /* =====================================================
         GET CUSTOMER NAME
      ===================================================== */

      const customerName =
        order.customerName ||
        order.fullName ||
        order.name ||
        order.shippingAddress?.fullName ||
        order.shippingAddress?.name ||
        "";

      /* =====================================================
         GET CUSTOMER PHONE
      ===================================================== */

      const customerPhone =
        order.phone ||
        order.shippingAddress?.phone ||
        "";

      /* =====================================================
         GET CUSTOMER ADDRESS
      ===================================================== */

      const customerAddress =
        order.address ||
        order.shippingAddress?.address ||
        "";

      /* =====================================================
         GET LANDMARK
      ===================================================== */

      const customerLandmark =
        order.landmark ||
        order.shippingAddress?.landmark ||
        "";

      /* =====================================================
         GET CITY
      ===================================================== */

      const customerCity =
        order.city ||
        order.shippingAddress?.city ||
        "";

      /* =====================================================
         GET STATE
      ===================================================== */

      const customerState =
        order.state ||
        order.shippingAddress?.state ||
        "";

      /* =====================================================
         GET PINCODE
      ===================================================== */

      const customerPincode =
        order.pincode ||
        order.shippingAddress?.pincode ||
        order.shippingAddress?.postalCode ||
        "";

      /* =====================================================
         FIRST ORDER FOR CUSTOMER
      ===================================================== */

      if (!customerMap.has(email)) {
        customerMap.set(email, {
          _id: email,

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

          createdAt:
            order.createdAt,

          lastOrderDate:
            order.createdAt,
        });
      } else {
        /* ===================================================
           EXISTING CUSTOMER
        =================================================== */

        const customer =
          customerMap.get(email);

        customer.orders += 1;

        customer.totalSpent +=
          Number(order.total) || 0;

        /* ===================================================
           FILL MISSING NAME
        =================================================== */

        if (
          !customer.name &&
          customerName
        ) {
          customer.name =
            customerName;
        }

        /* ===================================================
           FILL MISSING PHONE
        =================================================== */

        if (
          !customer.phone &&
          customerPhone
        ) {
          customer.phone =
            customerPhone;
        }

        /* ===================================================
           FILL MISSING ADDRESS
        =================================================== */

        if (
          !customer.address &&
          customerAddress
        ) {
          customer.address =
            customerAddress;
        }

        /* ===================================================
           FILL MISSING LANDMARK
        =================================================== */

        if (
          !customer.landmark &&
          customerLandmark
        ) {
          customer.landmark =
            customerLandmark;
        }

        /* ===================================================
           FILL MISSING CITY
        =================================================== */

        if (
          !customer.city &&
          customerCity
        ) {
          customer.city =
            customerCity;
        }

        /* ===================================================
           FILL MISSING STATE
        =================================================== */

        if (
          !customer.state &&
          customerState
        ) {
          customer.state =
            customerState;
        }

        /* ===================================================
           FILL MISSING PINCODE
        =================================================== */

        if (
          !customer.pincode &&
          customerPincode
        ) {
          customer.pincode =
            customerPincode;
        }
      }
    });

    /* =======================================================
       CONVERT MAP → ARRAY
    ======================================================= */

    const customers =
      Array.from(
        customerMap.values()
      );

    return res.status(200).json(
      customers
    );

  } catch (error) {
    console.error(
      "❌ Get customers error:",
      error
    );

    return res.status(500).json({
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

    return res.status(200).json({
      success: true,

      totalCustomers:
        uniqueEmails.size,
    });

  } catch (error) {
    console.error(
      "❌ Customer count error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to get customer count",
      error: error.message,
    });
  }
};


/* =========================================================
   ADMIN LOGIN
   POST /api/admin/login

   PUBLIC ROUTE
========================================================= */

export const adminLogin = async (
  req,
  res
) => {
  try {
    console.log(
      "===================================="
    );

    console.log(
      "🔐 ADMIN LOGIN REQUEST"
    );

    console.log(
      "Request body:",
      req.body
    );

    console.log(
      "===================================="
    );

    /* =====================================================
       CHECK REQUEST BODY
    ===================================================== */

    if (!req.body) {
      return res.status(400).json({
        success: false,
        message:
          "Request body is missing.",
      });
    }

    /* =====================================================
       GET EMAIL + PASSWORD
    ===================================================== */

    const email =
      req.body.email;

    const password =
      req.body.password;

    /* =====================================================
       VALIDATE INPUT
    ===================================================== */

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required.",
      });
    }

    /* =====================================================
       FIND ADMIN
    ===================================================== */

    const admin =
      await Admin.findOne({
        email:
          email
            .toLowerCase()
            .trim(),
      });

    /* =====================================================
       ADMIN NOT FOUND
    ===================================================== */

    if (!admin) {
      console.log(
        "❌ Admin not found:",
        email
      );

      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    /* =====================================================
       CHECK PASSWORD
    ===================================================== */

    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        admin.password
      );

    if (!isPasswordCorrect) {
      console.log(
        "❌ Incorrect admin password"
      );

      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    /* =====================================================
       CHECK JWT SECRET
    ===================================================== */

    if (!process.env.JWT_SECRET) {
      console.error(
        "❌ JWT_SECRET is missing from .env"
      );

      return res.status(500).json({
        success: false,
        message:
          "JWT secret is not configured.",
      });
    }

    /* =====================================================
       CREATE JWT TOKEN
    ===================================================== */

    const token =
      jwt.sign(
        {
          id: admin._id,
          email: admin.email,
          role: admin.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

    /* =====================================================
       SUCCESS
    ===================================================== */

    console.log(
      "✅ Admin login successful:",
      admin.email
    );

    return res.status(200).json({
      success: true,

      message:
        "Admin login successful.",

      token,

      admin: {
        id: admin._id,

        name:
          admin.name,

        email:
          admin.email,

        role:
          admin.role,
      },
    });

  } catch (error) {
    console.error(
      "❌ Admin login error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Admin login failed.",

      error:
        error.message,
    });
  }
};