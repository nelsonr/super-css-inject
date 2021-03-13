// ESLint
/* global chrome */

let browser = chrome || browser;
let isFirefox = /Firefox\/\d{1,2}/.test(navigator.userAgent);
let form = document.querySelector('.stylesheets-form');
let message = document.querySelector('.stylesheets-message');

let SuperCSSInject = {
    stylesheets: [],
    tabs: {}
};

class Stylesheet {
    constructor(url) {
        this.url = url;

        let urlParts = this.url.split('/');
        this.name = urlParts[urlParts.length - 1];
    }
}

function render(stylesheetsData) {
    let documentFragment = document.createDocumentFragment();
    let stylesheetsList = document.querySelector('.stylesheets-list');

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
        let stylesheetContainer = document.createElement('div');
        stylesheetContainer.classList.add('stylesheet');

        let stylesheetURL = document.createElement('div');
        stylesheetURL.classList.add('stylesheet__url');
        stylesheetURL.innerHTML = `<a href="${stylesheet.url}" target="_blank">${stylesheet.url}</a>`;

        let stylesheetActions = document.createElement('div');
        stylesheetActions.classList.add('stylesheet__actions');

        let deleteBtn = document.createElement('button');
        deleteBtn.classList.add('stylesheet__delete');

        deleteBtn.addEventListener('click', (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            removeStylesheet(index);
        });

        stylesheetActions.appendChild(deleteBtn);

        stylesheetContainer.setAttribute('data-index', index);
        stylesheetContainer.appendChild(stylesheetURL);
        stylesheetContainer.appendChild(stylesheetActions);

        documentFragment.appendChild(stylesheetContainer);
    });

    stylesheetsList.innerHTML = '';
    stylesheetsList.appendChild(documentFragment);

    return true;
}

function updateStorage(data) {
    browser.storage.local.set({ SuperCSSInject: data }, () => {
        // console.log('storage updated: ', data);
    });
}

function addStylesheet(stylesheetURL) {
    let urlList = SuperCSSInject.stylesheets.map((stylesheet) => stylesheet.url);

    if (urlList.indexOf(stylesheetURL) !== -1) {
        return false;
    }

    let stylesheet = new Stylesheet(stylesheetURL);
    SuperCSSInject.stylesheets.push(stylesheet);

    updateStorage(SuperCSSInject);
    render(SuperCSSInject.stylesheets);

    return true;
}

function removeStylesheet(stylesheetIndex) {
    SuperCSSInject.stylesheets = SuperCSSInject.stylesheets.filter((_, index) => {
        return index !== stylesheetIndex;
    });

    updateStorage(SuperCSSInject);
    render(SuperCSSInject.stylesheets);

    return true;
}

window.addEventListener('load', () => {
    // show mixed content note in firefox
    if (isFirefox) {
        let note = document.querySelector('.note');

        if (note) {
            note.classList.remove('hidden');
        }
    }

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

                return stylesheet;
            });

            render(SuperCSSInject.stylesheets);
        }
    });
});

form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    let styleSheetField = form.querySelector('input');

    if (styleSheetField.value === '') {
        return false;
    }

    addStylesheet(styleSheetField.value);
    styleSheetField.value = '';
});
