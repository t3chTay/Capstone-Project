import {useEffect, useState} from "react";

export default function EditSymptom({open, symptom, onClose, onSave}) {
    const [severity, setSeverity] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        if (symptom) {
            setSeverity(symptom.severity ?? "");
            setNotes(symptom.notes ?? "");
        }
    }, [symptom]);

    if (!open || !symptom) return null;

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                <h3 style={{marginTop: 0}}>Edit Symptom</h3>

                <div style={{display: "grid", gap: 10}}>
                    <label>
                        Severity (1-10):
                        <input 
                            type="number"
                            min="1"
                            max="10"
                            value={severity}
                            onChange={(e) => setSeverity(e.target.value)}
                            style={inputStyle}
                        />
                    </label>
                    <label>
                        Notes:
                        <input 
                            type="text"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            style={inputStyle}
                        />
                    </label>
                </div>
                <div style={{display: "flex", gap: 10, justifyContent: "flex-end"}}>
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={() => onSave({severity: Number(severity), notes})}>Save</button>
                </div>
            </div>
        </div>
    );
}

const overlayStyle = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    zIndex:50,
};

const modalStyle = {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
}

const inputStyle = {
    width: "100%",
    padding: 8,
    marginTop: 6,
    borderRadius: 4,
    border: "1px solid #ccc",
}