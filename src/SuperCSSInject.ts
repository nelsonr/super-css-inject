function injectStylesheets(urlList: string[]) {
    urlList.forEach((url) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = url;
        link.classList.add("SuperCSSInject");
        document.head.appendChild(link);
    });
}

function clearStylesheets(url: string) {
    const links: NodeListOf<HTMLLinkElement> = document.querySelectorAll("link.SuperCSSInject");

    if (links.length > 0) {
        links.forEach((link: HTMLLinkElement) => {
            if (link.href === url) {
                link.remove();
            }
        });
    }
}

function main() {
    const env = window.chrome || window.browser;

    env.runtime.sendMessage({ action: "pageLoad" });
    env.runtime.onMessage.addListener((message) => {
        if (message.action == "inject") {
            injectStylesheets(message.urlList);
        }

        if (message.action == "clear") {
            clearStylesheets(message.url);
        }
    });
}

window.addEventListener("load", main);

// This is just to make the TS compiler happy
export {};
