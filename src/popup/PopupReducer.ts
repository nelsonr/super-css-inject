import { broadcastClearStylesheet, broadcastInjectStylesheet } from "../Messages";
import { updateStorage } from "../storage";
import { PopupState } from "../types";

type State = PopupState;

type Action =
    | { type: "updateState"; state: State }
    | { type: "inject"; url: string; tabId: number; }
    | { type: "clear"; url: string; tabId: number; };

export function PopupReducer(state: State, action: Action): State {
    switch (action.type) {
    case "updateState":
        return action.state;

    case "inject":
        return inject(state, action.url, action.tabId);

    case "clear":
        return clear(state, action.url, action.tabId);

    default:
        return state;
    }
}

function inject(state: State, url: string, tabId: number): State {
    const { injected } = state;

    if (!injected[tabId]) {
        injected[tabId] = [];
        injected[tabId].push(url);
    } else if (!injected[tabId].includes(url)) {
        injected[tabId].push(url);
    }

    const updatedState = { ...state, injected };
    updateStorage(updatedState).then(() =>
        broadcastInjectStylesheet(tabId, url)
    );

    return updatedState;
}

function clear(state: State, url: string, tabId: number): State {
    const { injected } = state;

    if (injected[tabId]) {
        if (injected[tabId].includes(url)) {
            const index = injected[tabId].indexOf(url);
            injected[tabId].splice(index, 1);
        }
        
        if (injected[tabId].length < 1) {
            delete injected[tabId];
        }
    }

    const updatedState = { ...state, injected };
    updateStorage(updatedState).then(() =>
        broadcastClearStylesheet(tabId, url)
    );

    return updatedState;
}
