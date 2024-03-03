export type Tab = chrome.tabs.Tab | undefined;
export type TabId = number | undefined;

export interface InjectedTabs {
    [id: number]: string[] | undefined;
}

export interface StorageData {
    stylesheets: Stylesheet[];
    injected: InjectedTabs;
}

export interface PopupState extends StorageData {
    tabId: TabId;
}
