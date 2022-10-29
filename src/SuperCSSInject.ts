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

function main () {
    env.runtime.onMessage.addListener((message) => {
        if (message.action == "inject") {
            console.log("Super CSS Inject!");
            update(message.urlList);
        }
    });
    
    env.runtime.sendMessage({ action: "load" });
}

window.addEventListener("load", main);

// This is just to make the TS compiler happy
export {};
