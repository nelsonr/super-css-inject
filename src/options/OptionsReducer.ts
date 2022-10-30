import { updateStorage } from "../storage";
import { StorageData, Tabs } from "../types";
import { validateURL } from "../utils";

type State = StorageData;

type Action =
    | { type: "updateState"; state: State }
    | { type: "add"; url: string; }
    | { type: "update"; url: string; newURL: string; }
    | { type: "remove"; url: string; };

export function OptionsReducer (state: State, action: Action): State {
    switch (action.type) {
    case "updateState":
        return action.state;

    case "add":
        return add(state, action.url);

    case "update":
        return update(state, action.url, action.newURL);

    case "remove":
        return remove(state, action.url);

    default:
        return state;
    }
}

function add (state: State, url: string): State {
    const urlExists = state.stylesheets.find((stylesheet) => stylesheet === url);
    const isValid = validateURL(url);

    if (urlExists || !isValid) {
        return state;
    }
    
    const updatedState = {
        ...state,
        stylesheets: [ ...state.stylesheets, url ] 
    };
    
    updateStorage(updatedState);

    return updatedState;
}

function update (state: State, url: string, newURL: string): State {
    const stylesheets = state.stylesheets.map((stylesheetURL) => {
        return stylesheetURL === url ? newURL : stylesheetURL;
    });

    const updatedState = {
        ...state,
        stylesheets 
    };
    
    updateStorage(updatedState);

    return updatedState;
}

function remove (state: State, url: string): State {
    const stylesheets = state.stylesheets.filter((stylesheet) => stylesheet !== url);
    const injected = removeInjectedURL(state.injected, url);
    const updatedState = {
        stylesheets,
        injected 
    };
    
    updateStorage(updatedState);
    
    return updatedState;
}

function removeInjectedURL (injected: Tabs, url: string): Tabs {
    for (const tabId in injected) {
        if (injected[tabId]) {
            injected[tabId] = injected[tabId]?.filter(item => item !== url);

            if (injected[tabId]?.length == 0) {
                delete injected[tabId];
            }
        }
    }
    
    return injected;
}
