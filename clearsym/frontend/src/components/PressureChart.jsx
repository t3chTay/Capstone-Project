import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function PressureChart({data}) {
    // format data for chart
    const chartData = data.map(d => ({
        pressure: d.pressure,
        severity: d.severity,
    }));
    
    return (
        <div style={{marginBottom: "40px"}}>
            <h2>Pressure vs Severity Chart</h2>
            <LineChart width={600} height={300} data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="pressure" label={{ value: "Pressure", position: "insideBottomRight", offset: -5 }} />
                <YAxis label={{ value: "Severity", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="severity" stroke="#8884d8" activeDot={{radius:8}} />
            </LineChart>

        </div>
    );
}