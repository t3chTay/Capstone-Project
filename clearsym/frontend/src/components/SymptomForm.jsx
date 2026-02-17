import { useState, useEffect} from "react";
import { createSymptom } from "../api/symptoms";
import { formToJSON } from "axios";

export default function SymptomForm({onNewSymptom}) {
    const [symptomType, setSymptomType] = useState("");
    const [severity, setSeverity] = useState("");
    const [notes, setNotes] = useState("");
    const [coords, setCoords] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!symptomType || !severity) return alert("Type and severity required");

        const data = {
            symptom_type: symptomType,
            severity: parseInt(severity),
            notes,
            ...(coords ? coords : {}),
        };

        try {
            const res = await createSymptom(data);
            onNewSymptom(res.data.symptom_id);
            setSymptomType("");
            setSeverity("");
            setNotes("");
        } catch (err) {
                console.error("FULL ERROR:", err);
                console.error("SERVER RESPONSE:", err?.response?.data);
            alert("Failed to log symptom");
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
        <form onSubmit={handleSubmit} style={{marginBottom: "20px"}}>
            <h2>Log New Symptom</h2>

            <div>
                <label>Symptom Type: </label>
                <input
                    type="text"
                    value={symptomType}
                    onChange={(e) => setSymptomType(e.target.value)}
                />
            </div>

            <div>
                <label>Severity (1-10): </label>
                <input 
                    type="number"
                    min="1"
                    max="10"
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                />
            </div>

            <div>
                <label>Notes: </label>
                <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </div>
            
            <button type="submit">Log Symptom</button>
            <p style={{fontSize: 12, color: "#666", marginTop:8}}>
                {coords ? "Using your location for weather data" : "Location not available, weather data may be less accurate"}
            </p>
        </form>
    );
}