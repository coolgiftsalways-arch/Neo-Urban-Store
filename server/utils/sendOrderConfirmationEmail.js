import transporter from "../config/mailer.js";

export const sendOrderConfirmationEmail = async (order) => {
  try {
    console.log("====================================");
    console.log("📧 STARTING ORDER CONFIRMATION EMAIL");
    console.log("📧 ORDER ID:", order?._id);
    console.log("📧 CUSTOMER:", order?.customerName);
    console.log("📧 CUSTOMER EMAIL:", order?.email);
    console.log("📧 PAYMENT:", order?.paymentMethod);
    console.log("====================================");

    if (!order?.email) {
      console.error("❌ NO CUSTOMER EMAIL FOUND IN ORDER");
      return false;
    }

    const itemsHtml = (order.items || [])
      .map(
        (item) => `
          <tr>
            <td style="padding:12px;border-bottom:1px solid #eee;">
              ${item.name || "Product"}
            </td>

            <td style="padding:12px;text-align:center;border-bottom:1px solid #eee;">
              ${item.quantity || item.qty || 1}
            </td>

            <td style="padding:12px;text-align:right;border-bottom:1px solid #eee;">
              ₹${Number(item.price || 0).toLocaleString("en-IN")}
            </td>
          </tr>
        `
      )
      .join("");

    console.log("📧 Creating email...");

    const info = await transporter.sendMail({
      from: `"Neo Urban Store" <${process.env.SMTP_USER}>`,
      to: order.email,

      subject: "Order Confirmed 🎉 | Neo Urban Store",

      html: `
        <!DOCTYPE html>
        <html>
        <body style="
          margin:0;
          padding:30px;
          background:#f4f4f4;
          font-family:Arial,sans-serif;
        ">

          <div style="
            max-width:650px;
            margin:auto;
            background:white;
            border-radius:16px;
            overflow:hidden;
          ">

            <div style="
              background:#080b14;
              padding:30px;
              text-align:center;
            ">
              <h1 style="
                margin:0;
                color:#ff1744;
                font-size:32px;
              ">
                NEO URBAN
              </h1>

              <p style="color:white;">
                ORDER CONFIRMATION
              </p>
            </div>

            <div style="padding:35px;">

              <h2>
                Thank you, ${order.customerName || "Customer"}! 🎉
              </h2>

              <p style="color:#555;">
                Your order has been successfully placed.
                We're getting your order ready.
              </p>

              <div style="
                background:#f7f7f7;
                padding:20px;
                border-radius:10px;
                margin:25px 0;
              ">

                <p>
                  <strong>Order ID:</strong>
                  ${order._id}
                </p>

                <p>
                  <strong>Payment Method:</strong>
                  ${String(
                    order.paymentMethod || "COD"
                  ).toUpperCase()}
                </p>

                <p>
                  <strong>Status:</strong>
                  ${order.orderStatus || "Placed"}
                </p>

              </div>

              <h3>Order Summary</h3>

              <table style="
                width:100%;
                border-collapse:collapse;
              ">

                <thead>
                  <tr style="
                    background:#080b14;
                    color:white;
                  ">

                    <th style="padding:12px;text-align:left;">
                      Product
                    </th>

                    <th style="padding:12px;">
                      Qty
                    </th>

                    <th style="padding:12px;text-align:right;">
                      Price
                    </th>

                  </tr>
                </thead>

                <tbody>
                  ${itemsHtml}
                </tbody>

              </table>

              <div style="
                margin-top:25px;
                border-top:2px solid #111;
                padding-top:20px;
              ">

                <p>
                  Subtotal:
                  ₹${Number(order.subtotal || 0).toLocaleString("en-IN")}
                </p>

                <p>
                  Shipping:
                  ₹${Number(order.shipping || 0).toLocaleString("en-IN")}
                </p>

                <p>
                  Tax:
                  ₹${Number(order.tax || 0).toLocaleString("en-IN")}
                </p>

                <h2 style="color:#ff1744;">
                  Total:
                  ₹${Number(order.total || 0).toLocaleString("en-IN")}
                </h2>

              </div>

              <div style="
                background:#fafafa;
                padding:20px;
                border-radius:10px;
                margin-top:25px;
              ">

                <h3>Delivery Address</h3>

                <p style="
                  color:#555;
                  line-height:1.6;
                ">
                  ${order.customerName || ""}<br>
                  ${order.address || ""}<br>
                  ${order.landmark || ""}<br>
                  ${order.city || ""}, ${order.state || ""}<br>
                  ${order.pincode || ""}<br>
                  ${order.country || "India"}
                </p>

              </div>

              <p style="
                margin-top:30px;
                color:#555;
              ">
                Thank you for shopping with
                <strong>Neo Urban Store</strong> ❤️
              </p>

            </div>

            <div style="
              background:#080b14;
              color:#aaa;
              padding:20px;
              text-align:center;
              font-size:12px;
            ">
              © ${new Date().getFullYear()} Neo Urban Store
            </div>

          </div>

        </body>
        </html>
      `,
    });

    console.log("====================================");
    console.log("✅ EMAIL SENT SUCCESSFULLY");
    console.log("📨 MESSAGE ID:", info.messageId);
    console.log("📨 TO:", order.email);
    console.log("📨 ACCEPTED:", info.accepted);
    console.log("📨 REJECTED:", info.rejected);
    console.log("====================================");

    return true;

  } catch (error) {

    console.error("====================================");
    console.error("❌ EMAIL SEND ERROR");
    console.error("❌ MESSAGE:", error.message);
    console.error("❌ CODE:", error.code);
    console.error("❌ RESPONSE:", error.response);
    console.error("❌ RESPONSE CODE:", error.responseCode);
    console.error("❌ COMMAND:", error.command);
    console.error("====================================");

    return false;
  }
};