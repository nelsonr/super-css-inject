import {
    broadcastTabStylesheets,
    sendClearMessageToTab,
    sendInjectMessageToTab
} from "../Messages";

import { TabId, Tabs } from "../types";
import { env, updateBadgeText } from "../utils";

// This object acts as a kind of session storage.
// It keeps track of injected stylesheets per browser tab.
// This information will be stored as long the browser is open.
// It will not persist between browser sessions.
const activeTabs: Tabs = {};

function getStylesheetsByTab (tabId: number): string[] {
    if (activeTabs[tabId] && activeTabs[tabId].size > 0) {
        return [...activeTabs[tabId]];
    }

    return [];
}

function getStylesheetsByTabCount (tabId: number): number {
    return getStylesheetsByTab(tabId).length;
}

function isInjected(tabId: number, url: string) {
    if (activeTabs[tabId] && activeTabs[tabId].size > 0) {
        return activeTabs[tabId].has(url);
    }

    return false;
}

function onPageLoad (tabId: number) {
    if (activeTabs[tabId]) {
        const stylesheetsCountString = getStylesheetsByTabCount(tabId).toString();
        updateBadgeText(tabId, stylesheetsCountString);

        if (activeTabs[tabId].size > 0) {
            sendInjectMessageToTab(tabId, [...activeTabs[tabId]]);
        }
    }
}

function onInject (tabId: number, url: string) {
    if (isInjected(tabId, url)) {
        return;
    }

    if (!activeTabs[tabId]) {
        activeTabs[tabId] = new Set();
    }

    activeTabs[tabId].add(url);

    const stylesheetsCountString = getStylesheetsByTabCount(tabId).toString();
    updateBadgeText(tabId, stylesheetsCountString);
    sendInjectMessageToTab(tabId, [...activeTabs[tabId]]);
}

function onClear (tabId: number, url: string) {
    if (isInjected(tabId, url)) {
        onStylesheetRemoved(url);
        sendClearMessageToTab(tabId, url);
    }
}

function onGetTabStylesheets (tabId: number) {
    const stylesheets = getStylesheetsByTab(tabId);
    broadcastTabStylesheets(tabId, stylesheets);
}

function onStylesheetRemoved (url: string) {
    for (const tabId in activeTabs) {
        activeTabs[tabId].delete(url);

        const tabIdNumber = Number(tabId);
        const stylesheetsCount = getStylesheetsByTabCount(tabIdNumber);

        if (stylesheetsCount > 0) {
            updateBadgeText(tabIdNumber, stylesheetsCount.toString());
        } else {
            updateBadgeText(tabIdNumber, "");
        }

        if (activeTabs[tabId].size === 0) {
            delete activeTabs[tabId];
        }
    }
}

function main () {
    env.runtime.onMessage.addListener((message, sender) => {
        const tabId: TabId = message.tabId || sender.tab?.id;

        console.log("Message: ", message);

        switch (message.action) {
        case "pageLoad":
            if (tabId) {
                onPageLoad(tabId);
            }
            break;

        case "getTabStylesheets":
            if (tabId) {
                onGetTabStylesheets(tabId);
            }
            break;

        case "stylesheetRemoved":
            onStylesheetRemoved(message.url);
            break;

        case "inject":
            if (tabId) {
                onInject(tabId, message.url);
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
}

main();

// This is just to make the TS compiler happy
export {};
