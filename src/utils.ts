import { Stylesheet } from "./Stylesheet";

export const env = chrome || browser;

export const sortByName = (
    stylesSheetA: Stylesheet,
    stylesSheetB: Stylesheet
) => {
    const nameA = stylesSheetA.name.toLowerCase();
    const nameB = stylesSheetB.name.toLowerCase();

    if (nameA < nameB) {
        return -1;
    } else if (nameA > nameB) {
        return 1;
    }

    return 0;
};

export async function getCurrentTab (): Promise<chrome.tabs.Tab | undefined> {
    const queryOptions = { active: true, lastFocusedWindow: true };
    
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    const [tab] = await env.tabs.query(queryOptions);

    return tab;
}

export function toggleActiveStylesheet (isActive: boolean, activeTabId: number, url: string) {
    if (isActive) {
        env.runtime.sendMessage({ action: "inject", tabId: activeTabId, url: url }).then(
            () => console.log("INJECT"),
            (error) => console.error(error)
        );
    } else {
        env.runtime.sendMessage({ action: "clear", tabId: activeTabId, url: url }).then(
            () => console.log("CLEAR"),
            (error) => console.error(error)
        );
    }
}
