import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function formatName(name) {
  return name.trim().toLowerCase().split(" ").filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

async function hashPassword(password) {
  const enc = new TextEncoder().encode(password);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0")).join("");
}


export default function Profile() {
    const nav = useNavigate();
    const email = useMemo(
        () => (localStorage.getItem("clearsym_user_email") || "").trim().toLowerCase(),
        []
    );
    const [name, setName] = useState(localStorage.getItem("clearsym_user_name") || "");
    const [createdAt, setCreatedAt] = useState("");
    const [success, setSuccess] = useState("");
    const [nameError, setNameError] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pwError, setPwError] = useState("");
    const [pwSuccess, setPwSuccess] = useState("");

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
        const users = JSON.parse(localStorage.getItem("clearsym_users") || "{}");
        const user = users[email]; 
        setCreatedAt(user?.createdAt || "")}, [email]
    );

    const save = () => {
        setNameError("");
        setSuccess("");

        const formatted = formatName(name);
        if (!formatted) return setNameError("Name is required.");


        const users = JSON.parse(localStorage.getItem("clearsym_users") || "{}");

        localStorage.setItem("clearsym_users", JSON.stringify(users));
        localStorage.setItem("clearsym_user_name", formatted);

        setSuccess("Saved!");
        setTimeout(() => setSuccess(""), 1500);
    };

    const niceDate = createdAt ? new Date(createdAt).toLocaleString() : "—";
    
    const changePassword = async () => {
    setPwError("");
    setPwSuccess("");
    const currentHash = await hashPassword(currentPassword.trim());
    const newHash = await hashPassword(newPassword.trim());

    if (!currentPassword) return setPwError("Current password is required.");
    if (!newPassword || newPassword.length < 6) return setPwError("New password must be at least 6 characters.");
    if (newPassword !== confirmPassword) return setPwError("Passwords do not match.");

    const users = JSON.parse(localStorage.getItem("clearsym_users") || "{}");
    const user = users[email];
    if (!user) return setPwError("Account not found. Please sign in again.");

    const storedHash = user.passwordHash || user.passHash; // ✅ supports old accounts too

    if (!storedHash) return setPwError("No password found for this account. Please re-create the account (demo auth).");


    if (storedHash !== currentHash) return setPwError("Current password is incorrect.");

  

    users[email] = { ...user, passwordHash: newHash };
    delete users[email].passHash; // added clean up
    localStorage.setItem("clearsym_users", JSON.stringify(users));

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setPwSuccess("Password updated!");
    setTimeout(() => setPwSuccess(""), 1500);
    };

    return (
    <div className="page" style={{ padding: 20 }}>
      <div style={{ maxWidth: 720, margin:"0 auto", position:"relative", zIndex:0, marginTop: 60}}>
        <div style={{ display:"flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap"}}>
          <div>
            <div style={pill}><span style={{width:8, height:8, borderRadius: 100, background: "#2563eb"}}/>Profile</div>
            <h1 style={{ margin: "8px 0 0", fontSize: 28, fontWeight: 900, letterSpacing: -0.4 }}>
              Account settings
            </h1>
            <div style={{ marginTop: 6, color: "#6b7280" }}>
              Update your display name and view your account info.
            </div>
          </div>
          <div style={{ display: "flex", gap: 15, alignItems: "center" }}>
            <button 
            style={{
                background: "white",
                border: "1px solid #bdd0f6",
                padding: "12px 12px",
                borderRadius: 12,
                cursor: "pointer",
                fontWeight: 800,
                color: "#111827",
                }} 
                onClick={() => nav("/dashboard")} type="button">
                Back to dashboard
            </button>
          </div>
        </div>

        <div style={{ marginTop: 16, background: "#fbfbfc", border: "1px solid #e5e7eb", borderRadius: 18, padding: 18, boxShadow: "0 16px 45px rgba(0,0,0,0.06)", marginTop: 40 }}>
          {success && (
            <div style={{ marginBottom: 12, fontSize: 14, background: "#dcfce7", border: "1px solid #86efac", color: "#166534", padding: "10px 14px", borderRadius: 12, fontWeight: 700 }}>
              {success}
            </div>
          )}
          <div style={{ display: "grid", gap: 14 }}>
         

            <div style={{marginTop:19}}>
              <label style={{ fontWeight: 800, color: "#374151"}}>Display name</label>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError("");
                }}
                placeholder="Your name"
                style={{...inputStyle, marginTop: 12}}
              />
              {nameError && <p style={{ color:"#ef4444", fontWeight:600, marginTop:8 }}>{nameError}</p>}
              <div style={{ marginTop: 6, fontSize: 12, color: "#9ca3af" }}>
                This is what shows on the dashboard greeting.
              </div>
            </div>
            
            <div style={{ display: "grid", gap: 6, padding: 14, borderRadius: 14, background: "#f9fafb", border: "1px solid #e5e7eb" }}>
              <div style={{ fontWeight: 900 }}>Sign up info</div>
              <div style={{ fontSize: 14, color: "#6b7280" }}>
                <b>Created:</b> {niceDate}
              </div>
                <label style={{ fontWeight: 800, color: "#374151", marginTop:15 }}>Email</label>
                <input
                    value={email}
                    readOnly
                    style={{...inputStyle, background: "#07070715", color: "#1b191970"}}
                />
                <div style={{marginTop: 12}}>
                    <hr style={{height: 1, background: "#a09e9e"}} />
                </div>
               {/* password form */}
                <div style={{ fontWeight: 900, marginTop: 6, marginBottom: 8, color:"#374151"  }}>Change password</div>
                {pwSuccess && (
                    <div style={{
                        marginBottom: 10,
                        background: "#dcfce7",
                        border: "1px solid #86efac",
                        color: "#166534",
                        padding: "10px 12px",
                        borderRadius: 12,
                        fontWeight: 700, 
                        fontSize: 14}}
                    >
                    {pwSuccess}
                    </div>
                )}

                {pwError && (
                    <div
                    style={{
                        marginBottom: 10,
                        background: "#fee2e2",
                        border: "1px solid #fecaca",
                        color: "#991b1b",
                        padding: "10px 12px",
                        borderRadius: 12,
                        fontWeight: 700,
                        fontSize: 14
                    }}
                    >
                    {pwError}
                    </div>
                )}

                {/* current password */}
                <div style={{ position: "relative", marginTop: 8 }}>
                    <label style={{ fontWeight: 800, color: "#374151", fontSize: 17}}>Current password</label>
                    <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => {setCurrentPassword(e.target.value); 
                        setPwError("");
                    }}
                    style={inputStyle}
                    placeholder="Enter current password"
                    />
                    <button
                    type="button"
                    onClick={() => setShowCurrent((v) => !v)}
                    style={showPassBtn}>
                    {showCurrent ? "Hide" : "Show"}
                    </button>
                </div>

                {/* New password */}
                <div style={{ position: "relative", marginTop: 12 }}>
                    <label style={{ fontWeight: 800, color: "#374151", fontSize: 17}}>New password</label>
                    <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                        setNewPassword(e.target.value);
                        setPwError("");
                    }}
                    style={inputStyle}
                    placeholder="At least 6 characters"
                    />
                    <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    style={showPassBtn}>
                    {showNew ? "Hide" : "Show"}
                    </button>
                </div>

                {/* Confirm */}
                <div style={{ position: "relative", marginTop: 12 }}>
                    <label style={{ fontWeight: 800, color: "#374151", fontSize: 17 }}>Confirm new password</label>
                    <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setPwError("");
                    }}
                    style={inputStyle}
                    placeholder="Re-enter new password"
                    />
                    <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    style={showPassBtn}
                    >
                    {showConfirm ? "Hide" : "Show"}
                    </button>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
                    <button className="btnDanger" type="button" onClick={changePassword}>
                    Update password
                    </button>
                </div>         
            </div>
             

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button className="btnSec" type="button" onClick={() => setName(localStorage.getItem("clearsym_user_name") || "")}>
                Reset
              </button>
              <button
                type="button"
                style={{
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  padding: "10px 14px",
                  borderRadius: 12,
                  cursor: "pointer",
                  fontWeight: 800,
                  boxShadow: "0 12px 30px rgba(37,99,235,0.18)",
                }}
                onClick={save}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const showPassBtn = {
    position: "absolute",
    right: 10,
    top: "calc(50% + 14px)",
    transform: "translateY(-50%)",
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: "6px 10px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 12,
    color: "#111827",
}

const inputStyle = {
    width: "100%",
    marginTop: 8,
    padding: "10px 44px 10px 12px",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    outline: "none",
    boxSizing: "border-box",
    background: "#060c4206"
}

const pill = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid #2563eb38",
    background: "#2563eb1a",
    color: "#1d4ed8",
    fontSize: 13,
    fontWeight: 800,    
}