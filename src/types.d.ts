import { Stylesheet } from "./Stylesheet";

export type TabId = number | undefined;

export type Tabs = {
    [id: number]: string[];
};

export type SuperCSSInject = {
    stylesheets: Stylesheet[];
    tabs: Tabs;
};
