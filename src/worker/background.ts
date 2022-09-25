import { Tabs } from "../types";

const activeTabs: Tabs = {};
const env = chrome || browser;

function getActiveStylesheetsCount(tabId: number) {
    if (activeTabs[tabId]) {
        return activeTabs[tabId].length.toString();
    }

    return "";
}

env.runtime.onMessage.addListener((message, sender) => {
    const tabId: number = message.tabId || sender.tab?.id;

    if (message.action === "pageLoad" && activeTabs[tabId]) {
        env.action.setBadgeText({
            text: getActiveStylesheetsCount(tabId),
            tabId: tabId,
        });
        env.tabs.sendMessage(tabId, {
            action: "inject",
            urlList: activeTabs[tabId],
        });
    }

    if (message.action === "inject") {
        if (!activeTabs[tabId]) {
            activeTabs[tabId] = [];
        }

        activeTabs[tabId].push(message.url);
        env.action.setBadgeText({
            text: getActiveStylesheetsCount(tabId),
            tabId: tabId,
        });
        env.tabs.sendMessage(tabId, {
            action: "inject",
            urlList: [message.url],
        });
    }

    if (message.action === "clear" && activeTabs[tabId]) {
        activeTabs[tabId].forEach((stylesheetURL, index) => {
            if (stylesheetURL === message.url) {
                activeTabs[tabId].splice(index, 1);
            }
        });

        if (activeTabs[tabId].length < 1) {
            delete activeTabs[tabId];
        }

        env.action.setBadgeText({
            text: getActiveStylesheetsCount(tabId),
            tabId: tabId,
        });
        env.tabs.sendMessage(tabId, { action: "clear", url: message.url });
    }
});

export {};
