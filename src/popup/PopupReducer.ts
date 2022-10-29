import { sendInjectMessageToTab } from "../Messages";
import { updateStorage } from "../storage";
import { PopupState } from "../types";
import { updateBadgesCount } from "../utils";

type State = PopupState;

type Action =
    | { type: "updateState"; state: State }
    | { type: "inject"; url: string; tabId: number; }
    | { type: "clear"; url: string; tabId: number; };

const inject = updateWithStorage(injectAction);
const clear = updateWithStorage(clearAction);

export function PopupReducer (state: State, action: Action): State {
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

function updateWithStorage (action: (state: State, tabId: number, url: string) => State) {
    return (state: State, url: string, tabId: number) => {
        const updatedState = action(state, tabId, url);
        
        updateStorage(updatedState).then(() => {
            sendInjectMessageToTab(tabId, updatedState.injected[tabId] || []);
            updateBadgesCount();
        });
        
        return updatedState;
    };
}

function injectAction (state: State, tabId: number, url: string): State {
    const { injected } = state;
    
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

function clearAction (state: State, tabId: number, url: string): State {
    const { injected } = state;

    if (injected[tabId]) {
        injected[tabId] = injected[tabId]?.filter(item => item !== url);

        if (injected[tabId]?.length == 0) {
            delete injected[tabId];
        }
    }
                    
    return {
        ...state,
        injected 
    };
}
