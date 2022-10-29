import {
    getSelectionOrder,
    getStylesheetName,
    maxSelectionCount,
    setCSSClasses,
} from "../utils";
import { StylesheetItem } from "./StylesheetItem";

interface IProps {
    list: string[];
    activeList: string[];
    search: string;
    onSelectionChange: (isActive: boolean, url: string) => unknown;
}

export function StylesheetList (props: IProps) {
    const { list, activeList, search, onSelectionChange } = props;

    const searchIsEmpty = search.trim().length === 0;
    const searchRegex = new RegExp(search.trim(), "gi");

    const stylesheets = list.map((stylesheet: string, index: number) => {
        const isSelected = activeList.includes(stylesheet);
        const selectionOrder = getSelectionOrder(stylesheet, activeList);
        const name = getStylesheetName(stylesheet);
        const isFiltered = !searchIsEmpty && name.match(searchRegex) === null;

        const handleActiveChange = (isActive: boolean) => {
            return onSelectionChange(isActive, stylesheet);
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

    const listClassName = setCSSClasses([
        "stylesheets-list",
        activeList.length > maxSelectionCount ? "stylesheets-list--emoji" : "",
    ]);

    return <div className={listClassName}>{stylesheets}</div>;
}
