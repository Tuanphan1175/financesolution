// index.tsx (ROOT ENTRY)
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { AuthGate } from "./AuthGate";

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
  </React.StrictMode>
);
