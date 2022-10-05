import { TabId, Tabs } from "../types";
import { env } from "../utils";

// This object acts as a kind of session storage.
// It keeps track of injected stylesheets per browser tab.
// This information will be stored as long the browser is open.
// It will not persist between browser sessions.
const activeTabs: Tabs = {};

function sendInjectMessageToTab (tabId: number) {
    env.tabs.sendMessage(tabId, {
        action: "inject",
        urlList: [...activeTabs[tabId]]
    });
}

function sendClearMessageToTab (tabId: number, url: string) {
    env.tabs.sendMessage(tabId, {
        action: "clear",
        url: url
    });
}

function getStylesheetsCountByTab (tabId: TabId) {
    if (tabId && activeTabs[tabId] && activeTabs[tabId].size > 0) {
        return activeTabs[tabId].size.toString();
    }

    return "";
}

function isStylesheetActive(tabId: TabId, url: string) {
    if (tabId && url) {
        if (activeTabs[tabId] && activeTabs[tabId].size > 0) {
            return activeTabs[tabId].has(url);
        }
    }

    return false;
}

function injectStylesheet (tabId: TabId, url: string) {
    if (!tabId || isStylesheetActive(tabId, url)) {
        return;
    }
    
    if (!activeTabs[tabId]) {
        activeTabs[tabId] = new Set();
    }

    activeTabs[tabId].add(url);
    updateBadgeText(tabId);
    sendInjectMessageToTab(tabId);
}

function clearStylesheet (tabId: TabId, url: string) {
    if (tabId && isStylesheetActive(tabId, url)) {
        cleanUpRemovedStylesheet(url);

        sendClearMessageToTab(tabId, url);
    }
}

function pageLoad (tabId: TabId) {
    if (tabId && activeTabs[tabId]) {
        updateBadgeText(tabId);

        if (activeTabs[tabId].size > 0) {
            sendInjectMessageToTab(tabId);
        }
    }
}

function getActiveTabs () {
    env.runtime.sendMessage({
        action: "activeTabs",
        activeTabs: activeTabs
    });
}

// Should be called when a stylesheet is removed entirely from the list
// It also updates the number of injected stylesheets in the extension badge.
// If the removed stylesheet was the only one injected, it removes the badge marker. 
function cleanUpRemovedStylesheet (url: string) {
    for (const tabId in activeTabs) {
        activeTabs[tabId].delete(url);

        updateBadgeText(Number(tabId));

        if (activeTabs[tabId].size === 0) {
            delete activeTabs[tabId];
        }
    }
}

function updateBadgeText (tabId: number) {
    env.action.setBadgeText({
        tabId: tabId,
        text: getStylesheetsCountByTab(tabId)
    });
}

function main () {
    env.runtime.onMessage.addListener((message, sender) => {
        const tabId: TabId = message.tabId || sender.tab?.id;

        console.log("Message: ", message);

        switch (message.action) {
        case "pageLoad":
            pageLoad(tabId);
            break;

        case "getActiveTabs":
            getActiveTabs();
            break;

        case "stylesheetRemoved":
            cleanUpRemovedStylesheet(message.url);
            break;

        case "inject":
            injectStylesheet(tabId, message.url);
            break;

        case "clear":
            clearStylesheet(tabId, message.url);
            break;

        default:
            break;
        }
    });
}

main();

// This is just to make the TS compiler happy
export {};
