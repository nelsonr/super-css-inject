import { Stylesheet } from "./Stylesheet";
import { StorageData } from "./types";
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

function importStylesheets (stylesheets: Stylesheet[] | string[]): Stylesheet[] {
    return stylesheets.map((stylesheet: Stylesheet | string) => {
        if (typeof stylesheet === "string") {
            return new Stylesheet(stylesheet);
        }

        return new Stylesheet(stylesheet.url, stylesheet.shortname);
    }).sort(sortByName);
}
