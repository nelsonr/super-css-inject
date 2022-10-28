export type Tab = chrome.tabs.Tab | undefined;
export type TabId = number | undefined;
export type Stylesheets = string[];

export interface Tabs {
    [id: number]: Stylesheets;
}

export interface StorageData {
    stylesheets: Stylesheets;
    injected: Tabs;
}

export interface PopupState extends StorageData {
    tabId: TabId;
}
