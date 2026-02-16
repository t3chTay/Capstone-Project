import { useEffect, useState } from "react";
import { getDailyFrequency } from "../../api/analytics";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function DailyFrequencyChart() {
    const [data, setData] = useState([]);

    useEffect(() => {
        getDailyFrequency().then(res => setData(res.data))
        .catch(err => console.error(err));
    }, []);
    console.log("Daily Frequency:", data);

    return (
        <div style={{width: "100%", height: 300}}>
            <h3>Daily Symptom Frequency</h3>
            <p style={{fontSize: "14px", color: "#555"}}> Visualizes daily symptom frequency over time.</p>
            <div style={{background:"#ccc", padding:"30px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.05)"}}>
                <ResponsiveContainer width="100%" height={300}>
                    
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis allowDecimals={false}/>
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3}/>
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}