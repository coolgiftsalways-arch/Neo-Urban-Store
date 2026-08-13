import Order from "../models/Order.js";


// =====================================================
// GET ALL ORDERS
// GET /api/orders
// =====================================================

export const getOrders = async (req, res) => {
  try {
    console.log("====================================");
    console.log("📦 GET /api/orders");
    console.log("Fetching all orders...");
    console.log("====================================");

    const orders = await Order.find({})
      .sort({ createdAt: -1 });

    console.log(`✅ Orders found: ${orders.length}`);

    res.status(200).json(orders);

  } catch (error) {

    console.error("❌ GET ORDERS ERROR:");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};


// =====================================================
// GET SINGLE ORDER
// GET /api/orders/:id
// =====================================================

export const getOrderById = async (req, res) => {
  try {

    console.log(
      `📦 GET /api/orders/${req.params.id}`
    );

    const order =
      await Order.findById(req.params.id);

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


// =====================================================
// CREATE ORDER
// POST /api/orders
// =====================================================

export const addOrderItems = async (req, res) => {

  try {

    console.log("====================================");
    console.log("🛒 POST /api/orders");
    console.log("Creating new order...");
    console.log("====================================");

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
    // Accept all possible frontend field names
    // =================================================

    if (!finalCustomerName.trim()) {

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
      email ||
      shippingAddress?.email ||
      "";


    // =================================================
    // CUSTOMER PHONE
    // =================================================

    const finalPhone =
      phone ||
      phoneNumber ||
      shippingAddress?.phone ||
      "";


    // =================================================
    // ADDRESS
    // =================================================

    const finalAddress =
      address ||
      shippingAddress?.address ||
      "";


    // =================================================
    // LANDMARK
    // =================================================

    const finalLandmark =
      landmark ||
      shippingAddress?.landmark ||
      "";


    // =================================================
    // CITY
    // =================================================

    const finalCity =
      city ||
      shippingAddress?.city ||
      "";


    // =================================================
    // STATE
    // =================================================

    const finalState =
      state ||
      shippingAddress?.state ||
      "";


    // =================================================
    // PINCODE
    // =================================================

    const finalPincode =
      postalCode ||
      pincode ||
      shippingAddress?.postalCode ||
      shippingAddress?.pincode ||
      "";


    // =================================================
    // COUNTRY
    // =================================================

    const finalCountry =
      country ||
      shippingAddress?.country ||
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
      // Customer
      // -----------------------------------------------

      customerName:
        finalCustomerName,

      fullName:
        finalCustomerName,

      email:
        finalEmail,

      phone:
        finalPhone,

      // -----------------------------------------------
      // Address
      // -----------------------------------------------

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

      pincode:
        finalPincode,

      country:
        finalCountry,

      shippingAddress:
        finalShippingAddress,

      // -----------------------------------------------
      // Payment
      // -----------------------------------------------

      paymentMethod:
        finalPaymentMethod,

      // -----------------------------------------------
      // Items
      // -----------------------------------------------

      orderItems:
        finalItems,

      items:
        finalItems,

      // -----------------------------------------------
      // Prices
      // -----------------------------------------------

      itemsPrice:
        finalSubtotal,

      subtotal:
        finalSubtotal,

      shippingPrice:
        finalShipping,

      shipping:
        finalShipping,

      taxPrice:
        finalTax,

      tax:
        finalTax,

      totalPrice:
        finalTotal,

      total:
        finalTotal,

      // -----------------------------------------------
      // Status
      // -----------------------------------------------

      orderStatus:
        "Pending",

      status:
        "Pending",

    };


    // =================================================
    // SAVE ORDER
    // =================================================

    const order =
      new Order(orderData);


    const createdOrder =
      await order.save();


    console.log("====================================");
    console.log("✅ ORDER CREATED");
    console.log("ORDER ID:", createdOrder._id);
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
    console.log("====================================");


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


// =====================================================
// UPDATE ORDER STATUS
// PUT /api/orders/:id/status
// =====================================================

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


    // Support both fields
    order.orderStatus =
      status;

    order.status =
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