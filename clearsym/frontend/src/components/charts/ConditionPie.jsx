import { useEffect, useState } from "react";
import { getConditionBreakdown } from "../../api/analytics";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function ConditionPie({patientCode}) {
     const [data, setData] = useState([]);
     const Colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7c"];

     useEffect(() => {
        if (!patientCode) return null;

        getConditionBreakdown(patientCode).then(res => setData(res.data));
     }, [patientCode]);
     console.log("Condition Breakdown:", data);

     return (
        <div style={{width:"100%", height:320}}>
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
     );
}