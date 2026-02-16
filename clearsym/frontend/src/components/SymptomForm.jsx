import { useState } from "react";
import { createSymptom } from "../api";
import { formToJSON } from "axios";

export default function SymptomForm({onNewSymptom}) {
    const [symptomType, setSymptomType] = useState("");
    const [severity, setSeverity] = useState("");
    const [notes, setNotes] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!symptomType || !severity) return alert("Type and severity required");

        const data = {
            symptom_type: symptomType,
            severity: parseInt(severity),
            notes,
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
        </form>
    );
}