import "../styles/tailwind.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { FullPreviewPage } from "./FullPreviewPage";

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <StrictMode>
      <FullPreviewPage />
    </StrictMode>
  );
}
