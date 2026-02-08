import { useState, useEffect, useRef } from "react";
import { DisasterCard, DisasterCardSchema } from "./components/tambo/DisasterCard";
import { TamboProvider, useTamboThread, useTamboThreadInput } from "@tambo-ai/react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for Leaflet marker icons in React/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25,41], iconAnchor: [12,41] });
L.Marker.prototype.options.icon = DefaultIcon;

// 1. REGISTER GENERATIVE UI COMPONENTS
const components = [{
  name: "DisasterCard",
  description: "Dynamic survival dashboard based on disaster severity.",
  component: DisasterCard,
  propsSchema: DisasterCardSchema,
}];

// Smooth Map Controller
function MapController({ center }) {
  const map = useMap();
  useEffect(() => { map.flyTo(center, 14, { duration: 1.5 }); }, [center, map]);
  return null;
}

export default function App() {
  return (
    <TamboProvider apiKey="tambo_VdnFvvk4fC5Pebr+u0dzmm6MQcSNfzdSmclhKFGyPRQl4KbmcJzo8D3n7/LNPyAys8EpcXFKvI89P0FNoondQUv4zx9SroPGLTIv+8JWrM8=" components={components}>
      {/* Dynamic Emergency CSS Animations */}
      <style>{`
        @keyframes pulse-red {
          0% { border-color: #ff4d4f; box-shadow: 0 0 5px #ff4d4f; }
          50% { border-color: #ff0000; box-shadow: 0 0 25px #ff0000; }
          100% { border-color: #ff4d4f; box-shadow: 0 0 5px #ff4d4f; }
        }
        .severity-high { animation: pulse-red 1.5s infinite; border-width: 3px !important; }
      `}</style>
      <EmergencyInterface />
    </TamboProvider>
  );
}

function EmergencyInterface() {
  const [lang, setLang] = useState("English");
  const [mapCenter, setMapCenter] = useState([12.9784, 80.2184]); // Default: Chennai
  const [severity, setSeverity] = useState("low");
  const [draftValue, setDraftValue] = useState(""); // Local input safety
  const fileInputRef = useRef(null);

  const { thread } = useTamboThread();
  const { setValue, submit, isPending, error } = useTamboThreadInput();

  // 2. STATE SYNCHRONIZATION: Link AI Output to UI Theme
  useEffect(() => {
    const lastMsg = thread?.messages?.[thread.messages.length - 1];
    if (lastMsg?.role === "assistant") {
      const aiSeverity = lastMsg.content?.find(c => c.type === "component")?.props?.severity;
      if (aiSeverity) setSeverity(aiSeverity);
    }
  }, [thread?.messages]);

  const handleSOS = async (e, files = []) => {
    if (e) e.preventDefault();
    const messageToSend = draftValue || (files.length > 0 ? "Analyzing image damage..." : "");
    if (!messageToSend.trim() && files.length === 0) return;

    try {
      setValue(messageToSend); // Sync to Tambo internal state
      
      await submit({
        ...(files.length > 0 && { attachments: files }), // Multimodal support
        systemPrompt: `You are a Crisis-Response AI. Language: ${lang}.
        1. Analyze images for flood/damage levels immediately.
        2. Set severity to 'high' for life-threatening visuals.
        3. Use DisasterCard for EVERY response.
        4. List specific hospitals for the user's city location.`
      });

      setDraftValue(""); // Only clear on success
    } catch (err) { console.error("Tambo Sync Error:", err); }
  };

  const themeColor = severity === "high" ? "#ff4d4f" : severity === "medium" ? "#ffa940" : "#52c41a";

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh", background: "#0a0a0a", color: "#fff", overflow: "hidden", fontFamily: "Arial, sans-serif" }}>
      
      {/* SIDEBAR: Reactive Cockpit */}
      <div className={severity === "high" ? "severity-high" : ""} style={{ 
        width: "400px", padding: "25px", background: "#141414", borderRight: `2px solid ${themeColor}`, transition: "all 0.5s ease" 
      }}>
        <h1 style={{ color: themeColor, fontSize: "1.5rem", marginBottom: "20px", fontWeight: "900" }}>🚨 DISASTER HUB</h1>
        
        <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ width: "100%", padding: "12px", background: "#1f1f1f", color: "#fff", border: "1px solid #333", borderRadius: "8px", marginBottom: "20px" }}>
          <option>English</option><option>Tamil</option><option>Hindi</option>
        </select>

        {/* Dynamic Heatmap Map */}
        <div style={{ height: "300px", borderRadius: "15px", overflow: "hidden", border: "1px solid #333", marginBottom: "20px" }}>
          <MapContainer center={mapCenter} zoom={13} style={{ height: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapController center={mapCenter} />
            <Circle center={mapCenter} radius={severity === "high" ? 2500 : 800} pathOptions={{ color: themeColor, fillColor: themeColor, fillOpacity: 0.2 }} />
            <Marker position={mapCenter}><Popup>Active Crisis Zone</Popup></Marker>
          </MapContainer>
        </div>

        <button 
          onClick={() => window.open(`https://wa.me/?text=EMERGENCY: ${severity.toUpperCase()} ALERT AT COORDS: ${mapCenter}`)}
          style={{ width: "100%", padding: "15px", background: themeColor, color: "#fff", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}
        >
          BROADCAST SOS
        </button>
      </div>

      {/* CHAT PANEL: Generative UI Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "linear-gradient(180deg, #141414 0%, #0a0a0a 100%)" }}>
        <div style={{ flex: 1, overflowY: "auto", padding: "40px" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            {thread?.messages?.map((msg) => (
              <div key={msg.id} style={{ marginBottom: "30px", textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                <div style={{ 
                  display: "inline-block", padding: "16px 24px", borderRadius: "20px", 
                  background: msg.role === 'user' ? themeColor : "#1f1f1f",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5)", maxWidth: "80%"
                }}>
                  {Array.isArray(msg.content) ? msg.content.map(c => c.text).join("") : String(msg.content || "")}
                </div>
                <div style={{ marginTop: "20px" }}>{msg.renderedComponent}</div>
              </div>
            ))}
            {isPending && <div style={{ color: themeColor, textAlign: "center", fontWeight: "bold" }}>⚡ AI COORDINATING RELIEF...</div>}
            {error && <div style={{ color: "#ff4d4f", background: "rgba(255,0,0,0.1)", padding: "10px", borderRadius: "10px" }}>{error.message}</div>}
          </div>
        </div>

        {/* INPUT: Fixed Multimodal Bar */}
        <div style={{ padding: "30px", background: "rgba(20,20,20,0.9)", borderTop: "1px solid #222" }}>
          <form onSubmit={handleSOS} style={{ maxWidth: "800px", margin: "0 auto", display: "flex", gap: "10px", alignItems: "center" }}>
            <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={(e) => handleSOS(null, Array.from(e.target.files))} />
            <button type="button" onClick={() => fileInputRef.current.click()} style={{ background: "#333", border: "none", color: "#fff", width: "50px", height: "50px", borderRadius: "50%", cursor: "pointer" }}>📸</button>
            
            <input 
              value={draftValue} 
              onChange={(e) => setDraftValue(e.target.value)} 
              placeholder="Report incident or upload photo..." 
              style={{ flex: 1, padding: "15px 25px", borderRadius: "30px", background: "#1f1f1f", color: "#fff", border: "1px solid #333", outline: "none" }} 
            />
            
            <button type="submit" disabled={isPending} style={{ padding: "15px 30px", borderRadius: "30px", background: themeColor, color: "#fff", border: "none", fontWeight: "bold", cursor: "pointer" }}>
              {isPending ? "..." : "SEND"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}