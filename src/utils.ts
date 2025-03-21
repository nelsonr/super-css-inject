import { Stylesheet } from "./Stylesheet";
import { loadStorage } from "./storage";
import { MessageData, Tab } from "./types";

/**
 * Alias for accessing the browser extension API.
 *
 * Chrome uses `chrome`. Firefox uses `browser`.
 */
export const env = chrome || browser;

/**
 * Extracts the last portion of the URL, if the last part of the URL
 * is a filename (eg.: `theme.css`) it will return that as result.
 *
 * Example: "http://localhost/my-theme.css" => "my-theme.css"
 *
 * @param url A stylesheet URL
 * @returns The last portion of the URL
 */
export function getStylesheetName (url: string) {
    const urlParts = url.split("/");

    return urlParts[urlParts.length - 1];
}

/**
 * Sorts URLs by the last part, aka the filename.
 *
 * @param stylesheetA Stylesheet
 * @param stylesheetB Stylesheet
 * @returns Order between the two strings
 */
export function sortByName (stylesheetA: Stylesheet, stylesheetB: Stylesheet) {
    const nameA = stylesheetA.name.toLowerCase();
    const nameB = stylesheetB.name.toLowerCase();

    if (nameA < nameB) {
        return -1;
    } else if (nameA > nameB) {
        return 1;
    }

    return 0;
}

/**
 * Get the injected stylesheets for a browser tab
 *
 * @returns Object with list of stylesheets active per browser tab
 */
// export async function getInjectedStylesheets (tabId: number): Promise<Stylesheet[]> {
//     const storage = await loadStorage();

//     return storage.injected[tabId] || [];
// }

/**
 * Tries to get the current active browser tab (if any).
 * It returns either a Tab object or a undefined result, wrapped in a Promise.
 *
 * @returns Tab information wrapped in a Promise
 */
export async function getCurrentTab (): Promise<Tab> {
    const queryOptions = {
        active: true,
        currentWindow: true
    };

    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    const [ tab ] = await env.tabs.query(queryOptions);

    return tab;
}

/**
 * Helper function to create a CSS classes string from an array.
 *
 * Example: `["class-a", "class-b"]` => `"class-a class-b"`
 *
 * @param classes An array of CSS classes
 * @returns A string with CSS classes separated by spaces
 */
export function getClassName (classes: string[]): string {
    return classes.join(" ").trim();
}

/**
 * Sets the badge text for the extension icon on a specific browser tab.
 * Used mainly to highlight the current number of injected Stylesheets on a tab.
 *
 * @param tabId Browser tab identifier
 * @param text The text content for the badge
 */
export function updateBadgeText (tabId: number, text: string) {
    env.action.setBadgeText({
        tabId: tabId,
        text: text
    });
}

export function updateBadgeCount (injected: string[], tabId: number) {
    if (injected && injected.length > 0) {
        console.log("Update count in Tab:", tabId);
        updateBadgeText(tabId, injected.length.toString());
    } else {
        console.log("Clear count in Tab:", tabId);
        updateBadgeText(tabId, "");
    }
}

export async function updateBadgesCount () {
    const { injected } = await loadStorage();
    const tabs: chrome.tabs.Tab[] = await env.tabs.query({});

    for (const tab of tabs) {
        const tabId = tab.id;

        if (tabId) {
            updateBadgeCount(injected[tabId] || [], tabId);
        }
    }
}

/**
 * Validates an URL.
 *
 * @param url The URL string to validate
 * @returns true or false
 */
export function validateURL (url: string): boolean {
    try {
        new URL(url);
    } catch (error) {
        return false;
    }

    return true;
}

/**
 * Validates an WebSocket URL.
 *
 * @param url The URL string to validate
 * @returns true or false
 */
export function validateWebSocketURL (url: string): boolean {
    return url.match(/^ws:\/\/|wss:\/\//) !== null;
}

/**
 * Max number of selected stylesheets in a single browser tab.
 * This is only for the purpose of displaying the selection order in the popup.
 * If you're injecting 10 or more stylesheets at once,
 * you probably need to re-think something.
 */
export const maxSelectionCount = 9;

/**
 * Get the selection order of a stylesheet URL when there's more than
 * one stylesheet selected in a browser tab.
 *
 * @param url The current stylesheet URL
 * @param selectedList A Set of the selected stylesheets for the current browser tab
 * @returns A string with the order or null if there's only a single tab selected
 */
export function getSelectionOrder (url: string, selectedList: string[]) {
    if (selectedList.includes(url) && selectedList.length > 1) {
        // I mean...
        if (selectedList.length > maxSelectionCount) {
            return "🤔";
        }

        const order = [ ...selectedList ].indexOf(url) + 1;

        return `#${order}`;
    }

    return null;
}

/**
 * Sends an "inject" message to a browser tab with a list of stylesheet URLs.
 * Sent by: Background Worker
 *
 * @param tabId Browser tab identifier
 * @param urlList List of stylesheet URLs
 * @returns Promise
 */
export function sendInjectMessageToTab (data: MessageData) {
    return env.tabs.sendMessage(data.tabId, { action: "inject", ...data });
}

export function cond<A,B> (cond: boolean, trueValue: A, falseValue: B) {
    return cond ? trueValue : falseValue;
}

export function assign<T> (obj: T, key: string, value: unknown) {
    return { ...obj, [key]: value };
}
