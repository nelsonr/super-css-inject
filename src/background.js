// ESLint
/* global chrome */

let activeTabs = {};
let browser = chrome || browser;

browser.runtime.onMessage.addListener((message, sender) => {
    if (message.action === 'pageLoad') {
        if (activeTabs[sender.tab.id] !== undefined) {
            browser.browserAction.setBadgeText({ text: 'ON', tabId: sender.tab.id });
            browser.tabs.sendMessage(sender.tab.id, { action: 'inject', urlList: activeTabs[sender.tab.id] });
        }
    }

    if (message.action === 'inject') {
        if (!activeTabs[message.tabId]) {
            activeTabs[message.tabId] = [];
        }

        activeTabs[message.tabId].push(message.url);
        browser.browserAction.setBadgeText({ text: 'ON', tabId: message.tabId });
        browser.tabs.sendMessage(message.tabId, { action: 'inject', urlList: [message.url] });
    }

    if (message.action === 'clear') {
        activeTabs[message.tabId].forEach((stylesheetURL, index) => {
            if (stylesheetURL === message.url) {
                activeTabs[message.tabId].splice(index, 1);
            }
        });

        if (activeTabs[message.tabId].length < 1) {
            delete activeTabs[message.tabId];
        }

        browser.browserAction.setBadgeText({ text: '', tabId: message.tabId });
        browser.tabs.sendMessage(message.tabId, { action: 'clear', url: message.url });
    }
});
