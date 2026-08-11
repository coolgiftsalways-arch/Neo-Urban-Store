import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import "../styles/Track.css";

export default function TrackOrder() {
  const [orderIdInput, setOrderIdInput] = useState("");
  const [activeOrder, setActiveOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const pageRef = useRef(null);
  const cardRef = useRef(null);
  const resultRef = useRef(null);

  // Mock Order Data
  const mockOrders = {
    "NEO-10928": {
      id: "NEO-10928",
      status: "IN_TRANSIT",
      statusLabel: "IN TRANSIT",
      estimatedDelivery: "OCT 24, 2026",
      carrier: "FEDEX EXPRESS",
      trackingNumber: "7891234560",
      items: [
        {
          name: "CYBERPUNK OVERSIZED HOODIE",
          qty: "01",
          price: "$85.00",
          sku: "SKU-9921",
        },
        {
          name: "NEO-URBAN TACTICAL CARGO",
          qty: "01",
          price: "$110.00",
          sku: "SKU-4410",
        },
      ],
      currentStep: 2,
      timeline: [
        {
          title: "ORDER_PLACED",
          date: "OCT 20, 2026 • 10:30 AM",
          location: "CENTRAL WAREHOUSE",
        },
        {
          title: "QUALITY_CHECK",
          date: "OCT 21, 2026 • 02:15 PM",
          location: "HUB 04 - DISPATCH",
        },
        {
          title: "IN_TRANSIT",
          date: "OCT 22, 2026 • 09:00 AM",
          location: "AIR FREIGHT NORTH",
        },
        {
          title: "OUT_FOR_DELIVERY",
          date: "PENDING",
          location: "LOCAL DISTRIBUTION",
        },
        { title: "DELIVERED", date: "PENDING", location: "FINAL DESTINATION" },
      ],
    },
  };

  // Entrance Motion (Awwwards Staggered Reveal)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".aww-reveal",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power4.out",
        },
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setErrorMsg("");

    const formattedId = orderIdInput.trim().toUpperCase();
    const order = mockOrders[formattedId];

    if (order) {
      setActiveOrder(order);

      // Animate result presentation
      setTimeout(() => {
        if (resultRef.current) {
          gsap.fromTo(
            resultRef.current,
            { opacity: 0, y: 30, scale: 0.98 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" },
          );

          gsap.fromTo(
            ".timeline-step-anim",
            { opacity: 0, x: -20 },
            {
              opacity: 1,
              x: 0,
              duration: 0.5,
              stagger: 0.08,
              delay: 0.2,
              ease: "power2.out",
            },
          );
        }
      }, 50);
    } else {
      setActiveOrder(null);
      setErrorMsg(
        "ERR // ORDER_NOT_FOUND • VERIFY YOUR ORDER ID (DEMO: NEO-10928)",
      );
    }
  };

  return (
    <div className="aww-track-viewport" id="track" ref={pageRef}>
      {/* Dynamic Background Elements */}
      <div className="aww-bg-grid"></div>
      <div className="aww-glow-orb orb-1"></div>
      <div className="aww-glow-orb orb-2"></div>

      <div className="aww-track-container">
        {/* Awwwards Style Header */}
        <header className="aww-header aww-reveal">
          <div className="aww-tag font-mono">
            <span className="dot-pulse"></span> SYSTEM // LOGISTICS_TRACKER v2.6
          </div>
          <h1 className="aww-title">
            SHIPMENT <span className="text-stroke">LOGS</span>
          </h1>
          <p className="aww-subtitle">
            ENTER YOUR ORDER ID TO LOCATE YOUR PACKAGE IN REAL-TIME.
          </p>
        </header>

        {/* Input Terminal Card */}
        <div className="aww-card aww-reveal" ref={cardRef}>
          <form onSubmit={handleSearch} className="aww-form">
            <div className="aww-input-group" style={{ gridColumn: "1 / -1" }}>
              <label className="aww-label">
                <span>ORDER IDENTIFIER</span>
              </label>
              <input
                type="text"
                required
                placeholder="ENTER ORDER ID (e.g. NEO-10928)"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                className="aww-input font-mono"
              />
            </div>

            <button type="submit" className="aww-btn font-mono">
              <span className="btn-text">INITIALIZE_TRACKING</span>
              <span className="btn-icon">→</span>
            </button>
          </form>

          {/* Quick Demo Autofill */}
          <div className="aww-demo-bar font-mono">
            <span>
              DEMO_DATA: <code>NEO-10928</code>
            </span>
            <button
              type="button"
              className="aww-autofill-btn"
              onClick={() => {
                setOrderIdInput("NEO-10928");
              }}
            >
              [AUTO_FILL]
            </button>
          </div>

          {errorMsg && <div className="aww-error font-mono">{errorMsg}</div>}
        </div>

        {/* Results Panel */}
        {activeOrder && (
          <div className="aww-result-panel" ref={resultRef}>
            <div className="aww-card">
              {/* Order Meta Header */}
              <div className="aww-meta-header">
                <div>
                  <div className="aww-status-badge font-mono">
                    <span className="status-indicator"></span>
                    {activeOrder.statusLabel}
                  </div>
                  <h2 className="aww-order-id font-mono">{activeOrder.id}</h2>
                  <p className="aww-meta-sub font-mono">
                    CARRIER: {activeOrder.carrier} // TRK:{" "}
                    {activeOrder.trackingNumber}
                  </p>
                </div>

                <div className="aww-delivery-box">
                  <span className="aww-delivery-label font-mono">
                    ESTIMATED_ARRIVAL
                  </span>
                  <span className="aww-delivery-date font-mono">
                    {activeOrder.estimatedDelivery}
                  </span>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="aww-stepper-section">
                <h3 className="aww-section-heading font-mono">
                  // DISPATCH_TIMELINE
                </h3>

                <div className="aww-timeline font-mono">
                  {activeOrder.timeline.map((step, idx) => {
                    const isPassed = idx <= activeOrder.currentStep;
                    const isCurrent = idx === activeOrder.currentStep;

                    return (
                      <div
                        key={idx}
                        className={`timeline-step-anim aww-timeline-step ${
                          isPassed ? "step-passed" : "step-pending"
                        } ${isCurrent ? "step-active" : ""}`}
                      >
                        <div className="step-marker-container">
                          <div className="step-node"></div>
                          {idx !== activeOrder.timeline.length - 1 && (
                            <div className="step-connector"></div>
                          )}
                        </div>

                        <div className="step-content">
                          <div className="step-title-flex">
                            <span className="step-name">{step.title}</span>
                            <span className="step-date">{step.date}</span>
                          </div>
                          <span className="step-location">{step.location}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Package Inventory */}
              <div className="aww-items-section">
                <h3 className="aww-section-heading font-mono">
                  // MANIFEST_ITEMS
                </h3>
                <div className="aww-items-list font-mono">
                  {activeOrder.items.map((item, idx) => (
                    <div key={idx} className="aww-item-row">
                      <div className="item-info">
                        <span className="item-qty">[{item.qty}]</span>
                        <span className="item-title">{item.name}</span>
                        <span className="item-sku">{item.sku}</span>
                      </div>
                      <span className="item-price">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}