import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const authed = localStorage.getItem("clearsym_authed") === "true";

  const navStyle = {
    background: "white",
    borderBottom: "1px solid #e5e7eb",
    padding: "14px 24px",
    position: "sticky",
    top: 0,
    zIndex: 100,
    backdropFilter: "blur(6px)",
  };

  const container = {
    maxWidth: 1200,
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const linkStyle = (path) => ({
    textDecoration: "none",
    fontWeight: 600,
    color: location.pathname === path ? "#2563eb" : "#374151",
    padding: "6px 10px",
    borderRadius: 8,
  });

  return (
    <div style={navStyle}>
      <div style={container}>
        {/* logo */}
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: "#2563eb",
              boxShadow: "0 8px 20px rgba(37,99,235,0.25)",
            }}
          />
          <span style={{ fontWeight: 900, color: "#111827" }}>ClearSYM</span>
        </Link>

        {/* links */}
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>


          {authed && (
            <>
            <Link to="/dashboard" style={linkStyle("/dashboard")}>
              Dashboard
            </Link>

            <Link to={"/profile"} style={linkStyle("/profile")}>
            Profile
            </Link>
            </>
          )}

          {!authed ? (
            <>
              <Link to="/" style={linkStyle("/")}>
                Home
              </Link>

              <Link to="/doctor" style={linkStyle("/doctor")}>
                Doctor Portal
              </Link>
              <Link to="/signin" style={linkStyle("/signin")}>
                Sign In
              </Link>
              <Link to="/signup">
                <button
                  style={{
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: 10,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Get Started
                </button>
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                localStorage.removeItem("clearsym_authed");
                localStorage.removeItem("clearsym_user_email");
                localStorage.removeItem("clearsym_user");
                window.location.href = "/";
              }}
              style={{
                background: "#5555556b",
                border: "1px solid #bfbbd8",
                padding: "8px 14px",
                borderRadius: 10,
                cursor: "pointer",
                fontWeight: 600,
                color: "black"
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}