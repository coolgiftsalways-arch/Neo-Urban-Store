import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Cart from "../models/cart.js";
import { sendOrderConfirmationEmail } from "../utils/email.js";

import {
  createShiprocketOrder,
  assignShiprocketAWB,
  requestShiprocketPickup,
   trackShiprocketShipment,
} from "../services/shiprocketService.js";



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


    const orders = await Order.find({})
      .sort({
        createdAt: -1,
      })
      .lean();


    console.log(
      `✅ Orders found: ${orders.length}`
    );


    // =====================================================
    // BUILD CUSTOMER NAME MAP
    // =====================================================

    const customerNameMap = new Map();


    // =====================================================
    // BUILD CUSTOMER PHONE MAP
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
      // CUSTOMER PHONE
      // ===================================================

      const possiblePhone =
        order.phone?.trim() ||
        order.phoneNumber?.trim() ||
        order.shippingAddress?.phone?.trim() ||
        order.shippingAddress?.phoneNumber?.trim() ||
        order.billingAddress?.phone?.trim() ||
        "";


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

    const formattedOrders =
      orders.map(
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


          // =================================================
          // GET REAL CUSTOMER NAME
          // =================================================

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


          // =================================================
          // FINAL NAME FALLBACK
          // =================================================

          if (!customerName) {

            customerName =
              "Customer";

          }


          // =================================================
          // CUSTOMER PHONE
          // =================================================

          const directPhone =
            order.phone?.trim() ||
            order.phoneNumber?.trim() ||
            order.shippingAddress?.phone?.trim() ||
            order.shippingAddress?.phoneNumber?.trim() ||
            order.billingAddress?.phone?.trim() ||
            "";


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

            customerName,

            email:
              order.email ||
              order.shippingAddress?.email ||
              "",

            phone:
              customerPhone,

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

      message:
        "Failed to fetch orders",

      error:
        error.message,

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

        message:
          "Order not found",

      });

    }


    res.status(200).json(
      order
    );


  } catch (error) {

    console.error(
      "❌ GET ORDER ERROR:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        "Failed to fetch order",

      error:
        error.message,

    });

  }

};



/* =====================================================
   CREATE ORDER
   POST /api/orders

   INVENTORY:
   Product stock decreases ONLY when
   order is successfully created.
===================================================== */

export const addOrderItems = async (
  req,
  res
) => {

  let session = null;

  try {

    console.log("====================================");
    console.log("🛒 POST /api/orders");
    console.log("Creating new order...");
    console.log("====================================");

    console.log("📥 ORDER BODY:", req.body);


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
    // CUSTOMER
    // =================================================

    const finalCustomerName =
      customerName?.trim() ||
      fullName?.trim() ||
      shippingAddress?.fullName?.trim() ||
      "";

    if (!finalCustomerName) {
      return res.status(400).json({
        success: false,
        message:
          "Customer name is required. Guest checkout is not allowed.",
      });
    }


    const finalEmail =
      email?.trim() ||
      shippingAddress?.email?.trim() ||
      "";


    const finalPhone =
      phone?.trim() ||
      phoneNumber?.trim() ||
      shippingAddress?.phone?.trim() ||
      "";


    const finalAddress =
      address?.trim() ||
      shippingAddress?.address?.trim() ||
      "";


    const finalLandmark =
      landmark?.trim() ||
      shippingAddress?.landmark?.trim() ||
      "";


    const finalCity =
      city?.trim() ||
      shippingAddress?.city?.trim() ||
      "";


    const finalState =
      state?.trim() ||
      shippingAddress?.state?.trim() ||
      "";


    const finalPincode =
      postalCode?.trim() ||
      pincode?.trim() ||
      shippingAddress?.postalCode?.trim() ||
      shippingAddress?.pincode?.trim() ||
      "";


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


    if (!finalItems.length) {
      return res.status(400).json({
        success: false,
        message: "No order items",
      });
    }


    // =================================================
    // PAYMENT
    // =================================================

    const finalPaymentMethod =
      paymentMethod || "COD";


    // =================================================
    // PRICES
    // =================================================

    const finalSubtotal =
      Number(
        itemsPrice ?? subtotal ?? 0
      );


    const finalShipping =
      Number(
        shippingPrice ?? shipping ?? 0
      );


    const finalTax =
      Number(
        taxPrice ?? tax ?? 0
      );


    const finalTotal =
      Number(
        totalPrice ?? total ?? 0
      );


    // =================================================
    // SHIPPING ADDRESS
    // =================================================

    const finalShippingAddress = {
      fullName: finalCustomerName,
      email: finalEmail,
      phone: finalPhone,
      address: finalAddress,
      landmark: finalLandmark,
      city: finalCity,
      state: finalState,
      postalCode: finalPincode,
      country: finalCountry,
    };


    // =================================================
    // START MONGODB TRANSACTION
    // =================================================
    //
    // Stock update + order creation happen together.
    // If anything fails, MongoDB rolls EVERYTHING back.
    // This prevents stock being reduced when the order
    // itself was not successfully created.
    //
    // =================================================

    session = await Product.startSession();

    session.startTransaction();


    // =================================================
    // CHECK EVERY PRODUCT FIRST
    // =================================================

    const inventoryProducts = [];


    for (const item of finalItems) {

      // -------------------------------------------------
      // PRODUCT ID
      // -------------------------------------------------

      const productId =
        item.productId ||
        item.id ||
        "";


      if (!productId) {

        const error = new Error(
          `Product ID missing for ${
            item.name || "product"
          }.`
        );

        error.statusCode = 400;

        throw error;
      }


      // -------------------------------------------------
      // QUANTITY
      // -------------------------------------------------

      const quantity =
        Number(
          item.qty ??
          item.quantity ??
          0
        );


      if (
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {

        const error = new Error(
          `Invalid quantity for ${
            item.name || "product"
          }.`
        );

        error.statusCode = 400;

        throw error;
      }


      // -------------------------------------------------
      // FIND PRODUCT
      // -------------------------------------------------
      // Product.id is your custom product ID.
      // -------------------------------------------------

      const product =
        await Product.findOne({
          id: String(productId),
        }).session(session);


      if (!product) {

        const error = new Error(
          `${
            item.name || "Product"
          } was not found in the database.`
        );

        error.statusCode = 404;

        throw error;
      }


      // -------------------------------------------------
      // CHECK STOCK
      // -------------------------------------------------

      const currentStock =
        Number(
          product.stock ?? 0
        );


      console.log("------------------------------------");
      console.log("📦 PRODUCT:", product.name);
      console.log("🆔 PRODUCT ID:", product.id);
      console.log("📊 CURRENT STOCK:", currentStock);
      console.log("🛒 REQUESTED:", quantity);


      if (currentStock < quantity) {

        const error = new Error(
          `${product.name} has only ${currentStock} item${
            currentStock === 1 ? "" : "s"
          } available.`
        );

        error.statusCode = 400;
        error.productId = product.id;
        error.availableStock = currentStock;

        throw error;
      }


      // -------------------------------------------------
      // STORE FOR STOCK UPDATE
      // -------------------------------------------------

      inventoryProducts.push({
        product,
        quantity,
      });

    }


    // =================================================
    // REDUCE STOCK
    // =================================================

    const updatedOrderItems = [];


    for (const inventoryItem of inventoryProducts) {

      const product =
        inventoryItem.product;

      const quantity =
        inventoryItem.quantity;


      // -------------------------------------------------
      // REDUCE STOCK
      // -------------------------------------------------

      product.stock =
        Math.max(
          0,
          Number(product.stock ?? 0) - quantity
        );


      await product.save({
        session,
      });


      console.log(
        `✅ STOCK UPDATED: ${product.name}`
      );

      console.log(
        `🛒 Purchased: ${quantity}`
      );

      console.log(
        `📊 Remaining stock: ${product.stock}`
      );


      // -------------------------------------------------
      // ORDER ITEM
      // -------------------------------------------------

      updatedOrderItems.push({
        productId: String(product.id),
        name: product.name,
        qty: quantity,
        price: Number(product.price ?? 0),
      });

    }


    // =================================================
    // CREATE ORDER DATA
    // =================================================

    const orderData = {

      customerName:
        finalCustomerName,

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

      pincode:
        finalPincode,

      postalCode:
        finalPincode,

      country:
        finalCountry,

      shippingAddress:
        finalShippingAddress,

      paymentMethod:
        finalPaymentMethod,

      items:
        updatedOrderItems,

      orderItems:
        updatedOrderItems,

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

      orderStatus:
        "Pending",

      status:
        "Pending",

    };


    // =================================================
// CREATE ORDER INSIDE SAME TRANSACTION
// =================================================

const order =
  new Order(orderData);

const createdOrder =
  await order.save({
    session,
  });


// =================================================
// CLEAR CART INSIDE SAME TRANSACTION
// =================================================
//
// IMPORTANT:
// Cart is deleted BEFORE commit.
// Therefore order creation, stock reduction,
// and cart clearing all succeed or all rollback.
//

console.log(
  "🧹 CLEARING CART INSIDE TRANSACTION..."
);

const cartResult =
  await Cart.deleteMany(
    {},
    {
      session,
    }
  );

console.log(
  `🧹 CART ITEMS TO DELETE: ${cartResult.deletedCount}`
);


// =================================================
// COMMIT EVERYTHING
// =================================================

await session.commitTransaction();

console.log("✅ TRANSACTION COMMITTED");
console.log("📧 CUSTOMER EMAIL:", createdOrder.email);

try {
  await sendOrderConfirmationEmail(createdOrder);

  console.log("✅ ORDER CONFIRMATION EMAIL SENT");
  console.log("📨 SENT TO:", createdOrder.email);
} catch (emailError) {
  console.error("❌ ORDER EMAIL FAILED");
  console.error("Email error:", emailError);
}

console.log("====================================");
console.log("✅ ORDER CREATED");
console.log("ORDER ID:", createdOrder._id);
console.log("CUSTOMER:", finalCustomerName);
console.log("TOTAL:", finalTotal);
console.log("📦 PRODUCT STOCK UPDATED");
console.log("====================================");


    // =================================================
    // RESPONSE
    // =================================================

    return res.status(201).json(
      createdOrder
    );


  } catch (error) {

    // =================================================
    // ROLLBACK TRANSACTION
    // =================================================

    if (session) {

      try {
        await session.abortTransaction();
      } catch (rollbackError) {
        console.error(
          "❌ TRANSACTION ROLLBACK ERROR:",
          rollbackError
        );
      }

    }


    console.error("====================================");
    console.error("❌ CREATE ORDER ERROR");
    console.error(error);
    console.error("====================================");


    return res.status(
      error.statusCode || 500
    ).json({

      success: false,

      message:
        error.message ||
        "Failed to create order",

      ...(error.productId
        ? {
            productId:
              error.productId,
          }
        : {}),

      ...(error.availableStock !== undefined
        ? {
            availableStock:
              error.availableStock,
          }
        : {}),

      error:
        error.message,

    });


  } finally {

    if (session) {

      await session.endSession();

    }

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

        message:
          "Status is required",

      });

    }


    const order =
      await Order.findById(
        req.params.id
      );


    if (!order) {

      return res.status(404).json({

        success: false,

        message:
          "Order not found",

      });

    }


    // =================================================
    // UPDATE STATUS
    // =================================================

    order.orderStatus =
      status;


    // Keep your old `status` field
    // synchronized too.

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
          createdAt: -1,
        })
        .lean();



    // =================================================
    // BUILD REAL CUSTOMER NAME MAP
    // =================================================

    const customerNameMap =
      new Map();


    for (
      const order
      of orders
    ) {

      const email =
        order.email
          ?.trim()
          .toLowerCase();


      const name =
        order.customerName
          ?.trim() ||
        order.fullName
          ?.trim() ||
        order.shippingAddress
          ?.fullName
          ?.trim() ||
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


    for (
      const order
      of orders
    ) {

      const email =
        order.email
          ?.trim()
          .toLowerCase();


      const phone =
        order.phone?.trim() ||
        order.phoneNumber?.trim() ||
        order.shippingAddress
          ?.phone
          ?.trim() ||
        "";


      if (
        email &&
        phone &&
        !customerPhoneMap.has(
          email
        )
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


    for (
      const order
      of orders
    ) {

      const email =
        order.email
          ?.trim()
          .toLowerCase() ||
        order.shippingAddress
          ?.email
          ?.trim()
          .toLowerCase() ||
        "";


      const directPhone =
        order.phone?.trim() ||
        order.phoneNumber?.trim() ||
        order.shippingAddress
          ?.phone
          ?.trim() ||
        "";


      const phone =
        directPhone ||
        (
          email &&
          customerPhoneMap.has(
            email
          )
            ? customerPhoneMap.get(
                email
              )
            : ""
        );


      let name =
        order.customerName
          ?.trim() ||
        order.fullName
          ?.trim() ||
        order.shippingAddress
          ?.fullName
          ?.trim() ||
        "";


      // =================================================
      // GET REAL NAME
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
        customerNameMap.has(
          email
        )
      ) {

        name =
          customerNameMap.get(
            email
          );

      }


      // =================================================
      // FINAL FALLBACK
      // =================================================

      if (!name) {

        name =
          "Customer";

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
              order.shippingAddress
                ?.address ||
              "",

            landmark:
              order.landmark ||
              order.shippingAddress
                ?.landmark ||
              "",

            city:
              order.city ||
              order.shippingAddress
                ?.city ||
              "",

            state:
              order.state ||
              order.shippingAddress
                ?.state ||
              "",

            pincode:
              order.pincode ||
              order.postalCode ||
              order.shippingAddress
                ?.pincode ||
              order.shippingAddress
                ?.postalCode ||
              "",

            country:
              order.country ||
              order.shippingAddress
                ?.country ||
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
          order.shippingAddress
            ?.address ||
          "";

      }


      if (
        !customer.landmark
      ) {

        customer.landmark =
          order.landmark ||
          order.shippingAddress
            ?.landmark ||
          "";

      }


      if (
        !customer.city
      ) {

        customer.city =
          order.city ||
          order.shippingAddress
            ?.city ||
          "";

      }


      if (
        !customer.state
      ) {

        customer.state =
          order.state ||
          order.shippingAddress
            ?.state ||
          "";

      }


      if (
        !customer.pincode
      ) {

        customer.pincode =
          order.pincode ||
          order.postalCode ||
          order.shippingAddress
            ?.pincode ||
          order.shippingAddress
            ?.postalCode ||
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

// =====================================================
// SHIP ORDER WITH SHIPROCKET
// POST /api/orders/:id/shiprocket
// =====================================================

export const shipOrderWithShiprocket = async (
  req,
  res
) => {

  try {

    console.log("====================================");
    console.log("🚚 SHIP ORDER WITH SHIPROCKET");
    console.log("ORDER ID:", req.params.id);
    console.log("====================================");


    // =================================================
    // FIND ORDER
    // =================================================

    const order = await Order.findById(
      req.params.id
    );


    if (!order) {

      return res.status(404).json({
        success: false,
        message: "Order not found",
      });

    }


    // =================================================
    // PREVENT DUPLICATE SHIPPING
    // =================================================

    if (order.shiprocket?.synced) {

      return res.status(400).json({
        success: false,
        message:
          "This order is already synced with Shiprocket.",
        shiprocket: order.shiprocket,
      });

    }


    // =================================================
    // CREATE SHIPROCKET ORDER
    // =================================================

    console.log(
      "🚚 Creating Shiprocket order..."
    );

    const shiprocketOrder =
      await createShiprocketOrder(order);


    console.log(
      "✅ Shiprocket order created"
    );


    // =================================================
    // GET SHIPMENT ID
    // =================================================

    const shipmentId =
      shiprocketOrder?.shipment_id;


    const shiprocketOrderId =
      shiprocketOrder?.order_id;


    if (!shipmentId) {

      console.error(
        "❌ Shiprocket did not return shipment ID"
      );

      return res.status(500).json({
        success: false,
        message:
          "Shiprocket order created but shipment ID was not returned.",
        response:
          shiprocketOrder,
      });

    }


    // =================================================
    // ASSIGN AWB
    // =================================================

    console.log(
      "🚚 Assigning courier / AWB..."
    );

    const awbResponse =
      await assignShiprocketAWB(
        shipmentId
      );


    const awbData =
      awbResponse?.response?.data ||
      awbResponse?.data ||
      {};


    const awbCode =
      awbData?.awb_code ||
      awbResponse?.awb_code ||
      "";


    const courierName =
      awbData?.courier_name ||
      awbResponse?.courier_name ||
      "";


    // =================================================
    // REQUEST PICKUP
    // =================================================

    console.log(
      "🚚 Requesting pickup..."
    );


    let pickupResponse = null;


    try {

      pickupResponse =
        await requestShiprocketPickup(
          shipmentId
        );

      console.log(
        "✅ Pickup requested"
      );

    } catch (pickupError) {

      console.error(
        "⚠️ Pickup request failed:"
      );

      console.error(
        pickupError.response?.data ||
        pickupError.message
      );

    }


    // =================================================
    // SAVE SHIPROCKET INFORMATION
    // =================================================

    order.shiprocket = {

      synced: true,

      shiprocketOrderId:
        String(
          shiprocketOrderId || ""
        ),

      shipmentId:
        String(
          shipmentId || ""
        ),

      awbCode:
        String(
          awbCode || ""
        ),

      courierName:
        String(
          courierName || ""
        ),

      trackingUrl:
        awbCode
          ? `https://shiprocket.co/tracking/${awbCode}`
          : "",

      shippingStatus:
        "SHIPPED",

      pickupScheduled:
        !!pickupResponse,

      pickupDate:
        "",

      syncedAt:
        new Date(),

    };


    // =================================================
    // UPDATE WEBSITE ORDER STATUS
    // =================================================

    order.orderStatus =
      "Shipped";

    order.status =
      "Shipped";


    // =================================================
    // SAVE ORDER
    // =================================================

    await order.save();


    console.log(
      "===================================="
    );

    console.log(
      "✅ SHIPROCKET SYNC COMPLETE"
    );

    console.log(
      "ORDER:",
      order._id
    );

    console.log(
      "SHIPROCKET ORDER:",
      shiprocketOrderId
    );

    console.log(
      "SHIPMENT:",
      shipmentId
    );

    console.log(
      "AWB:",
      awbCode
    );

    console.log(
      "COURIER:",
      courierName
    );

    console.log(
      "====================================");


    return res.status(200).json({

      success: true,

      message:
        "Order successfully shipped with Shiprocket.",

      order,

      shiprocket: {
        orderId:
          shiprocketOrderId,

        shipmentId:
          shipmentId,

        awbCode:
          awbCode,

        courierName:
          courierName,

        pickupScheduled:
          !!pickupResponse,
      },

    });


  } catch (error) {

    console.error(
      "===================================="
    );

    console.error(
      "❌ SHIPROCKET SHIPPING ERROR"
    );

    console.error(
      error.response?.data ||
      error.message
    );

    console.error(
      "===================================="
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to ship order with Shiprocket.",

      error:
        error.response?.data ||
        error.message,

    });

  }

};
// =====================================================
// GET ORDER TRACKING
// GET /api/orders/:id/tracking
// =====================================================

export const getOrderTracking = async (req, res) => {

  try {

    console.log("====================================");
    console.log("📍 GET ORDER TRACKING");
    console.log("ORDER ID:", req.params.id);
    console.log("====================================");


    // =================================================
    // FIND ORDER
    // =================================================

    const order = await Order.findById(
      req.params.id
    );


    if (!order) {

      return res.status(404).json({
        success: false,
        message: "Order not found",
      });

    }


    // =================================================
    // CHECK SHIPROCKET SYNC
    // =================================================

    if (!order.shiprocket?.synced) {

      return res.status(400).json({
        success: false,
        message:
          "This order has not been shipped yet.",
        order: {
          _id: order._id,
          orderStatus: order.orderStatus,
          shiprocket: order.shiprocket,
        },
      });

    }


    // =================================================
    // GET AWB
    // =================================================

    const awbCode =
      order.shiprocket?.awbCode;


    if (!awbCode) {

      return res.status(400).json({
        success: false,
        message:
          "Tracking is not available yet. AWB has not been assigned.",
        order: {
          _id: order._id,
          orderStatus: order.orderStatus,
          shiprocket: order.shiprocket,
        },
      });

    }


    // =================================================
    // ASK SHIPROCKET FOR LATEST TRACKING
    // =================================================

    console.log(
      "📍 Tracking AWB:",
      awbCode
    );


    const trackingResponse =
      await trackShiprocketShipment(
        awbCode
      );


    console.log(
      "✅ SHIPROCKET TRACKING RESPONSE:"
    );

    console.log(
      JSON.stringify(
        trackingResponse,
        null,
        2
      )
    );


    // =================================================
    // RETURN TRACKING DATA
    // =================================================

    return res.status(200).json({

      success: true,

      order: {
        id: order._id,

        customerName:
          order.customerName,

        email:
          order.email,

        orderStatus:
          order.orderStatus,

        paymentMethod:
          order.paymentMethod,

        items:
          order.items,

        subtotal:
          order.subtotal,

        shipping:
          order.shipping,

        tax:
          order.tax,

        total:
          order.total,
      },

      shiprocket: {

        synced:
          order.shiprocket.synced,

        shiprocketOrderId:
          order.shiprocket.shiprocketOrderId,

        shipmentId:
          order.shiprocket.shipmentId,

        awbCode:
          awbCode,

        courierName:
          order.shiprocket.courierName,

        trackingUrl:
          order.shiprocket.trackingUrl,

        shippingStatus:
          order.shiprocket.shippingStatus,

        pickupScheduled:
          order.shiprocket.pickupScheduled,

      },

      tracking:
        trackingResponse,

    });


  } catch (error) {

    console.error("====================================");
    console.error("❌ ORDER TRACKING ERROR");

    console.error(
      error.response?.data ||
      error.message
    );

    console.error("====================================");


    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch shipment tracking.",

      error:
        error.response?.data ||
        error.message,

    });

  }

};