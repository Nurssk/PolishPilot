import "../styles/tailwind.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PreviewGalleryPage } from "./PreviewGalleryPage";

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <StrictMode>
      <PreviewGalleryPage />
    </StrictMode>
  );
}
