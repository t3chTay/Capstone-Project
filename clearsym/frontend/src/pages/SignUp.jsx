import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth";

function formatName(name) {
  return name
    .trim()
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

export default function SignUp() {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef(null);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setNameError("");

    const clEmail = email.trim().toLowerCase();
    const clName = name.trim();
    const clPassword = password;

    if (!clName) return setNameError("Name required");
    if (!clEmail) return setEmailError("Email required");
    if (!/^\S+@\S+\.\S+$/.test(clEmail)) return setEmailError("Enter a valid email.");
    if (!clPassword || clPassword.length < 6) return setPasswordError("Password must be at least 6 characters.");

    try {
      const res = await register({ email: clEmail, name: clName, password: clPassword });
      const user = res.data.user;

      localStorage.setItem("clearsym_authed", "true");
      localStorage.setItem("clearsym_user_email", user.email);
      localStorage.setItem("clearsym_user_name", user.name);
      localStorage.removeItem("clearsym_users");

      nav("/dashboard");
    } catch (err) {
      const msg = err?.response?.data?.error || "Signup failed";
      if (msg.toLowerCase().includes("exists")) setEmailError(msg);
      else setPasswordError(msg);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        zIndex: 0,
        minHeight: "calc(100vh - 64px)",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "transparent",
      }}
    >
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
            Create your account
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
          <h2 style={{ margin: 0, fontSize: 26, fontWeight: 900, letterSpacing: -0.4 }}>
            Sign up for ClearSYM
          </h2>
          <p style={{ marginTop: 8, marginBottom: 18, color: "#6b7280", lineHeight: 1.6 }}>
            Start tracking symptoms, weather context, and food triggers in one dashboard today!
          </p>

          <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Name</label>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError("");
                }}
                placeholder="Your name"
                style={inputStyle}
              />
              {nameError && (
                <p style={{ marginTop: 8, color: "#ef4444", fontWeight: 600, fontSize: 14 }}>{nameError}</p>
              )}
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Email</label>
              <input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                placeholder="youremail@example.com"
                style={inputStyle}
              />
              {emailError && (
                <p style={{ marginTop: 8, color: "#ef4444", fontWeight: 600, fontSize: 14 }}>{emailError}</p>
              )}
            </div>

            <div style={{ position: "relative", marginTop: 8 }}>
              <label style={{ display: "block", fontWeight: 700, fontSize: 13, color: "#374151" }}>Password</label>
              <input
                ref={inputRef}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                placeholder="Create a password"
                style={{
                  ...inputStyle,
                  border: passwordError ? "1px solid #ef4444" : "1px solid #e5e7eb",
                  transition: "border 0.15s ease, box-shadow 0.15s ease",
                  boxShadow: passwordError ? "0 0 0 2px rgba(239, 68, 68, 0.15)" : "none",
                }}
              />
              {passwordError && (
                <p style={{ marginTop: 10, color: "#ef4444", fontWeight: 600, fontSize: 14 }}>{passwordError}</p>
              )}

              <button
                type="button"
                onClick={() => {
                  setShowPassword((v) => !v);
                  setTimeout(() => inputRef.current?.focus(), 0);
                }}
                style={showPassBtn}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button
              type="submit"
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
            >
              Create account
            </button>
          </form>

          <div style={{ marginTop: 14, fontSize: 14, color: "#6b7280" }}>
            Already have an account?{" "}
            <Link to="/signin" style={{ color: "#2563eb", fontWeight: 800, textDecoration: "none" }}>
              Sign in
            </Link>
          </div>
        </div>
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
  fontSize: 14,
};

const showPassBtn = {
  position: "absolute",
  right: "22px",
  top: "41px",
  transform: "translateY(-50%)",
  background: "#dcdce2",
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: "6px 10px",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: 12,
  color: "#111827",
};