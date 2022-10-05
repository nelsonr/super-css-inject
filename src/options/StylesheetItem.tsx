import { Stylesheet } from "../Stylesheet";

interface IProps {
    stylesheet: Stylesheet;
    onRemove: (url: string) => unknown;
}

export function StylesheetItem (props: IProps) {
    const { stylesheet, onRemove } = props;

    const handleRemove = () => onRemove(stylesheet.url);

    return (
        <div className="stylesheet">
            <div className="stylesheet__url">
                <a href={stylesheet.url} target="_blank" rel="noreferrer">{stylesheet.url}</a>
            </div>
            <div className="stylesheet__actions">
                <button className="stylesheet__delete" onClick={handleRemove}></button>
            </div>
        </div>
    );
}
