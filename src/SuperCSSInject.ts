import { env } from "./utils";

function inject (url: string) {
    const link = createLinkElement(url);
    document.head.append(link);
}

function clear (url: string) {
    const link = document.querySelector(`link[href="${url}"].SuperCSSInject`);
    link && link.remove();
}

function update (urlList: string[]) {
    const links: NodeListOf<HTMLLinkElement> = document.querySelectorAll("link.SuperCSSInject");
    const currentList = Array.from(links).map((link) => link.href);
    
    if (currentList.length > urlList.length) {
        for (const url of currentList) {
            if (!urlList.includes(url)) {
                clear(url);
            }
        } 
    } else {
        for (const url of urlList) {
            if (!currentList.includes(url)) {
                inject(url);
            }
        } 
    }
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
function observeHeadMutations () {
    const observer = new MutationObserver((mutationsList) => {
        const isInjected = document.head.querySelector("link.SuperCSSInject");

        if (isInjected) {
            for (const mutation of mutationsList) {
                for (const addedNode of mutation.addedNodes) {
                    if (addedNode.nodeName.toLowerCase() === "link") {
                        const node = addedNode as HTMLLinkElement;

                        if (node.className !== "SuperCSSInject") {
                            console.log("Move");
                            observer.disconnect();
                            move();

                            return;
                        }
                    }
                }
            }
        }
    });

    observer.observe(document.head, { childList: true });
}

function move () {
    const links: NodeListOf<HTMLLinkElement> = document.head.querySelectorAll("link");
    const injectedLinks = Array.from(links).filter((link) => link.className === "SuperCSSInject");

    if (injectedLinks.length > 0) {
        for (const link of injectedLinks) {
            document.head.appendChild(link);
        }

        observeHeadMutations();
    }
}

function main () {
    env.runtime.onMessage.addListener((message) => {
        if (message.action == "inject") {
            update(message.urlList);
        }
    });
    
    env.runtime.sendMessage({ action: "load" });
    observeHeadMutations();
}

window.addEventListener("load", main);

// This is just to make the TS compiler happy
export { };
