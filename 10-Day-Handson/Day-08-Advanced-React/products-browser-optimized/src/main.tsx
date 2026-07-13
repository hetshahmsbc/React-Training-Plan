// main.tsx — app entry point. Wraps <App /> with ErrorBoundary + ProductsProvider.
// Fill this in from the guide in chat.

// main.tsx — app entry point.

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import ErrorBoundary from "./components/ErrorBoundary";
import { ProductsProvider } from "./context/ProductsContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <ProductsProvider>
        <App />
      </ProductsProvider>
    </ErrorBoundary>
  </StrictMode>,
);
