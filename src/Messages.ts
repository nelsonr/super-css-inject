import { env } from "./utils";

/**
 * Sends an "inject" message to a browser tab with a list of stylesheet URLs.
 * Sent by: Background Worker
 * 
 * @param tabId Browser tab identifier
 * @param urlList List of stylesheet URLs
 * @returns Promise
 */
export function sendInjectMessageToTab (tabId: number, urlList: string[]) {
    return env.tabs.sendMessage(tabId, {
        action: "inject",
        urlList: urlList
    });
}

/**
 * Sends an "clear" message to a browser tab to remove a specific stylesheet URL.
 * Sent by: Background Worker
 * 
 * @param tabId Browser tab identifier
 * @param url Stylesheet URL
 * @returns Promise
 */
export function sendClearMessageToTab (tabId: number, url: string) {
    return env.tabs.sendMessage(tabId, {
        action: "clear",
        url: url
    });
}

/**
 * Broadcasts a message to all listeners with information of 
 * injected stylesheets of a specific browser tab.
 * Sent by: Background Worker
 * 
 * @param tabId Browser tab identifier
 * @param urlList List of stylesheet URLs
 * @returns Promise
 */
export function broadcastTabStylesheets(tabId: number, urlList: string[]) {
    return env.runtime.sendMessage({ 
        action: "tabStylesheets", 
        tabId: tabId, 
        urlList: urlList
    });
}

/**
 * Broadcasts a message to all listeners with information of a stylesheet to inject.
 * Sent by: Popup page
 * 
 * @param tabId Browser tab identifier
 * @param url Stylesheet URL
 * @returns Promise
 */
export function broadcastInjectStylesheet (tabId: number, url: string) {
    return env.runtime.sendMessage({ 
        action: "inject", 
        tabId: tabId, 
        url: url 
    });
}

/**
 * Broadcasts a message to all listeners with information of a stylesheet to clear.
 * Sent by: Popup page
 * 
 * @param tabId Browser tab identifier
 * @param url Stylesheet URL
 * @returns Promise
 */
export function broadcastClearStylesheet (tabId: number, url: string) {
    return env.runtime.sendMessage({ 
        action: "clear", 
        tabId: tabId, 
        url: url 
    });
}

/**
 * Broadcasts a message to all listeners about an stylesheet that was removed.
 * Sent by: Options page
 * 
 * @param url Stylesheet URL
 * @returns Promise
 */
export function broadcastStylesheetRemoved (url: string) {
    return env.runtime.sendMessage({ 
        action: "stylesheetRemoved", 
        url: url
    });
}
