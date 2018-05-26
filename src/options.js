let browser = chrome || browser;
let isFirefox = /Firefox\/\d{1,2}/.test(navigator.userAgent);
let form = document.querySelector('.stylesheets__form');
let message = document.querySelector('.stylesheets__message');
let superCSSInject = {
    stylesheets: []
};

function render(stylesheetsData) {
    let documentFragment = document.createDocumentFragment();
    let stylesheetsList = document.querySelector('.stylesheets__list');

    if (stylesheetsData.length === 0) {
        message.classList.remove('hidden');
        stylesheetsList.innerHTML = '';
        
        return false;
    } else {
        message.classList.add('hidden');
    }

    stylesheetsData.forEach((stylesheet, index) => {
        let stylesheetContainer = document.createElement('div');
        stylesheetContainer.classList.add('stylesheet');
        
        let stylesheetURL = document.createElement('div');
        stylesheetURL.classList.add('stylesheet__url');
        stylesheetURL.innerText = stylesheet.url;

        let stylesheetActions = document.createElement('div');
        stylesheetActions.classList.add('stylesheet__actions');

        let toggleBtn = document.createElement('button');
        toggleBtn.classList.add('stylesheet__toggle');

        toggleBtn.addEventListener('click', (ev) => {
            ev.target.parentElement.classList.toggle('active');
            toggleStylesheet(index);
        });
        
        let deleteBtn = document.createElement('button');
        deleteBtn.classList.add('stylesheet__delete');

        deleteBtn.addEventListener('click', (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            
            console.log('Delete stylesheet!');
            removeStylesheet(index);
        });

        stylesheetActions.appendChild(toggleBtn);
        stylesheetActions.appendChild(deleteBtn);

        if (stylesheet.active) {
            stylesheetContainer.classList.add('stylesheet--active');
        }

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
    let urlList = superCSSInject.stylesheets.map((el) => el.url);

    if (urlList.indexOf(stylesheetURL) !== -1) {
        return false;
    }

    superCSSInject.stylesheets = superCSSInject.stylesheets.map((stylesheet) => {
        stylesheet.active = false;

        return stylesheet;
    })
    
    superCSSInject.stylesheets.push({
        url: stylesheetURL,
        active: true
    });

    updateStorage(superCSSInject);
    render(superCSSInject.stylesheets);

    return true;
}

function removeStylesheet(stylesheetIndex) {
    superCSSInject.stylesheets = superCSSInject.stylesheets.filter((_, index) => {
        return index !== stylesheetIndex;
    });

    updateStorage(superCSSInject);
    render(superCSSInject.stylesheets);

    return true;
}

function toggleStylesheet(stylesheetIndex) {
    superCSSInject.stylesheets = superCSSInject.stylesheets.map((stylesheet, index) => {
        if (stylesheetIndex === index) {
            stylesheet.active = true;
        } else {
            stylesheet.active = false;
        }
        
        return stylesheet;
    });

    updateStorage(superCSSInject);
    render(superCSSInject.stylesheets);

    return true;
}

window.addEventListener('load', (ev) => {
    // show mixed content note in firefox
    if (isFirefox) {
        let note = document.querySelector('.note');
        
        if (note) {
            note.classList.remove('hidden');
        }
    }
    
    browser.storage.local.get(['SuperCSSInject'], (storage) => {
        if (storage.SuperCSSInject !== undefined) {
            superCSSInject = storage.SuperCSSInject;
            
            render(superCSSInject.stylesheets)
        }
    });
});

form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    let styleSheetField = form.querySelector('input');

    if (styleSheetField.value === "") {
        return false;
    }

    addStylesheet(styleSheetField.value);
    styleSheetField.value = '';  
})
