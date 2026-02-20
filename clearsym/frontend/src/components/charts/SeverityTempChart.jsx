import {useEffect, useState, useMemo} from "react";
import {getSeverityTemp} from "../../api/analytics";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from "recharts";

export default function SeverityTempChart({ patientCode }) {
  const [raw, setRaw] = useState([]);

  useEffect(() => {
    if (!patientCode) return;

    getSeverityTemp(patientCode)
      .then((res) => setRaw(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        console.error("SeverityTempChart fetch error:", err);
        setRaw([]);
      });
  }, [patientCode]);

  const data = useMemo(() => {
    return (raw || [])
      .map((d) => ({
        temperature: Number(d.temperature ?? d.temp ?? d.x),
        severity: Number(
          d.severity ?? d.avg_severity ?? d.average_severity ?? d.y
        ),
      }))
      .filter(
        (d) => Number.isFinite(d.temperature) && Number.isFinite(d.severity)
      );
  }, [raw]);

  return (
    <div style={{ width: "100%", height: 320 }}>
      {patientCode && data.length === 0 ? (
        <div style={{ color: "#6b7280", fontSize: 13 }}>
          No data yet for this chart. Log a few symptoms to populate insights.
        </div>
      ) : null}

      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart>
          <CartesianGrid />
          <XAxis
            dataKey="temperature"
            name="Temperature (°C)"
            type="number"
            tickFormatter={(v) => `${v}`}
          />
          <YAxis dataKey="severity" name="Symptom Severity" type="number" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter data={data} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}