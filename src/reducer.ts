import { SuperCSSInject } from "./types";
import { updateStorage } from "./storage";

type State = SuperCSSInject;

type Action =
    | { type: "add"; url: string; persist: boolean }
    | { type: "remove"; url: string; persist: boolean }
    | { type: "setActive"; url: string; tabId: number; }
    | { type: "setInactive"; url: string; tabId: number; }
    | { type: "updateStylesheets"; stylesheets: string[] }
    | { type: "updateTabStylesheets"; tabId: number; stylesheets: string[] };

export function reducer(state: State, action: Action): State {
    switch (action.type) {
    case "add":
        return add(state, action.url, action.persist);

    case "remove":
        return remove(state, action.url, action.persist);

    case "updateStylesheets":
        return updateStylesheets(state, action.stylesheets);

    case "updateTabStylesheets":
        return updateTabStylesheets(state, action.tabId, action.stylesheets);

    case "setActive":
        return setActive(state, action.url, action.tabId);

    case "setInactive":
        return setInactive(state, action.url, action.tabId);

    default:
        return state;
    }
}

function add(state: State, url: string, persist: boolean): State {
    const urlExists = state.stylesheets.find((stylesheet) => stylesheet === url);

    // Exit early if URL already exists
    if (urlExists) return state;
    
    const updatedState = {
        ...state,
        stylesheets: [...state.stylesheets, url],
    };

    if (persist) {
        updateStorage(updatedState);
    }

    return updatedState;
}

function remove(state: State, url: string, persist: boolean): State {
    const stylesheets = state.stylesheets.filter((stylesheet) => stylesheet !== url);
    const updatedState = { ...state, stylesheets };

    if (persist) {
        updateStorage(updatedState);
    }

    return updatedState;
}

function updateStylesheets(state: State, stylesheets: string[]): State {
    return { ...state, stylesheets };
}

function updateTabStylesheets(state: State, tabId: number, stylesheets: string[]): State {
    const { tabs } = state;
    tabs[tabId] = new Set(stylesheets);

    return { ...state, tabs };
}

function setActive(state: State, url: string, tabId: number): State {
    const { tabs } = state;

    if (!tabs[tabId]) {
        tabs[tabId] = new Set(url);
    } else if (!tabs[tabId].has(url)) {
        tabs[tabId].add(url);
    }

    return { ...state, tabs };
}

function setInactive(state: State, url: string, tabId: number): State {
    const { tabs } = state;
    
    if (tabs[tabId]) {
        tabs[tabId].delete(url);
        
        if (tabs[tabId].size === 0) {
            delete tabs[tabId];
        }
    }
    
    return { ...state, tabs };
}
