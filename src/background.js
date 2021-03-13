// ESLint
/* global chrome */

let activeTabs = {};
let browser = chrome || browser;

function getActiveStylesheetsCount(tabId) {
    if (activeTabs[tabId]) {
        return activeTabs[tabId].length.toString();
    }

    return '';
}

browser.runtime.onMessage.addListener((message, sender) => {
    const tabId = message.tabId || sender.tab.id;

    if (message.action === 'pageLoad' && activeTabs[tabId]) {
        browser.browserAction.setBadgeText({ text: getActiveStylesheetsCount(tabId), tabId: tabId });
        browser.tabs.sendMessage(tabId, { action: 'inject', urlList: activeTabs[tabId] });
    }

    if (message.action === 'inject') {
        if (!activeTabs[tabId]) {
            activeTabs[tabId] = [];
        }

        activeTabs[tabId].push(message.url);
        browser.browserAction.setBadgeText({ text: getActiveStylesheetsCount(tabId), tabId: tabId });
        browser.tabs.sendMessage(tabId, { action: 'inject', urlList: [message.url] });
    }

    if (message.action === 'clear' && activeTabs[tabId]) {
        activeTabs[tabId].forEach((stylesheetURL, index) => {
            if (stylesheetURL === message.url) {
                activeTabs[tabId].splice(index, 1);
            }
        });

        if (activeTabs[tabId].length < 1) {
            delete activeTabs[tabId];
        }

        browser.browserAction.setBadgeText({ text: getActiveStylesheetsCount(tabId), tabId: tabId });
        browser.tabs.sendMessage(tabId, { action: 'clear', url: message.url });
    }
});
