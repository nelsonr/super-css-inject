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
        const { stylesheets } = storage.SuperCSSInject;

        if (stylesheets !== undefined) {
            state.stylesheets = stylesheets.map((stylesheet: Stylesheet | string) => {
                if (typeof stylesheet === "string") {
                    return stylesheet;
                } else {
                    return stylesheet.url;
                }
            });

            state.stylesheets.sort(sortByName);
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

export function withStorage(data: SuperCSSInject) {
    updateStorage(data);

    return data;
}
