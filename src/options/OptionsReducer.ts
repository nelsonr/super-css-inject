import { Stylesheet } from "../Stylesheet";
import { InjectedTabs, StorageData } from "../types";
import { cond, validateURL } from "../utils";

type Action =
    | { type: "add"; url: string; }
    | { type: "update"; prevStyleheet: Stylesheet; newStylesheet: Stylesheet; }
    | { type: "remove"; url: string; };

export function OptionsReducer (state: StorageData, action: Action): StorageData {
    switch (action.type) {
    case "add":
        return add(state, action.url);

    case "update":
        return update(state, action.prevStyleheet, action.newStylesheet);

    case "remove":
        return remove(state, action.url);

    default:
        return state;
    }
}

function add (state: StorageData, url: string): StorageData {
    const urlExists = state.stylesheets.find((stylesheet: Stylesheet) => stylesheet.url === url);
    const isValid = validateURL(url);

    if (urlExists || !isValid) {
        return state;
    }

    return {
        ...state,
        stylesheets: [ 
            ...state.stylesheets, 
            (new Stylesheet(url))
        ]
    };
}

function update (state: StorageData, prevStylesheet: Stylesheet, newStylesheet: Stylesheet): StorageData {
    const isDuplicated = state.stylesheets.find((item) => { return item.url === newStylesheet.url; }) && prevStylesheet.url !== newStylesheet.url;

    // If the new URL already exists, do nothing
    if (isDuplicated) {
        return state;
    }

    const updateStylesheet = (item: Stylesheet) => cond((item.url === prevStylesheet.url), newStylesheet, item);
    const stylesheets = state.stylesheets.map(updateStylesheet);
    const injected = updateInjectedURL(state.injected, prevStylesheet.url, newStylesheet.url);

    return { stylesheets, injected };
}

function remove (state: StorageData, url: string): StorageData {
    const stylesheets = state.stylesheets.filter((item: Stylesheet) => item.url !== url);
    const injected = removeInjectedURL(state.injected, url);

    return { stylesheets, injected };
}

function updateInjectedURL (injected: InjectedTabs, urlToUpdate: string, newURL: string): InjectedTabs {
    const updatedTabs = Object
        .entries(injected)
        .map(([ tabId, urlList ]) => {
            return [ 
                tabId, 
                urlList.map((url: string) => cond((url === urlToUpdate), newURL, url)) 
            ];
        })
        .filter(([ _tabId, urlList ]) => urlList.length > 0);

    return Object.fromEntries(updatedTabs);
}

function removeInjectedURL (injected: InjectedTabs, urlToRemove: string): InjectedTabs {
    const updatedTabs = Object
        .entries(injected)
        .map(([ tabId, urlList ]) => {
            return [ 
                tabId, 
                urlList.filter((url: string) => url !== urlToRemove) 
            ];
        })
        .filter(([ _tabId, urlList ]) => urlList.length > 0);

    return Object.fromEntries(updatedTabs);
}
