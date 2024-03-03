import { Stylesheet } from "../Stylesheet";
import {
    getClassName,
    getSelectionOrder,
    maxSelectionCount
} from "../utils";
import { StylesheetItem } from "./StylesheetItem";

interface IProps {
    list: Stylesheet[];
    activeList: string[];
    search: string;
    onSelectionChange: (isActive: boolean, url: string) => unknown;
}

export function StylesheetList (props: IProps) {
    const { list, activeList, search, onSelectionChange } = props;

    const searchIsEmpty = search.trim().length === 0;
    const searchRegex = new RegExp(search.trim(), "gi");

    const stylesheets = list.map((stylesheet: Stylesheet, index: number) => {
        const isSelected = activeList.includes(stylesheet.url);
        const selectionOrder = getSelectionOrder(stylesheet.url, activeList);
        const isFiltered = !searchIsEmpty && stylesheet.name.match(searchRegex) === null;

        const handleActiveChange = (isActive: boolean) => {
            return onSelectionChange(isActive, stylesheet.url);
        };

        return (
            <StylesheetItem
                key={index}
                stylesheet={stylesheet}
                isSelected={isSelected}
                selectionOrder={selectionOrder}
                isHidden={isFiltered}
                onActiveToggle={handleActiveChange}
            />
        );
    });

    const listClassName = getClassName([
        "stylesheets-list",
        activeList.length > maxSelectionCount ? "stylesheets-list--emoji" : "",
    ]);

    return <div className={listClassName}>{stylesheets}</div>;
}
