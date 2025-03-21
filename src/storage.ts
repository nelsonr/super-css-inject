import { Stylesheet } from "./Stylesheet";
import { Config, StorageData } from "./types";
import { env, sortByName } from "./utils";

export const defaultConfig: Config = { webSocketServerURL: "ws://localhost:35729/livereload" };

export async function loadStorage (): Promise<StorageData> {
    const { SuperCSSInject } = await env.storage.local.get("SuperCSSInject");
    const { stylesheets, injected, config } = SuperCSSInject || {};

    return {
        stylesheets: importStylesheets(stylesheets || []),
        injected: injected || {},
        config: config ? { ...defaultConfig, ...config } : {}
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
