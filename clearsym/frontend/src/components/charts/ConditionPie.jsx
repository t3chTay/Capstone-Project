import { useEffect, useState } from "react";
import { getConditionBreakdown } from "../../api/analytics";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function ConditionPie() {
     const [data, setData] = useState([]);
     const Colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7c"];

     useEffect(() => {
        getConditionBreakdown().then(res => setData(res.data));
     }, []);
     console.log("Condition Breakdown:", data);

     return (
        <div>
            <h3>Weather Condition Breakdown</h3>
            <p style={{fontSize: "14px", color: "#555"}}> Visualizes distribution of weather conditions.</p>
            <div style={{background:"#ccc", padding:"30px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.05)", height: 300}}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data} dataKey="count" nameKey="condition" outerRadius={110}>
                            {data.map((entry, index) => (
                                <Cell key={entry.condition ?? index} fill={Colors[index % Colors.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>  
            </div>
        </div>
     );
}