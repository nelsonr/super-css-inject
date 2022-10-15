import { SuperCSSInject } from "./types";
import { withStorage } from "./storage";
import { validateURL } from "./utils";

type State = SuperCSSInject;

type Action =
    | { type: "add"; url: string; }
    | { type: "update"; url: string; newURL: string; }
    | { type: "remove"; url: string; }
    | { type: "setActive"; url: string; tabId: number; }
    | { type: "setInactive"; url: string; tabId: number; }
    | { type: "updateStylesheets"; stylesheets: string[] }
    | { type: "updateTabStylesheets"; tabId: number; stylesheets: string[] };

export function reducer(state: State, action: Action): State {
    switch (action.type) {
    case "add":
        return withStorage(add(state, action.url));

    case "update":
        return withStorage(update(state, action.url, action.newURL));

    case "remove":
        return withStorage(remove(state, action.url));

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

function add(state: State, url: string): State {
    const urlExists = state.stylesheets.find((stylesheet) => stylesheet === url);
    const isValid = validateURL(url);

    if (urlExists || !isValid) {
        return state;
    }
    
    return {
        ...state,
        stylesheets: [...state.stylesheets, url],
    };
}

function update(state: State, url: string, newURL: string): State {
    const stylesheets = state.stylesheets.map((stylesheetURL) => {
        return stylesheetURL === url ? newURL : stylesheetURL;
    });

    return { ...state, stylesheets };
}

function remove(state: State, url: string): State {
    const stylesheets = state.stylesheets.filter((stylesheet) => stylesheet !== url);

    return { ...state, stylesheets };
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
        tabs[tabId] = new Set();
        tabs[tabId].add(url);
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
