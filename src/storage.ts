import { Stylesheet } from "./Stylesheet";
import { SuperCSSInject } from "./types";
import { env, sortByName } from "./utils";

export async function loadStorage(): Promise<SuperCSSInject> {
    const state: SuperCSSInject = {
        stylesheets: [],
        tabs: {},
    };

    const storage = await env.storage.local.get("SuperCSSInject");

    if (storage.SuperCSSInject !== undefined) {
        const { stylesheets, tabs } = storage.SuperCSSInject;

        if (stylesheets !== undefined) {
            state.stylesheets = stylesheets.map((stylesSheet: Stylesheet) => {
                if (!stylesSheet.name) {
                    const urlParts = stylesSheet.url.split("/");
                    stylesSheet.name = urlParts[urlParts.length - 1];
                }

                return stylesSheet;
            });

            state.stylesheets.sort(sortByName);
        }

        if (tabs !== undefined) {
            state.tabs = tabs;
        }
    }

    return state;
}

export function updateStorage(data: SuperCSSInject) {
    env.storage.local.set({ SuperCSSInject: data }).then(
        () => console.log("Local storage updated!", data),
        (error) => console.error(error)
    );
}
