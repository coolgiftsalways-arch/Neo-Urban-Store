import Order from "../models/Order.js";

/* =====================================================
   GET ALL ORDERS
   GET /api/orders
===================================================== */

export const getOrders = async (req, res) => {
  try {
    console.log("====================================");
    console.log("📦 GET /api/orders");
    console.log("Fetching all orders...");
    console.log("====================================");

    // =====================================================
    // GET ALL ORDERS
    // =====================================================

    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .lean();

    console.log(`✅ Orders found: ${orders.length}`);

    // =====================================================
    // BUILD CUSTOMER NAME MAP
    // =====================================================

    const customerNameMap = new Map();

    // =====================================================
    // BUILD CUSTOMER PHONE MAP ⭐
    // =====================================================

    const customerPhoneMap = new Map();

    for (const order of orders) {
      const email =
        order.email?.trim().toLowerCase() ||
        order.shippingAddress?.email
          ?.trim()
          .toLowerCase() ||
        "";

      // ===================================================
      // CUSTOMER NAME
      // ===================================================

      const possibleName =
        order.customerName?.trim() ||
        order.fullName?.trim() ||
        order.shippingAddress?.fullName?.trim() ||
        "";

      const invalidNames = [
        "",
        "guest customer",
        "unknown customer",
        "n/a",
        "customer",
      ];

      if (
        email &&
        possibleName &&
        !invalidNames.includes(
          possibleName.toLowerCase()
        )
      ) {
        customerNameMap.set(
          email,
          possibleName
        );
      }

      // ===================================================
      // CUSTOMER PHONE ⭐
      // ===================================================

      const possiblePhone =
        order.phone?.trim() ||
        order.phoneNumber?.trim() ||
        order.shippingAddress?.phone?.trim() ||
        order.shippingAddress?.phoneNumber?.trim() ||
        order.billingAddress?.phone?.trim() ||
        "";

      /*
        If this customer already has a valid phone
        in another order, remember it by email.
      */

      if (
        email &&
        possiblePhone &&
        !customerPhoneMap.has(email)
      ) {
        customerPhoneMap.set(
          email,
          possiblePhone
        );
      }
    }

    console.log(
      "👤 Customer name map:",
      customerNameMap
    );

    console.log(
      "📱 Customer phone map:",
      customerPhoneMap
    );

    // =====================================================
    // FORMAT ORDERS
    // =====================================================

    const formattedOrders = orders.map(
      (order) => {

        // =================================================
        // CUSTOMER EMAIL
        // =================================================

        const email =
          order.email?.trim().toLowerCase() ||
          order.shippingAddress?.email
            ?.trim()
            .toLowerCase() ||
          "";

        // =================================================
        // CUSTOMER NAME
        // =================================================

        let customerName =
          order.customerName?.trim() ||
          order.fullName?.trim() ||
          order.shippingAddress?.fullName?.trim() ||
          "";

        const invalidNames = [
          "",
          "guest customer",
          "unknown customer",
          "n/a",
          "customer",
        ];

        // -------------------------------------------------
        // GET REAL CUSTOMER NAME FROM ANOTHER ORDER
        // -------------------------------------------------

        if (
          invalidNames.includes(
            customerName.toLowerCase()
          ) &&
          email &&
          customerNameMap.has(email)
        ) {
          customerName =
            customerNameMap.get(email);
        }

        // -------------------------------------------------
        // FINAL NAME FALLBACK
        // -------------------------------------------------

        if (!customerName) {
          customerName = "Customer";
        }

        // =================================================
        // CUSTOMER PHONE ⭐
        // =================================================

        // First try the current order
        const directPhone =
          order.phone?.trim() ||
          order.phoneNumber?.trim() ||
          order.shippingAddress?.phone?.trim() ||
          order.shippingAddress?.phoneNumber?.trim() ||
          order.billingAddress?.phone?.trim() ||
          "";

        // If current order has no phone,
        // get it from another order with same email
        const customerPhone =
          directPhone ||
          (
            email &&
            customerPhoneMap.has(email)
              ? customerPhoneMap.get(email)
              : ""
          );

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
        // RETURN FORMATTED ORDER
        // =================================================

        return {
          ...order,

          // -----------------------------------------------
          // CUSTOMER
          // -----------------------------------------------

          customerName,

          email:
            order.email ||
            order.shippingAddress?.email ||
            "",

          phone: customerPhone,

          // -----------------------------------------------
          // ADDRESS
          // -----------------------------------------------

          address,

          landmark,

          city,

          state,

          pincode,

          country,
        };
      }
    );

    // =====================================================
    // DEBUG
    // =====================================================

    console.log(
      "===================================="
    );

    console.log(
      "✅ Orders formatted successfully"
    );

    console.log(
      "===================================="
    );

    // =====================================================
    // RESPONSE
    // =====================================================

    res.status(200).json(
      formattedOrders
    );

  } catch (error) {

    console.error(
      "❌ GET ORDERS ERROR:"
    );

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};


/* =====================================================
   GET SINGLE ORDER
   GET /api/orders/:id
===================================================== */

export const getOrderById = async (
  req,
  res
) => {
  try {

    console.log(
      `📦 GET /api/orders/${req.params.id}`
    );

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {

      return res.status(404).json({
        success: false,
        message: "Order not found",
      });

    }

    res.status(200).json(order);

  } catch (error) {

    console.error(
      "❌ GET ORDER ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};


/* =====================================================
   CREATE ORDER
   POST /api/orders
===================================================== */

export const addOrderItems = async (
  req,
  res
) => {

  try {

    console.log(
      "===================================="
    );

    console.log(
      "🛒 POST /api/orders"
    );

    console.log(
      "Creating new order..."
    );

    console.log(
      "===================================="
    );

    console.log(
      "📥 ORDER BODY:",
      req.body
    );

    // =================================================
    // GET DATA FROM REQUEST
    // =================================================

    const {
      orderItems,
      items,

      shippingAddress,

      paymentMethod,

      itemsPrice,
      subtotal,

      shippingPrice,
      shipping,

      taxPrice,
      tax,

      totalPrice,
      total,

      customerName,
      fullName,

      email,

      phone,
      phoneNumber,

      address,
      landmark,
      city,
      state,

      postalCode,
      pincode,

      country,

    } = req.body;


    // =================================================
    // CUSTOMER NAME
    // =================================================

    const finalCustomerName =
      customerName?.trim() ||
      fullName?.trim() ||
      shippingAddress?.fullName?.trim() ||
      "";


    // =================================================
    // CUSTOMER NAME IS REQUIRED
    // =================================================

    if (!finalCustomerName) {

      return res.status(400).json({
        success: false,
        message:
          "Customer name is required. Guest checkout is not allowed.",
      });

    }


    // =================================================
    // CUSTOMER EMAIL
    // =================================================

    const finalEmail =
      email?.trim() ||
      shippingAddress?.email?.trim() ||
      "";


    // =================================================
    // CUSTOMER PHONE
    // =================================================

    const finalPhone =
      phone?.trim() ||
      phoneNumber?.trim() ||
      shippingAddress?.phone?.trim() ||
      "";


    // =================================================
    // ADDRESS
    // =================================================

    const finalAddress =
      address?.trim() ||
      shippingAddress?.address?.trim() ||
      "";


    // =================================================
    // LANDMARK
    // =================================================

    const finalLandmark =
      landmark?.trim() ||
      shippingAddress?.landmark?.trim() ||
      "";


    // =================================================
    // CITY
    // =================================================

    const finalCity =
      city?.trim() ||
      shippingAddress?.city?.trim() ||
      "";


    // =================================================
    // STATE
    // =================================================

    const finalState =
      state?.trim() ||
      shippingAddress?.state?.trim() ||
      "";


    // =================================================
    // PINCODE
    // =================================================

    const finalPincode =
      postalCode?.trim() ||
      pincode?.trim() ||
      shippingAddress?.postalCode?.trim() ||
      shippingAddress?.pincode?.trim() ||
      "";


    // =================================================
    // COUNTRY
    // =================================================

    const finalCountry =
      country?.trim() ||
      shippingAddress?.country?.trim() ||
      "India";


    // =================================================
    // ITEMS
    // =================================================

    const finalItems =
      Array.isArray(orderItems)
        ? orderItems
        : Array.isArray(items)
          ? items
          : [];


    // =================================================
    // VALIDATE ITEMS
    // =================================================

    if (
      !Array.isArray(finalItems) ||
      finalItems.length === 0
    ) {

      return res.status(400).json({
        success: false,
        message: "No order items",
      });

    }


    // =================================================
    // PRICES
    // =================================================

    const finalSubtotal =
      Number(
        itemsPrice ??
        subtotal ??
        0
      );


    const finalShipping =
      Number(
        shippingPrice ??
        shipping ??
        0
      );


    const finalTax =
      Number(
        taxPrice ??
        tax ??
        0
      );


    const finalTotal =
      Number(
        totalPrice ??
        total ??
        0
      );


    // =================================================
    // PAYMENT
    // =================================================

    const finalPaymentMethod =
      paymentMethod ||
      "COD";


    // =================================================
    // CREATE SHIPPING ADDRESS
    // =================================================

    const finalShippingAddress = {

      fullName:
        finalCustomerName,

      email:
        finalEmail,

      phone:
        finalPhone,

      address:
        finalAddress,

      landmark:
        finalLandmark,

      city:
        finalCity,

      state:
        finalState,

      postalCode:
        finalPincode,

      country:
        finalCountry,
    };


    // =================================================
    // CREATE ORDER
    // =================================================

    const orderData = {

      // -----------------------------------------------
      // CUSTOMER
      // -----------------------------------------------

      customerName:
        finalCustomerName,

      email:
        finalEmail,

      phone:
        finalPhone,


      // -----------------------------------------------
      // ADDRESS
      // -----------------------------------------------

      address:
        finalAddress,

      landmark:
        finalLandmark,

      city:
        finalCity,

      state:
        finalState,

      pincode:
        finalPincode,

      country:
        finalCountry,


      // -----------------------------------------------
      // PAYMENT
      // -----------------------------------------------

      paymentMethod:
        finalPaymentMethod,


      // -----------------------------------------------
      // ITEMS
      // -----------------------------------------------

      items:
        finalItems,


      // -----------------------------------------------
      // PRICES
      // -----------------------------------------------

      subtotal:
        finalSubtotal,

      shipping:
        finalShipping,

      tax:
        finalTax,

      total:
        finalTotal,


      // -----------------------------------------------
      // STATUS
      // -----------------------------------------------

      orderStatus:
        "Pending",
    };


    // =================================================
    // SAVE ORDER
    // =================================================

    const order =
      new Order(orderData);

    const createdOrder =
      await order.save();


    // =================================================
    // LOG
    // =================================================

    console.log(
      "===================================="
    );

    console.log(
      "✅ ORDER CREATED"
    );

    console.log(
      "ORDER ID:",
      createdOrder._id
    );

    console.log(
      "CUSTOMER:",
      finalCustomerName
    );

    console.log(
      "EMAIL:",
      finalEmail
    );

    console.log(
      "PHONE:",
      finalPhone
    );

    console.log(
      "TOTAL:",
      finalTotal
    );

    console.log(
      "===================================="
    );


    // =================================================
    // RESPONSE
    // =================================================

    res.status(201).json(
      createdOrder
    );


  } catch (error) {

    console.error(
      "===================================="
    );

    console.error(
      "❌ CREATE ORDER ERROR"
    );

    console.error(error);

    console.error(
      "===================================="
    );

    res.status(500).json({

      success: false,

      message:
        "Failed to create order",

      error:
        error.message,

    });

  }
};


/* =====================================================
   UPDATE ORDER STATUS
   PUT /api/orders/:id/status
===================================================== */

export const updateOrderStatus = async (
  req,
  res
) => {

  try {

    const {
      status
    } = req.body;


    if (!status) {

      return res.status(400).json({
        success: false,
        message: "Status is required",
      });

    }


    const order =
      await Order.findById(
        req.params.id
      );


    if (!order) {

      return res.status(404).json({
        success: false,
        message: "Order not found",
      });

    }


    // =================================================
    // UPDATE ORDER STATUS
    // =================================================

    order.orderStatus =
      status;


    const updatedOrder =
      await order.save();


    console.log(
      `✅ Order ${order._id} status updated to ${status}`
    );


    res.status(200).json(
      updatedOrder
    );


  } catch (error) {

    console.error(
      "❌ UPDATE ORDER STATUS ERROR:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Failed to update order status",

      error:
        error.message,

    });

  }
};


/* =====================================================
   GET ALL CUSTOMERS
   GET /api/orders/customers/all
===================================================== */

export const getCustomers = async (
  req,
  res
) => {

  try {

    console.log(
      "===================================="
    );

    console.log(
      "👥 GET /api/orders/customers/all"
    );

    console.log(
      "Fetching customers from orders..."
    );

    console.log(
      "===================================="
    );


    // =================================================
    // GET ALL ORDERS
    // =================================================

    const orders =
      await Order.find({})
        .sort({
          createdAt: -1
        })
        .lean();


    // =================================================
    // BUILD REAL CUSTOMER NAME MAP
    // =================================================

    const customerNameMap =
      new Map();


    for (const order of orders) {

      const email =
        order.email?.trim().toLowerCase();


      const name =
        order.customerName?.trim() ||
        order.fullName?.trim() ||
        order.shippingAddress?.fullName?.trim() ||
        "";


      if (
        email &&
        name &&
        name.toLowerCase() !==
          "guest customer" &&
        name.toLowerCase() !==
          "unknown customer" &&
        name.toLowerCase() !==
          "n/a"
      ) {

        customerNameMap.set(
          email,
          name
        );

      }

    }


    // =================================================
    // BUILD CUSTOMER PHONE MAP
    // =================================================

    const customerPhoneMap =
      new Map();


    for (const order of orders) {

      const email =
        order.email?.trim().toLowerCase();


      const phone =
        order.phone?.trim() ||
        order.phoneNumber?.trim() ||
        order.shippingAddress?.phone?.trim() ||
        "";


      if (
        email &&
        phone &&
        !customerPhoneMap.has(email)
      ) {

        customerPhoneMap.set(
          email,
          phone
        );

      }

    }


    // =================================================
    // GROUP CUSTOMERS
    // =================================================

    const customersMap =
      new Map();


    for (const order of orders) {

      const email =
        order.email?.trim().toLowerCase() ||
        order.shippingAddress?.email?.trim().toLowerCase() ||
        "";


      const directPhone =
        order.phone?.trim() ||
        order.phoneNumber?.trim() ||
        order.shippingAddress?.phone?.trim() ||
        "";


      const phone =
        directPhone ||
        (
          email &&
          customerPhoneMap.has(email)
            ? customerPhoneMap.get(email)
            : ""
        );


      let name =
        order.customerName?.trim() ||
        order.fullName?.trim() ||
        order.shippingAddress?.fullName?.trim() ||
        "";


      // =================================================
      // GET REAL NAME FROM NAME MAP
      // =================================================

      if (
        (
          !name ||
          name.toLowerCase() ===
            "guest customer" ||
          name.toLowerCase() ===
            "unknown customer" ||
          name.toLowerCase() ===
            "n/a"
        ) &&
        email &&
        customerNameMap.has(email)
      ) {

        name =
          customerNameMap.get(email);

      }


      // =================================================
      // FINAL FALLBACK
      // =================================================

      if (!name) {
        name = "Customer";
      }


      // =================================================
      // CUSTOMER KEY
      // =================================================

      let customerKey;


      if (email) {

        customerKey =
          `email:${email}`;

      } else if (phone) {

        customerKey =
          `phone:${phone}`;

      } else {

        customerKey =
          `name:${name
            .trim()
            .toLowerCase()}`;

      }


      // =================================================
      // CREATE CUSTOMER
      // =================================================

      if (
        !customersMap.has(
          customerKey
        )
      ) {

        customersMap.set(
          customerKey,
          {

            _id:
              customerKey,

            name:
              name,

            email:
              email ||
              "N/A",

            phone:
              phone ||
              "N/A",

            ordersCount:
              0,

            totalSpent:
              0,

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
              order.createdAt ||
              null,

          }
        );

      }


      // =================================================
      // GET CUSTOMER
      // =================================================

      const customer =
        customersMap.get(
          customerKey
        );


      // =================================================
      // ADD ORDER COUNT
      // =================================================

      customer.ordersCount += 1;


      // =================================================
      // ADD TOTAL SPENT
      // =================================================

      customer.totalSpent +=
        Number(
          order.total ??
          order.totalPrice ??
          0
        );


      // =================================================
      // UPDATE NAME
      // =================================================

      if (
        name &&
        name !== "Customer" &&
        name !== "N/A"
      ) {

        customer.name =
          name;

      }


      // =================================================
      // UPDATE CUSTOMER PHONE
      // =================================================

      if (
        phone &&
        (
          !customer.phone ||
          customer.phone === "N/A"
        )
      ) {

        customer.phone =
          phone;

      }


      // =================================================
      // UPDATE ADDRESS
      // =================================================

      if (
        !customer.address
      ) {

        customer.address =
          order.address ||
          order.shippingAddress?.address ||
          "";

      }


      if (
        !customer.landmark
      ) {

        customer.landmark =
          order.landmark ||
          order.shippingAddress?.landmark ||
          "";

      }


      if (
        !customer.city
      ) {

        customer.city =
          order.city ||
          order.shippingAddress?.city ||
          "";

      }


      if (
        !customer.state
      ) {

        customer.state =
          order.state ||
          order.shippingAddress?.state ||
          "";

      }


      if (
        !customer.pincode
      ) {

        customer.pincode =
          order.pincode ||
          order.postalCode ||
          order.shippingAddress?.pincode ||
          order.shippingAddress?.postalCode ||
          "";

      }


      // =================================================
      // LAST ORDER DATE
      // =================================================

      if (
        order.createdAt &&
        (
          !customer.lastOrderDate ||
          new Date(
            order.createdAt
          ) >
          new Date(
            customer.lastOrderDate
          )
        )
      ) {

        customer.lastOrderDate =
          order.createdAt;

      }

    }


    // =================================================
    // CONVERT MAP TO ARRAY
    // =================================================

    const customers =
      Array.from(
        customersMap.values()
      );


    // =================================================
    // SORT BY LAST ORDER
    // =================================================

    customers.sort(
      (a, b) => {

        return (
          new Date(
            b.lastOrderDate || 0
          ) -
          new Date(
            a.lastOrderDate || 0
          )
        );

      }
    );


    // =================================================
    // LOG
    // =================================================

    console.log(
      `👥 Customers found: ${customers.length}`
    );

    console.log(
      "Customer data:",
      customers
    );


    // =================================================
    // RESPONSE
    // =================================================

    res.status(200).json(
      customers
    );


  } catch (error) {

    console.error(
      "❌ GET CUSTOMERS ERROR:",
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