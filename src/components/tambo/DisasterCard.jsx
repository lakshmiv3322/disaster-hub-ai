import { z } from "zod";

export const DisasterCardSchema = z.object({
  title: z.string().optional().default("Emergency Alert"),
  // Adding .catch([]) ensures that if the AI sends 'undefined', it becomes an empty array
  steps: z.array(z.string()).catch([]), 
  supplies: z.array(z.string()).catch([]),
  severity: z.enum(["low", "medium", "high"]).catch("medium")
});

export function DisasterCard({ title, steps = [], supplies = [] }) {
  return (
    <div
      style={{
        border: "2px solid #ff4d4f",
        borderRadius: "12px",
        padding: "20px",
        marginTop: "12px",
        background: "#fff", // Clean white for better contrast
        color: "#1a1a1a",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        borderLeft: "8px solid #ff4d4f"
      }}
    >
      <h2 style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
        🚨 {title || "Analyzing Situation..."}
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div>
          <h4 style={{ color: "#cf1322", marginBottom: "8px", fontWeight: "bold" }}>Immediate Steps:</h4>
          <ul style={{ paddingLeft: "1.2rem" }}>
            {steps.map((s, i) => <li key={i} style={{ marginBottom: "4px" }}>{s}</li>)}
          </ul>
        </div>

        <div>
          <h4 style={{ color: "#096dd9", marginBottom: "8px", fontWeight: "bold" }}>Required Supplies:</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {supplies.map((s, i) => (
              <span key={i} style={{ background: "#e6f7ff", padding: "4px 8px", borderRadius: "4px", fontSize: "0.85rem" }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}