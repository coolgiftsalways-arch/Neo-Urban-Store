import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { State, City } from "country-state-city";

import {
  FaCreditCard,
  FaMoneyBillWave,
  FaCheckCircle,
  FaChevronDown,
  FaSearch,
  FaMapMarkerAlt,
} from "react-icons/fa";

import "../styles/Check.css";

export default function Check() {
  const navigate = useNavigate();

  // =====================================================
  // LOADING
  // =====================================================

  const [loading, setLoading] = useState(false);

  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    altPhoneNumber: "",
    email: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "razorpay",
  });

  // =====================================================
  // LOCATION SEARCH
  // =====================================================

  const [stateSearch, setStateSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");

  const [selectedStateCode, setSelectedStateCode] =
    useState("");

  const [showStateDropdown, setShowStateDropdown] =
    useState(false);

  const [showCityDropdown, setShowCityDropdown] =
    useState(false);

  // =====================================================
  // REFS
  // =====================================================

  const stateRef = useRef(null);
  const cityRef = useRef(null);

  // =====================================================
  // ALL INDIAN STATES + UNION TERRITORIES
  // =====================================================

  const indianStates = useMemo(() => {
    return State.getStatesOfCountry("IN");
  }, []);

  // =====================================================
  // CITIES FOR SELECTED STATE
  // =====================================================

  const indianCities = useMemo(() => {
    if (!selectedStateCode) {
      return [];
    }

    return City.getCitiesOfState(
      "IN",
      selectedStateCode
    );
  }, [selectedStateCode]);

  // =====================================================
  // FILTER STATES
  // =====================================================

  const filteredStates = useMemo(() => {
    const search = stateSearch
      .toLowerCase()
      .trim();

    if (!search) {
      return indianStates;
    }

    return indianStates.filter((state) =>
      state.name
        .toLowerCase()
        .includes(search)
    );
  }, [indianStates, stateSearch]);

  // =====================================================
  // FILTER CITIES
  // =====================================================

  const filteredCities = useMemo(() => {
    const search = citySearch
      .toLowerCase()
      .trim();

    if (!search) {
      return indianCities;
    }

    return indianCities.filter((city) =>
      city.name
        .toLowerCase()
        .includes(search)
    );
  }, [indianCities, citySearch]);

  // =====================================================
  // CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
  // =====================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        stateRef.current &&
        !stateRef.current.contains(event.target)
      ) {
        setShowStateDropdown(false);
      }

      if (
        cityRef.current &&
        !cityRef.current.contains(event.target)
      ) {
        setShowCityDropdown(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // =====================================================
  // NORMAL INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // STATE SEARCH
  // =====================================================

  const handleStateChange = (e) => {
    const value = e.target.value;

    setStateSearch(value);

    // Reset selected state because user is typing again
    setSelectedStateCode("");

    // State changed → city must reset
    setCitySearch("");

    setFormData((prev) => ({
      ...prev,
      state: value,
      city: "",
    }));

    setShowStateDropdown(true);
    setShowCityDropdown(false);
  };

  // =====================================================
  // STATE SELECT
  // =====================================================

  const handleStateSelect = (state) => {
    setStateSearch(state.name);

    setSelectedStateCode(state.isoCode);

    setFormData((prev) => ({
      ...prev,
      state: state.name,
      city: "",
    }));

    setCitySearch("");

    setShowStateDropdown(false);

    // Automatically allow city selection
    setShowCityDropdown(true);
  };

  // =====================================================
  // CITY SEARCH
  // =====================================================

  const handleCityChange = (e) => {
    const value = e.target.value;

    setCitySearch(value);

    setFormData((prev) => ({
      ...prev,
      city: value,
    }));

    setShowCityDropdown(true);
  };

  // =====================================================
  // CITY SELECT
  // =====================================================

  const handleCitySelect = (city) => {
    setCitySearch(city.name);

    setFormData((prev) => ({
      ...prev,
      city: city.name,
    }));

    setShowCityDropdown(false);
  };

  // =====================================================
  // PAYMENT METHOD
  // =====================================================

  const handlePaymentChange = (method) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: method,
    }));
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ===================================================
    // REQUIRED FIELDS
    // ===================================================

    const requiredFields = [
      "fullName",
      "phoneNumber",
      // "altPhoneNumber",
      "email",
      "address",
      "landmark",
      "city",
      "state",
      "pincode",
    ];

    const hasEmptyField = requiredFields.some(
      (field) =>
        !formData[field] ||
        formData[field].trim() === ""
    );

    if (hasEmptyField) {
      alert("Please fill all fields.");
      return;
    }

    // ===================================================
    // STATE VALIDATION
    // ===================================================

    if (!selectedStateCode) {
      alert(
        "Please select your state from the suggestions."
      );
      return;
    }

    // ===================================================
    // CITY VALIDATION
    // ===================================================

    const selectedCityExists =
      indianCities.some(
        (city) =>
          city.name.toLowerCase() ===
          formData.city.toLowerCase()
      );

    if (!selectedCityExists) {
      alert(
        "Please select your city from the suggestions."
      );
      return;
    }

    // ===================================================
    // PAYMENT VALIDATION
    // ===================================================

    if (!formData.paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    setLoading(true);

    try {
      // =================================================
      // SAVE CHECKOUT DATA
      // =================================================

      localStorage.setItem(
        "checkoutData",
        JSON.stringify(formData)
      );

      // =================================================
      // CASH ON DELIVERY
      // =================================================

      if (
        formData.paymentMethod === "cod"
      ) {
        const response = await fetch(
          "http://localhost:5000/api/orders",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify(formData),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to place order"
          );
        }

        // =================================================
        // SAVE ORDER ID
        // =================================================

        if (data._id) {
          localStorage.setItem(
            "orderId",
            data._id
          );
        }

        // =================================================
        // GO TO SUCCESS PAGE
        // =================================================

        navigate("/order-success");

        return;
      }

      // =================================================
      // RAZORPAY
      // =================================================

      if (
        formData.paymentMethod ===
        "razorpay"
      ) {
        navigate("/payment");

        return;
      }

    } catch (error) {
      console.error(
        "Order placement error:",
        error
      );

      alert(
        error.message ||
          "Something went wrong while placing your order."
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // JSX
  // =====================================================

  return (
    <div className="checkin-container">

      <div className="checkin-card">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="checkin-header">

          <h2>GUEST CHECKOUT</h2>

          <p>
            Please enter your delivery details
          </p>

        </div>


        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="checkin-form"
        >

          {/* =================================================
              FULL NAME
          ================================================= */}

          <div className="form-group full-width">

            <label>
              Full Name *
            </label>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              autoComplete="name"
            />

          </div>


          {/* =================================================
              PHONE
          ================================================= */}

          <div className="form-group">

            <label>
              Phone Number *
            </label>

            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+91 9876543210"
              autoComplete="tel"
            />

          </div>


          {/* =================================================
              ALTERNATE PHONE
          ================================================= */}

          <div className="form-group">

            <label>
              Alternate Phone 
            </label>

            <input
              type="tel"
              name="altPhoneNumber"
              value={formData.altPhoneNumber}
              onChange={handleChange}
              placeholder="Alternate Number"
            />

          </div>


          {/* =================================================
              EMAIL
          ================================================= */}

          <div className="form-group full-width">

            <label>
              Email *
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              autoComplete="email"
            />

          </div>


          {/* =================================================
              ADDRESS
          ================================================= */}

          <div className="form-group full-width">

            <label>
              Address *
            </label>

            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="House No, Street, Area"
              autoComplete="street-address"
            />

          </div>


          {/* =================================================
              LANDMARK
          ================================================= */}

          <div className="form-group">

            <label>
              Landmark *
            </label>

            <input
              type="text"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              placeholder="Near Metro / Park"
            />

          </div>


          {/* =================================================
              STATE
          ================================================= */}

          <div
            className="form-group location-group"
            ref={stateRef}
          >

            <label>
              State *
            </label>

            <div className="location-input-wrapper">

              <FaMapMarkerAlt className="location-icon" />

              <input
                type="text"
                name="state"
                value={stateSearch}
                onChange={handleStateChange}
                onFocus={() =>
                  setShowStateDropdown(true)
                }
                placeholder="Search your state"
                autoComplete="off"
              />

              <FaChevronDown
                className={`dropdown-arrow ${
                  showStateDropdown
                    ? "rotate"
                    : ""
                }`}
              />

            </div>


            {/* =================================================
                STATE DROPDOWN
            ================================================= */}

            {showStateDropdown && (
              <div className="location-dropdown">

                <div className="dropdown-header">
                  <FaSearch />

                  <span>
                    Select your state
                  </span>
                </div>

                <div className="dropdown-list">

                  {filteredStates.length > 0 ? (

                    filteredStates.map(
                      (state) => (
                        <button
                          type="button"
                          className={`location-option ${
                            formData.state ===
                            state.name
                              ? "selected"
                              : ""
                          }`}
                          key={state.isoCode}
                          onClick={() =>
                            handleStateSelect(
                              state
                            )
                          }
                        >
                          <span>
                            {state.name}
                          </span>

                          {formData.state ===
                            state.name && (
                            <FaCheckCircle />
                          )}
                        </button>
                      )
                    )

                  ) : (

                    <div className="location-empty">
                      No state found
                    </div>

                  )}

                </div>

              </div>
            )}

          </div>


          {/* =================================================
              CITY
          ================================================= */}

          <div
            className="form-group location-group"
            ref={cityRef}
          >

            <label>
              City *
            </label>

            <div
              className={`location-input-wrapper ${
                !selectedStateCode
                  ? "disabled"
                  : ""
              }`}
            >

              <FaMapMarkerAlt className="location-icon" />

              <input
                type="text"
                name="city"
                value={citySearch}
                onChange={handleCityChange}
                onFocus={() => {
                  if (selectedStateCode) {
                    setShowCityDropdown(true);
                  }
                }}
                placeholder={
                  selectedStateCode
                    ? "Search your city"
                    : "Select state first"
                }
                autoComplete="off"
                disabled={
                  !selectedStateCode
                }
              />

              <FaChevronDown
                className={`dropdown-arrow ${
                  showCityDropdown
                    ? "rotate"
                    : ""
                }`}
              />

            </div>


            {/* =================================================
                CITY DROPDOWN
            ================================================= */}

            {showCityDropdown &&
              selectedStateCode && (
                <div className="location-dropdown">

                  <div className="dropdown-header">
                    <FaSearch />

                    <span>
                      Select your city
                    </span>
                  </div>

                  <div className="dropdown-list">

                    {filteredCities.length >
                    0 ? (

                      filteredCities.map(
                        (city) => (
                          <button
                            type="button"
                            className={`location-option ${
                              formData.city ===
                              city.name
                                ? "selected"
                                : ""
                            }`}
                            key={`${city.id}-${city.name}`}
                            onClick={() =>
                              handleCitySelect(
                                city
                              )
                            }
                          >

                            <span>
                              {city.name}
                            </span>

                            {formData.city ===
                              city.name && (
                              <FaCheckCircle />
                            )}

                          </button>
                        )
                      )

                    ) : (

                      <div className="location-empty">
                        No city found
                      </div>

                    )}

                  </div>

                </div>
              )}

          </div>


          {/* =================================================
              PINCODE
          ================================================= */}

          <div className="form-group">

            <label>
              Pincode *
            </label>

            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="400001"
              maxLength="6"
              inputMode="numeric"
              autoComplete="postal-code"
            />

          </div>


          {/* =================================================
              PAYMENT
          ================================================= */}

          <div className="payment-section full-width">

            <div className="payment-heading">

              <span>
                PAYMENT METHOD
              </span>

              <small>
                Choose how you'd like to pay
              </small>

            </div>


            <div className="payment-options">

              {/* =================================================
                  ONLINE PAYMENT
              ================================================= */}

              <button
                type="button"
                className={`payment-option ${
                  formData.paymentMethod ===
                  "razorpay"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  handlePaymentChange(
                    "razorpay"
                  )
                }
              >

                <div className="payment-icon">
                  <FaCreditCard />
                </div>

                <div className="payment-info">

                  <strong>
                    Online Payment
                  </strong>

                  <span>
                    UPI, Cards, Net Banking &
                    Wallets
                  </span>

                </div>

                <div className="payment-check">

                  {formData.paymentMethod ===
                    "razorpay" && (
                    <FaCheckCircle />
                  )}

                </div>

              </button>


              {/* =================================================
                  CASH ON DELIVERY
              ================================================= */}

              <button
                type="button"
                className={`payment-option ${
                  formData.paymentMethod ===
                  "cod"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  handlePaymentChange(
                    "cod"
                  )
                }
              >

                <div className="payment-icon cod-icon">
                  <FaMoneyBillWave />
                </div>

                <div className="payment-info">

                  <strong>
                    Cash on Delivery
                  </strong>

                  <span>
                    Pay when your order arrives
                  </span>

                </div>

                <div className="payment-check">

                  {formData.paymentMethod ===
                    "cod" && (
                    <FaCheckCircle />
                  )}

                </div>

              </button>

            </div>

          </div>


          {/* =================================================
              SUBMIT
          ================================================= */}

          <div className="form-group full-width">

            <button
              className="submit-btn"
              type="submit"
              disabled={loading}
            >

              {loading
                ? "LOADING..."
                : formData.paymentMethod ===
                  "cod"
                ? "PLACE ORDER →"
                : "CONTINUE TO PAYMENT →"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}