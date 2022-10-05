import { Stylesheet } from "./Stylesheet";
import { Tab, Tabs } from "./types";

export const env = chrome || browser;

export function sortByName (stylesSheetA: Stylesheet, stylesSheetB: Stylesheet) {
    const nameA = stylesSheetA.name.toLowerCase();
    const nameB = stylesSheetB.name.toLowerCase();

    if (nameA < nameB) {
        return -1;
    } else if (nameA > nameB) {
        return 1;
    }

    return 0;
}

/**
 * Get the active stylesheets per browser tab
 * 
 * @returns Object with list of stylesheets active per browser tab
 */
export function getTabs(): Promise<Tabs> {
    return new Promise((resolve, reject) => {
        try {
            env.runtime.onMessage.addListener((message) => {
                if (message.action === "activeTabs") {
                    resolve(message.activeTabs);
                }
            });
                        
            env.runtime.sendMessage({ action: "getActiveTabs" });
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

export function toggleActiveStylesheet (tabId: number, isActive: boolean, url: string) {
    if (isActive) {
        env.runtime.sendMessage({ 
            action: "inject", 
            tabId: tabId, 
            url: url 
        }).then(
            () => console.log("INJECT"),
            (error) => console.error(error)
        );
    } else {
        env.runtime.sendMessage({ 
            action: "clear", 
            tabId: tabId, 
            url: url 
        }).then(
            () => console.log("CLEAR"),
            (error) => console.error(error)
        );
    }
}

export function setCSSClasses (classes: string[]): string {
    return classes.join(" ").trim();
}
