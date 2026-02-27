import { useEffect, useMemo, useState } from "react";
import { getDailyFrequency } from "../../api/analytics";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from "recharts";

export default function DailyFrequencyChart({ patientCode }) {
  const [raw, setRaw] = useState([]);

  useEffect(() => {
    if (!patientCode) return;

    getDailyFrequency(patientCode)
      .then((res) => setRaw(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        console.error("DailyFrequencyChart fetch error:", err);
        setRaw([]);
      });
  }, [patientCode]);

  // Normalize to { date, count } even if backend returns different keys
  const data = useMemo(() => {
    return (raw || [])
      .map((d) => ({
        date: d.date ?? d.day ?? d.created_at ?? d.label,
        count: Number(d.count ?? d.frequency ?? d.total ?? d.value ?? 0),
      }))
      .filter((d) => d.date);
  }, [raw]);
console.log("Daily Frequency sample:", raw[0]);
  return (
    <div style={{ width: "100%", height: 320 }}>
      {patientCode && data.length === 0 ? (
        <div style={{ color: "#6b7280", fontSize: 13 }}>
          No daily frequency data yet. Log symptoms across multiple days to populate this chart.
        </div>
      ) : null}

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="count" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
