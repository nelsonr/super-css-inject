import { loadStorage, updateStorage } from "../storage";
import { TabId } from "../types";
import { env, sendInjectMessageToTab, updateBadgeCount } from "../utils";

async function getInjectedByTab (tabId: number): Promise<string[]> {
    const storage = await loadStorage();

    return storage.injected[tabId] || [];
}

async function onPageLoad (tabId: number) {
    const injected = await getInjectedByTab(tabId);
    
    sendInjectMessageToTab(tabId, injected);
    updateBadgeCount(injected, tabId);
}

env.runtime.onMessage.addListener((message, sender) => {
    const tabId: TabId = message.tabId || sender.tab?.id;

    console.log("Message: ", message);

    if (message.action === "load" && tabId) {
        onPageLoad(tabId);
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
export { };
