import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "jquery/dist/jquery.min.js";
import "popper.js/dist/popper.min.js";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);

  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );
} else {
  console.error("Root element not found");
}
