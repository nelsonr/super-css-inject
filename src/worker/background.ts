import {
    sendClearMessageToTab,
    sendInjectMessageToTab
} from "../Messages";

import { loadStorage, updateStorage } from "../storage";
import { TabId } from "../types";
import { env, updateBadgeText } from "../utils";

async function getInjectedByTab (tabId: number): Promise<string[]> {
    const storage = await loadStorage();

    return storage.injected[tabId] || [];
}

async function onPageLoad (tabId: number) {
    const injected = await getInjectedByTab(tabId);
    
    if (injected.length > 0) {
        sendInjectMessageToTab(tabId, injected);
    }
    
    if (injected.length > 0) {
        updateBadgeText(tabId, injected.length.toString());
    } else {
        updateBadgeText(tabId, "");
    }
}

async function onInject (tabId: number) {
    const injected = await getInjectedByTab(tabId);
    
    if (injected.length === 0) {
        return;
    }
    
    updateBadgeText(tabId, injected.length.toString());
    sendInjectMessageToTab(tabId, injected);
}

async function onClear (tabId: number, url: string) {
    const injected = await getInjectedByTab(tabId);
    
    if (!injected.includes(url)) {
        sendClearMessageToTab(tabId, url);
    }
    
    if (injected.length > 0) {
        updateBadgeText(tabId, injected.length.toString());
    } else {
        updateBadgeText(tabId, "");
    }
}

env.runtime.onMessage.addListener((message, sender) => {
    const tabId: TabId = message.tabId || sender.tab?.id;

    console.log("Message: ", message);

    switch (message.action) {
    case "pageLoad":
        if (tabId) {
            onPageLoad(tabId);
        }
        break;

    case "inject":
        if (tabId) {
            onInject(tabId);
        } 
        break;

    case "clear":
        if (tabId) {
            onClear(tabId, message.url);
        }
        break;

    default:
        break;
    }
});

env.tabs.onRemoved.addListener(async (tabId) => {
    const storage = await loadStorage();
    const hasTab = storage.injected[tabId] !== undefined;

    if (hasTab) {
        delete storage.injected[tabId];
        updateStorage(storage);
        console.log("Tab closed:", tabId);
    }
});


// This is just to make the TS compiler happy
export {};
