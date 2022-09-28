import { SuperCSSInject } from "./types";
import { Stylesheet } from "./Stylesheet";
import { updateStorage } from "./storage";

type State = SuperCSSInject;

type Action =
    | { type: "add"; url: string; persist: boolean }
    | { type: "remove"; id: number; persist: boolean }
    | { type: "setActive"; id: number; tabId: number; persist: boolean }
    | { type: "clearActive"; id: number; tabId: number; persist: boolean }
    | { type: "updateState"; state: State; persist: boolean };

export function reducer(state: State, action: Action): State {
    switch (action.type) {
    case "add":
        return add(state, action.url, action.persist);

    case "remove":
        return remove(state, action.id, action.persist);

    case "setActive":
        return setActive(state, action.id, action.tabId, action.persist);

    case "clearActive":
        return clearActive(state, action.id, action.tabId, action.persist);

    case "updateState":
        return updateState(state, action.state, action.persist);

    default:
        return state;
    }
}

function add(state: State, url: string, persist: boolean): State {
    const stylesheet = new Stylesheet(url);

    const updatedState = {
        ...state,
        stylesheets: [...state.stylesheets, stylesheet],
    };

    if (persist) {
        updateStorage(updatedState);
    }

    return updatedState;
}

function remove(state: State, id: number, persist: boolean): State {
    const stylesheets = state.stylesheets.filter(
        (_item, index) => index !== id
    );

    const updatedState = {
        ...state,
        stylesheets: stylesheets,
    };

    if (persist) {
        updateStorage(updatedState);
    }

    return updatedState;
}

function setActive(
    state: State,
    id: number,
    tabId: number,
    persist: boolean
): State {
    const tabs = { ...state.tabs };
    const url = state.stylesheets[id].url;

    if (!tabs[tabId]) {
        tabs[tabId] = [url];
    } else {
        tabs[tabId].push(url);
    }

    const updatedState = {
        ...state,
        tabs: { ...tabs },
    };

    if (persist) {
        updateStorage(updatedState);
    }

    return updatedState;
}

function clearActive(
    state: State,
    id: number,
    tabId: number,
    persist: boolean
): State {
    const tabs = { ...state.tabs };
    const url = state.stylesheets[id].url;

    if (tabs[tabId]) {
        const index = tabs[tabId].indexOf(url);
        tabs[tabId].splice(index, 1);

        if (tabs[tabId].length < 1) {
            delete tabs[tabId];
        }
    }

    const updatedState = {
        ...state,
        tabs: { ...tabs },
    };

    if (persist) {
        updateStorage(updatedState);
    }

    return updatedState;
}

function updateState(state: State, newState: State, persist: boolean): State {
    const updatedState = { ...state, ...newState };

    if (persist) {
        updateStorage(newState);
    }

    return updatedState;
}
