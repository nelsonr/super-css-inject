let browser = chrome || browser;

function injectStylesheets() {
    console.log('Inject stylesheets');
    
    browser.storage.local.get(['SuperCSSInject'], (storage) => {
        if (storage.SuperCSSInject) {
            storage.SuperCSSInject.stylesheets.forEach((stylesheet) => {
                if (stylesheet.active) {
                    var link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.type = 'text/css';
                    link.href = stylesheet.url;
                    document.head.appendChild(link);
                }
            });
        }
    });
}

function clearStylesheets() {
    console.log('clear stylesheets');

    browser.storage.local.get(['SuperCSSInject'], (storage) => {
        if (storage.SuperCSSInject) {
            storage.SuperCSSInject.stylesheets
                .filter((stylesheet) => stylesheet.active)
                .forEach((stylesheet) => {
                    let links = document.head.querySelectorAll(`link[href="${stylesheet.url}"`);

                    if (links.length > 0) {
                        links.forEach((link) => link.remove());
                    } 
                });
        }
    });
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