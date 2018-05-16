chrome.browserAction.onClicked.addListener(function(tab) {
    console.log('Extension icon clicked!');

    chrome.tabs.executeScript({
        file: 'injectStylesheet.js'
    });
});