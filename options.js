var stylesheets = [];
var form = document.querySelector('form');

window.addEventListener('load', function (ev) {
    chrome.storage.local.get(['stylesheets'], function (results) {
        console.log("The results is: ", results.stylesheets);
        
        if (results.stylesheets !== undefined) {
            stylesheets = results.stylesheets;
        }

        if (stylesheets.length === 0) {
            return false;
        }

        let documentFragment = document.createDocumentFragment();
        let stylesheetsList = document.querySelector('.stylesheets ul');

        stylesheets.forEach((stylesheet) => {
            let li = document.createElement('li');
            let span = document.createElement('span');

            span.innerText = stylesheet.url;

            li.appendChild(span);
            documentFragment.appendChild(li);
        });

        stylesheetsList.appendChild(documentFragment);
    });
});

form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    let styleSheetField = form.querySelector('input');

    if (styleSheetField.value === "") {
        return false;
    }

    stylesheets.push({
        url: styleSheetField.value,
        active: true
    });

    let stylesheetsData = stylesheets;

    chrome.storage.local.set({stylesheets: stylesheetsData}, function () {
        console.log('storage updated: ', stylesheetsData);
    })
})