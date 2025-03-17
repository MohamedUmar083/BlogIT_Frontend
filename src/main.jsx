import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store, persistor } from "./Redux/Store.jsx";
import { PersistGate } from "redux-persist/integration/react";
import ThemeProvider from "./Components/ThemeProvider.jsx";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

createRoot(document.getElementById("root")).render(
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <ThemeProvider>
        <SkeletonTheme color="#f5f5f5" highlightColor="#e5e5e5">
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SkeletonTheme>
      </ThemeProvider>
    </Provider>
  </PersistGate>
);
