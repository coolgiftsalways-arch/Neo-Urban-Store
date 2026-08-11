import { useEffect, useState } from "react";

export default function AdminCheckIns() {
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
     fetch("/api/checkin")
       .then((res) => {
         if (!res.ok) throw new Error("Failed to connect to backend");
         return res.json();
       })
       .then((data) => {
         if (data.success) {
           setCheckIns(data.data);
         } else {
           setError(data.message || "Failed to load check-ins");
         }
       })
       .catch((err) => {
         console.error("Admin Fetch Error:", err);
         setError("Could not reach backend server on port 5000.");
       })
       .finally(() => setLoading(false));
  }, []);

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Guest Check-In Submissions ({checkIns.length})</h2>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            borderRadius: "4px",
            border: "1px solid #ccc",
            background: "#fff",
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {loading && <p>Loading submissions...</p>}

      {error && (
        <div
          style={{
            color: "#d9534f",
            background: "#fdf7f7",
            padding: "12px",
            border: "1px solid #d9534f",
            borderRadius: "4px",
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && checkIns.length === 0 && (
        <p>No guest check-ins recorded yet.</p>
      )}

      {!loading && !error && checkIns.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#fff",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr
                style={{ background: "#222", color: "#fff", textAlign: "left" }}
              >
                <th style={{ padding: "12px 10px" }}>Name</th>
                <th style={{ padding: "12px 10px" }}>Phone</th>
                <th style={{ padding: "12px 10px" }}>Alt Phone</th>
                <th style={{ padding: "12px 10px" }}>Email</th>
                <th style={{ padding: "12px 10px" }}>Address</th>
                <th style={{ padding: "12px 10px" }}>Landmark</th>
                <th style={{ padding: "12px 10px" }}>City / State</th>
                <th style={{ padding: "12px 10px" }}>Pincode</th>
              </tr>
            </thead>
            <tbody>
              {checkIns.map((item) => (
                <tr key={item._id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px 10px", fontWeight: "bold" }}>
                    {item.fullName}
                  </td>
                  <td style={{ padding: "12px 10px" }}>{item.phoneNumber}</td>
                  <td style={{ padding: "12px 10px", color: "#666" }}>
                    {item.altPhoneNumber || "-"}
                  </td>
                  <td style={{ padding: "12px 10px" }}>{item.email}</td>
                  <td style={{ padding: "12px 10px" }}>{item.address}</td>
                  <td style={{ padding: "12px 10px" }}>{item.landmark}</td>
                  <td style={{ padding: "12px 10px" }}>
                    {item.city}, {item.state}
                  </td>
                  <td style={{ padding: "12px 10px" }}>{item.pincode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}