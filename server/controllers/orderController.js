import Order from "../models/Order.js";
import Cart from "../models/cart.js";
import transporter from "../config/mailer.js";

export const placeOrder = async (req, res) => {
  try {
    // ==========================================
    // GET CART
    // ==========================================

    const cart = await Cart.find();

    if (cart.length === 0) {
      return res.status(400).json({
        message: "Cart is Empty",
      });
    }

    // ==========================================
    // CALCULATE TOTAL
    // ==========================================

    const subtotal = cart.reduce(
      (acc, item) =>
        acc + Number(item.price) * Number(item.quantity),
      0
    );

    const shipping = subtotal > 499 ? 0 : 40;

    const tax = Math.round(subtotal * 0.05);

    const total = subtotal + shipping + tax;

    // ==========================================
    // PAYMENT METHOD
    // ==========================================

    const paymentMethod =
      req.body.paymentMethod || "cod";

    // ==========================================
    // CREATE ORDER
    // ==========================================

    const order = await Order.create({
      ...req.body,

      items: cart,

      subtotal,
      shipping,
      tax,
      total,

      paymentMethod,

      paymentStatus:
        paymentMethod === "cod"
          ? "Pending"
          : "Pending",

      orderStatus: "Placed",
    });

    // ==========================================
    // SEND THANK YOU EMAIL
    // ==========================================

    try {
      await transporter.sendMail({
        from: `"Neo Urban Store" <${process.env.SMTP_USER}>`,

        to: req.body.email,

        subject:
          "⚡ Your Neo Urban Order Has Been Placed!",

        html: `
<!DOCTYPE html>

<html>

<body style="
  margin:0;
  padding:0;
  background:#060913;
  font-family:Arial,Helvetica,sans-serif;
">

<div style="
  max-width:620px;
  margin:40px auto;
  background:#0A0F1D;
  border:1px solid #1c2638;
  border-radius:18px;
  overflow:hidden;
  color:#ffffff;
">

  <!-- HEADER -->

  <div style="
    padding:30px;
    text-align:center;
    background:linear-gradient(
      135deg,
      #090d18,
      #111827
    );
    border-bottom:1px solid #1c2638;
  ">

    <h1 style="
      margin:0;
      font-size:30px;
      letter-spacing:2px;
      font-weight:900;
    ">
      NEO
      <span style="color:#E60026;">
        URBAN
      </span>
      STORE
    </h1>

    <p style="
      margin:8px 0 0;
      color:#8E9BAE;
      font-size:13px;
      letter-spacing:2px;
    ">
      FUEL YOUR ENERGY
    </p>

  </div>


  <!-- CONTENT -->

  <div style="padding:35px;">

    <h2 style="
      margin-top:0;
      font-size:26px;
    ">
      Order Placed Successfully ⚡
    </h2>

    <p style="
      color:#A8B1C1;
      font-size:15px;
      line-height:1.7;
    ">
      Hey
      <strong style="color:#ffffff;">
        ${req.body.fullName || "there"}
      </strong>,
    </p>

    <p style="
      color:#A8B1C1;
      font-size:15px;
      line-height:1.7;
    ">
      Thank you for shopping with
      <strong style="color:#ffffff;">
        Neo Urban Store
      </strong>.
      Your order has been successfully placed
      and we're getting it ready for you.
    </p>


    <!-- =====================================
         ORDER DETAILS
    ====================================== -->

    <div style="
      margin:25px 0;
      padding:22px;
      background:#111827;
      border-radius:12px;
      border:1px solid #202c40;
    ">

      <p style="
        margin:0 0 12px;
        color:#8E9BAE;
        font-size:13px;
      ">
        ORDER ID
      </p>

      <p style="
        margin:0;
        font-size:15px;
        word-break:break-all;
      ">
        ${order._id}
      </p>

      <hr style="
        border:0;
        border-top:1px solid #263246;
        margin:18px 0;
      ">

      <p style="
        margin:0 0 8px;
        color:#A8B1C1;
      ">
        Payment Method
      </p>

      <p style="
        margin:0;
        font-weight:bold;
      ">
        ${
          paymentMethod === "cod"
            ? "Cash on Delivery"
            : "Online Payment"
        }
      </p>

    </div>


    <!-- =====================================
         YOUR ORDER
    ====================================== -->

    <h3 style="
      margin:30px 0 15px;
      font-size:19px;
      color:#ffffff;
    ">
      Your Order
    </h3>


    <div style="
      background:#111827;
      border:1px solid #202c40;
      border-radius:12px;
      overflow:hidden;
    ">

      ${
        cart.map((item) => `
          
          <div style="
            padding:18px;
            border-bottom:1px solid #202c40;
          ">

            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              style="border-collapse:collapse;"
            >

              <tr>

                <!-- PRODUCT IMAGE -->

                <td
                  width="75"
                  valign="middle"
                  style="padding-right:12px;"
                >

                  ${
                    item.image
                      ? `
                        <img
                          src="${
                            item.image.startsWith("http")
                              ? item.image
                              : `http://localhost:5000${item.image}`
                          }"
                          width="60"
                          height="60"
                          style="
                            width:60px;
                            height:60px;
                            object-fit:contain;
                            border-radius:10px;
                            background:#080c15;
                            border:1px solid #263246;
                            display:block;
                          "
                        />
                      `
                      : `
                        <div style="
                          width:60px;
                          height:60px;
                          background:#080c15;
                          border:1px solid #263246;
                          border-radius:10px;
                          text-align:center;
                          line-height:60px;
                          color:#53627A;
                          font-size:10px;
                        ">
                          PRODUCT
                        </div>
                      `
                  }

                </td>


                <!-- PRODUCT INFO -->

                <td
                  valign="middle"
                  style="padding-right:10px;"
                >

                  <p style="
                    margin:0 0 7px;
                    color:#ffffff;
                    font-size:14px;
                    font-weight:800;
                    line-height:1.4;
                  ">
                    ${item.name}
                  </p>

                  <p style="
                    margin:0;
                    color:#8E9BAE;
                    font-size:12px;
                  ">
                    Quantity: ${item.quantity}
                  </p>

                  <p style="
                    margin:5px 0 0;
                    color:#68758A;
                    font-size:11px;
                  ">
                    ₹${Number(item.price)} each
                  </p>

                </td>


                <!-- ITEM TOTAL -->

                <td
                  width="90"
                  align="right"
                  valign="middle"
                >

                  <p style="
                    margin:0;
                    color:#ffffff;
                    font-size:15px;
                    font-weight:900;
                  ">
                    ₹${
                      Number(item.price) *
                      Number(item.quantity)
                    }
                  </p>

                </td>

              </tr>

            </table>

          </div>

        `).join("")
      }

    </div>


    <!-- =====================================
         PRICE SUMMARY
    ====================================== -->

    <div style="
      margin-top:20px;
      padding:22px;
      background:#111827;
      border:1px solid #202c40;
      border-radius:12px;
    ">

      <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        style="border-collapse:collapse;"
      >

        <tr>

          <td style="
            padding:6px 0;
            color:#8E9BAE;
            font-size:14px;
          ">
            Subtotal
          </td>

          <td
            align="right"
            style="
              padding:6px 0;
              color:#ffffff;
              font-size:14px;
            "
          >
            ₹${subtotal}
          </td>

        </tr>


        <tr>

          <td style="
            padding:6px 0;
            color:#8E9BAE;
            font-size:14px;
          ">
            Shipping
          </td>

          <td
            align="right"
            style="
              padding:6px 0;
              color:#ffffff;
              font-size:14px;
            "
          >
            ${
              shipping === 0
                ? "FREE"
                : `₹${shipping}`
            }
          </td>

        </tr>


        <tr>

          <td style="
            padding:6px 0;
            color:#8E9BAE;
            font-size:14px;
          ">
            Tax
          </td>

          <td
            align="right"
            style="
              padding:6px 0;
              color:#ffffff;
              font-size:14px;
            "
          >
            ₹${tax}
          </td>

        </tr>


        <tr>

          <td colspan="2">

            <hr style="
              border:0;
              border-top:1px solid #263246;
              margin:14px 0;
            ">

          </td>

        </tr>


        <tr>

          <td style="
            color:#ffffff;
            font-size:17px;
            font-weight:900;
          ">
            TOTAL
          </td>

          <td
            align="right"
            style="
              color:#E60026;
              font-size:24px;
              font-weight:900;
            "
          >
            ₹${total}
          </td>

        </tr>

      </table>

    </div>


    <!-- =====================================
         COD MESSAGE
    ====================================== -->

    ${
      paymentMethod === "cod"
        ? `
          <div style="
            margin-top:20px;
            padding:18px;
            background:#160b0e;
            border-left:4px solid #E60026;
            border-radius:8px;
          ">

            <p style="
              margin:0;
              color:#ffffff;
              font-size:14px;
              line-height:1.6;
            ">
              💵 Please keep
              <strong>
                ₹${total}
              </strong>
              ready when your order arrives.
            </p>

          </div>
        `
        : ""
    }


    <p style="
      margin-top:30px;
      color:#A8B1C1;
      font-size:14px;
      line-height:1.7;
    ">
      We appreciate your order and can't wait
      to get your Monster drinks to you. ⚡
    </p>

    <p style="
      margin-top:30px;
      color:#ffffff;
      font-weight:bold;
    ">
      Stay Energized ⚡
    </p>

    <p style="
      color:#E60026;
      font-weight:900;
    ">
      Neo Urban Store
    </p>

  </div>


  <!-- FOOTER -->

  <div style="
    padding:20px 30px;
    background:#070b14;
    text-align:center;
    color:#53627A;
    font-size:11px;
  ">

    This is an automated order confirmation email.
    Please do not reply to this email.

  </div>

</div>

</body>

</html>
`,
      });

      console.log(
        "✅ Order confirmation email sent to:",
        req.body.email
      );

    } catch (emailError) {

      console.error(
        "⚠️ Email failed:",
        emailError.message
      );
    }

    // ==========================================
    // CLEAR CART
    // ==========================================

    await Cart.deleteMany();

    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: order._id,
      order,
    });

  } catch (err) {

    console.error(
      "❌ PLACE ORDER ERROR:",
      err
    );

    res.status(500).json({
      success: false,
      message: "Failed to place order",
      error: err.message,
    });
  }
};