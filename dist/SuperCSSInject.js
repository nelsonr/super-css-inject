// ESLint
/* global chrome */

let browser = chrome || browser;

function injectStylesheets(urlList) {
    urlList.forEach((url) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url;
        link.classList.add('SuperCSSInject');
        document.head.appendChild(link);
    });
}

function clearStylesheets(url) {
    let links = document.querySelectorAll('link.SuperCSSInject');

    if (links.length > 0) {
        links.forEach((link) => {
            if (link.href === url) {
                link.remove();
            }
        });
    }
}

window.addEventListener('load', () => {
    browser.runtime.sendMessage({ action: 'pageLoad' });
});

browser.runtime.onMessage.addListener((message) => {
    if (message.action == 'inject') {
        injectStylesheets(message.urlList);
    }

    if (message.action == 'clear') {
        clearStylesheets(message.url);
    }
});
