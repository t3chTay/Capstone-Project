import {useState} from "react";
import {createFoodLog} from "../api/foodLogs";

export default function FoodLogForm({patientCode, onLogged}) {
    const [foodName, setFoodName] = useState("");
    const [notes, setNotes] = useState("");
    const [suspected, setSuspected] = useState(false);
    const [time, setTime] = useState("");

    const submit = async (e) => {
    e.preventDefault();
    if (!patientCode) return;
    if (!foodName.trim()) return alert("Food name required");

    let localTimestamp = null;

    if (time) {
        const now = new Date();
        const [hours, minutes] = time.split(":");
        now.setHours(Number(hours));
        now.setMinutes(Number(minutes));
        now.setSeconds(0);
        now.setMilliseconds(0);

        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const dd = String(now.getDate()).padStart(2, "0");
        const hh = String(now.getHours()).padStart(2, "0");
        const mi = String(now.getMinutes()).padStart(2, "0");

        localTimestamp = `${yyyy}-${mm}-${dd}T${hh}:${mi}:00`;
    }

    await createFoodLog(patientCode, {
        food_name: foodName.trim(),
        notes,
        suspected_trigger: suspected,
        ...(localTimestamp ? { timestamp: localTimestamp } : {}),
    });

    setFoodName("");
    setNotes("");
    setSuspected(false);
    setTime("");

        if (typeof onLogged === "function") onLogged();
    };

    return (
        <div>
            <form onSubmit={submit} style={{marginBottom: 16}}>
                <div>
                    <label style={labelStyle}>Food: </label>
                    <input style={inputStyle} value={foodName} onChange={(e) => setFoodName(e.target.value)} />
                </div>

                <div>
                    <label style={labelStyle}>Notes: </label>
                    <input style={inputStyle} value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
                <div style={{marginTop: 14}}>
                    <label style={labelStyle}>Time food was consumed</label>
                    <input
                    style={inputStyle}
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}

                    />
                </div>

                <label style={{display: "flex", alignItems:"center", gap: 8, cursor: "pointer", position: "relative", fontWeight: 700, fontSize: 15, marginTop: 10}}>
                    <input type="checkbox" checked={suspected} onChange={(e) => setSuspected(e.target.checked)} 
                        style={{
                            appearance: "none",
                            width: 18,
                            height: 18,
                            borderRadius: 6,
                            border: suspected ? "2px solid #22ad24" : "2px solid #c4c1d4",
                            backgroundColor: suspected ? "#22ad24" : "white",
                            position: "relative",
                            cursor: "pointer",
                        }} 
                    />
                    {suspected && (
                        <span
                            style={{
                                position: "absolute",
                                left: 7,
                                top: 4,
                                color: "white",
                                fontSize: 12,
                                fontWeight: "900",
                                pointerEvents: "none"
                            }}
                        >
                            ✓
                        </span>
                    )}
                    <span>Suspected trigger</span>
                </label>

                <button style={primaryButton} type="submit" disabled={!patientCode}>Save Food</button>
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

