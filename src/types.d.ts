export type Tab = chrome.tabs.Tab | undefined;
export type TabId = number | undefined;

export interface Config {
    webSocketServerURL: string;
}

export interface InjectedTabs {
    [id: number]: string[] | undefined;
}

export interface StorageData {
    stylesheets: Stylesheet[];
    injected: InjectedTabs;
    config: Config;
}

export interface PopupState extends StorageData {
    tabId: TabId;
}

export interface MessageData {
    tabId: number;
    urlList: string[];
    webSocketServerURL: string;
}

export interface Message extends MessageData {
    action: "inject";
}
