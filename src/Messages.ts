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
 * Broadcasts a message to all listeners about an stylesheet that was removed.
 * Sent by: Options page
 * 
 * @returns Promise
 */
export function broadcastStylesheetRemoved () {
    return env.runtime.sendMessage({ action: "stylesheetRemoved", });
}
