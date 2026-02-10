import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import AuthGate from "./AuthGate";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

// ====== LẤY ROOT ELEMENT ======
const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element #root not found in index.html");
}

// ====== CREATE ROOT (REACT 18) ======
const root = ReactDOM.createRoot(container);

// ====== RENDER APP ======
root.render(
  <React.StrictMode>
    <AuthGate>
      <App />
    </AuthGate>
    <SpeedInsights />
    <Analytics />
  </React.StrictMode>
);
