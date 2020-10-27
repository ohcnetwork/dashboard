/* eslint-disable no-console */
import { Windmill } from "@saanuregh/react-ui";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { register } from "register-service-worker";

import App from "./App";
import "./assets/css/tailwind.css";
import ThemedSuspense from "./components/ThemedSuspense";
import { AuthProvider } from "./context/AuthContext";
import { SidebarProvider } from "./context/SidebarContext";

ReactDOM.render(
  <AuthProvider>
    <SidebarProvider>
      <Suspense
        fallback={
          <ThemedSuspense className="dark:bg-gray-900 my-auto min-h-screen" />
        }
      >
        <Windmill usePreferences>
          <App />
        </Windmill>
      </Suspense>
    </SidebarProvider>
  </AuthProvider>,
  document.querySelector("#root")
);

register(`${process.env.PUBLIC_URL}service-worker.js`, {
  cached(registration) {
    console.log("Content has been cached for offline use.");
  },
  error(error) {
    console.error("Error during service worker registration:", error);
  },
  offline() {
    console.log(
      "No internet connection found. App is running in offline mode."
    );
  },
  ready(registration) {
    console.log("Service worker is active.");
  },
  registered(registration) {
    console.log("Service worker has been registered.");
  },
  updated(registration) {
    console.log("New content is available; please refresh.");
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (this.refreshing) {
        return;
      }
      this.refreshing = true;
      window.location.reload();
    });
  },
  updatefound(registration) {
    console.log("New content is downloading.");
  },
});
