import { useState, useEffect} from "react";
import { createSymptom } from "../api/symptoms";

export default function SymptomForm({onNewSymptom, patientCode}) {
    const [symptomType, setSymptomType] = useState("");
    const [severity, setSeverity] = useState(1);
    const [notes, setNotes] = useState("");
    const [coords, setCoords] = useState(null);
    const [error, setError] = useState("");
    const [time, setTime] = useState("");

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!symptomType) return alert("Type required");
    if (!patientCode) {
        console.error("Patient code is still loading, try again in a moment");
        return;
    }

    let timestamp = null;

    if (time) {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");

    timestamp = `${yyyy}-${mm}-${dd}T${time}:00`;
    }

    
    const data = {
        patient_code: patientCode,
        symptom_type: symptomType,
        severity: parseInt(severity, 10),
        notes,
        ...(coords ? coords : {}),
        ...(timestamp ? { timestamp } : {}),
    };

    try {
        const res = await createSymptom(data);
        if (typeof onNewSymptom === "function") {
        onNewSymptom(res.data.symptom_id);
        }
        setSymptomType("");
        setSeverity("");
        setNotes("");
        setTime("");
    } catch (err) {
        console.error("SERVER RESPONSE:", err?.response?.data);
        console.error("STATUS:", err?.response?.status);
        setError(err?.response?.data?.error || err?.message || "Failed to log symptom");
    }
    };

    useEffect(() => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCoords({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                });
            },  
            (err) => {
                console.warn("Geolocation failed:", err.message);
                setCoords(null);
            }
        );
    }, []);

    return (
        <div className="card-section">
            <form onSubmit={handleSubmit} style={{marginBottom: "20px"}}>
                <div>
                    <label style={{...labelStyle, marginTop:8}}>Symptom Type: </label>
                    <input style={inputStyle}
                        type="text"
                        value={symptomType}
                        onChange={(e) => setSymptomType(e.target.value)}
                    />
                </div>
                {/* severity scale */}
                <div style={{ marginTop: 18 }}>
                <label style={labelStyle}>
                    Severity
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ fontSize: 13, color: "#9ca3af" }}>1</span>
                <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={severity}
                    onChange={(e) => setSeverity(Number(e.target.value))}
                    style={{
                        flex: 1,
                        appearance: "none",
                        height: 6,
                        borderRadius: 8,
                        background: `linear-gradient(to right, 
                        ${severity <= 3 ? "#22c55e" : 
                            severity <= 6 ? "#facc15" : "#ef4444"} 
                        ${(severity - 1) * 11.11}%, 
                        #e5e7eb ${(severity - 1) * 11.11}%)`,
                        outline: "none",
                        cursor: "pointer",
                    }}
                />
                <span
                    style={{
                        minWidth: 32,
                        textAlign: "center",
                        fontWeight: 900,
                        fontSize: 20,
                        color:
                            severity <= 3
                            ? "#16a34a"
                            : severity <= 6
                            ? "#ca8a04"
                            : "#dc2626",
                        }}
                    >
                        {severity}
                    </span>
                </div>

                    <div
                        style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 14,
                        color: "#9ca3af",
                        marginTop: 6,
                        }}
                    >
                        <span>Mild</span>
                        <span>Moderate</span>
                        <span>Severe</span>
                    </div>
                </div>
                {/* <div>
                    <label style={{marginTop:8, fontWeight: 900, fontSize:16}}>Severity (1-10): </label>
                    <input style={inputStyle} 
                        type="number"
                        min="1"
                        max="10"
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value)}
                    />
                </div> */}
                {/* Time Selection */}
                <div style={{ marginTop: 14 }}>
                <label
                    style={labelStyle}
                >
                    Time symptom occurred
                </label>

                <div
                    style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    }}
                >
                    <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => {
                        e.target.style.border = "1px solid #2563eb";
                        e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.15)";
                    }}
                    onBlur={(e) => {
                        e.target.style.border = "1px solid #e5e7eb";
                        e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.04)";
                    }}
                    />
                </div>

                <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 6, marginBottom: 14 }}>
                    Leave blank to use current time
                </div>
                </div>
                                {/* <div>
                    <label style={{marginTop:8, fontWeight: 900, fontSize:16}}>Time</label>
                    <input style={inputStyle}
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    />  
                </div> */}
                

                <div>
                    <label style={{...labelStyle, marginTop:8}}>Notes: </label>
                    <input style={inputStyle}
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>
                
                <button style={primaryButton}type="submit" disabled={!patientCode}>Log Symptom</button>
                <p style={{fontSize: 12, color: "#666", marginTop:8}}>
                    {coords ? "Using your location for weather data" : "Location not available, weather data may be less accurate"}
                </p>
                {error && <p style={{color: "red", marginTop: 8}}>{error}</p>}
            </form>
        </div>
    );
}
const primaryButton = {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: 10,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 30,
};
const inputStyle = {
    width: "90%",
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    outline: "none",
    fontSize: 14,
    background: "#f9fafb",
    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
    transition: "all 0.2s ease",
    marginTop: 15,
};
const labelStyle = {
    fontWeight: 900,
    fontSize: 17,
    color: "#374151",    
}
