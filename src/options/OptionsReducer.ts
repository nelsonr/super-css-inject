import { updateStorage } from "../storage";
import { StorageData } from "../types";
import { validateURL } from "../utils";

type State = StorageData;

type Action =
    | { type: "add"; url: string; }
    | { type: "update"; url: string; newURL: string; }
    | { type: "remove"; url: string; }
    | { type: "updateState"; state: State };

export function OptionsReducer(state: State, action: Action): State {
    switch (action.type) {
    case "add":
        return add(state, action.url);

    case "update":
        return update(state, action.url, action.newURL);

    case "remove":
        return remove(state, action.url);

    case "updateState":
        return action.state;

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
    
    const updatedState = {
        ...state,
        stylesheets: [...state.stylesheets, url],
    };
    updateStorage(updatedState);

    return updatedState;
}

function update(state: State, url: string, newURL: string): State {
    const stylesheets = state.stylesheets.map((stylesheetURL) => {
        return stylesheetURL === url ? newURL : stylesheetURL;
    });

    const updatedState = { ...state, stylesheets };
    updateStorage(updatedState);

    return updatedState;
}

function remove(state: State, url: string): State {
    const stylesheets = state.stylesheets.filter((stylesheet) => stylesheet !== url);

    const updatedState = { ...state, stylesheets };
    updateStorage(updatedState);
    
    return updatedState;
}