import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";

const root = document.getElementById("root");

const defferRender = async () => {
  const { mockApiWorker } = await import("./mockApiWorker.ts");
  return mockApiWorker.start();
};

if (root) {
  defferRender()
    .then(() => {
      const queryClient = new QueryClient();

      ReactDOM.createRoot(root).render(
        <React.StrictMode>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </React.StrictMode>,
      );

      return;
    })
    .catch((error) =>
      console.error("Error while trying to start mock API worker.", error),
    );
} else {
  console.error("Root element not found in DOM.");
}
