let activeTabs = {};
let browser = chrome || browser;

browser.browserAction.onClicked.addListener((tab) => {
    if (activeTabs[tab.id] === undefined) {
        activeTabs[tab.id] = true;

        browser.browserAction.setBadgeText({ text: 'ON', tabId: tab.id });
        browser.tabs.sendMessage(tab.id, { action: 'inject' });
    } else {
        activeTabs[tab.id] = undefined;
        
        browser.browserAction.setBadgeText({ text: '', tabId: tab.id });
        browser.tabs.sendMessage(tab.id, { action: 'clear' });
    } 
});

browser.runtime.onMessage.addListener((message, sender) => {
    if (message.action === 'pageLoad') {
        if (activeTabs[sender.tab.id]) {
            browser.browserAction.setBadgeText({ text: 'ON', tabId: sender.tab.id });
            browser.tabs.sendMessage(sender.tab.id, { action: 'inject' });
        }
    }
});