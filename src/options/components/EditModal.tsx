import { ChangeEvent, FormEvent, useState } from "react";
import { Stylesheet } from "../../Stylesheet";
import { assign, getClassName, validateURL } from "../../utils";

interface IProps {
    stylesheet: Stylesheet;
    onUpdate: (stylesheet: Stylesheet) => unknown;
    onCancel: () => unknown;
}

export function EditModal (props: IProps) {
    const { stylesheet, onUpdate, onCancel } = props;
    const [ editStylesheet, setEditStylesheet ] = useState(stylesheet);
    const [ formValidations, setFormValidations ] = useState({
        url: {
            isValid: true,
            validationMessage: ""
        },
        shortname: {
            isValid: true,
            validationMessage: ""
        }
    });

    const validateForm = () => {
        const validations = structuredClone(formValidations);

        if (editStylesheet.url.length > 0 && validateURL(editStylesheet.url)) {
            validations.url.isValid = true;
            validations.url.validationMessage = "";
        } else {
            validations.url.isValid = false;
            validations.url.validationMessage = "The URL is not valid.";
        }

        setFormValidations(validations);

        if (validations.url.isValid && validations.shortname.isValid) {
            return true;
        }

        return false;
    };

    const onSave = (ev: FormEvent) => {
        ev.preventDefault();

        if (validateForm()) {
            onUpdate(editStylesheet);
        }
    };

    const onEdit = (key: string, value: string) => setEditStylesheet(assign(editStylesheet, key, value));
    const onEditURL = (ev: ChangeEvent<HTMLInputElement>) => onEdit("url", ev.target.value);
    const onEditShortname = (ev: ChangeEvent<HTMLInputElement>) => onEdit("shortname", ev.target.value);

    const classNames = {
        formFieldURL: getClassName([
            "form-field",
            (formValidations.url.isValid ? "" : "form-field--not-valid")
        ]),
        formFieldShortname: getClassName([
            "form-field",
            (formValidations.shortname.isValid ? "" : "form-field--not-valid")
        ])
    };

    return (
        <div className="modal modal--show">
            <div className="modal__overlay" onClick={onCancel}></div>

            <div className="modal__main">
                <div className="modal__content">
                    <form onSubmit={onSave} className="form">
                        <div className={classNames.formFieldURL}>
                            <label htmlFor="url">URL</label>
                            <input id="url" type="text" value={editStylesheet.url} onInput={onEditURL} />
                            <div className="validation-message">{formValidations.url.validationMessage}</div>
                        </div>

                        <div className={classNames.formFieldShortname}>
                            <label htmlFor="shortname">Shortname</label>
                            <input id="shortname" type="text" placeholder="Choose a shortname for your stylesheet, e.g. My Amazing Theme" value={editStylesheet.shortname} onInput={onEditShortname} />
                            <div className="validation-message">{formValidations.shortname.validationMessage}</div>
                        </div>

                        <div className="form-actions">
                            <button className="button button--small" type="button" onClick={onCancel}>Cancel</button>
                            <button className="button button--small button--success" type="submit">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
