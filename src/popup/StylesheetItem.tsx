import { Stylesheet } from "../Stylesheet";

interface IProps {
    stylesheet: Stylesheet;
    active: boolean;
    onActiveToggle: (active: boolean) => unknown;
}

export function StylesheetItem (props: IProps) {
    const { stylesheet, active, onActiveToggle } = props;

    const handleActiveChange = () => onActiveToggle(!active);

    const className = [
        "stylesheet",
        (active ? "stylesheet--active" : "")
    ].join(" ").trim();

    return (
        <div className={className} data-index="0" onClick={handleActiveChange}>
            <div className="stylesheet__url" title={stylesheet.name}>{stylesheet.name}</div>
            <div className="stylesheet__actions">
                <button className="stylesheet__toggle"></button>
            </div>
        </div>
    );
}
