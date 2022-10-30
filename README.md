## <img src="https://github.com/nelsonr/super_css_inject/raw/master/dist/icons/48x48.png" width="24" /> Super CSS Inject

Keep multiple stylesheets ready to inject and change on the fly. Works with **LiveReload**.
Compatible with Chrome and Firefox.

<img src="https://github.com/nelsonr/super_css_inject/raw/master/preview.png" />

### How to install (Chrome)

1. Clone or download the repository zip file (extract it to a folder)
2. Open Chrome extensions page
3. Enable Developer Mode
4. Click on Load Unpacked Extension
5. Select the `dist` folder inside the extension folder

The extension icon should be now visible in Chrome menu.

### How to Use?

1. First, add a stylesheet URL to the list by using the Options page, acessible via the Popup page.
2. On the web page where you want to inject the stylesheet, click on the extension icon to open the popup, click on one or more stylesheets from the list to inject them on your web page.
3. If there's more than one stylesheet selected, they will be injected in the order of your selection.

### Terminology

#### Endpoints

The extension is composed of multiple parts, you can think of them as being endpoints that can communicate with each other, these endpoints are:

-   Content Script
-   Popup Page
-   Options Page
-   Background Worker

**Content Script**

The JavaScript file that gets injected into the web page and the final responsible for managing the HTML necessary to inject or remove the injected stylesheet from the web page.

**Popup Page**

The web page that shows up when you click on the extension icon on the browser. The popup page is responsible for listing the available stylesheets and also responsible for managing the injected stylesheets per tab. Each tab can have multiple stylesheets injected at once.

**Options Page**

The web page responsible for managing the available stylesheets, where you can **add**, **edit** or **remove** stylesheets.

**Background Worker**

A [web worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) responsible for managing the communication between all the other endpoints. It also acts as a kind of session storage to keep track of all injected stylesheets in all browser tabs.
