import "../styles/tailwind.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DesignIdeasPage } from "./DesignIdeasPage";

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <StrictMode>
      <DesignIdeasPage />
    </StrictMode>
  );
}
