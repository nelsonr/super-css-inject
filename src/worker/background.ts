import { loadStorage, updateStorage } from "../storage";
import { TabId } from "../types";
import { env, sendInjectMessageToTab, updateBadgeCount } from "../utils";

async function onPageLoad (tabId: number) {
    const storage = await loadStorage();
    const injected = storage.injected[tabId] || [];

    sendInjectMessageToTab({
        tabId: tabId,
        urlList: injected,
        webSocketServerURL: storage.config.webSocketServerURL
    });
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
