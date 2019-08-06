// ESLint
/* global chrome */

let browser = chrome || browser;

function injectStylesheets(stylesheetIndex) {
    browser.storage.local.get(['SuperCSSInject'], (storage) => {
        if (storage.SuperCSSInject) {
            storage.SuperCSSInject.stylesheets.forEach((stylesheet, index) => {
                if (index == stylesheetIndex) {
                    var link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.type = 'text/css';
                    link.href = stylesheet.url;
                    link.classList.add('SuperCSSInject');
                    document.head.appendChild(link);
                }
            });
        }
    });
}

function clearStylesheets() {
    let links = document.querySelectorAll('link.SuperCSSInject');

    if (links.length > 0) {
        links.forEach((link) => link.remove());
    }
}

window.addEventListener('load', () => {
    browser.runtime.sendMessage({ action: 'pageLoad' });
});

browser.runtime.onMessage.addListener((message) => {
    if (message.action == 'inject') {
        clearStylesheets();
        injectStylesheets(message.stylesheetIndex);
    }

    if (message.action == 'clear') {
        clearStylesheets();
    }
});
