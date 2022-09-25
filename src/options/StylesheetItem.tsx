import { Stylesheet } from "../Stylesheet";

interface IProps {
    id: number;
    stylesheet: Stylesheet;
    onRemove: (id: number) => unknown;
}

export function StylesheetItem (props: IProps) {
    const { id, stylesheet, onRemove } = props;

    const handleRemove = () => onRemove(id);

    return (
        <div className="stylesheet" data-index={id}>
            <div className="stylesheet__url">
                <a href={stylesheet.url} target="_blank" rel="noreferrer">{stylesheet.url}</a>
            </div>
            <div className="stylesheet__actions">
                <button className="stylesheet__delete" onClick={handleRemove}></button>
            </div>
        </div>
    );
}
