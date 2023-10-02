import { PopupState } from "../types";

type Action =
    | { type: "inject"; url: string; tabId: number; }
    | { type: "clear"; url: string; tabId: number; };

export function PopupReducer (state: PopupState, action: Action): PopupState {
    switch (action.type) {
    case "inject":
        return inject(state, action.tabId, action.url);
        
    case "clear":
        return clear(state, action.tabId, action.url);
        
    default:
        return state;
    }
}

function inject (state: PopupState, tabId: number, url: string): PopupState {
    const { injected } = structuredClone(state);
    
    if (injected[tabId]) {
        if (!injected[tabId]?.includes(url)) {
            injected[tabId]?.push(url);
        }
    } else {
        injected[tabId] = [ url ];
    }
    
    return {
        ...state,
        injected
    };
}

function clear (state: PopupState, tabId: number, url: string): PopupState {
    const { injected } = structuredClone(state);

    if (injected[tabId]) {
        injected[tabId] = injected[tabId]?.filter((_url: string) => _url !== url);

        if (injected[tabId]?.length == 0) {
            delete injected[tabId];
        }
    }
                    
    return {
        ...state,
        injected 
    };
}
