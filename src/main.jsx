import React from "react";
import ReactDOM from "react-dom";
import AppRouter from "../router/AppRouter";
import './App.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode >
);
