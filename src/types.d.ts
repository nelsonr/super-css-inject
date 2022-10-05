import { Stylesheet } from "./Stylesheet";

export type Tabs = {
    [id: number]: Set<string>;
};

export type Tab = chrome.tabs.Tab | undefined;

export type TabId = number | undefined;

export type SuperCSSInject = {
    stylesheets: Stylesheet[];
    tabs: Tabs;
};
