import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function PressureChart({data}) {
    // format data for chart
    const chartData = data.map(d => ({
        pressure: d.pressure,
        severity: d.severity,
    }));
    console.log("Chart Data:", chartData);
    return (
        <div style={{marginBottom: "40px", width:"100%", height: 320, borderRadius: "12px", background: "#f9fafb",
}}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="pressure" label={{ value: "Pressure", position: "insideBottom", offset: -5, fontSize: 14 }} />
                    <YAxis label={{ value: "Severity", angle: -90, position: "insideLeftCenter", fontSize: 14 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="severity" stroke="#8884d8" activeDot={{radius:8}} />
                </LineChart>
            </ResponsiveContainer>
            
        </div>
    );
}