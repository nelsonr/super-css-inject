import { getStylesheetName, setCSSClasses } from "../utils";

interface IProps {
    stylesheet: string;
    active: boolean;
    hidden: boolean;
    onActiveToggle: (active: boolean) => unknown;
}

export function StylesheetItem (props: IProps) {
    const { stylesheet, active, hidden, onActiveToggle } = props;

    const handleActiveChange = () => onActiveToggle(!active);

    const className = setCSSClasses([
        "stylesheet",
        (hidden ? "hidden" : ""),
        (active ? "stylesheet--active" : "")
    ]);

    const stylesheetName = getStylesheetName(stylesheet);

    return (
        <div className={className} data-index="0" onClick={handleActiveChange}>
            <div className="stylesheet__url" title={stylesheetName}>{stylesheetName}</div>
            <div className="stylesheet__actions">
                <button className="stylesheet__toggle"></button>
            </div>
        </div>
    );
}
