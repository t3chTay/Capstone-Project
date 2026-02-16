import { useEffect, useState } from "react";
import { getDailyFrequency } from "../api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function DailyFrequencyChart() {
    const [data, setData] = useState([]);

    useEffect(() => {
        getDailyFrequency()
        .then(res => setData(res.data))
        .catch(err => console.error(err));
    }, []);

    return (
        <div style={{width: "100%", height: 300}}>
            <h2>Symptom Frequency Over Time</h2>

            <ResponsiveContainer>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false}/>
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#2563e" strokeWidth={3}/>
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}