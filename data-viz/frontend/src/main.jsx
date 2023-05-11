import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./router/AppRouter";
import { GlobalProvider } from "./context/GlobalState";

import "./styles/app.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GlobalProvider>
    <React.StrictMode>
      <AppRouter />
    </React.StrictMode>
  </GlobalProvider>
);
