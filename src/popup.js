// ESLint
/* global chrome */

let browser = chrome || browser;
let message = document.querySelector('.stylesheets-message');
let searchEl = document.querySelector('.search');
let searchInput = searchEl.querySelector('input[type="text"]');
let searchInputClear = searchEl.querySelector('.icon-cross');

let SuperCSSInject = {
    stylesheets: [],
    tabs: {}
};

function render(stylesheetsData, tabId) {
    let documentFragment = document.createDocumentFragment();
    let stylesheetsList = document.querySelector('.stylesheets-list');
    let showSearch = stylesheetsData.length > 8;

    if (showSearch) {
        searchEl.classList.remove('hidden');
        searchInput.focus();
    }

    if (stylesheetsData.length === 0) {
        message.classList.remove('hidden');
        stylesheetsList.innerHTML = '';

        return false;
    } else {
        message.classList.add('hidden');
    }

    // sort stylesheets by name
    stylesheetsData.sort((stylesheet_A, stylesheet_B) => {
        let nameA = stylesheet_A.name.toLowerCase();
        let nameB = stylesheet_B.name.toLowerCase();

        if (nameA < nameB) {
            return -1;
        } else if (nameA > nameB) {
            return 1;
        }

        return 0;
    });

    stylesheetsData.forEach((stylesheet, index) => {
        if (!stylesheet.hidden) {
            let stylesheetContainer = document.createElement('div');
            stylesheetContainer.classList.add('stylesheet');

            let stylesheetURL = document.createElement('div');
            stylesheetURL.classList.add('stylesheet__url');
            stylesheetURL.setAttribute('title', stylesheet.name);

            stylesheetURL.innerText = stylesheet.name;

            let stylesheetActions = document.createElement('div');
            stylesheetActions.classList.add('stylesheet__actions');

            let toggleBtn = document.createElement('button');
            toggleBtn.classList.add('stylesheet__toggle');

            stylesheetContainer.addEventListener('click', () => {
                stylesheetContainer.classList.toggle('active');
                toggleStylesheet(index, tabId);
            });

            stylesheetActions.appendChild(toggleBtn);

            if (index === getActiveStylesheet(tabId)) {
                stylesheetContainer.classList.add('stylesheet--active');
            }

            stylesheetContainer.setAttribute('data-index', index);
            stylesheetContainer.appendChild(stylesheetURL);
            stylesheetContainer.appendChild(stylesheetActions);

            documentFragment.appendChild(stylesheetContainer);
        }
    });

    stylesheetsList.innerHTML = '';
    stylesheetsList.appendChild(documentFragment);

    return true;
}

function search(query, stylesheetsData) {
    let queryRegex = new RegExp(query, 'gi');

    return stylesheetsData.map((stylesheet) => {
        if (query.length > 0 && !stylesheet.name.match(queryRegex)) {
            stylesheet.hidden = true;
        } else {
            stylesheet.hidden = false;
        }

        return stylesheet;
    });
}

function getActiveStylesheet(tabId) {
    return SuperCSSInject.tabs[tabId];
}

function setActiveStylesheet(stylesheetIndex, tabId) {
    SuperCSSInject.tabs[tabId] = stylesheetIndex;
    updateStorage(SuperCSSInject);
}

function clearActiveStylesheet(tabId) {
    SuperCSSInject.tabs[tabId] = undefined;
    delete SuperCSSInject.tabs[tabId];
    updateStorage(SuperCSSInject);
}

function updateStorage(data) {
    browser.storage.local.set({ SuperCSSInject: data });
}

function toggleStylesheet(stylesheetIndex, tabId) {
    if (SuperCSSInject.tabs[tabId] === stylesheetIndex) {
        clearActiveStylesheet(tabId);
        browser.runtime.sendMessage({ action: 'clear', tabId: tabId });
    } else {
        setActiveStylesheet(stylesheetIndex, tabId);
        browser.runtime.sendMessage({ action: 'inject', tabId: tabId, stylesheetIndex: stylesheetIndex });
    }

    render(SuperCSSInject.stylesheets, tabId);

    return true;
}

window.addEventListener('load', () => {
    browser.storage.local.get(['SuperCSSInject'], (storage) => {
        if (storage.SuperCSSInject !== undefined) {
            SuperCSSInject = storage.SuperCSSInject;

            if (SuperCSSInject.tabs === undefined) {
                SuperCSSInject.tabs = {};
            }

            SuperCSSInject.stylesheets = SuperCSSInject.stylesheets.map((stylesheet) => {
                if (!stylesheet.name) {
                    let urlParts = stylesheet.url.split('/');
                    stylesheet.name = urlParts[urlParts.length - 1];
                }

                stylesheet.hidden = false;

                return stylesheet;
            });

            browser.tabs.query({ currentWindow: true, active: true }, (tabs) => {
                render(SuperCSSInject.stylesheets, tabs[0].id);

                searchInput.addEventListener('input', (_) => {
                    if (searchInput.value.length > 0) {
                        searchInputClear.classList.remove('hidden');
                    } else {
                        searchInputClear.classList.add('hidden');
                    }

                    render(search(searchInput.value, SuperCSSInject.stylesheets), tabs[0].id);
                });

                searchInputClear.addEventListener('click', (_) => {
                    searchInput.value = '';
                    searchInput.dispatchEvent(new Event('input'));
                });
            });
        }
    });

    let buttons = document.querySelectorAll('[data-action="preferences"]');

    buttons.forEach((button) => {
        button.addEventListener('click', () => browser.runtime.openOptionsPage());
    });
});
