import {deleteFoodLog} from "../api/foodLogs";

export default function FoodLogList({ logs, patientCode, onDeleted}) {
    if (!logs.length) return <p>No food logs yet. Try to add some.</p>;

    return (
        <div>
            {logs.map((l) => (
                <div key={l.id} 
                style={{
                   border: "1px solid #e5e7eb",
                   borderRadius: 16,
                   padding: 14,
                   marginBottom: 10,
                   background: "#f9fafb",
                   boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
                   transition: "all 0.15s ease",
                   marginTop: 10,
                }}
                className="food-card">
                    <div style={{fontWeight: 900}}>
                        {l.suspected_trigger ? "⚠️" : ""}<b>{l.food_name}</b> 
                    </div>
                    <div style={{fontSize:12, color: "#666", marginBottom: 12}}>
                        {new Date(l.created_at).toLocaleString()}
                    </div>
                    {l.notes ? 
                    <div style={{marginTop: 8, color: "#6b7280", fontSize: 15, marginBottom: 15}}>
                        {l.notes}</div> : null}
                    <button onClick={async () => {
                        await deleteFoodLog(l.id, patientCode);
                        if (typeof onDeleted === "function") onDeleted();
                    }}
                    className="btnDanger"> Delete 🗑️ </button>
                </div>
            ))}
        </div>
    )
}

    // width: "90%",
    // padding: "10px 14px",
    // borderRadius: 12,
    // border: "1px solid #e5e7eb",
    // outline: "none",
    // fontSize: 14,
    // background: "#f9fafb",
    // boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
    // transition: "all 0.2s ease",
    // marginTop: 15,