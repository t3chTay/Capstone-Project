import {useState, useRef} from "react";
import {useNavigate, Link} from "react-router-dom";

export default function SignUp() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const inputRef = useRef(null);

  function formatName(name) {
    return name.trim().toLowerCase().split(" ").filter(Boolean).map(word => word[0].toUpperCase() + word.slice(1)).join(" ")
  }

  async function hashPassword(password) {
    const enc = new TextEncoder().encode(password);
    const buf = await crypto.subtle.digest("SHA-256", enc);
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
}

  const submit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    const clEmail = email.trim().toLowerCase();
    const clName = name.trim();
    const clPassword = password;

    if (!clName) return setNameError("Name required");
    if (!clEmail) return setEmailError("Email required");
    if (!/^\S+@\S+\.\S+$/.test(clEmail)) return setEmailError("Enter a valid email.");
    if (!clPassword || clPassword.length < 6) return setPasswordError("Password must be at least 6 characters.");

    const users = JSON.parse(localStorage.getItem("clearsym_users") || "{}");
    if (users[clEmail]) return setEmailError("An account with this email already exists.");

    const formattedName = formatName(clName);
    const passHash = await hashPassword(clPassword);

    users[clEmail] = {
      name: formattedName,
      passHash, 
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("clearsym_users", JSON.stringify(users));
    localStorage.setItem("clearsym_authed", "true");
    localStorage.setItem("clearsym_user_email", clEmail);
    localStorage.setItem("clearsym_user_name", formattedName);

    nav("/dashboard");
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
        background:"transparent"
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
            {/* sign up card */}
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
            Start tracking symptoms, weather context, and food triggers in one dashboard today !
          </p>

          <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>

            {/* name input */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Name</label>
              <input
                value={name}
                onChange={(e) => { setName(formatName(e.target.value));
                  setNameError("")
                }}
                placeholder="Your name"
                style={inputStyle}
              />
              {nameError && (
                <p style={{marginTop: 8, color: "#ef4444", fontWeight: 600, fontSize: 14,}}> {nameError}</p>
              )}
            </div>
            
          {/* email input */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Email</label>
              <input
                value={email}
                onChange={(e) => { setEmail(e.target.value);
                  setEmailError("");
                }}
                placeholder="youremail@example.com"
                style={inputStyle}
              />
              {/* error message */}
              {emailError && (
                <p style={{marginTop: 8, color: "#ef4444", fontWeight: 600, fontSize: 14,}}> {emailError}</p>
              )}
            </div>

            {/* password input */}
            <div style={{position: "relative", marginTop: 8}}>
              <label style={{display: "block", fontWeight: 700, fontSize: 13, color: "#374151"}}>Password</label>
              <input ref={inputRef} type={showPassword ? "text" : "password"} value={password} onChange={(e) => {setPassword(e.target.value);
                setPasswordError("");
                  }}
                  placeholder="Create a password"
                  style={{...inputStyle, 
                    border: passwordError ? "1px solid #ef4444" : "1px solid #e5e7eb", 
                    transition: "border 0.15s ease, box-shadow 0.15s ease", 
                    boxShadow: passwordError ? "0 0 0 2px rgba(239, 68, 68 0.15" : "none",
                  }}
              />
              {passwordError && <p 
              style={{marginTop: 10, color: "#ef4444", fontWeight:600, fontSize:14}}>{passwordError}</p>}

              <button type="button" onClick={() => {
                setShowPassword((v) => !v);
                setTimeout(() => inputRef.current?.focus(), 0);
              }} 
              style={showPassBtn}
              >
                  {showPassword ? "Hide" : "Show"}
              </button>
            </div>
              
            {/* sign up button */}
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
  background:"#dcdce2", 
  border: "1px solid #e5e7eb", 
  borderRadius: 10, 
  padding: "6px 10px", 
  cursor: "pointer", 
  fontWeight: 700, 
  fontSize: 12, 
  color: "#111827",
}