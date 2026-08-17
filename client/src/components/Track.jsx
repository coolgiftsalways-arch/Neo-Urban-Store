import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import axios from "axios";
import "../styles/Track.css";

export default function TrackOrder() {
  const [orderIdInput, setOrderIdInput] = useState("");
  const [activeOrder, setActiveOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const pageRef = useRef(null);
  const cardRef = useRef(null);
  const resultRef = useRef(null);

  // =====================================================
  // API BASE URL
  // =====================================================

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

  // =====================================================
  // PAGE ENTRANCE ANIMATION
  // =====================================================

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".aww-reveal",
        {
          y: 40,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power4.out",
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  // =====================================================
  // FORMAT STATUS
  // =====================================================

  const formatStatus = (status) => {
    if (!status) return "ORDER PLACED";

    return String(status)
      .replace(/_/g, " ")
      .replace(/-/g, " ")
      .toUpperCase();
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "PENDING";

    try {
      const parsedDate = new Date(date);

      if (Number.isNaN(parsedDate.getTime())) {
        return String(date).toUpperCase();
      }

      return parsedDate
        .toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
        .toUpperCase();
    } catch {
      return String(date).toUpperCase();
    }
  };

  // =====================================================
  // NORMALIZE ORDER ID
  // =====================================================

  const normalizeOrderId = (value) => {
    return String(value || "")
      .trim()
      .replace(/^#/, "");
  };

  // =====================================================
  // BUILD TIMELINE
  // =====================================================

  const buildTimeline = (trackingData, order) => {
    const timeline = [];

    // ===================================================
    // 1. ORDER PLACED
    // ===================================================

    timeline.push({
      title: "ORDER_PLACED",
      date: formatDate(order?.createdAt),
      location: "NEO URBAN STORE",
    });

    // ===================================================
    // SHIPROCKET TRACKING DATA
    // ===================================================

    const tracking =
      trackingData?.tracking_data ||
      trackingData?.data?.tracking_data ||
      trackingData?.tracking ||
      trackingData?.data ||
      trackingData;

    const activities =
      tracking?.shipment_track_activities ||
      tracking?.activities ||
      tracking?.shipment_track ||
      [];

    // ===================================================
    // 2. SHIPROCKET ACTIVITIES
    // ===================================================

    if (Array.isArray(activities) && activities.length > 0) {
      activities.forEach((activity) => {
        const status =
          activity?.status ||
          activity?.activity ||
          activity?.current_status ||
          "SHIPMENT_UPDATE";

        const date =
          activity?.date ||
          activity?.activity_date ||
          activity?.timestamp;

        const location =
          activity?.location ||
          activity?.activity_location ||
          "SHIPROCKET";

        timeline.push({
          title: formatStatus(status),
          date: formatDate(date),
          location: String(location).toUpperCase(),
        });
      });
    }

    // ===================================================
    // SHIPROCKET CURRENT STATUS
    // ===================================================

    const currentStatus =
      tracking?.shipment_status ||
      tracking?.current_status ||
      tracking?.status ||
      order?.shiprocket?.shippingStatus ||
      "";

    // ===================================================
    // IF SHIPMENT EXISTS BUT NO ACTIVITIES
    // ===================================================

    if (
      currentStatus &&
      currentStatus !== "NOT_SHIPPED" &&
      timeline.length === 1
    ) {
      timeline.push({
        title: formatStatus(currentStatus),
        date: "CURRENT",
        location: String(
          order?.shiprocket?.courierName ||
            "SHIPROCKET"
        ).toUpperCase(),
      });
    }

    // ===================================================
    // IF NOT SHIPPED YET
    // ===================================================

    if (
      !order?.shiprocket?.synced &&
      timeline.length === 1
    ) {
      timeline.push({
        title: "AWAITING_DISPATCH",
        date: "PENDING",
        location: "NEO URBAN STORE",
      });
    }

    // ===================================================
    // AVOID DUPLICATES
    // ===================================================

    return timeline.filter(
      (item, index, array) =>
        index ===
        array.findIndex(
          (x) =>
            x.title === item.title &&
            x.date === item.date &&
            x.location === item.location
        )
    );
  };

  // =====================================================
  // GET CURRENT STEP
  // =====================================================

  const getCurrentStep = (timeline, status, shiprocket) => {
    if (!timeline.length) return 0;

    // ---------------------------------------------------
    // NOT SHIPPED
    // ---------------------------------------------------

    if (
      !shiprocket?.synced ||
      !shiprocket?.shipmentId
    ) {
      return 0;
    }

    const normalizedStatus = String(status || "")
      .toUpperCase()
      .replace(/[_-]/g, " ");

    // ---------------------------------------------------
    // FIND CURRENT STATUS
    // ---------------------------------------------------

    let foundIndex = timeline.findIndex(
      (step) =>
        step.title === normalizedStatus
    );

    // ---------------------------------------------------
    // IF CURRENT STATUS IS NOT FOUND
    // ---------------------------------------------------

    if (foundIndex === -1) {
      foundIndex = timeline.length - 1;
    }

    return foundIndex;
  };

  // =====================================================
  // SEARCH ORDER
  // =====================================================

  const handleSearch = async (e) => {
    e.preventDefault();

    setErrorMsg("");
    setActiveOrder(null);

    const formattedId = normalizeOrderId(
      orderIdInput
    );

    if (!formattedId) {
      setErrorMsg(
        "ERR // ORDER_IDENTIFIER_REQUIRED"
      );
      return;
    }

    try {
      setLoading(true);

      console.log(
        "===================================="
      );

      console.log(
        "📍 TRACKING ORDER:",
        formattedId
      );

      console.log(
        "===================================="
      );

      // =================================================
      // GET ORDER TRACKING
      // =================================================

      const response = await axios.get(
        `${API_URL}/orders/${encodeURIComponent(
          formattedId
        )}/tracking`
      );

      console.log(
        "📍 TRACKING RESPONSE:",
        response.data
      );

      // =================================================
      // CHECK RESPONSE
      // =================================================

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Tracking information unavailable."
        );
      }

      const order =
        response.data.order || {};

      const shiprocket =
        response.data.shiprocket ||
        order?.shiprocket ||
        {};

      const tracking =
        response.data.tracking ||
        null;

      const trackingData =
        tracking?.tracking_data ||
        tracking?.data?.tracking_data ||
        tracking?.data ||
        tracking ||
        {};

      // =================================================
      // DETERMINE STATUS
      // =================================================

      let status =
        trackingData?.shipment_status ||
        trackingData?.current_status ||
        trackingData?.status ||
        shiprocket?.shippingStatus ||
        order?.orderStatus ||
        "ORDER_PLACED";

      // =================================================
      // IMPORTANT:
      // If Shiprocket has NOT been synced yet,
      // don't pretend the order is in transit.
      // =================================================

      if (
        !shiprocket?.synced &&
        !shiprocket?.shipmentId
      ) {
        status = "ORDER_PLACED";
      }

      // =================================================
      // BUILD TIMELINE
      // =================================================

      const timeline = buildTimeline(
        tracking,
        order
      );

      // =================================================
      // CURRENT STEP
      // =================================================

      const currentStep = getCurrentStep(
        timeline,
        status,
        shiprocket
      );

      // =================================================
      // PREPARE ITEMS
      // =================================================

      const items = (
        order?.items || []
      ).map((item) => ({
        name:
          item?.name ||
          "PRODUCT",

        qty: String(
          item?.qty ||
            item?.quantity ||
            1
        ).padStart(2, "0"),

        price:
          `₹${Number(
            item?.price || 0
          ).toLocaleString("en-IN")}`,

        sku:
          item?.productId ||
          item?.sku ||
          "N/A",
      }));

      // =================================================
      // ACTIVE ORDER DATA
      // =================================================

      const activeOrderData = {
        id:
          String(
            order?.id ||
              order?._id ||
              formattedId
          ),

        status,

        statusLabel:
          formatStatus(status),

        // -------------------------------------------------
        // DELIVERY
        // -------------------------------------------------

        estimatedDelivery:
          trackingData?.etd ||
          trackingData?.estimated_delivery_date ||
          "UPDATING",

        // -------------------------------------------------
        // COURIER
        // -------------------------------------------------

        carrier:
          shiprocket?.courierName ||
          trackingData?.courier_name ||
          trackingData?.courier ||
          "NOT ASSIGNED",

        // -------------------------------------------------
        // AWB
        // -------------------------------------------------

        trackingNumber:
          shiprocket?.awbCode ||
          trackingData?.awb_code ||
          trackingData?.awb ||
          "NOT ASSIGNED",

        // -------------------------------------------------
        // TRACKING URL
        // -------------------------------------------------

        trackingUrl:
          shiprocket?.trackingUrl ||
          "",

        // -------------------------------------------------
        // SHIPMENT STATE
        // -------------------------------------------------

        isShipped:
          Boolean(
            shiprocket?.synced &&
            shiprocket?.shipmentId
          ),

        // -------------------------------------------------
        // ITEMS
        // -------------------------------------------------

        items,

        // -------------------------------------------------
        // TIMELINE
        // -------------------------------------------------

        currentStep,

        timeline,

        // -------------------------------------------------
        // ORDER TOTAL
        // -------------------------------------------------

        total:
          order?.total || 0,

        // -------------------------------------------------
        // PAYMENT
        // -------------------------------------------------

        paymentMethod:
          order?.paymentMethod || "",
      };

      console.log(
        "📦 ACTIVE ORDER:",
        activeOrderData
      );

      setActiveOrder(
        activeOrderData
      );

      // =================================================
      // RESULT ANIMATION
      // =================================================

      setTimeout(() => {
        if (!resultRef.current) return;

        gsap.fromTo(
          resultRef.current,
          {
            opacity: 0,
            y: 30,
            scale: 0.98,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
          }
        );

        gsap.fromTo(
          ".timeline-step-anim",
          {
            opacity: 0,
            x: -20,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.08,
            delay: 0.2,
            ease: "power2.out",
          }
        );
      }, 50);

    } catch (error) {
      console.error(
        "❌ TRACKING ERROR:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to find tracking information.";

      setActiveOrder(null);

      setErrorMsg(
        `ERR // ${message}`
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      className="aww-track-viewport"
      id="track"
      ref={pageRef}
    >

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className="aww-bg-grid"></div>

      <div className="aww-glow-orb orb-1"></div>

      <div className="aww-glow-orb orb-2"></div>

      <div className="aww-track-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="aww-header aww-reveal">

          <div className="aww-tag font-mono">
            <span className="dot-pulse"></span>

            SYSTEM // LOGISTICS_TRACKER v2.6
          </div>

          <h1 className="aww-title">
            SHIPMENT{" "}
            <span className="text-stroke">
              LOGS
            </span>
          </h1>

          <p className="aww-subtitle">
            ENTER YOUR ORDER ID TO LOCATE YOUR
            PACKAGE IN REAL-TIME.
          </p>

        </header>

        {/* =================================================
            SEARCH CARD
        ================================================= */}

        <div
          className="aww-card aww-reveal"
          ref={cardRef}
        >

          <form
            onSubmit={handleSearch}
            className="aww-form"
          >

            <div
              className="aww-input-group"
              style={{
                gridColumn: "1 / -1",
              }}
            >

              <label className="aww-label">
                <span>
                  ORDER IDENTIFIER
                </span>
              </label>

              <input
                type="text"
                required
                placeholder="ENTER YOUR ORDER ID"
                value={orderIdInput}
                onChange={(e) =>
                  setOrderIdInput(
                    e.target.value
                  )
                }
                className="aww-input font-mono"
              />

            </div>

            <button
              type="submit"
              className="aww-btn font-mono"
              disabled={loading}
            >

              <span className="btn-text">
                {loading
                  ? "FETCHING_TRACKING..."
                  : "INITIALIZE_TRACKING"}
              </span>

              <span className="btn-icon">
                {loading
                  ? "..."
                  : "→"}
              </span>

            </button>

          </form>

          {/* =================================================
              ERROR
          ================================================= */}

          {errorMsg && (
            <div className="aww-error font-mono">
              {errorMsg}
            </div>
          )}

        </div>

        {/* =================================================
            RESULTS
        ================================================= */}

        {activeOrder && (

          <div
            className="aww-result-panel"
            ref={resultRef}
          >

            <div className="aww-card">

              {/* =================================================
                  ORDER META
              ================================================= */}

              <div className="aww-meta-header">

                <div>

                  <div className="aww-status-badge font-mono">

                    <span className="status-indicator"></span>

                    {activeOrder.statusLabel}

                  </div>

                  <h2 className="aww-order-id font-mono">
                    {activeOrder.id}
                  </h2>

                  <p className="aww-meta-sub font-mono">

                    CARRIER:{" "}

                    {activeOrder.carrier}

                    {" // TRK: "}

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

              {/* =================================================
                  NOT SHIPPED MESSAGE
              ================================================= */}

              {!activeOrder.isShipped && (

                <div
                  className="font-mono"
                  style={{
                    marginTop: "25px",
                    padding: "20px",
                    border:
                      "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    background:
                      "rgba(255,255,255,0.03)",
                  }}
                >

                  <div
                    style={{
                      fontSize: "12px",
                      letterSpacing: "2px",
                      opacity: 0.6,
                      marginBottom: "8px",
                    }}
                  >
                    // SHIPMENT_STATUS
                  </div>

                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: 600,
                      marginBottom: "8px",
                    }}
                  >
                    SHIPMENT NOT YET DISPATCHED
                  </div>

                  <div
                    style={{
                      fontSize: "13px",
                      opacity: 0.65,
                      lineHeight: 1.6,
                    }}
                  >
                    YOUR ORDER HAS BEEN RECEIVED.
                    TRACKING WILL BECOME AVAILABLE
                    ONCE THE ORDER IS HANDED OVER
                    TO THE COURIER.
                  </div>

                </div>

              )}

              {/* =================================================
                  TRACKING LINK
              ================================================= */}

              {activeOrder.trackingUrl && (

                <div
                  style={{
                    marginTop: "20px",
                    textAlign: "right",
                  }}
                >

                  <a
                    href={
                      activeOrder.trackingUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="aww-btn font-mono"
                    style={{
                      display:
                        "inline-flex",
                      textDecoration:
                        "none",
                    }}
                  >
                    OPEN LIVE TRACKING →
                  </a>

                </div>

              )}

              {/* =================================================
                  TIMELINE
              ================================================= */}

              <div className="aww-stepper-section">

                <h3 className="aww-section-heading font-mono">
                  // DISPATCH_TIMELINE
                </h3>

                <div className="aww-timeline font-mono">

                  {activeOrder.timeline.map(
                    (step, idx) => {

                      const isPassed =
                        idx <=
                        activeOrder.currentStep;

                      const isCurrent =
                        idx ===
                        activeOrder.currentStep;

                      return (

                        <div
                          key={`${step.title}-${idx}`}
                          className={`
                            timeline-step-anim
                            aww-timeline-step
                            ${
                              isPassed
                                ? "step-passed"
                                : "step-pending"
                            }
                            ${
                              isCurrent
                                ? "step-active"
                                : ""
                            }
                          `}
                        >

                          <div className="step-marker-container">

                            <div className="step-node"></div>

                            {idx !==
                              activeOrder.timeline.length -
                                1 && (

                              <div className="step-connector"></div>

                            )}

                          </div>

                          <div className="step-content">

                            <div className="step-title-flex">

                              <span className="step-name">
                                {step.title}
                              </span>

                              <span className="step-date">
                                {step.date}
                              </span>

                            </div>

                            <span className="step-location">
                              {step.location}
                            </span>

                          </div>

                        </div>

                      );
                    }
                  )}

                </div>

              </div>

              {/* =================================================
                  ORDER ITEMS
              ================================================= */}

              <div className="aww-items-section">

                <h3 className="aww-section-heading font-mono">
                  // MANIFEST_ITEMS
                </h3>

                <div className="aww-items-list font-mono">

                  {activeOrder.items.map(
                    (item, idx) => (

                      <div
                        key={idx}
                        className="aww-item-row"
                      >

                        <div className="item-info">

                          <span className="item-qty">
                            [{item.qty}]
                          </span>

                          <span className="item-title">
                            {item.name}
                          </span>

                          <span className="item-sku">
                            {item.sku}
                          </span>

                        </div>

                        <span className="item-price">
                          {item.price}
                        </span>

                      </div>

                    )
                  )}

                </div>

              </div>

              {/* =================================================
                  ORDER TOTAL
              ================================================= */}

              <div
                style={{
                  marginTop: "25px",
                  paddingTop: "20px",
                  borderTop:
                    "1px solid rgba(255,255,255,0.1)",
                }}
              >

                <div
                  className="font-mono"
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center",
                  }}
                >

                  <span>
                    ORDER_TOTAL
                  </span>

                  <strong>
                    ₹
                    {Number(
                      activeOrder.total || 0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}