chrome.storage.local.get(['stylesheets'], function(result) {
    if (result.stylesheets !== undefined) {
        result.stylesheets.forEach(stylesheet => {
            if (stylesheet.active) {
                var link = document.createElement('link');

                link.rel = 'stylesheet';
                link.type = 'text/css';
                link.href = stylesheet.url;

                document.head.appendChild(link);
            }
        });
    }
})