import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// =====================================================
// SHIPROCKET CONFIG
// =====================================================

const SHIPROCKET_BASE_URL =
  "https://apiv2.shiprocket.in/v1/external";

const shiprocketClient = axios.create({
  baseURL: SHIPROCKET_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// =====================================================
// HELPER — GET ACTUAL SHIPROCKET ERROR
// =====================================================

const getShiprocketError = (error) => {
  return (
    error?.response?.data ||
    error?.response?.data?.message ||
    error?.message ||
    "Unknown Shiprocket error"
  );
};

// =====================================================
// HELPER — CLEAN PHONE
// =====================================================

const cleanPhone = (phone) => {
  if (!phone) return "";

  return String(phone)
    .replace(/\D/g, "")
    .slice(-10);
};

// =====================================================
// HELPER — CLEAN PINCODE
// =====================================================

const cleanPincode = (pincode) => {
  if (!pincode) return "";

  return String(pincode)
    .replace(/\D/g, "")
    .slice(0, 6);
};

// =====================================================
// GET SHIPROCKET TOKEN
// =====================================================

const getShiprocketToken = async () => {
  try {
    console.log("====================================");
    console.log("🔐 SHIPROCKET AUTHENTICATION");
    console.log(
      "📧 API USER:",
      process.env.SHIPROCKET_EMAIL
    );
    console.log(
      "🔑 PASSWORD EXISTS:",
      Boolean(process.env.SHIPROCKET_PASSWORD)
    );
    console.log("====================================");

    if (!process.env.SHIPROCKET_EMAIL) {
      throw new Error(
        "SHIPROCKET_EMAIL is missing from .env"
      );
    }

    if (!process.env.SHIPROCKET_PASSWORD) {
      throw new Error(
        "SHIPROCKET_PASSWORD is missing from .env"
      );
    }

    const response = await shiprocketClient.post(
      "/auth/login",
      {
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      }
    );

    if (!response.data?.token) {
      throw new Error(
        "Shiprocket authentication succeeded but no token was returned."
      );
    }

    console.log("✅ SHIPROCKET AUTHENTICATED");
    console.log("====================================");

    return response.data.token;

  } catch (error) {
    console.error("====================================");
    console.error("❌ SHIPROCKET AUTH ERROR");
    console.error(
      JSON.stringify(
        getShiprocketError(error),
        null,
        2
      )
    );
    console.error("====================================");

    throw error;
  }
};

// =====================================================
// CREATE SHIPROCKET ORDER
// =====================================================

export const createShiprocketOrder = async (order) => {
  try {
    if (!order) {
      throw new Error(
        "Order object was not provided."
      );
    }

    const token = await getShiprocketToken();

    console.log("====================================");
    console.log("🚚 CREATING SHIPROCKET ORDER");
    console.log(
      "WEBSITE ORDER:",
      order._id
    );
    console.log("====================================");

    // =================================================
    // CUSTOMER
    // =================================================

    const customerName =
      order.customerName ||
      order.fullName ||
      order.shippingAddress?.fullName ||
      "Demo Customer";

    const phone = cleanPhone(
      order.phone ||
      order.shippingAddress?.phone
    );

    const email =
      order.email ||
      order.shippingAddress?.email ||
      "";

    // =================================================
    // ADDRESS
    // =================================================

    const address =
      order.address ||
      order.shippingAddress?.address ||
      "";

    const landmark =
      order.landmark ||
      order.shippingAddress?.landmark ||
      "";

    const city =
      order.city ||
      order.shippingAddress?.city ||
      "";

    const state =
      order.state ||
      order.shippingAddress?.state ||
      "";

    const pincode = cleanPincode(
      order.pincode ||
      order.postalCode ||
      order.shippingAddress?.pincode ||
      order.shippingAddress?.postalCode
    );

    const country =
      order.country ||
      order.shippingAddress?.country ||
      "India";

    // =================================================
    // VALIDATION
    // =================================================

    if (!phone || phone.length !== 10) {
      throw new Error(
        `Invalid customer phone number: "${phone}". Shiprocket requires a valid 10-digit phone number.`
      );
    }

    if (!pincode || pincode.length !== 6) {
      throw new Error(
        `Invalid delivery pincode: "${pincode}". Shiprocket requires a valid 6-digit pincode.`
      );
    }

    if (!address) {
      throw new Error(
        "Delivery address is missing."
      );
    }

    if (!city) {
      throw new Error(
        "Delivery city is missing."
      );
    }

    if (!state) {
      throw new Error(
        "Delivery state is missing."
      );
    }

    // =================================================
    // ORDER ITEMS
    // =================================================

    const sourceItems =
      order.items ||
      order.orderItems ||
      [];

    if (!sourceItems.length) {
      throw new Error(
        "Order does not contain any products."
      );
    }

    const orderItems = sourceItems.map(
      (item, index) => {
        const quantity = Number(
          item.qty ||
          item.quantity ||
          1
        );

        const price = Number(
          item.price ||
          item.selling_price ||
          0
        );

        return {
          name:
            item.name ||
            `Demo Product ${index + 1}`,

          sku:
            item.productId ||
            item.sku ||
            `DEMO-SKU-${index + 1}`,

          units:
            quantity > 0
              ? quantity
              : 1,

          selling_price:
            price >= 0
              ? price
              : 0,

          discount: 0,

          tax: 0,

          hsn: "",
        };
      }
    );

    // =================================================
    // PAYMENT METHOD
    // =================================================

    const paymentMethod =
      String(
        order.paymentMethod || "cod"
      ).toLowerCase() === "cod"
        ? "COD"
        : "Prepaid";

    // =================================================
    // UNIQUE SHIPROCKET ORDER ID
    // =================================================

    const shiprocketOrderId =
      `NU-${String(order._id)}`;

    // =================================================
    // TOTALS
    // =================================================

    const subtotal = Number(
      order.subtotal ||
      order.itemsPrice ||
      order.total ||
      0
    );

    const shippingCharges = Number(
      order.shipping || 0
    );

    // =================================================
    // PICKUP LOCATION
    // =================================================

    const pickupLocation =
      process.env.SHIPROCKET_PICKUP_LOCATION ||
      "home";

    console.log(
      "📍 SHIPROCKET PICKUP LOCATION:",
      pickupLocation
    );

    // =================================================
    // SHIPROCKET PAYLOAD
    // =================================================

    const payload = {
      order_id:
        shiprocketOrderId,

      order_date:
        new Date(
          order.createdAt ||
          Date.now()
        )
          .toISOString()
          .split("T")[0],

      pickup_location:
        pickupLocation,

      channel_id: "",

      comment:
        `Neo Urban Store Order ${order._id}`,

      // =================================================
      // BILLING
      // =================================================

      billing_customer_name:
        customerName,

      billing_last_name:
        "",

      billing_address:
        address,

      billing_address_2:
        landmark,

      billing_city:
        city,

      billing_pincode:
        Number(pincode),

      billing_state:
        state,

      billing_country:
        country,

      billing_email:
        email,

      billing_phone:
        phone,

      // =================================================
      // SHIPPING
      // =================================================

      shipping_is_billing:
        true,

      shipping_customer_name:
        customerName,

      shipping_last_name:
        "",

      shipping_address:
        address,

      shipping_address_2:
        landmark,

      shipping_city:
        city,

      shipping_pincode:
        Number(pincode),

      shipping_country:
        country,

      shipping_state:
        state,

      shipping_email:
        email,

      shipping_phone:
        phone,

      // =================================================
      // PRODUCTS
      // =================================================

      order_items:
        orderItems,

      // =================================================
      // PAYMENT
      // =================================================

      payment_method:
        paymentMethod,

      shipping_charges:
        shippingCharges,

      giftwrap_charges:
        0,

      transaction_charges:
        0,

      total_discount:
        0,

      sub_total:
        subtotal,

      // =================================================
      // PACKAGE
      // =================================================

      length:
        Number(
          process.env.SHIPROCKET_LENGTH || 20
        ),

      breadth:
        Number(
          process.env.SHIPROCKET_BREADTH || 15
        ),

      height:
        Number(
          process.env.SHIPROCKET_HEIGHT || 10
        ),

      weight:
        Number(
          process.env.SHIPROCKET_DEFAULT_WEIGHT ||
          0.5
        ),
    };

    // =================================================
    // DEBUG PAYLOAD
    // =================================================

    console.log(
      "📦 SHIPROCKET PAYLOAD:"
    );

    console.log(
      JSON.stringify(
        payload,
        null,
        2
      )
    );

    // =================================================
    // CREATE ORDER
    // =================================================

    const response =
      await shiprocketClient.post(
        "/orders/create/adhoc",
        payload,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    console.log("====================================");
    console.log(
      "✅ SHIPROCKET ORDER CREATED"
    );

    console.log(
      "SHIPROCKET ORDER ID:",
      response.data?.order_id
    );

    console.log(
      "SHIPMENT ID:",
      response.data?.shipment_id
    );

    console.log(
      "FULL RESPONSE:",
      JSON.stringify(
        response.data,
        null,
        2
      )
    );

    console.log("====================================");

    return response.data;

  } catch (error) {
    console.error("====================================");
    console.error(
      "❌ CREATE SHIPROCKET ORDER FAILED"
    );

    console.error(
      JSON.stringify(
        getShiprocketError(error),
        null,
        2
      )
    );

    if (error?.response) {
      console.error(
        "HTTP STATUS:",
        error.response.status
      );

      console.error(
        "HTTP HEADERS:",
        JSON.stringify(
          error.response.headers,
          null,
          2
        )
      );
    }

    console.error("====================================");

    throw error;
  }
};

// =====================================================
// ASSIGN AWB
// =====================================================

export const assignShiprocketAWB = async (
  shipmentId
) => {
  try {
    if (!shipmentId) {
      throw new Error(
        "Shipment ID is missing. Cannot assign AWB."
      );
    }

    const token =
      await getShiprocketToken();

    console.log("====================================");
    console.log(
      "🚚 ASSIGNING SHIPROCKET AWB"
    );

    console.log(
      "SHIPMENT ID:",
      shipmentId
    );

    console.log("====================================");

    const response =
      await shiprocketClient.post(
        "/courier/assign/awb",
        {
          shipment_id:
            Number(shipmentId),
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    console.log(
      "✅ AWB RESPONSE:"
    );

    console.log(
      JSON.stringify(
        response.data,
        null,
        2
      )
    );

    return response.data;

  } catch (error) {
    console.error("====================================");
    console.error(
      "❌ SHIPROCKET AWB ERROR"
    );

    console.error(
      JSON.stringify(
        getShiprocketError(error),
        null,
        2
      )
    );

    if (error?.response) {
      console.error(
        "HTTP STATUS:",
        error.response.status
      );
    }

    console.error("====================================");

    throw error;
  }
};

// =====================================================
// REQUEST PICKUP
// =====================================================

export const requestShiprocketPickup = async (
  shipmentId
) => {
  try {
    if (!shipmentId) {
      throw new Error(
        "Shipment ID is missing. Cannot request pickup."
      );
    }

    const token =
      await getShiprocketToken();

    console.log("====================================");
    console.log(
      "📦 REQUESTING SHIPROCKET PICKUP"
    );

    console.log(
      "SHIPMENT ID:",
      shipmentId
    );

    console.log("====================================");

    const response =
      await shiprocketClient.post(
        "/courier/generate/pickup",
        {
          shipment_id: [
            Number(shipmentId),
          ],
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    console.log(
      "✅ PICKUP REQUESTED"
    );

    console.log(
      JSON.stringify(
        response.data,
        null,
        2
      )
    );

    return response.data;

  } catch (error) {
    console.error("====================================");
    console.error(
      "❌ SHIPROCKET PICKUP ERROR"
    );

    console.error(
      JSON.stringify(
        getShiprocketError(error),
        null,
        2
      )
    );

    if (error?.response) {
      console.error(
        "HTTP STATUS:",
        error.response.status
      );
    }

    console.error("====================================");

    throw error;
  }
};

// =====================================================
// TRACK SHIPMENT
// =====================================================

export const trackShiprocketShipment = async (
  awbCode
) => {
  try {
    if (!awbCode) {
      throw new Error(
        "AWB code is missing."
      );
    }

    const token =
      await getShiprocketToken();

    console.log("====================================");
    console.log(
      "📍 TRACKING SHIPROCKET SHIPMENT"
    );

    console.log(
      "AWB:",
      awbCode
    );

    console.log("====================================");

    const response =
      await shiprocketClient.get(
        `/courier/track/awb/${awbCode}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    console.log(
      "✅ TRACKING RESPONSE:"
    );

    console.log(
      JSON.stringify(
        response.data,
        null,
        2
      )
    );

    return response.data;

  } catch (error) {
    console.error("====================================");
    console.error(
      "❌ SHIPROCKET TRACKING ERROR"
    );

    console.error(
      JSON.stringify(
        getShiprocketError(error),
        null,
        2
      )
    );

    if (error?.response) {
      console.error(
        "HTTP STATUS:",
        error.response.status
      );
    }

    console.error("====================================");

    throw error;
  }
};