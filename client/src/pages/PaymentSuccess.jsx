import { Link } from "react-router-dom";
import "../styles/PaymentSuccess.css";

export default function PaymentSuccess() {
  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">✓</div>

        <h1>Payment Successful!</h1>

        <p>
          Your payment has been received successfully.
          Your order has been placed and will be processed shortly.
        </p>

        <div className="success-info">
          <div>
            <span>Status</span>
            <strong>Paid</strong>
          </div>

          <div>
            <span>Delivery</span>
            <strong>2-4 Days</strong>
          </div>
        </div>

        <Link to="/" className="success-btn">
          Continue Shopping
        </Link>

        
      </div>
    </div>
  );
}