import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Doctor() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isValidFormat = (value) => /^CLRSYM-[A-Z0-9]{6}$/.test(value.trim());

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const trimmed = code.trim().toUpperCase();

    if (!isValidFormat(trimmed)) {
      setError("Invalid code format. Example: CLRSYM-1A2B3C");
      return;
    }

    setLoading(true);

    try {
      await axios.get(
        `http://127.0.0.1:5001/api/patient-codes/validate?patient_code=${encodeURIComponent(
          trimmed
        )}`
      );

      // valid in DB
      localStorage.setItem("clearsym_doctor_code", trimmed);
      navigate("/doctor/dashboard");
    } catch (err) {
      const status = err?.response?.status;

      // If backend CONFIRMS it doesn't exist, block
      if (status === 404) {
        setError("Code not found. Make sure the patient copied the latest code.");
        return;
      }

      // Otherwise still allow access (network/CORS/server issue)
      localStorage.setItem("clearsym_doctor_code", trimmed);
      navigate("/doctor/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
        position: "relative",
        zIndex: 0,
        minHeight: "calc(100vh - 64px)",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "transparent",
      }}>
      <div style={{ width: "100%", maxWidth: 480 }}>
          <div style={{ marginBottom: 12 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: 999,
              border: "1px solid rgba(37,99,235,0.22)",
              background: "rgba(37,99,235,0.10)",
              color: "#1d4ed8",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            Welcome to the Doctor Portal
          </div>
        </div>
        
        <div
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: 18,
            padding: 20,
            boxShadow: "0 16px 45px rgba(0,0,0,0.08)",
          }}
        >
        <h2 style={{margin:0, fontSize:26, fontWeight: 900, letterSpacing: -0.4}}>Doctor Access (Read Only)</h2>
        <p style={{marginTop: 8, marginBottom: 18, color: "#6b7280", lineHeight: 1.6 }}>
          Enter a patient’s anonymous code to view symptom + weather analytics.
        </p>

        <form onSubmit={handleSubmit} style={{display: "grid", gap:12}}>
          <label style={{ fontSize: 18, fontWeight: 700, color: "#374151" }}>Patient Code</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="CLRSYM-1A2B3C"
            style={inputStyle}
            autoCapitalize="characters"
          />

          {error && <p style={{ fontSize: 13,marginTop: 10, color: "#ef4444" }}>{error}</p>}

          <button
              style={{
                marginTop: 4,
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "12px 14px",
                borderRadius: 12,
                cursor: "pointer",
                fontWeight: 800,
                boxShadow: "0 12px 30px rgba(37,99,235,0.25)",
              }}
            type="submit"
            disabled={loading}
          >
            {loading ? "Checking..." : "View Dashboard"}
          </button>
        </form>

        </div>


        <p style={{ marginTop: 14, fontSize: 13, opacity: 0.7 }}>
          Read-only access: logging and editing are disabled. No personal
          identifiers are stored in ClearSYM.
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "90%",
  marginTop: 6,
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  outline: "none",
  fontSize: 14
};

