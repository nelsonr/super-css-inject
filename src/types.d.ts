export type Tab = chrome.tabs.Tab | undefined;
export type TabId = number | undefined;
export type Stylesheets = string[];

export interface InjectedTabs {
    [id: number]: Stylesheets | undefined;
}

export interface StorageData {
    stylesheets: Stylesheets;
    injected: InjectedTabs;
}

export interface PopupState extends StorageData {
    tabId: TabId;
}
