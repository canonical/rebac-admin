import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./scss/index.scss";

const root = document.getElementById("root");

const defferRender = async () => {
  const { mockApiWorker } = await import("./mockApiWorker");
  return mockApiWorker.start();
};

if (root) {
  defferRender()
    .then(() => {
      ReactDOM.createRoot(root).render(
        <React.StrictMode>
          <App />
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
