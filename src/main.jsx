import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { TamboProvider } from "@tambo-ai/react";
import "leaflet/dist/leaflet.css";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <TamboProvider apiKey={import.meta.env.VITE_TAMBO_API_KEY}>
    <App />
  </TamboProvider>
);