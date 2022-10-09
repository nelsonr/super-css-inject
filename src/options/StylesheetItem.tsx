import { FormEvent, useRef, useState } from "react";
import { setCSSClasses, validateURL } from "../utils";

interface IProps {
    url: string;
    onRemove: (url: string) => unknown;
    onUpdate: (url: string, newURL: string) => unknown;
}

export function StylesheetItem (props: IProps) {
    const { url, onRemove, onUpdate } = props;
    const [isEdit, setIsEdit] = useState(false);
    const [isFormValid, setValidForm] = useState(true);
    const textInputRef = useRef<HTMLInputElement>(null);

    const handleRemove = () => onRemove(url);
    const handleCancel = () => {
        setIsEdit(false);
        setValidForm(true);
    };
    const handleEdit = () => setIsEdit(true);
    
    const handleUpdate = (ev: FormEvent) => {
        ev.preventDefault();

        if (textInputRef.current) {
            const newURL = textInputRef.current.value;
            const hasChanged = newURL !== url;
            const isValid = validateURL(newURL);

            if (hasChanged) {
                if (isValid) {
                    onUpdate(url, textInputRef.current.value);
                    setIsEdit(false);
                    setValidForm(true);
                } else {
                    setValidForm(false);
                }
            } else {
                setIsEdit(false);
                setValidForm(true);
            }
        } else {
            setIsEdit(false);
        }
    };

    const renderEdit = () => {
        const inputClassName = (isFormValid ? "" : "not-valid");
        
        return ( 
            <form className="stylesheet" onSubmit={handleUpdate}>
                <div className="stylesheet__url">
                    <input type="text" defaultValue={url} ref={textInputRef} className={inputClassName} autoFocus />
                </div>
                <div className="stylesheet__actions">
                    <button className="button button--small button--success" type="submit">Save</button>
                    <button className="button button--small" type="button" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        );
    };

    const renderDefault = () => {
        return ( 
            <div className="stylesheet">
                <div className="stylesheet__url">
                    <a href={url} target="_blank" rel="noreferrer">{url}</a>
                </div>
                <div className="stylesheet__actions">
                    <button className="button button--small button--icon" onClick={handleEdit}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M15.728 9.686l-1.414-1.414L5 17.586V19h1.414l9.314-9.314zm1.414-1.414l1.414-1.414-1.414-1.414-1.414 1.414 1.414 1.414zM7.242 21H3v-4.243L16.435 3.322a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414L7.243 21z"/></svg>
                    </button>
                    <button className="button button--small button--icon button--danger" onClick={handleRemove}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"/></svg>
                    </button>
                </div>
            </div>
        );
    };
    
    return (isEdit ? renderEdit() : renderDefault());
}
