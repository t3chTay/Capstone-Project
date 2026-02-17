import { useEffect , useState } from "react";
import { getSymptoms, updateSymptom, deleteSymptom } from "./api/symptoms";
import SymptomForm from "./components/SymptomForm";
import EditSymptom from "./components/EditSymptom";
import PressureChart from "./components/charts/PressureSeverityChart";
import SeverityTempChart from "./components/charts/SeverityTempChart";
import DailyFrequencyChart from "./components/charts/DailyFrequencyChart";
import ConditionPie from "./components/charts/ConditionPie";
// console.log("deleteSymptom import:", deleteSymptom);

function App() {
    const [symptoms, setSymptoms] = useState([]);
    const [range, setRange] = useState("7"); // for data range filtering
    const [editing, setEditing] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchSymptoms = () => {
        getSymptoms()
        .then(res => setSymptoms(res.data))
        .catch(err => console.error(err));
    };

    const totalLogs = symptoms.length;
    const averageSeverity = totalLogs === 0 ? 0 : (symptoms.reduce((sum,s) => sum + (Number(s.severity) || 0), 0) / totalLogs).toFixed(1);

    const mostCommonCondition = (() => {
        if (totalLogs === 0) return "Not enough data";
        const counts = symptoms.reduce((acc, s) => {
            const key = s.weather_condition || "unknown";
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(counts).sort((a,b) => b[1] - a[1])[0][0];
    }) ();

    const filteredSymptoms = (() => {
        if (range === "all") return symptoms;

        const days = Number(range);
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);

        return symptoms.filter((s) => new Date(s.created_at) >= cutoff)
    })();


    // summary stats cards
    const cardStyle = {
        background: "white",
        borderRadius: "12px",
        padding: "16px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    };
    const labelStyle = {fontSize: "13px", color:"#555"};
    const valueStyle = {fontSize: "28px", fontWeight: 700, marginTop: "6px"};
    
    // weather trigger insights
    const triggerInsight = (() => {
            const logs = filteredSymptoms ?? [];

            if (logs.length < 3) return "Not enough data yet — log at least 3 symptoms to generate insights.";

            const buckets = {};
            for (const s of logs) {
                const condition = s.weather_condition || "Unknown";
                const sev = Number(s.severity);

                if (!Number.isFinite(sev)) continue;

                if (!buckets[condition]) buckets[condition] = { total: 0, count: 0 };
                buckets[condition].total += sev;
                buckets[condition].count += 1;
            }

            const ranked = Object.entries(buckets)
                .map(([condition, v]) => ({
                condition,
                avg: v.count ? v.total / v.count : 0,
                count: v.count,
                }))
                .filter((x) => x.count > 0)
                .sort((a, b) => b.avg - a.avg);

            if (ranked.length === 0) return "Not enough valid severity data to generate insights.";

            const top = ranked[0];
            return `Your highest average severity occurs during ${top.condition} conditions (avg ${top.avg.toFixed(
                1
            )} over ${top.count} logs). Consider taking preventative measures during these conditions to avoid symptom flare-ups.`;
            })();

        useEffect(() => {
        fetchSymptoms();
    }, []);

    const openEdit = (symptom) => {
        setEditing(symptom);
        setIsModalOpen(true);
    };

    const closeEdit = () => {
        setIsModalOpen(false);
        setEditing(null);
    };

    const saveEdit = async (payload) => {
        await updateSymptom(editing.id, payload);
        closeEdit();
        fetchSymptoms();
    };

    return (
        <div style={{padding: "30px", fontFamily: "Arial, sans-serif"}}>
            <h1 style={{marginBottom:"20px"}}>ClearSYM Dashboard</h1>
            <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 16}}>
                <div style={cardStyle}>
                    <div style={labelStyle}>Total Logs</div>
                    <div style={valueStyle}>{totalLogs}</div>

                </div>
                <div style={cardStyle}>
                    <div style={labelStyle}>Average Severity</div>
                    <div style={valueStyle}>{averageSeverity}</div>
                </div>
                <div style={cardStyle}>
                    <div style={labelStyle}>Most Common Condition</div>
                    <div style={valueStyle}>{mostCommonCondition}</div>
                </div>

            </div>
            <div style={{marginTop: 18, display:"flex", gap:10, alignItems: "center"}}>
                <span style={{fontSize: 14, color: "#444"}}>Date Range:</span>
                <select value={range} onChange={(e) => setRange(e.target.value)}>
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="all">All time</option>
                </select>
            </div>
            <div style={{...cardStyle, marginTop:16, borderLeft: "5px solid #2563eb", width: "100%"}}>
                <div style={{fontSize:13, color: "#555"}}>Trigger Insights</div>
                <div style={{fontSize: 16, fontWeight: 600, marginTop: 6}}>{triggerInsight}</div>
            </div>

            <hr />
            <SymptomForm onNewSymptom={fetchSymptoms} />

            <h2>Logged Symptoms</h2>
            {symptoms.map(s => (
                <div key={s.id} style={{border: "1px solid #ccc", margin: "10px", padding: "10px"}}>
                    <h3>{s.symptom_type} - Severity {s.severity}</h3>
                    <p>Weather: {s.weather_condition}</p>
                    <p>Temp: {s.temperature}°C</p>
                    <p>Pressure: {s.pressure} hPa</p>
                    <p>Humidity: {s.humidity}%</p>
                    <p>Notes: {s.notes}</p>
                    <button onClick={() => openEdit(s)} style={{marginRight:10}}>Edit</button>
                   <button onClick={async () => {
                        await deleteSymptom(s.id);
                        fetchSymptoms();
                    }}
                    style={{marginTop: 8}}>
                        Delete
                </button>  
                </div>
            ))}

            <hr />
            <div style={{marginTop: "40px"}}>
              <h2>Health Insights</h2>  
              <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginTop: "20px"}}>

                <PressureChart data={symptoms} />
                <SeverityTempChart />
                <DailyFrequencyChart />
                <ConditionPie />   
                </div>
            </div>
            <EditSymptom
                open={isModalOpen}
                symptom={editing}
                onClose={closeEdit}
                onSave={saveEdit}
            />
        </div>
    );
}

export default App;