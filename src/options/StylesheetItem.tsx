interface IProps {
    stylesheet: string;
    onRemove: (url: string) => unknown;
}

export function StylesheetItem (props: IProps) {
    const { stylesheet, onRemove } = props;

    const handleRemove = () => onRemove(stylesheet);

    return (
        <div className="stylesheet">
            <div className="stylesheet__url">
                <a href={stylesheet} target="_blank" rel="noreferrer">{stylesheet}</a>
            </div>
            <div className="stylesheet__actions">
                <button className="stylesheet__delete" onClick={handleRemove}></button>
            </div>
        </div>
    );
}
