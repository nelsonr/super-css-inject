import { InjectedTabs, StorageData } from "../types";
import { validateURL } from "../utils";

type Action =
    | { type: "add"; url: string; }
    | { type: "update"; url: string; newURL: string; }
    | { type: "remove"; url: string; };

export function OptionsReducer (state: StorageData, action: Action): StorageData {
    switch (action.type) {
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

function add (state: StorageData, url: string): StorageData {
    const urlExists = state.stylesheets.find((stylesheet) => stylesheet === url);
    const isValid = validateURL(url);

    if (urlExists || !isValid) {
        return state;
    }

    const updatedState = {
        ...state,
        stylesheets: [ ...state.stylesheets, url ]
    };

    return updatedState;
}

function update (state: StorageData, url: string, newURL: string): StorageData {
    const stylesheets = state.stylesheets.map((stylesheetURL) => {
        return stylesheetURL === url ? newURL : stylesheetURL;
    });

    const updatedState = {
        ...state,
        stylesheets
    };

    return updatedState;
}

function remove (state: StorageData, url: string): StorageData {
    const stylesheets = state.stylesheets.filter((stylesheet) => stylesheet !== url);
    const injected = removeInjectedURL(state.injected, url);
    const updatedState = {
        stylesheets,
        injected
    };

    return updatedState;
}

function removeInjectedURL (injected: InjectedTabs, urlToRemove: string): InjectedTabs {
    const updatedTabs = Object
        .entries(injected)
        .map(([ tabId, urlList ]) => {
            return [ tabId, urlList.filter((url: string) => url !== urlToRemove) ];
        })
        .filter(([ _tabId, urlList ]) => {
            return urlList.length > 0;
        });

    return Object.fromEntries(updatedTabs);
}
