import React from "react";
import ReactDOM from "react-dom/client";
import { loadStorage } from "../storage";
import { PopupState } from "../types";
import { getCurrentTab } from "../utils";
import Popup from "./Popup";

async function getInitialPopupState (): Promise<PopupState> {
    const [ storage, currentTab ] = await Promise.all([
        loadStorage(),
        getCurrentTab()
    ]);

    return {
        stylesheets: storage.stylesheets,
        injected: storage.injected,
        config: storage.config,
        tabId: currentTab?.id,
    };
}

getInitialPopupState().then((state: PopupState) => {
    ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
        <React.StrictMode>
            <Popup initialState={state} />
        </React.StrictMode>
    );
});
