import React from "react";
import ReactDOM from "react-dom/client";
import { Link, RouterProvider, createBrowserRouter } from "react-router-dom";

import Panel from "components/Panel";
import ReBACAdmin from "components/ReBACAdmin";
import logger from "utils/logger";

import App from "./App";

import "./scss/index.scss";

const root = document.getElementById("root");

const defferRender = async () => {
  if (import.meta.env.VITE_DEMO_API_MOCKED !== "true") {
    // If the API should not be mocked then prevent the service worker from
    // taking over the network calls.
    return;
  }
  const { mockApiWorker } = await import("./mockApiWorker");
  return mockApiWorker.start();
};

const admin = () => (
  <ReBACAdmin
    apiURL={import.meta.env.VITE_DEMO_API_URL}
    logLevel={logger.levels.TRACE}
  />
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <Panel title="Demo">
            <div className="u-fixed-width">
              <Link to="/permissions">Go to ReBAC Admin</Link>
            </div>
          </Panel>
        ),
      },
      {
        path: "models",
        element: <Panel title="Models" />,
      },
      {
        path: "controllers",
        element: <Panel title="Controllers" />,
      },
      {
        path: "permissions/*",
        element: admin(),
      },
    ],
  },
]);

if (root) {
  defferRender()
    .then(() => {
      ReactDOM.createRoot(root).render(
        <React.StrictMode>
          <RouterProvider router={router} />
        </React.StrictMode>,
      );
      return;
    })
    .catch((error) =>
      logger.error("Error while trying to start mock API worker.", error),
    );
} else {
  logger.error("Root element not found in DOM.");
}
