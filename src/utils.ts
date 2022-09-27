import { Stylesheet } from "./Stylesheet";

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

export async function getCurrentTab() {
    const env = chrome || browser;
    const queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    const [tab] = await env.tabs.query(queryOptions);

    return tab;
}
