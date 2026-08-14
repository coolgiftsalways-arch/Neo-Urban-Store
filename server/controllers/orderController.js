import Order from "../models/Order.js";
import Product from "../models/Product.js";


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

    for (const order of orders) {

      const email =
        order.email?.trim().toLowerCase() ||
        order.shippingAddress?.email?.trim().toLowerCase() ||
        "";

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
    }


    // =====================================================
    // FORMAT ORDERS
    // =====================================================

    const formattedOrders = orders.map((order) => {

      const email =
        order.email?.trim().toLowerCase() ||
        order.shippingAddress?.email?.trim().toLowerCase() ||
        "";

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


      // ---------------------------------------------------
      // GET REAL CUSTOMER NAME FROM ANOTHER ORDER
      // ---------------------------------------------------

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


      // ---------------------------------------------------
      // FINAL FALLBACK
      // ---------------------------------------------------

      if (!customerName) {
        customerName = "Customer";
      }


      return {
        ...order,

        // CUSTOMER

        customerName,

        email:
          order.email ||
          order.shippingAddress?.email ||
          "",

        phone:
          order.phone ||
          order.phoneNumber ||
          order.shippingAddress?.phone ||
          "",


        // ADDRESS

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
      };
    });


    console.log(
      "===================================="
    );

    console.log(
      "✅ Orders formatted successfully"
    );

    console.log(
      "===================================="
    );


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



// =====================================================
// GET SINGLE ORDER
// GET /api/orders/:id
// =====================================================

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



// =====================================================
// CREATE ORDER
// POST /api/orders
//
// IMPORTANT:
// This function also decreases Product.stock.
// =====================================================

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
    // CUSTOMER NAME REQUIRED
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
    // NORMALIZE ORDER ITEMS
    //
    // We support:
    //
    // productId
    // id
    // _id
    //
    // and name as fallback.
    // =================================================

    const normalizedItems =
      finalItems.map((item) => {

        const quantity = Number(
          item.qty ??
          item.quantity ??
          1
        );

        return {
          ...item,

          productId:
            item.productId ??
            item.id ??
            item._id ??
            null,

          quantity:
            Number.isFinite(quantity) &&
            quantity > 0
              ? quantity
              : 1,

          qty:
            Number.isFinite(quantity) &&
            quantity > 0
              ? quantity
              : 1,
        };

      });



    // =================================================
    // CHECK STOCK BEFORE CREATING ORDER
    // =================================================

    console.log(
      "📦 Checking product stock..."
    );


    const productsToUpdate = [];


    for (
      const item of normalizedItems
    ) {

      const requestedQuantity =
        Number(item.quantity);


      let product = null;



      // -------------------------------------------------
      // 1. FIND USING MONGODB _id
      // -------------------------------------------------

      const possibleObjectId =
        String(
          item.productId || ""
        );


      if (
        /^[0-9a-fA-F]{24}$/.test(
          possibleObjectId
        )
      ) {

        product =
          await Product.findById(
            possibleObjectId
          );

      }



      // -------------------------------------------------
      // 2. FIND USING NUMERIC productId
      // -------------------------------------------------

      if (
        !product &&
        item.productId !== null &&
        item.productId !== undefined
      ) {

        const numericProductId =
          Number(item.productId);


        if (
          Number.isFinite(
            numericProductId
          )
        ) {

          product =
            await Product.findOne({
              productId:
                numericProductId,
            });

        }

      }



      // -------------------------------------------------
      // 3. FALLBACK — FIND BY NAME
      // -------------------------------------------------

      if (
        !product &&
        item.name
      ) {

        product =
          await Product.findOne({
            name: item.name,
          });

      }



      // -------------------------------------------------
      // PRODUCT NOT FOUND
      // -------------------------------------------------

      if (!product) {

        return res.status(404).json({
          success: false,

          message:
            `Product not found: ${
              item.name ||
              item.productId ||
              "Unknown product"
            }`,
        });

      }



      // -------------------------------------------------
      // CURRENT STOCK
      // -------------------------------------------------

      const currentStock =
        Number(product.stock ?? 0);



      console.log(
        `📦 ${product.name} | Stock: ${currentStock} | Requested: ${requestedQuantity}`
      );



      // -------------------------------------------------
      // OUT OF STOCK
      // -------------------------------------------------

      if (
        currentStock <= 0
      ) {

        return res.status(400).json({
          success: false,

          message:
            `${product.name} is out of stock.`,
        });

      }



      // -------------------------------------------------
      // NOT ENOUGH STOCK
      // -------------------------------------------------

      if (
        currentStock <
        requestedQuantity
      ) {

        return res.status(400).json({
          success: false,

          message:
            `Only ${currentStock} unit${
              currentStock === 1
                ? ""
                : "s"
            } of ${
              product.name
            } available.`,
        });

      }



      // -------------------------------------------------
      // SAVE PRODUCT FOR STOCK UPDATE
      // -------------------------------------------------

      productsToUpdate.push({
        product,
        quantity:
          requestedQuantity,
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
    // CREATE ORDER DATA
    // =================================================

    const orderData = {

      // CUSTOMER

      customerName:
        finalCustomerName,

      email:
        finalEmail,

      phone:
        finalPhone,


      // ADDRESS

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


      // SHIPPING ADDRESS

      shippingAddress:
        finalShippingAddress,


      // PAYMENT

      paymentMethod:
        finalPaymentMethod,


      // ITEMS

      items:
        normalizedItems,


      // PRICES

      subtotal:
        finalSubtotal,

      shipping:
        finalShipping,

      tax:
        finalTax,

      total:
        finalTotal,


      // STATUS

      orderStatus:
        "Pending",

    };



    // =================================================
    // SAVE ORDER FIRST
    // =================================================

    const order =
      new Order(orderData);


    const createdOrder =
      await order.save();


    console.log(
      "✅ ORDER CREATED:",
      createdOrder._id
    );



    // =================================================
    // REDUCE PRODUCT STOCK
    //
    // IMPORTANT:
    // This happens ONLY after the order was saved.
    // =================================================

    console.log(
      "📉 Reducing product stock..."
    );


    const updatedProducts = [];


    try {

      for (
        const stockItem
        of productsToUpdate
      ) {

        const product =
          stockItem.product;

        const quantity =
          stockItem.quantity;


        // -------------------------------------------------
        // ATOMIC STOCK UPDATE
        // -------------------------------------------------

        const updatedProduct =
          await Product.findOneAndUpdate(

            {
              _id:
                product._id,

              stock: {
                $gte:
                  quantity,
              },
            },

            {
              $inc: {
                stock:
                  -quantity,
              },
            },

            {
              new: true,
            }

          );


        // -------------------------------------------------
        // STOCK UPDATE FAILED
        // -------------------------------------------------

        if (!updatedProduct) {

          throw new Error(
            `Stock changed while placing order for ${product.name}. Please try again.`
          );

        }


        updatedProducts.push({
          product:
            updatedProduct,

          quantity,
        });


        console.log(
          `✅ ${product.name}: ${product.stock} → ${updatedProduct.stock}`
        );

      }


    } catch (stockError) {

      console.error(
        "❌ STOCK UPDATE FAILED:",
        stockError
      );


      // =================================================
      // ROLLBACK STOCK THAT WAS ALREADY REDUCED
      // =================================================

      for (
        const updated
        of updatedProducts
      ) {

        try {

          await Product.findByIdAndUpdate(
            updated.product._id,

            {
              $inc: {
                stock:
                  updated.quantity,
              },
            }
          );

        } catch (
          rollbackError
        ) {

          console.error(
            "❌ STOCK ROLLBACK ERROR:",
            rollbackError
          );

        }

      }


      // =================================================
      // DELETE ORDER BECAUSE STOCK FAILED
      // =================================================

      try {

        await Order.findByIdAndDelete(
          createdOrder._id
        );

      } catch (
        deleteError
      ) {

        console.error(
          "❌ ORDER ROLLBACK ERROR:",
          deleteError
        );

      }


      return res.status(400).json({

        success: false,

        message:
          stockError.message ||
          "Unable to update product stock.",

      });

    }



    // =================================================
    // FINAL LOG
    // =================================================

    console.log(
      "===================================="
    );

    console.log(
      "✅ ORDER CREATED SUCCESSFULLY"
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
      "✅ STOCK UPDATED"
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
    // UPDATE ORDER STATUS
    // =================================================

    order.orderStatus =
      status;


    // =================================================
    // ALSO UPDATE status IF YOUR SCHEMA HAS IT
    // =================================================

    if (
      Object.prototype.hasOwnProperty.call(
        order.toObject(),
        "status"
      )
    ) {

      order.status =
        status;

    }


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



// =====================================================
// GET ALL CUSTOMERS
// GET /api/orders/customers/all
// =====================================================

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


    for (
      const order of orders
    ) {

      const email =
        order.email
          ?.trim()
          .toLowerCase();


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
    // GROUP CUSTOMERS
    // =================================================

    const customersMap =
      new Map();


    for (
      const order of orders
    ) {

      const email =
        order.email
          ?.trim()
          .toLowerCase() ||
        order.shippingAddress?.email
          ?.trim()
          .toLowerCase() ||
        "";


      const phone =
        order.phone ||
        order.phoneNumber ||
        order.shippingAddress?.phone ||
        "";


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
      // UPDATE CUSTOMER CONTACT
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