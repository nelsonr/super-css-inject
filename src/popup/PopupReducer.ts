import { sendInjectMessageToTab } from "../Messages";
import { updateStorage } from "../storage";
import { PopupState, Tabs } from "../types";
import { updateBadgesCount } from "../utils";

type State = PopupState;

type Action =
    | { type: "updateState"; state: State }
    | { type: "inject"; url: string; tabId: number; }
    | { type: "clear"; url: string; tabId: number; };

const inject = createAction(add);
const clear = createAction(remove);

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

function createAction (action: (injected: Tabs, tabId: number, url: string) => Tabs) {
    return (state: State, url: string, tabId: number) => {
        const injected = action(state.injected, tabId, url);
        const updatedState = {
            ...state,
            injected 
        };
        
        updateStorage(updatedState).then(() => {
            sendInjectMessageToTab(tabId, injected[tabId] || []);
            updateBadgesCount();
        });

        return updatedState;
    };
}

function add (injected: Tabs, tabId: number, url: string): Tabs {
    const tabs = { ...injected };
    
    if (tabs[tabId]) {
        if (!tabs[tabId]?.includes(url)) {
            tabs[tabId]?.push(url);
        }
    } else {
        tabs[tabId] = [ url ];
    }

    return tabs;
}

function remove (injected: Tabs, tabId: number, url: string): Tabs {
    const tabs = { ...injected };
    
    if (tabs[tabId]) {
        tabs[tabId] = tabs[tabId]?.filter(item => item !== url);

        if (tabs[tabId]?.length == 0) {
            delete tabs[tabId];
        }
    }

    return tabs;
}
