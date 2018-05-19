let activeTabs = {};

chrome.browserAction.onClicked.addListener((tab) => {
    console.log('Extension icon clicked!');

    if (activeTabs[tab.id] === undefined) {
        activeTabs[tab.id] = true;

        chrome.browserAction.setBadgeText({ text: 'ON', tabId: tab.id });
        chrome.tabs.sendMessage(tab.id, { action: 'inject' });
    } else {
        activeTabs[tab.id] = undefined;
        
        chrome.browserAction.setBadgeText({ text: '', tabId: tab.id });
        chrome.tabs.sendMessage(tab.id, { action: 'clear' });
    } 
});

chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.action === 'pageLoad') {
        if (activeTabs[sender.tab.id]) {
            chrome.browserAction.setBadgeText({ text: 'ON', tabId: sender.tab.id });
            chrome.tabs.sendMessage(sender.tab.id, { action: 'inject' });
        }
    }
});