import { ChangeEvent, FormEvent, useState } from "react";
import { Stylesheet } from "../../Stylesheet";
import { assign } from "../../utils";

interface IProps {
    stylesheet: Stylesheet;
    onUpdate: (stylesheet: Stylesheet) => unknown;
    onCancel: () => unknown;
}

export function EditModal (props: IProps) {
    const { stylesheet, onUpdate, onCancel } = props;
    const [ editStylesheet, setEditStylesheet ] = useState(stylesheet);

    const isValid = () => {
        return true;
    };

    const onSave = (ev: FormEvent) => { 
        ev.preventDefault();
        isValid() && onUpdate(editStylesheet);
    };

    const onEdit = (key: string, value: string) => setEditStylesheet(assign(editStylesheet, key, value));
    const onEditURL = (ev: ChangeEvent<HTMLInputElement>) => onEdit("url", ev.target.value);
    const onEditShortname = (ev: ChangeEvent<HTMLInputElement>) => onEdit("shortname", ev.target.value);

    return (
        <div className="modal modal--show">
            <div className="modal__overlay" onClick={onCancel}></div>
            
            <div className="modal__main">
                <div className="modal__content">
                    <form onSubmit={onSave} className="form">
                        <div className="form-field">
                            <label htmlFor="">URL</label>
                            <input type="text" value={editStylesheet.url} onChange={onEditURL} />
                        </div>
                        
                        <div className="form-field">
                            <label htmlFor="">Shortname</label>
                            <input type="text" value={editStylesheet.shortname} onChange={onEditShortname} />
                        </div>

                        <div className="form-actions">
                            <button type="button" onClick={onCancel}>Cancel</button>
                            <button type="submit">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
