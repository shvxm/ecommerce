import {
  CheckCircle,
  Package,
  ArrowRight
} from "lucide-react";

import {
  Link,
  useParams
} from "react-router-dom";

import "./OrderSuccess.css";

const OrderSuccess = () => {
  const { id } = useParams();

  return (
    <main className="order-success-page">

      <div className="order-success-card">

        <div className="success-icon">
          <CheckCircle size={55} />
        </div>

        <h1>
          Order Placed Successfully!
        </h1>

        <p>
          Thank you for your purchase.
          Your order has been received and
          is currently being processed.
        </p>

        <div className="order-id-box">

          <Package size={20} />

          <div>
            <span>
              Order ID
            </span>

            <strong>
              {id}
            </strong>
          </div>

        </div>

        <div className="success-actions">

          <Link
            to="/orders"
            className="view-orders-btn"
          >
            View My Orders
            <ArrowRight size={18} />
          </Link>

          <Link
            to="/products"
            className="continue-btn"
          >
            Continue Shopping
          </Link>

        </div>

      </div>

    </main>
  );
};

export default OrderSuccess;