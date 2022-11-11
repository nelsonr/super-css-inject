import React from "react";
import ReactDOM from "react-dom/client";
import { loadStorage } from "../storage";
import { StorageData } from "../types";
import Options from "./Options";

loadStorage().then((state: StorageData) => {
    ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
        <React.StrictMode>
            <Options initialState={state} />
        </React.StrictMode>
    );
});
