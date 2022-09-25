import { Stylesheet } from "./Stylesheet";

export type Tabs = {
    [id: number]: string[];
};

export type SuperCSSInject = {
    stylesheets: Stylesheet[];
    tabs: Tabs;
};
