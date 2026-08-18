import "../styles/LegalPages.css";

export default function RefundPolicy() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <div className="legal-eyebrow">NEO URBAN STORE // ORDERS</div>

        <h1>Cancellation & Refund Policy</h1>
        <p className="legal-date">Effective Date: 18 August 2026</p>

        <section>
          <h2>1. Order Cancellation</h2>
          <p>
            You may request cancellation of an order by contacting us as soon
            as possible after placing the order. Cancellation may not be
            possible once an order has been processed, packed, or handed over
            to a shipping partner.
          </p>
        </section>

        <section>
          <h2>2. Cancellation Before Shipment</h2>
          <p>
            If your cancellation request is received before the order has
            been shipped, we will make reasonable efforts to cancel the order.
            If payment has already been successfully collected, an eligible
            refund will be initiated after cancellation is confirmed.
          </p>
        </section>

        <section>
          <h2>3. Cancellation After Shipment</h2>
          <p>
            Once an order has been shipped, cancellation may no longer be
            possible. In such cases, please contact us and we will advise you
            regarding available options.
          </p>
        </section>

        <section>
          <h2>4. Damaged or Incorrect Products</h2>
          <p>
            If you receive a product that is damaged, defective, or different
            from what you ordered, contact us as soon as possible after
            delivery.
          </p>

          <p>Please provide:</p>

          <ul>
            <li>Order ID</li>
            <li>Description of the issue</li>
            <li>Photographs or videos where applicable</li>
            <li>Relevant packaging information where requested</li>
          </ul>
        </section>

        <section>
          <h2>5. Refund Eligibility</h2>
          <p>A refund may be issued where:</p>

          <ul>
            <li>An eligible order is cancelled before shipment.</li>
            <li>We are unable to fulfill an order.</li>
            <li>
              A payment was successfully collected but the corresponding
              order was not fulfilled.
            </li>
            <li>An eligible product issue is verified.</li>
          </ul>
        </section>

        <section>
          <h2>6. Refund Processing</h2>
          <p>
            Once a refund is approved, it will be initiated through the
            applicable payment method or payment service provider. The time
            taken for the amount to appear in your account may depend on your
            bank, card issuer, or payment provider.
          </p>
        </section>

        <section>
          <h2>7. Non-Refundable Situations</h2>
          <p>
            Refunds may not be available for issues caused by incorrect
            delivery information provided by the customer, customer refusal
            to accept a correctly fulfilled order, failure to provide
            necessary delivery information, or normal product characteristics
            disclosed on the product page, subject to applicable law.
          </p>
        </section>

        <section>
          <h2>8. Failed or Duplicate Payments</h2>
          <p>
            If money has been deducted but an order was not successfully
            created, please contact us with the relevant transaction and
            order details. We will verify the payment status and take
            appropriate action.
          </p>
        </section>

        <section>
          <h2>9. Contact Us</h2>
          <p>
            <strong>Neo Urban Store</strong>
            <br />
            Email: admin@neourbanstore.in
            <br />
            Website: neourbanstore.in
          </p>
        </section>
      </div>
    </div>
  );
}