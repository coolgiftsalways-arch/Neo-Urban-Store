import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const SHIPROCKET_BASE_URL =
  "https://apiv2.shiprocket.in/v1/external";

// =====================================================
// GET SHIPROCKET TOKEN
// =====================================================

const getShiprocketToken = async () => {
  try {
    console.log("====================================");
    console.log("🔐 SHIPROCKET AUTHENTICATION");
    console.log("📧 API USER:", process.env.SHIPROCKET_EMAIL);
    console.log("====================================");

    const response = await axios.post(
      `${SHIPROCKET_BASE_URL}/auth/login`,
      {
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data?.token) {
      throw new Error(
        "Shiprocket authentication succeeded but no token was returned."
      );
    }

    console.log("✅ SHIPROCKET AUTHENTICATED");

    return response.data.token;

  } catch (error) {

    console.error("====================================");
    console.error("❌ SHIPROCKET AUTH ERROR");
    console.error(
      error.response?.data || error.message
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

    const token = await getShiprocketToken();

    console.log("====================================");
    console.log("🚚 CREATING SHIPROCKET ORDER");
    console.log("WEBSITE ORDER:", order._id);
    console.log("====================================");


    // -------------------------------------------------
    // CUSTOMER INFORMATION
    // -------------------------------------------------

    const customerName =
      order.customerName ||
      order.fullName ||
      order.shippingAddress?.fullName ||
      "Customer";


    const phone =
      order.phone ||
      order.shippingAddress?.phone ||
      "";


    const email =
      order.email ||
      order.shippingAddress?.email ||
      "";


    // -------------------------------------------------
    // ADDRESS
    // -------------------------------------------------

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


    const pincode =
      order.pincode ||
      order.postalCode ||
      order.shippingAddress?.pincode ||
      order.shippingAddress?.postalCode ||
      "";


    const country =
      order.country ||
      order.shippingAddress?.country ||
      "India";


    // -------------------------------------------------
    // ORDER ITEMS
    // -------------------------------------------------

    const orderItems = (
      order.items ||
      order.orderItems ||
      []
    ).map((item, index) => ({

      name:
        item.name ||
        `Product ${index + 1}`,

      sku:
        item.productId ||
        item.sku ||
        `SKU-${index + 1}`,

      units:
        Number(
          item.qty ||
          item.quantity ||
          1
        ),

      selling_price:
        Number(
          item.price ||
          item.selling_price ||
          0
        ),

      discount: "",

      tax: "",

      hsn: "",

    }));


    // -------------------------------------------------
    // PAYMENT METHOD
    // -------------------------------------------------

    const paymentMethod =
      String(
        order.paymentMethod || "cod"
      ).toLowerCase() === "cod"
        ? "COD"
        : "Prepaid";


    // -------------------------------------------------
    // SHIPROCKET ORDER ID
    // IMPORTANT:
    // Must be unique in Shiprocket
    // -------------------------------------------------

    const shiprocketOrderId =
      `NU-${String(order._id)}`;


    // -------------------------------------------------
    // TOTAL
    // -------------------------------------------------

    const subtotal =
      Number(
        order.subtotal ||
        order.itemsPrice ||
        0
      );


    // -------------------------------------------------
    // SHIPROCKET PAYLOAD
    // -------------------------------------------------

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
        process.env.SHIPROCKET_PICKUP_LOCATION ||
        "home",

      channel_id: "",

      comment:
        `Neo Urban Store Order ${order._id}`,

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

      order_items:
        orderItems,

      payment_method:
        paymentMethod,

      shipping_charges:
        Number(order.shipping || 0),

      giftwrap_charges:
        0,

      transaction_charges:
        0,

      total_discount:
        0,

      sub_total:
        subtotal,

      length:
        20,

      breadth:
        15,

      height:
        10,

      weight:
        Number(
          process.env.SHIPROCKET_DEFAULT_WEIGHT ||
          0.5
        ),

    };


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


    // -------------------------------------------------
    // CREATE ORDER
    // -------------------------------------------------

    const response =
      await axios.post(

        `${SHIPROCKET_BASE_URL}/orders/create/adhoc`,

        payload,

        {
          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },
        }

      );


    console.log("====================================");
    console.log("✅ SHIPROCKET ORDER CREATED");
    console.log(
      "SHIPROCKET ORDER ID:",
      response.data?.order_id
    );

    console.log(
      "SHIPMENT ID:",
      response.data?.shipment_id
    );

    console.log("====================================");


    return response.data;

  } catch (error) {

    console.error("====================================");
    console.error("❌ CREATE SHIPROCKET ORDER FAILED");

    console.error(
      error.response?.data ||
      error.message
    );

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

    const token =
      await getShiprocketToken();


    console.log(
      "🚚 ASSIGNING SHIPROCKET AWB"
    );

    console.log(
      "SHIPMENT ID:",
      shipmentId
    );


    const response =
      await axios.post(

        `${SHIPROCKET_BASE_URL}/courier/assign/awb`,

        {
          shipment_id:
            Number(shipmentId),
        },

        {
          headers: {
            "Content-Type":
              "application/json",

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

    console.error(
      "❌ SHIPROCKET AWB ERROR:"
    );

    console.error(
      error.response?.data ||
      error.message
    );

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

    const token =
      await getShiprocketToken();


    console.log(
      "📦 REQUESTING SHIPROCKET PICKUP"
    );

    console.log(
      "SHIPMENT ID:",
      shipmentId
    );


    const response =
      await axios.post(

        `${SHIPROCKET_BASE_URL}/courier/generate/pickup`,

        {
          shipment_id: [
            Number(shipmentId),
          ],
        },

        {
          headers: {
            "Content-Type":
              "application/json",

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

    console.error(
      "❌ SHIPROCKET PICKUP ERROR:"
    );

    console.error(
      error.response?.data ||
      error.message
    );

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

    const token =
      await getShiprocketToken();


    const response =
      await axios.get(

        `${SHIPROCKET_BASE_URL}/courier/track/awb/${awbCode}`,

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }

      );


    return response.data;

  } catch (error) {

    console.error(
      "❌ SHIPROCKET TRACKING ERROR:"
    );

    console.error(
      error.response?.data ||
      error.message
    );

    throw error;
  }
};