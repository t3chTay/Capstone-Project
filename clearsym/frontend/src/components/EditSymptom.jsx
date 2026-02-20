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
        <div className="modalOverlay" style={overlayStyle} onClick={onClose}>
            <div className="modalCard" style={modalStyle} onClick={(e) => e.stopPropagation()}>
                <h3 style={{...pill, marginTop: 0}}><span style={{width:8, height:8, borderRadius: 100, background: "#2563eb"}}/>Edit Symptom</h3>

                <div style={{display: "grid", gap: 10}}>
                    <label style={{...labelStyle, marginTop:12}}>
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
                    <label style={labelStyle}>
                        Notes:
                        <input 
                            type="text"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            style={inputStyle}
                        />
                    </label>
                </div>
                <div style={{display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 14}}>
                    <button style={ghostButton} onClick={onClose}>Cancel</button>
                    <button style={primaryButton} onClick={() => onSave({severity: Number(severity), notes})}>Save</button>
                </div>
            </div>
        </div>
    );
}

const overlayStyle = {
    position: "fixed",
    inset: 0,
    backgroundColor: "#11182773",
    backdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    zIndex: 9999,
};

const modalStyle = {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 2px 10px #00000033",
    animation: "fadeIn 0.2s ease-out"
}

const inputStyle = {
    width: "95%",
    padding: 8,
    marginTop: 6,
    borderRadius: 4,
    border: "1px solid #cccccc",
}

const labelStyle = {
    fontWeight: 700,
    fontSize: 20
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
    fontSize: 17,
    fontWeight: 800,
    marginBottom: 8
}
const primaryButton = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: 10,
  fontWeight: 600,
  cursor: "pointer",
};

const ghostButton = {
  background: "#555555b4",
  border: "1px solid #e5e7eb",
  padding: "8px 14px",
  borderRadius: 10,
  fontWeight: 600,
  cursor: "pointer",
  color: "#fff"
};