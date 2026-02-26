import { useState, useEffect} from "react";
import { createSymptom } from "../api/symptoms";

export default function SymptomForm({onNewSymptom, patientCode}) {
    const [symptomType, setSymptomType] = useState("");
    const [severity, setSeverity] = useState("");
    const [notes, setNotes] = useState("");
    const [coords, setCoords] = useState(null);
    const [error, setError] = useState("");
    const [time, setTime] = useState("");

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!symptomType || severity === "") return alert("Type and severity required");
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

    // ✅ send ONE payload (include timestamp)
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
                    <label style={{marginTop:8, fontWeight: 900, fontSize:16}}>Symptom Type: </label>
                    <input style={inputStyle}
                        type="text"
                        value={symptomType}
                        onChange={(e) => setSymptomType(e.target.value)}
                    />
                </div>

                <div>
                    <label style={{marginTop:8, fontWeight: 900, fontSize:16}}>Severity (1-10): </label>
                    <input style={inputStyle} 
                        type="number"
                        min="1"
                        max="10"
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value)}
                    />
                </div>

                <div>
                    <label style={{marginTop:8, fontWeight: 900, fontSize:16}}>Time</label>
                    <input style={inputStyle}
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    />  
                </div>
                

                <div>
                    <label style={{marginTop:8, fontWeight: 900, fontSize:16}}>Notes: </label>
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
  marginTop: 6,
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  outline: "none",
  fontSize: 14
};

