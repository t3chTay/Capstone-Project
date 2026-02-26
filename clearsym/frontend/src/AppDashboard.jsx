import {useEffect , useState } from "react";
import { getSymptoms, updateSymptom, deleteSymptom } from "./api/symptoms";
import { createPatientCode } from "./api/patientCodes";
import SymptomForm from "./components/SymptomForm";
import EditSymptom from "./components/EditSymptom";
import PressureChart from "./components/charts/PressureSeverityChart";
import SeverityTempChart from "./components/charts/SeverityTempChart";
import DailyFrequencyChart from "./components/charts/DailyFrequencyChart";
import ConditionPie from "./components/charts/ConditionPie";
import {getFoodLogs} from "./api/foodLogs";
import FoodLogForm from "./components/FoodLogForm";
import FoodLogList from "./components/FoodLogList"
import FoodSeverityInsights from "./components/FoodSeverityInsights";
import ParticlesBackground from "./components/ParticleBg";
// console.log("deleteSymptom import:", deleteSymptom);

function AppDashboard({mode = "patient"}) {
    const [symptoms, setSymptoms] = useState([]);
    const [range, setRange] = useState("7"); // for data range filtering
    const [editing, setEditing] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [foodLogs, setFoodLogs] = useState([]);
    const [activeTab, setActiveTab] = useState("overview");
    const [successMessage, setSuccessMessage] = useState("");
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    // const [patientCode, setPatientCode] = useState(localStorage.getItem("patientCode") || "");
    const email = (localStorage.getItem("clearsym_user_email") || "guest").toLowerCase();
    const codeStorageKey = mode === "doctor" ? "clearsym_doctor_code" : `clearsym_patient_code_${email}`;
    const [patientCode, setPatientCode] = useState(() => {
        return localStorage.getItem(codeStorageKey) || "";
    });

    const validatePatientCode = async(code) => {
        try {
            const res = await fetch(`http://localhost:5001/api/patient-codes/validate?patient_code=${encodeURIComponent(code)}`);
            return  res.ok;
        } catch {
            return false;
        }
    };


    useEffect(() => {
        if (mode === "doctor") return;

        (async() => {
            if (patientCode) {
                const ok = await validatePatientCode(patientCode);
                if (ok) return;

                localStorage.removeItem(codeStorageKey);
                setPatientCode("");
                return;
            }

            try {
                const res = await createPatientCode();
                const code = res.data.code;
                setPatientCode(code);
                localStorage.setItem(codeStorageKey, code);
            } catch (err) {
                console.error("Failed to create patient code:", err)
            }
        }) ();
    }, [patientCode, mode]);




    useEffect(() => {
        const stored = localStorage.getItem(codeStorageKey) || "";
        if (stored !== patientCode) setPatientCode(stored);
    }, [codeStorageKey, patientCode]);
    


    const fetchSymptoms = () => {
        if (!patientCode) return;
        getSymptoms(patientCode)
            .then((res) => setSymptoms(res.data))
            .catch((err) => console.error(err));
    };


    const fetchFoodLogs = async () => {
        if (!patientCode) return;
        try {
            const res = await getFoodLogs(patientCode); 
            setFoodLogs(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!patientCode) return;
        fetchSymptoms();
        fetchFoodLogs();
    }, [patientCode])
    
    const totalLogs = symptoms.length;
    const averageSeverity = totalLogs === 0 ? 0 : (symptoms.reduce((sum,s) => sum + (Number(s.severity) || 0), 0) / totalLogs).toFixed(1);

    const mostCommonCondition = (() => {
        if (totalLogs === 0) return "Not enough data";
        const counts = symptoms.reduce((acc, s) => {
            const key = s.weather_condition || "unknown";
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(counts).sort((a,b) => b[1] - a[1])[0][0];
    }) ();

    const filteredSymptoms = (() => {
        if (range === "all") return symptoms;

        const days = Number(range);
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);

        return symptoms.filter((s) => new Date(s.created_at) >= cutoff)
    })();

    
    // weather trigger insights
    const triggerInsight = (() => {
            const logs = filteredSymptoms ?? [];

            if (logs.length < 3) return "Not enough data yet — log at least 3 symptoms to generate insights.";

            const buckets = {};
            for (const s of logs) {
                const condition = s.weather_condition || "Unknown";
                const sev = Number(s.severity);

                if (!Number.isFinite(sev)) continue;

                if (!buckets[condition]) buckets[condition] = { total: 0, count: 0 };
                buckets[condition].total += sev;
                buckets[condition].count += 1;
            }

            const ranked = Object.entries(buckets)
                .map(([condition, v]) => ({
                condition,
                avg: v.count ? v.total / v.count : 0,
                count: v.count,
                }))
                .filter((x) => x.count > 0)
                .sort((a, b) => b.avg - a.avg);

            if (ranked.length === 0) return "Not enough valid severity data to generate insights.";

            const top = ranked[0];
            return `Your highest average severity occurs during ${top.condition} conditions (avg ${top.avg.toFixed(
                1
            )} over ${top.count} logs). Consider taking preventative measures during these conditions to avoid symptom flare-ups.`;
            })();

    const openEdit = (symptom) => {
        setEditing(symptom);
        setIsModalOpen(true);
    };

    const closeEdit = () => {
        setIsModalOpen(false);
        setEditing(null);
    };

    const saveEdit = async (payload) => {
        await updateSymptom(editing.id, payload);
        closeEdit();
        fetchSymptoms();
    };

    const h1 = {fontSize: 32,fontWeight: 900,letterSpacing: -0.6,};

    const sub = {marginTop: 6,color: "#6b7280",lineHeight: 1.6,};

    const sectionTitle = {marginTop: 24, marginBottom: 12,fontSize: 16,fontWeight: 900, letterSpacing: -0.2,};

    const ui = {
        page: {
            position: "relative",
            minHeight: "100vh",
            zIndex: 0,
            background: "transparent"
        },
        shell: { position:"relative", maxWidth: 1200, margin: "0 auto", padding: "28px 20px 60px" },
        card: {
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: 18,
            padding: 18,
            boxShadow: "0 14px 40px rgba(0,0,0,0.06)",
        },
        softCard: {
            background:"white" ,
            border: "1px solid #e5e7eb",
            borderRadius: 18,
            padding: 18,
            boxShadow: "0 10px 26px rgba(0,0,0,0.05)",
        },
        pill: {
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
        },
        statLabel: { fontSize: 12, color: "#6b7280", fontWeight: 700 },
        statValue: { fontSize: 34, fontWeight: 900, marginTop: 6, letterSpacing: -0.6 },
    };

    const openDeleteConfirm = (symptom) => {
        console.log("openDeleteConfirm ->", symptom);
        setDeleteTarget(symptom);
        setIsDeleteOpen(true)
    }

    const closeDeleteConfirm = () => {
        setIsDeleteOpen(false);
        setDeleteTarget(null);
    }

    const confirmDelete = async () => {
        if (!deleteTarget) return;

        const id = deleteTarget.id;

        setDeletingId(id);

        setTimeout(async () => {
            try {
                await deleteSymptom(id);

                setSymptoms((prev) => prev.filter((s) => s.id !== id));
            } catch (err) {
                console.error("Delete failed:", err);
            } finally {
                setDeletingId(null);
                closeDeleteConfirm();
            }
        }, 180);
    };
    useEffect(() => {
        console.log("isDeleteOpen:", isDeleteOpen, "deleteTarget:", deleteTarget);
    }, [isDeleteOpen, deleteTarget]
);

    const userName = localStorage.getItem("clearsym_user_name") || "";


   const selectStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    background: "#f9fafb",
    fontSize: 14,
    fontWeight: 600,
    outline: "none",
    appearance: "none",  
    WebkitAppearance: "none",
    MozAppearance: "none",
    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",    
} 

    return (        
        <div style={{...ui.page, background: "radial-gradient(circle at top left, rgba(37,99,235,0.08), transparent 40%)"
}}>
            <div style={ui.shell}>

                {/* HEADER */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                    <div>
                        <div style={ui.pill}><span style={{width:8, height:8, borderRadius: 100, background: "#2563eb"}}/>Dashboard</div>
                        {userName && (
                            <div style={{fontSize: 55, fontWeight: 700, color: "#6b7280", marginBottom: 6}}>
                                Hello, <span style={{color: "#111827"}}>{userName}</span>
                            </div>
                        )}

                        <div style={sub}>Track symptoms, weather context, and food triggers — then visualize patterns.</div>
                        <div style={{display:"flex", gap:12, marginTop:20, marginBottom:20}}>
                        {(mode === "doctor" ? ["overview", "analytics"].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)}
                                style={{
                                    background: activeTab === tab ? "#2564eb" : "#d3d0e4",
                                    color: activeTab === tab ? "white" : "#111827",
                                    border: activeTab === tab ? "1px solid transparent" : "1px solid #c4c1d4",
                                    padding: "8px 14px",
                                    borderRadius: 8,
                                    cursor: "pointer",
                                    textTransform: "capitalize",
                                }}>
                                    {tab}

                            </button>
                        )) : ["overview", "log", "analytics"].map(tab =>(
                            <button key={tab} onClick={() => setActiveTab(tab)}
                                style={{
                                    background: activeTab === tab ? "#2563eb" : "#d3d0e4",
                                    color: activeTab === tab ? "white" : "#111827",
                                    border: activeTab === tab ? "1px solid transparent" : "1px solid #c4c1d4",
                                    padding: "8px 14px",
                                    borderRadius: 8,
                                    cursor: "pointer",
                                    textTransform: "capitalize",
                                }}>{tab}
                          </button>
                        )))}
                        </div>    
                        <div>
                            {successMessage && (
                            <div
                                style={{
                                background: "#dcfce7",
                                border: "1px solid #86efac",
                                color: "#166534",
                                padding: "10px 14px",
                                borderRadius: 12,
                                marginTop: 16,
                                marginBottom: 10,
                                fontWeight: 600,
                                maxWidth: 420,
                                }}
                            >
                                {successMessage}
                            </div>
                            )}
                                            
                        </div>
                    </div>
                </div>

                {/* OVERVIEW TAB */}
                {activeTab === "overview" && (
                    <>
                    < hr/>
                    {/* patient session card */}
                    <div style={{ ...ui.card, padding: 20 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                            <div>
                            <div style={ui.pill}>{mode === "doctor" ? "Viewing Patient Code" : "Doctor Access Code"}</div>
                            <div style={{ marginTop: 10, fontSize: 26, fontWeight: 900, letterSpacing: -0.6 }}>
                                {patientCode || "Generating…"}
                            </div>
                            <div style={{ marginTop: 6, color: "#6b7280", lineHeight: 1.6 }}>
                                {mode === "doctor" ? "Read-only access"
                                : "Share this code with your clinician for read-only access to charts and history."}
                            </div>
                            </div>

                            {mode !== "doctor" && (
                                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                    <button
                                        onClick={() => {
                                        localStorage.removeItem(codeStorageKey);
                                        setPatientCode("");
                                        }}
                                        style={{
                                        background: "white",
                                        border: "1px solid #e5e7eb",
                                        padding: "10px 12px",
                                        borderRadius: 12,
                                        cursor: "pointer",
                                        fontWeight: 800,
                                        color: "#111827",
                                        }}
                                    >
                                        New Session
                                    </button>
                                </div>
                            )}
                            {mode === "doctor" && (
                                <div style={{display: "flex", gap:10, alignItems: "center"}}>

                                <button
                                    onClick={() => {
                                        localStorage.removeItem("clearsym_doctor_code");
                                        window.location.href = "/doctor";
                                    }}
                                    style={{
                                        background: "#290382",
                                        border: "none",
                                        color: "white",
                                        padding: "15px 12px",
                                        borderRadius: 12,
                                        cursor: "pointer",
                                        fontWeight: 800,
                                    }}
                                >
                                    Exit Doctor View
                                </button>
                                </div>
                            )}
                        </div>
                        </div>

                        {/* Stats row */}
                        <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                            gap: 16,
                            marginTop: 16,
                        }}
                        >
                        <div style={ui.softCard}>
                            <div style={ui.statLabel}>Total Logs</div>
                            <div style={ui.statValue}>{totalLogs}</div>
                            <div style={{ marginTop: 4, color: "#9ca3af", fontSize: 12 }}>Symptoms recorded</div>
                        </div>

                        <div style={ui.softCard}>
                            <div style={ui.statLabel}>Average Severity</div>
                            <div style={ui.statValue}>{averageSeverity}</div>
                            <div style={{ marginTop: 4, color: "#9ca3af", fontSize: 12 }}>Across selected range</div>
                        </div>

                        <div style={ui.softCard}>
                            <div style={ui.statLabel}>Most Common Condition</div>
                            <div style={{ ...ui.statValue, fontSize: 22, marginTop: 10 }}>{mostCommonCondition}</div>
                            <div style={{ marginTop: 14, color: "#9ca3af", fontSize: 12 }}>Weather context</div>
                        </div>
                        </div>

                        {/* Trigger insight callout */}
                        <div
                        style={{
                            marginTop: 16,
                            borderRadius: 18,
                            padding: 18,
                            background: "linear-gradient(135deg, #2563eb24, #ffffffcc)",
                            border: "1px solid #2563eb2e",
                            boxShadow: "0 14px 40px #0000000f",
                        }}
                        >
                        <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 800 }}>Trigger Insights</div>
                        <div style={{ marginTop: 8, fontSize: 16, fontWeight: 800, lineHeight: 1.5, color: "#111827" }}>
                            {triggerInsight}
                        </div>

                        <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <div style={ui.pill}>🌦️ Weather-aware</div>
                            <div style={ui.pill}>🍽️ Food-aware</div>
                            <div style={ui.pill}>📈 Trends</div>
                        </div>
                    </div>
                    <div style={{...ui.softCard, marginTop: 16, background: "linear-gradient(135deg, #ffffffcc, #255aeb24"}}>
                       <FoodSeverityInsights patientCode={patientCode} /> 
                    </div>
                    
                    </>
                )}
            

                {/* LOG & TRACKING SECTION */}
                {activeTab === "log" && mode !== "doctor" && (
                    <>
                    < hr/>
                        <div style={{ marginTop: 4, color: "#6b7280", lineHeight: 1.6 }}>
                        Log symptoms and meals to build stronger insights over time.
                            </div>

                            {/* forms row */}
                            <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                                gap: 16,
                                marginTop: 16,
                            }}
                            >
                            <div style={ui.card}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div>
                                    <div style={ui.pill}>📝 Symptom Log</div>
                                    <div style={{ marginTop: 8, fontWeight: 900, fontSize: 16 }}>Log a symptom</div>
                                    <div style={{ marginTop: 4, color: "#6b7280", fontSize: 13 }}>
                                    Severity + notes + weather context
                                    </div>
                                </div>
                                </div>

                                <div style={{ marginTop: 14 }}>
                                <SymptomForm onNewSymptom={fetchSymptoms} patientCode={patientCode} />
                                </div>
                            </div>

                            <div style={ui.card}>
                                <div>
                                <div style={ui.pill}>🍽️ Food Log</div>
                                <div style={{ marginTop: 8, fontWeight: 900, fontSize: 16 }}>Log a meal</div>
                                <div style={{ marginTop: 4, color: "#6b7280", fontSize: 13 }}>
                                    Flag suspected triggers
                                </div>
                                </div>

                                <div style={{ marginTop: 14 }}>
                                <FoodLogForm patientCode={patientCode} onLogged={fetchFoodLogs} />
                                </div>
                            </div>
                            </div>

                            {/* Lists row */}
                            <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
                                gap: 16,
                                marginTop: 16,
                            }}
                            >
                            <div style={ui.card}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                                <div>
                                    <div style={ui.pill}>📋 Symptoms</div>
                                    <div style={{ marginTop: 8, fontWeight: 900, fontSize: 16 }}>Recent symptom entries</div>
                                    <div style={{ marginTop: 4, color: "#6b7280", fontSize: 13 }}>
                                    Edit or delete logs anytime
                                    </div>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 800 }}>Showing:</span>

                                        <select
                                            value={range}
                                            onChange={(e) => setRange(e.target.value)}
                                            style={selectStyle}
                                        >
                                            <option value="7">Last 7 days</option>
                                            <option value="30">Last 30 days</option>
                                            <option value="all">All time</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ marginTop: 14 }}>
                                {filteredSymptoms.length === 0 ? (
                                    <div style={{ color: "#6b7280" }}>No symptom logs yet.</div>
                                ) : (
                                    filteredSymptoms.map((s) => (
                                    <div
                                        key={s.id}
                                        className={`symptomCard ${deletingId === s.id ? "deleting" : ""}`}
                                        style={{
                                        border: "1px solid #e5e7eb",
                                        borderRadius: 14,
                                        padding: 14,
                                        marginBottom: 10,
                                        background: "#f9fafb",
                                        borderLeft: Number(s.severity) >= 8 ? "6px solid #ef7a7a" : "6px solid transparent",
                                        }}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                                        <div style={{ fontWeight: 900 }}>
                                            {s.symptom_type}<span style={{ color: "#6b7280", fontWeight: 800 }}> • Sev {s.severity}</span>
                                        </div>
                                        <div style={{ fontSize: 12, color: "#6b7280" }}>
                                            {s.created_at ? new Date(s.created_at).toLocaleString() : ""}
                                        </div>
                                        </div>

                                        <div style={{ marginTop: 8, color: "#374151", fontSize: 13, lineHeight: 1.6 }}>
                                        <b>Weather:</b> {s.weather_condition || "Unknown"} · <b>Temp:</b> {s.temperature ?? "—"}°C ·{" "}
                                        <b>Pressure:</b> {s.pressure ?? "—"} hPa · <b>Humidity:</b> {s.humidity ?? "—"}%
                                        </div>

                                        {s.notes ? (
                                        <div style={{ marginTop: 8, color: "#6b7280", fontSize: 13 }}>
                                            <b>Notes:</b> {s.notes}
                                        </div>
                                        ) : null}

                                        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                                        <button className="btnSec"
                                            onClick={() => openEdit(s)}
                                        >
                                            Edit
                                        </button>

                                        <button className="btnDanger"
                                            onClick={() => {
                                                console.log("clicked delete", s); 
                                            openDeleteConfirm(s);
                                            }}>
                                            Delete 🗑️
                                        </button>
                                        </div>
                                    </div>
                                    ))
                                )}
                                </div>
                            </div>

                            <div style={ui.card}>
                                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                                    <div>
                                        <div style={ui.pill}>🍲 Food History</div>
                                        <div style={{ marginTop: 8, fontWeight: 900, fontSize: 16 }}>Logged foods</div>
                                        <div style={{ marginTop: 4, color: "#6b7280", fontSize: 13 }}>
                                        Triggers help highlight patterns
                                        </div>
                                    </div>

                                    <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 800 }}>
                                        Total: <span style={{ color: "#111827" }}>{foodLogs.length}</span>
                                    </div>
                                </div>

                                

                                <div
                                    style={{
                                        marginTop: 16,
                                        padding: 16,
                                        borderRadius: 16,
                                        background: "linear-gradient(135deg, rgba(239,68,68,0.06), rgba(255,255,255,0.9))",
                                        border: "1px solid rgba(239,68,68,0.18)",
                                        borderLeft: "6px solid #fa7676",
                                        boxShadow: "0 10px 24px rgba(0,0,0,0.05)",
                                    }}
                                >
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                                    <div style={{ fontWeight: 900 }}>⚠️ Possible Triggers</div>
                                        <span
                                            style={{
                                                fontSize: 12,
                                                fontWeight: 800,
                                                padding: "4px 10px",
                                                borderRadius: 999,
                                                background: "rgba(239,68,68,0.12)",
                                                color: "#d55454",
                                            }}
                                        >
                                    {foodLogs.filter((l) => l.suspected_trigger).length} flagged
                                    </span>
                                </div>

                                {foodLogs.filter((l) => l.suspected_trigger).length === 0 ? (
                                    <p style={{ color: "#6b7280", marginTop: 8, lineHeight: 1.6 }}>
                                    No suspected triggers logged yet. Mark foods as suspected triggers when you notice flare-ups.
                                    </p>
                                ) : (
                                    <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                                    {foodLogs
                                        .filter((f) => f.suspected_trigger)
                                        .map((f) => (
                                        <span
                                            key={f.id}
                                            style={{
                                            padding: "6px 10px",
                                            borderRadius: 999,
                                            border: "1px solid rgba(239,68,68,0.22)",
                                            background: "rgba(239,68,68,0.08)",
                                            color: "#7f1d1d",
                                            fontSize: 12,
                                            fontWeight: 800,
                                            }}
                                        >
                                            {f.food_name}
                                        </span>
                                        ))}
                                    </div>
                                )}
                                </div>

                                <div style={{marginTop: 16, height: 1, background: "#d2d4d7"}}></div>
                                <div style={{ marginTop: 14 }}>
                                <FoodLogList logs={foodLogs} patientCode={patientCode} onDeleted={fetchFoodLogs} />
                                </div>

                            </div>
                        </div>
                    </>
                )}
                
                
               
                {/* ANALYTICS SECTION */}
                {activeTab === "analytics" && (
                    <> 
                    < hr/>
                        <div style={{ marginTop: 4, color: "#6b7280", lineHeight: 1.6 }}>
                        Visualize patterns across weather, severity, frequency, and food triggers.
                        </div>

                        {/* Insights row */}
                        <div style={{ marginTop: 16 }}>
                        <div style={{...ui.card,  background: "linear-gradient(135deg, #ffffffcc, #255aeb24"}}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                            <div>
                                <div style={ui.pill}>📊 Insights</div>
                                <div style={{ marginTop: 8, fontWeight: 900, fontSize: 16 }}>Food ↔ Severity Correlation</div>
                                <div style={{ marginTop: 4, color: "#6b7280", fontSize: 13 }}>
                                Helps identify foods commonly associated with higher symptom severity.
                                </div>
                            </div>
                            <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 800 }}>
                                Session: <span style={{ color: "#111827" }}>{patientCode || "—"}</span>
                            </div>
                            </div>

                            <div style={{ marginTop: 14 }}>
                            <FoodSeverityInsights patientCode={patientCode} />
                            </div>
                        </div>
                        </div>
                        <div style={{ marginTop: 12, height: 1, background: "#f1f5f9"}}>
                            {/* Charts grid */}
                            <div
                            style={{
                                marginTop: 16,
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
                                gap: 16,
                            }}
                            >
                            <div style={{...ui.card, background: "#f9fafb"}}>
                                <ChartHeader title="Pressure vs Severity" subtitle="How barometric pressure relates to symptom intensity" />
                                <div style={{ marginTop: 12 }}>
                                <PressureChart data={filteredSymptoms} />
                                </div>
                            </div>

                            <div style={{...ui.card, background: "#f9fafb"}}>
                                <ChartHeader title="Severity vs Temperature" subtitle="Symptom severity plotted against temperature" />
                                <div style={{ marginTop: 12 }}>
                                <SeverityTempChart patientCode={patientCode} />
                                </div>
                            </div>

                            <div style={{...ui.card, background: "#f9fafb"}}>
                                <ChartHeader title="Daily Symptom Frequency" subtitle="Number of symptoms logged per day" />
                                <div style={{ marginTop: 12 }}>
                                <DailyFrequencyChart patientCode={patientCode} />
                                </div>
                            </div>

                            <div style={{...ui.card, background: "#f9fafb"}}>
                                <ChartHeader title="Condition Breakdown" subtitle="Distribution of symptoms by weather condition" />
                                <div style={{ marginTop: 12 }}>
                                <ConditionPie patientCode={patientCode} />
                                </div>
                            </div>
                            </div>

                            {/* Small footer note */}
                            <div style={{ marginTop: 14, fontSize: 12, color: "#9ca3af" }}>
                            Tip: Insights improve as you log more symptoms and food entries over multiple days.
                            </div>
                        </div>
                    </>
                )}
            </div>
            {/* edit */}
            {isModalOpen && editing && (
                <EditSymptom
                    open={isModalOpen}
                    symptom={editing}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditing(null);
                    }}
                    onSave={async (payload) => {
                        try {
                            await updateSymptom(editing.id, payload);
                            fetchSymptoms(); 
                            setIsModalOpen(false);
                            setEditing(null);

                            setSuccessMessage("Symptom updated successfully!");
                            setTimeout(() => setSuccessMessage(""), 2000);
    
                        } catch (err) {
                            console.error("Update failed:", err);
                        }
                        
                    }}
                />
            )}
            {isDeleteOpen && (
            <div
                onClick={closeDeleteConfirm}
                style={{
                position: "fixed",
                inset: 0,
                background: "#11182773",
                backdropFilter: "blur(6px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 20,
                zIndex: 9999,
                }}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                        style={{
                            width: "100%",
                            maxWidth: 420,
                            background: "white",
                            borderRadius: 18,
                            padding: 22,
                            boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
                        }}
                        >
                        <h3 style={{ marginTop: 0 }}>Delete Symptom?</h3>
                        <p style={{ color: "#6b7280", marginTop: 6, lineHeight: 1.5 }}>
                            This will permanently delete <b>{deleteTarget?.symptom_type}</b> (severity {deleteTarget?.severity}).
                        </p>

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
                            <button style={{background: "#555555b4", color: "white"}} className="btnSec" onClick={closeDeleteConfirm}>Cancel</button>
                            <button className="btnDanger" onClick={confirmDelete}>Delete</button>
                        </div>
                </div>
            </div>
            )}

        </div>
    );

    function ChartHeader({ title, subtitle }) {
        return (
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                    <div style={{ fontWeight: 900, fontSize: 16 }}>{title}</div>
                    <div style={{ marginTop: 4, fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>{subtitle}</div>
                </div>

                <div
                    style={{
                    padding: "8px 10px",
                    borderRadius: 999,
                    border: "1px solid rgba(37,99,235,0.22)",
                    background: "rgba(37,99,235,0.10)",
                    color: "#1d4ed8",
                    fontSize: 12,
                    fontWeight: 800,
                    height: "fit-content",
                    }}
                >
                    Analytics
                </div>
            </div>
        );
    }

}




export default AppDashboard;

