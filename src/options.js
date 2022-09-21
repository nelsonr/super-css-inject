// ESLint
/* global chrome */

const browser = window.chrome || window.browser;
const isFirefox = /Firefox\/\d{1,2}/.test(navigator.userAgent);
const form = document.querySelector('.stylesheets-form');
const message = document.querySelector('.stylesheets-message');
const stylesheetsList = document.querySelector('.stylesheets-list');

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

const sortByName = (stylesSheetA, stylesSheetB) => {
    const nameA = stylesSheetA.name.toLowerCase();
    const nameB = stylesSheetB.name.toLowerCase();

    if (nameA < nameB) {
        return -1;
    } else if (nameA > nameB) {
        return 1;
    }

    return 0;
};

function render(stylesheetsData) {
    if (stylesheetsData.length === 0) {
        message.classList.remove('hidden');
        stylesheetsList.innerHTML = '';

        return false;
    } else {
        message.classList.add('hidden');
    }

    stylesheetsData.sort(sortByName);

    const stylesheetsHTML = stylesheetsData.map((item, index) =>
        renderStylesheet(item, index)
    );

    stylesheetsList.innerHTML = stylesheetsHTML.join('');
    setupStylesheetListeners();

    return true;
}

function setupStylesheetListeners() {
    const stylesheets = stylesheetsList.querySelectorAll('.stylesheet');

    stylesheets.forEach((item, index) => {
        const removeButton = item.querySelector('.stylesheet__delete');

        if (removeButton) {
            removeButton.addEventListener('click', (ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                removeStylesheet(index);
            });
        }
    });
}

function renderStylesheet(stylesheet, index) {
    return `
        <div class="stylesheet" data-index="${index}">
            <div class="stylesheet__url">
                <a href="${stylesheet.url}" target="_blank">${stylesheet.url}</a>
            </div>
            <div class="stylesheet__actions">
                <button class="stylesheet__delete"></button>
            </div>
        </div>
    `;
}

function updateStorage(data) {
    browser.storage.local.set({ SuperCSSInject: data }, () => {
        console.log('storage updated: ', data);
    });
}

function addStylesheet(stylesSheetURL) {
    let urlList = SuperCSSInject.stylesheets.map((stylesSheet) => stylesSheet.url);

    if (urlList.indexOf(stylesSheetURL) !== -1) {
        return false;
    }

    let stylesSheet = new Stylesheet(stylesSheetURL);
    SuperCSSInject.stylesheets.push(stylesSheet);

    updateStorage(SuperCSSInject);
    render(SuperCSSInject.stylesheets);

    return true;
}

function removeStylesheet(stylesSheetIndex) {
    SuperCSSInject.stylesheets = SuperCSSInject.stylesheets.filter((_, index) => {
        return index !== stylesSheetIndex;
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

            SuperCSSInject.stylesheets = SuperCSSInject.stylesheets.map((stylesSheet) => {
                if (!stylesSheet.name) {
                    let urlParts = stylesSheet.url.split('/');
                    stylesSheet.name = urlParts[urlParts.length - 1];
                }

                return stylesSheet;
            });

            render(SuperCSSInject.stylesheets);
        }
    });
});

form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    let stylesSheetField = form.querySelector('input');

    if (stylesSheetField.value === '') {
        return false;
    }

    addStylesheet(stylesSheetField.value);
    stylesSheetField.value = '';
});
