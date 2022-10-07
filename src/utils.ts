import { Tab } from "./types";

export const env = chrome || browser;

export function getStylesheetName(url: string) {
    const urlParts = url.split("/");
    return urlParts[urlParts.length - 1];
}

export function sortByName (urlA: string, urlB: string) {
    const nameA = getStylesheetName(urlA).toLowerCase();
    const nameB = getStylesheetName(urlB).toLowerCase();

    if (nameA < nameB) {
        return -1;
    } else if (nameA > nameB) {
        return 1;
    }

    return 0;
}

/**
 * Get the injected stylesheets for a tab
 * 
 * @returns Object with list of stylesheets active per browser tab
 */
export function getTabInjectedStylesheets (tabId: number): Promise<string[]> {
    return new Promise((resolve, reject) => {
        try {
            env.runtime.onMessage.addListener((message) => {
                if (message.action === "tabStylesheets") {
                    resolve(message.urlList);
                }
            });
                        
            env.runtime.sendMessage({ 
                action: "getTabStylesheets", 
                tabId: tabId 
            });
        } catch (error) {
            reject(error); 
        }
    });
}

export async function getCurrentTab (): Promise<Tab> {
    const queryOptions = { active: true, lastFocusedWindow: true };
    
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    const [tab] = await env.tabs.query(queryOptions);

    return tab;
}

export function setCSSClasses (classes: string[]): string {
    return classes.join(" ").trim();
}

export function updateBadgeText (tabId: number, text: string) {
    env.action.setBadgeText({
        tabId: tabId,
        text: text
    });
}
