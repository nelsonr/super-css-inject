import { env } from "./utils";

let liveReloadSocket: WebSocket;
let liveReloadConnectionAttempts = 0;
let liveReloadIsConnected = false;
const liveReloadMaxAttempts = 3;

function main () {
    env.runtime.onMessage.addListener((message) => {
        if (message.action == "inject") {
            updateInjectedStylesheets(message.urlList);

            if (message.urlList.length > 0) {
                if (!liveReloadSocket || liveReloadSocket.readyState === WebSocket.CLOSED) {
                    if (liveReloadConnectionAttempts < liveReloadMaxAttempts) {
                        console.log("[SuperCSSInject]: Attempting to connect to Live Reload server.");
                        listenToLiveReload();
                    }
                }
            }
        }
    });

    env.runtime.sendMessage({ action: "load" });
    maintainStylesheetsOrder();
}

function listenToLiveReload () {
    liveReloadSocket = new WebSocket("ws://localhost:35729/livereload");

    liveReloadSocket.addEventListener("open", () => {
        console.log("[SuperCSSInject]: Connected successfully to Live Reload server.");
        liveReloadIsConnected = true;
        env.runtime.sendMessage({ action: "livereload_connect" });
    });

    liveReloadSocket.addEventListener("error", () => {
        liveReloadConnectionAttempts++;
        console.log("[SuperCSSInject]: Failed to connect to Live Reload server.");
        console.log("[SuperCSSInject]: Attempts remaining:", liveReloadMaxAttempts - liveReloadConnectionAttempts);
    });

    liveReloadSocket.addEventListener("message", () => {
        console.log("[SuperCSSInject]: Injected stylesheets changed, refreshing...");
        const injectedStylesheets: NodeListOf<HTMLLinkElement> = document.head.querySelectorAll(".SuperCSSInject");

        injectedStylesheets.forEach((stylesheet: HTMLLinkElement) => {
            // eslint-disable-next-line no-self-assign
            stylesheet.href = stylesheet.href;
        });
    });

    liveReloadSocket.addEventListener("close", () => {
        if (liveReloadIsConnected) {
            console.log("[SuperCSSInject]: Connection to Live Reload server was closed.");
            liveReloadIsConnected = false;
            liveReloadConnectionAttempts = 0;
        }
    });
}

function updateInjectedStylesheets (urlList: string[]) {
    const links: NodeListOf<HTMLLinkElement> = document.querySelectorAll("link.SuperCSSInject");
    const currentList = Array.from(links).map((link) => link.href);

    if (currentList.length > urlList.length) {
        for (const url of currentList) {
            if (!urlList.includes(url)) {
                clearStylesheet(url);
            }
        }
    } else {
        for (const url of urlList) {
            if (!currentList.includes(url)) {
                injectStylesheet(url);
            }
        }
    }
}

function clearStylesheet (url: string) {
    const link = document.querySelector(`link[href="${url}"].SuperCSSInject`);
    link && link.remove();
}

function injectStylesheet (url: string) {
    const link = createLinkElement(url);
    document.head.append(link);
}

function createLinkElement (url: string) {
    const link = document.createElement("link");

    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = url;
    link.classList.add("SuperCSSInject");

    return link;
}

/**
 * Make sure the injected stylesheets are always placed last on the DOM
 *
 * This handles SPAs where is common for additional assets to be loaded after
 * the initial page load and ensures the injected styles retain priority.
 */
function maintainStylesheetsOrder () {
    const observer = new MutationObserver(() => {
        const injectedLinks: NodeListOf<HTMLLinkElement> = document.head.querySelectorAll("link.SuperCSSInject");

        if (injectedLinks.length > 0) {
            const links: NodeListOf<HTMLLinkElement> = document.head.querySelectorAll("link[rel='stylesheet']");
            const lastLink: HTMLLinkElement = links[links.length - 1];
            const isInjectedStylesheetLast = lastLink.className === "SuperCSSInject";

            if (!isInjectedStylesheetLast) {
                observer.disconnect();
                moveInjectedStylesheets();
            }
        }
    });

    observer.observe(document.head, { childList: true });
}

function moveInjectedStylesheets () {
    const links: NodeListOf<HTMLLinkElement> = document.head.querySelectorAll("link.SuperCSSInject");

    for (const link of links) {
        document.head.appendChild(link);
    }

    maintainStylesheetsOrder();
}

window.addEventListener("load", main);

// This is just to make the TS compiler happy
export { };
