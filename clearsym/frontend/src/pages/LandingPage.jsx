import {Link} from "react-router-dom";

export default function LandingPage() {
  const authed = localStorage.getItem("clearsym_authed") === "true";

  return (

    <div style={{
      minHeight:"100vh", 
      position: "relative",
      zIndex: 0,
      background:"-gradient(1200px 600px at 20% 10%, rgba(37, 100, 235, 0.53), transparent 60%), radial-gradient(900px 500px at 90% 20%, rgba(37,99,235,0.12), transparent 55%), linear-gradient(#f8fafc, #f3f4f6)",}}
     
    >

    {/* hero section */}
    <div style={{maxWidth: 1100, margin: "0 auto", marginTop: 67, padding: "36px 20px 10px"}}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px,1fr)",
          gap:28,
          alignItems: "center"
        }}
      >
        <div>
          <div
            style={{
              display:"inline-flex",
              gap:8,
              alignItems: "center",
              background: "#2563eb1a",
              border: "1px solid #2563eb40",
              color: "#1d4ed8",
              padding: "8px 12px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600
            }}
          >
            <span style={{width: 8, height: 8, borderRadius: 100, background: "#2563eb"}} />
            Symptom + Weather + Food insights
          </div>
          <h1
            style={{
              marginTop: 14,
              fontSize: 48,
              lineHeight: 1.05,
              letterSpacing: -1.2
            }}
          >
            See patterns in your symptoms-<span style={{color:"2563eb"}}>faster</span>.
          </h1>  
          <p style={{marginTop:45, fontSize:17, color:"#4b5563", lineHeight: 1.6, maxWidth: 620}}>
            ClearSYM helps you log symptoms, capture local weather context, track food triggers, visualize correlations- 
            so you can make smarter decisions and share clear insights with your clinician.
          </p>

          <div style={{display: "flex", gap:12, marginTop: 44, flexWrap: "wrap"}}>
            {authed ? (
              <Link to="/dashboard">
                <button
                  style={{
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    padding: "12px 16px",
                    borderRadius: 14,
                    cursor: "pointer",
                    fontWeight: 700,
                    boxShadow: "0 14px 34px rgba(37, 99, 235, 0.25)"
                  }}
                >
                  Open Dashboard
                </button>
              </Link>
            ) : (
              <>
                <Link to="/signup">
                  <button
                    style={{
                      background: "#2563eb",
                      color: "white",
                      border: "none",
                      padding: "12px 16px",
                      borderRadius: 14,
                      cursor: "pointer",
                      fontWeight: 700,
                      boxShadow: "0 14px 34px rgba(37, 99, 235, 0.25)"
                    }}
                  >
                    Create account
                  </button>
                </Link>
                <Link to="/signin">
                    <button
                      style={{
                        background: "white",
                        color: "#111827",
                        border: "1px solid #e5e7eb",
                        padding: "12px 16px",
                        borderRadius: 14,
                        cursor: "pointer",
                        fontWeight: 700
                      }}
                    >
                      Sign in
                    </button>
                </Link>
              </>
            )}

            <div style={{display: "flex", alignItems: "center", gap: 10, color: "#6b7280", fontSize:13}}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  background: "white",
                  border: "1px solid #e5e7eb",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                🔒
              </div>
              Anonymous patient codes supported
            </div>
          </div>

          {/* trust row */}
            <div style={{ marginTop: 18, display: "flex", gap: 5, flexWrap: "wrap" }}>
              {[
                { k: "Live Weather", v: "OpenWeather" },
                { k: "Analytics", v: "Charts + Trends" },
                { k: "Triggers", v: "Food + Conditions" },
              ].map((x) => (
                <div
                  key={x.k}
                  style={{
                    background: "white",
                    border: "1px solid #e5e7eb",
                    padding: "10px 12px",
                    borderRadius: 14,
                    boxShadow: "0 10px 24px rgba(0,0,0,0.04)",
                    minWidth: 160,
                  }}
                >
                  <div style={{ fontSize: 12, color: "#6b7280" }}>{x.k}</div>
                  <div style={{ fontWeight: 800, marginTop: 2 }}>{x.v}</div>
                </div>
              ))}
            </div>
        </div>

        {/* preview card ride side */}
          <div
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: 20,
              margin: 25,
              padding: 18,
              boxShadow: "0 18px 50px rgba(0,0,0,0.07)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>Today</div>
                <div style={{ fontSize: 18, fontWeight: 900, marginTop: 2 }}>Your Snapshot</div>
              </div>
              <div
                style={{
                  padding: "8px 10px",
                  borderRadius: 999,
                  background: "rgba(37,99,235,0.10)",
                  color: "#1d4ed8",
                  fontSize: 12,
                  fontWeight: 700,
                  border: "1px solid rgba(37,99,235,0.25)",
                }}
              >
                Demo Preview
              </div>
            </div>

            <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
              <PreviewRow label="Top trigger condition" value="Clear Sky (avg severity 6.7)" />
              <PreviewRow label="Most logged symptom" value="Hives" />
              <PreviewRow label="Food flagged" value="Soy ⚠️" />
              <div
                style={{
                  marginTop: 8,
                  borderRadius: 16,
                  background:
                    "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(37,99,235,0.03))",
                  border: "1px solid rgba(37,99,235,0.15)",
                  padding: 12,
                }}
              >
                <div style={{ fontSize: 12, color: "#6b7280" }}>Next step</div>
                <div style={{ fontWeight: 800, marginTop: 4 }}>
                  Log symptoms + food for 7 days to unlock stronger insights.
                </div>
              </div>
            </div>
          </div>
        </div>


        <div>
          <hr style={{marginTop: 88}}/>
        </div>
        {/* feature grid */}
        <div style={{ marginTop: 200 }}>
          <div style={{ fontWeight: 900, fontSize: 18 }}>What you can do on our app</div>
          <p style={{ marginTop: 6, color: "#6b7280", maxWidth: 720, lineHeight: 1.6 }}>
            Log → enhance accuracy with weather → analyze charts → share with clinicians.
          </p>

          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
            }}
          >
            <FeatureCard
              title="Symptom Logging"
              desc="Record symptom type, severity level, notes, and timestamps."
              icon="📋"
            />
            <FeatureCard
              title="Weather Context"
              desc="Attach live temperature, humidity, pressure and conditions."
              icon="🌦️"
            />
            <FeatureCard
              title="Food Triggers"
              desc="Track meals and suspected triggers alongside symptoms."
              icon="🍽️"
            />
            <FeatureCard
              title="Correlation Insights"
              desc="Discover foods/conditions associated with more severe symptoms."
              icon="📈"
            />
          </div>
        </div>

        {/* how it works */}
        <div style={{ marginTop: 90, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: 20,
              padding: 18,
              boxShadow: "0 14px 40px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontWeight: 900, fontSize: 18 }}>How it works</div>
            <ol style={{ marginTop: 10, color: "#4b5563", lineHeight: 1.7 }}>
              <li>Sign in and generate an anonymous patient session code.</li>
              <li>Log symptoms (severity + notes), with optional weather tracking via geo-location.</li>
              <li>Log foods and checkbox suspected triggers.</li>
              <li>Review charts & insights to observe patterns over time.</li>
            </ol>
          </div>

          <div
            style={{
              position: "relative",
              zIndex: 1,
              background: "linear-gradient(135deg, rgba(177, 197, 240, 0.73), rgb(255, 255, 255))",
              border: "1px solid rgba(37,99,235,0.18)",
              borderRadius: 20,
              padding: 18,
              boxShadow: "0 14px 40px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontWeight: 900, fontSize: 18 }}>Built for clarity</div>
            <p style={{ marginTop: 10, color: "#374151", lineHeight: 1.7 }}>
              ClearSYM is designed to make symptom history easier to understand and share with Doctors.
              Your patient code can be shown to a clinician for quick review of patterns without exposing personal identity.
            </p>

            <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Pill text="Easy-to-use theme" />
              <Pill text="Fast dashboard tabs" />
              <Pill text="Weather + Food insights" />
              <Pill text="Simple sharing" />
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div
          style={{
            marginTop: 42,
            padding: 18,
            borderRadius: 22,
            background: "#111827",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ fontSize: 18, fontWeight: 900 }}>Ready to see your patterns?</div>
            <div style={{ marginTop: 4, color: "rgba(255,255,255,0.75)" }}>
              Start logging today! Insights improve as your history grows.
            </div>
          </div>

          {authed ? (
            <Link to="/dashboard">
              <button
                style={{
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  padding: "12px 16px",
                  borderRadius: 14,
                  cursor: "pointer",
                  fontWeight: 800,
                }}
              >
                Open Dashboard
              </button>
            </Link>
          ) : (
            <Link to="/signup">
              <button
                style={{
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  padding: "12px 16px",
                  borderRadius: 14,
                  cursor: "pointer",
                  fontWeight: 800,
                }}
              >
                Create account
              </button>
            </Link>
          )}
        </div>

        <div style={{ padding: "26px 0 40px", color: "#9ca3af", fontSize: 12 }}>
          &copy; {new Date().getFullYear()} ClearSYM 
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, desc, icon }) {
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #e5e7eb",
        borderRadius: 18,
        padding: 16,
        boxShadow: "0 12px 30px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ fontSize: 22 }}>{icon}</div>
      <div style={{ marginTop: 10, fontWeight: 900 }}>{title}</div>
      <div style={{ marginTop: 6, color: "#6b7280", lineHeight: 1.55 }}>{desc}</div>
    </div>
  );
}

function PreviewRow({ label, value }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
      }}
    >
      <div style={{ color: "#6b7280", fontSize: 12 }}>{label}</div>
      <div style={{ fontWeight: 800 }}>{value}</div>
    </div>
  );
}

function Pill({ text }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.7)",
        border: "1px solid rgba(37,99,235,0.18)",
        padding: "8px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        color: "#1f2937",
      }}
    >
      {text}
    </div>
  );
}