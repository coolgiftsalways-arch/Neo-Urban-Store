import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Check.css";

export default function Check() {
  const navigate = useNavigate();
  const [loading,setLoading]=useState(false);
  const [formData,setFormData]=useState({
    fullName:"",
    phoneNumber:"",
    altPhoneNumber:"",
    email:"",
    address:"",
    landmark:"",
    city:"",
    state:"",
    pincode:"",
  });

  const handleChange=(e)=>{
    const {name,value}=e.target;
    setFormData(prev=>({...prev,[name]:value}));
  };

  const handleSubmit=(e)=>{
    e.preventDefault();

    const hasEmptyField=Object.values(formData).some(
      value=>value.trim()===""
    );

    if(hasEmptyField){
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);

    localStorage.setItem(
      "checkoutData",
      JSON.stringify(formData)
    );

    setLoading(false);

    navigate("/payment");
  };

  return (
    <div className="checkin-container">
      <div className="checkin-card">

        <div className="checkin-header">
          <h2>GUEST CHECKOUT</h2>
          <p>Please enter your delivery details</p>
        </div>

        <form onSubmit={handleSubmit} className="checkin-form">

          <div className="form-group full-width">
            <label>Full Name *</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe"/>
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="+91 9876543210"/>
          </div>

          <div className="form-group">
            <label>Alternate Phone *</label>
            <input type="tel" name="altPhoneNumber" value={formData.altPhoneNumber} onChange={handleChange} placeholder="Alternate Number"/>
          </div>

          <div className="form-group full-width">
            <label>Email *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@gmail.com"/>
          </div>

          <div className="form-group full-width">
            <label>Address *</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="House No, Street, Area"/>
          </div>

          <div className="form-group">
            <label>Landmark *</label>
            <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} placeholder="Near Metro / Park"/>
          </div>

          <div className="form-group">
            <label>City *</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Mumbai"/>
          </div>

          <div className="form-group">
            <label>State *</label>
            <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="Maharashtra"/>
          </div>

          <div className="form-group">
            <label>Pincode *</label>
            <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="400001"/>
          </div>

          <div className="form-group full-width">
            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? "LOADING..." : "CONTINUE TO PAYMENT →"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}