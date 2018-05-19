function BetterCSSInject() {
    return {
        stylesheets: []
    };
}

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
        toggleBtn.classList.add('toggle');
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
    chrome.storage.local.set({ BetterCSSInject: data }, () => {
        console.log('storage updated: ', data);
    });
}

function addStylesheet(stylesheetURL) {
    let urlList = betterCSSInject.stylesheets.map((el) => el.url);

    if (urlList.indexOf(stylesheetURL) !== -1) {
        return false;
    }

    betterCSSInject.stylesheets = betterCSSInject.stylesheets.map((stylesheet) => {
        stylesheet.active = false;

        return stylesheet;
    })
    
    betterCSSInject.stylesheets.push({
        url: stylesheetURL,
        active: true
    });

    updateStorage(betterCSSInject);
    render(betterCSSInject.stylesheets);

    return true;
}

function removeStylesheet(stylesheetIndex) {
    betterCSSInject.stylesheets = betterCSSInject.stylesheets.filter((_, index) => {
        return index !== stylesheetIndex;
    });

    updateStorage(betterCSSInject);
    render(betterCSSInject.stylesheets);

    return true;
}

function toggleStylesheet(stylesheetIndex) {
    betterCSSInject.stylesheets = betterCSSInject.stylesheets.map((stylesheet, index) => {
        if (stylesheetIndex === index) {
            stylesheet.active = true;
        } else {
            stylesheet.active = false;
        }
        
        return stylesheet;
    });

    updateStorage(betterCSSInject);
    render(betterCSSInject.stylesheets);

    return true;
}

let form = document.querySelector('.stylesheets__form');
let message = document.querySelector('.stylesheets__message');
let betterCSSInject = new BetterCSSInject();

window.addEventListener('load', (ev) => {
    chrome.storage.local.get(['BetterCSSInject'], (storage) => {
        console.log("The storage is: ", storage.BetterCSSInject);

        if (storage.BetterCSSInject !== undefined) {
            betterCSSInject = storage.BetterCSSInject;
            
            render(betterCSSInject.stylesheets)
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
