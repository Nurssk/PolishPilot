import "../styles/tailwind.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CodeChangePage } from "./CodeChangePage";

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <StrictMode>
      <CodeChangePage />
    </StrictMode>
  );
}
