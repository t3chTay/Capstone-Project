import {useState} from "react";
import {createFoodLog} from "../api/foodLogs";

export default function FoodLogForm({patientCode, onLogged}) {
    const [foodName, setFoodName] = useState("");
    const [notes, setNotes] = useState("");
    const [suspected, setSuspected] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        if (!patientCode) return;
        if (!foodName.trim()) return alert("Food name required");

        await createFoodLog(patientCode,{
            food_name: foodName.trim(),
            notes,
            suspected_trigger: suspected,
        });

        setFoodName("");
        setNotes("");
        setSuspected(false);

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
    marginTop: 10,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    outline: "none",
    fontSize: 14,
    marginBottom:12,
};

const labelStyle = {
    fontWeight: 900,
    fontSize: 16
}

