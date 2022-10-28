import { loadStorage } from "./storage";
import { Stylesheets, Tab } from "./types";

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
export function getStylesheetName(url: string) {
    const urlParts = url.split("/");
    return urlParts[urlParts.length - 1];
}

/**
 * Sorts URLs by the last part, aka the filename.
 * 
 * @param urlA URL string
 * @param urlB URL string
 * @returns Order between the two strings
 */
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
 * Get the injected stylesheets for a browser tab
 * 
 * @returns Object with list of stylesheets active per browser tab
 */
export async function getInjectedStylesheets (tabId: number): Promise<Stylesheets> {
    const storage = await loadStorage();

    return storage.injected[tabId] || [];
}

/**
 * Tries to get the current active browser tab (if any).
 * It returns either a Tab object or a undefined result, wrapped in a Promise.
 * 
 * @returns Tab information wrapped in a Promise
 */
export async function getCurrentTab (): Promise<Tab> {
    const queryOptions = { active: true, currentWindow: true };
    
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    const [tab] = await env.tabs.query(queryOptions);

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
export function setCSSClasses (classes: string[]): string {
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

/**
 * Validates an URL.
 * 
 * @param url The URL string to validate
 * @returns true or false
 */
export function validateURL(url: string): boolean {
    try {
        new URL(url);
    } catch (error) {
        return false; 
    }

    return true;
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
        
        const order = [...selectedList].indexOf(url) + 1;
        
        return `#${order}`;
    }

    return null;
}
