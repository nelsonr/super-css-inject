// ESLint
/* global chrome */

let activeTabs = {};
let browser = chrome || browser;

browser.runtime.onMessage.addListener((message, sender) => {
    if (message.action === 'pageLoad') {
        if (activeTabs[sender.tab.id] !== undefined) {
            browser.browserAction.setBadgeText({ text: 'ON', tabId: sender.tab.id });
            browser.tabs.sendMessage(sender.tab.id, { action: 'inject', stylesheetIndex: activeTabs[sender.tab.id] });
        }
    }

    if (message.action === 'inject') {
        activeTabs[message.tabId] = message.stylesheetIndex;
        browser.browserAction.setBadgeText({ text: 'ON', tabId: message.tabId });
        browser.tabs.sendMessage(message.tabId, { action: 'inject', stylesheetIndex: message.stylesheetIndex });
    }

    if (message.action === 'clear') {
        activeTabs[message.tabId] = undefined;
        delete activeTabs[message.tabId];

        browser.browserAction.setBadgeText({ text: '', tabId: message.tabId });
        browser.tabs.sendMessage(message.tabId, { action: 'clear' });
    }
});
