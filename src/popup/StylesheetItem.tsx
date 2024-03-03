import { Stylesheet } from "../Stylesheet";
import { getClassName } from "../utils";

interface IProps {
    stylesheet: Stylesheet;
    isSelected: boolean;
    isHidden: boolean;
    selectionOrder: string | null;
    onActiveToggle: (active: boolean) => unknown;
}

export function StylesheetItem (props: IProps) {
    const { stylesheet, isSelected, selectionOrder, isHidden, onActiveToggle } = props;
    const handleActiveChange = () => onActiveToggle(!isSelected);
    const stylesheetName = stylesheet.name;

    const className = getClassName([
        "stylesheet",
        isHidden ? "hidden" : "",
        isSelected ? "stylesheet--active" : "",
        selectionOrder !== null ? "stylesheet--show-order" : "",
    ]);

    return (
        <div className={className} onClick={handleActiveChange}>
            <div className="stylesheet__url" title={stylesheetName}>
                {stylesheetName}
            </div>
            <div className="stylesheet__actions">
                <button className="stylesheet__toggle">{selectionOrder}</button>
            </div>
        </div>
    );
}
