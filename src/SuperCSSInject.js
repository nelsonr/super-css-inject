let browser = chrome || browser;

function injectStylesheets() {
    browser.storage.local.get(['SuperCSSInject'], (storage) => {
        if (storage.SuperCSSInject) {
            storage.SuperCSSInject.stylesheets.forEach((stylesheet) => {
                if (stylesheet.active) {
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

window.addEventListener('load', (ev) => {
    browser.runtime.sendMessage({action: 'pageLoad'});
});

browser.runtime.onMessage.addListener((message) => {
    if (message.action == 'inject') {
        injectStylesheets();
    }

    if (message.action == 'clear') {
        clearStylesheets();
    } 
});