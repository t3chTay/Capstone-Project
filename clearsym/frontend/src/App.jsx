import { useEffect , useState } from "react";
import { getSymptoms } from "./api";
import SymptomForm from "./components/SymptomForm";
import PressureChart from "./components/PressureChart";

function App() {
    const [symptoms, setSymptoms] = useState([]);

    const fetchSymptoms = () => {
        getSymptoms()
        .then(res => setSymptoms(res.data))
        .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchSymptoms();
    }, []);

    return (
        <div style={{padding: "20px"}}>
            <h1>ClearSYM Dashboard</h1>

            <SymptomForm onNewSymptom={fetchSymptoms} />

            <PressureChart data={symptoms} />

            <h2>Logged Symptoms</h2>
            {symptoms.map(s => (
                <div key={s.id} style={{border: "1px solid #ccc", margin: "10px", padding: "10px"}}>
                    <h3>{s.symptom_type} - Severity {s.severity}</h3>
                    <p>Weather: {s.weather_condition}</p>
                    <p>Temp: {s.temperature}°C</p>
                    <p>Pressure: {s.pressure} hPa</p>
                    <p>Humidity: {s.humidity}%</p>
                    <p>Notes: {s.notes}</p>
                </div>
            ))}
        </div>
    );
}

export default App;