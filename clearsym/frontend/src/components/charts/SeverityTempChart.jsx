import {useEffect, useState} from "react";
import {getSeverityTemp} from "../../api/analytics";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from "recharts";

export default function SeverityTempChart() {
    const [data, setData] = useState([]);

    useEffect(() => {
        getSeverityTemp().then(res => setData(res.data));
    }, []);
    console.log("Chart Data:", data);

    return (
        <div style={{width: "100%", height: 300}}>
            <h3>Symptom Severity vs Temperature</h3>
            <p style={{fontSize: "14px", color: "#555"}}> Visualizes correlation between temperature and symptom severity.</p>
            <div style={{background:"#ccc", padding:"30px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.05)"}}>
                <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart>
                        <CartesianGrid />
                        <XAxis dataKey="temperature" name="Temperature (°C)" />
                        <YAxis dataKey="severity" name="Symptom Severity" />
                        <Tooltip cursor={{strokeDasharray: "3 3 "}} />
                        <Scatter data={data} />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}