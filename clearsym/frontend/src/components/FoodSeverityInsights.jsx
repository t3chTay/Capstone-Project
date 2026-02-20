import {useEffect, useState} from "react";
import {getFoodSeverity} from "../api/analytics";

export default function FoodSeverityInsights({patientCode}) {
    const [data, setData] = useState(null);

    useEffect(() => {
        if (!patientCode) return;
        
        getFoodSeverity(patientCode, 6).then((res) => setData(res.data)).catch(console.error)
    }, [patientCode]);
    
    if (!data) return null;

    const top = data?.results?.[0];
    const isHighRisk = top && top.avg_severity >= 8;
    
    return (
        <div className="food-insights" 
            >
            <div style={{ marginTop: 4, color: "#6b7280", fontSize: 13 }}> Within next {data.window_hours}h</div>

            {data.results.length === 0 ? (
                <p style={{color: "#666666", fontWeight: 600}}>
                    No correlations yet. Log a food then a symptom within {data.window_hours} hours.
                </p>
            ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                        <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ddd" }}>Food</th>
                        <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ddd" }}>Avg Severity</th>
                        <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ddd" }}># Symptoms</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.results.map((row) => (
                        <tr key={row.food} 
                            style={{
                                border: "1px solid #e5e7eb",
                                padding: 18,
                                background: "white",
                                borderLeft: isHighRisk ? "6px solid #f87b7b" : "6px solid transparent",
                                transition: "all 0.2s ease",
                            }}>
                            <td style={{ padding: 8, borderBottom: "1px solid #eee", fontWeight:600 }}>{row.food}</td>
                            <td style={{ padding: 8, borderBottom: "1px solid #eee", fontWeight:400 }}>{row.avg_severity}</td>
                            <td style={{ padding: 8, borderBottom: "1px solid #eee", fontWeight:400 }}>{row.symptom_count}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            )}

        </div>
    )
}