import { StorageData, Stylesheets } from "./types";
import { env, sortByName } from "./utils";

export async function loadStorage (): Promise<StorageData> {
    const { SuperCSSInject } = await env.storage.local.get("SuperCSSInject");
    const { stylesheets, injected } = SuperCSSInject || {};

    return { 
        stylesheets: importStylesheets(stylesheets || []),
        injected: injected || {}
    };
}

export function updateStorage (data: StorageData): Promise<void> {
    return env.storage.local.set({ SuperCSSInject: data });
}

function importStylesheets (stylesheets: { url: string }[] | string[]): Stylesheets {
    return stylesheets.map((stylesheet: { url: string } | string) => {
        const isString = typeof stylesheet === "string";
    
        return isString ? stylesheet : stylesheet.url;
    }).sort(sortByName);
}
