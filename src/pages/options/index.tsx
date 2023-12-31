import React from "react";
import { createRoot } from "react-dom/client";
import LayoutContainer from './layoutContainer';
import "@pages/options/index.css";
import refreshOnUpdate from "virtual:reload-on-update-in-view";
import { HashRouter  } from "react-router-dom"

refreshOnUpdate("pages/options");

function init() {
  const appContainer = document.querySelector("#app-container");
  if (!appContainer) {
    throw new Error("Can not find #app-container");
  }
  const root = createRoot(appContainer);
  root.render(
    <HashRouter >
      <LayoutContainer />
    </HashRouter>
  );
}

init();
