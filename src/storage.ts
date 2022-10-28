import { Stylesheet } from "./Stylesheet";
import { StorageData, Stylesheets } from "./types";
import { env, sortByName } from "./utils";

export async function loadStorage(): Promise<StorageData> {
    const data: StorageData = {
        stylesheets: [],
        injected: {}
    };

    const storage = await env.storage.local.get("SuperCSSInject");

    if (storage.SuperCSSInject !== undefined) {
        const { stylesheets, injected } = storage.SuperCSSInject;

        if (stylesheets !== undefined) {
            data.stylesheets = importStylesheets(stylesheets);
        }

        if (injected !== undefined) {
            data.injected = injected;
        }
    }

    return data;
}

export function updateStorage(data: StorageData): Promise<void> {
    return env.storage.local.set({ SuperCSSInject: data });
}

function importStylesheets(stylesheets: Stylesheet[] | string[]): Stylesheets {
    return stylesheets.map((stylesheet: Stylesheet | string) => {
        const isString = typeof stylesheet === "string";
    
        return isString ? stylesheet : stylesheet.url;
    }).sort(sortByName);
}
