import { SuperCSSInject, Tabs } from "./types";
import { Stylesheet } from "./Stylesheet";
import { updateStorage } from "./storage";

type State = SuperCSSInject;

type Action =
    | { type: "add"; url: string; persist: boolean }
    | { type: "remove"; url: string; persist: boolean }
    | { type: "setActive"; url: string; tabId: number; }
    | { type: "setInactive"; url: string; tabId: number; }
    | { type: "updateStylesheets"; stylesheets: Stylesheet[] }
    | { type: "updateTabs"; tabs: Tabs };

export function reducer(state: State, action: Action): State {
    switch (action.type) {
    case "add":
        return add(state, action.url, action.persist);

    case "remove":
        return remove(state, action.url, action.persist);

    case "updateStylesheets":
        return updateStylesheets(state, action.stylesheets);

    case "updateTabs":
        return updateTabs(state, action.tabs);

    case "setActive":
        return setActive(state, action.url, action.tabId);

    case "setInactive":
        return setInactive(state, action.url, action.tabId);

    default:
        return state;
    }
}

function add(state: State, url: string, persist: boolean): State {
    const urlExists = state.stylesheets.find((item) => item.url === url);

    // Exit early if URL already exists
    if (urlExists) return state;
    
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

function remove(state: State, url: string, persist: boolean): State {
    const stylesheets = state.stylesheets.filter((stylesheet) => stylesheet.url !== url);
    const updatedState = { ...state, stylesheets };

    if (persist) {
        updateStorage(updatedState);
    }

    return updatedState;
}

function updateStylesheets(state: State, stylesheets: Stylesheet[]): State {
    return { ...state, stylesheets };
}

function updateTabs(state: State, tabs: Tabs): State {
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
