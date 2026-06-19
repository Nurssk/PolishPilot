import "../styles/tailwind.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PreviewImagePage } from "./PreviewImagePage";

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <StrictMode>
      <PreviewImagePage />
    </StrictMode>
  );
}
