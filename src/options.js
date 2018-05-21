let browser = chrome || browser;
let form = document.querySelector('.stylesheets__form');
let message = document.querySelector('.stylesheets__message');
let superCSSInject = {
    stylesheets: []
};

function render(stylesheetsData) {
    let documentFragment = document.createDocumentFragment();
    let stylesheetsList = document.querySelector('.stylesheets ul');

    if (stylesheetsData.length === 0) {
        message.classList.remove('hidden');
        stylesheetsList.innerHTML = '';
        
        return false;
    } else {
        message.classList.add('hidden');
    }

    stylesheetsData.forEach((stylesheet, index) => {
        let li = document.createElement('li');

        let span = document.createElement('span');
        span.innerText = stylesheet.url;

        let deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete');
        deleteBtn.innerText = 'X';

        deleteBtn.addEventListener('click', (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            
            console.log('Delete stylesheet!');
            removeStylesheet(index);
        });

        let toggleBtn = document.createElement('button');
        toggleBtn.classList.add('toggle', 'primary');
        toggleBtn.innerText = 'Set Active';

        toggleBtn.addEventListener('click', (ev) => {
            ev.target.parentElement.classList.toggle('active');
            toggleStylesheet(index);
        });

        let buttonGroup = document.createElement('div');
        buttonGroup.classList.add('button-group');

        buttonGroup.appendChild(toggleBtn);
        buttonGroup.appendChild(deleteBtn);

        if (stylesheet.active) {
            li.classList.add('active');
        }

        li.setAttribute('data-index', index);
        li.appendChild(span);
        li.appendChild(buttonGroup);

        documentFragment.appendChild(li);
    });

    stylesheetsList.innerHTML = '';
    stylesheetsList.appendChild(documentFragment);

    return true;
}

function updateStorage(data) {
    browser.storage.local.set({ SuperCSSInject: data }, () => {
        console.log('storage updated: ', data);
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
    browser.storage.local.get(['SuperCSSInject'], (storage) => {
        console.log("The storage is: ", storage.SuperCSSInject);

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
