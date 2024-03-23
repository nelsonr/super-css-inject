import { FormEvent, useState } from "react";
import { getClassName, validateURL } from "../../utils";

const isFirefox = /Firefox\/\d{1,2}/.test(navigator.userAgent);
const mixedContentURL = "https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content#Warnings_in_Web_Console";

interface IProps {
    onSubmit: (url: string) => unknown;
}

export function StylesheetForm (props: IProps) {
    const { onSubmit } = props;
    const [ url, setURL ] = useState("");
    const [ isFormValid, setValidForm ] = useState(true);

    const handleSubmit = (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        const newURL = url.trim();

        if (newURL.length === 0) {
            return false;
        }

        const isValid = validateURL(newURL);

        if (isValid) {
            setURL("");
            onSubmit(newURL);
            setValidForm(true);
        } else {
            setValidForm(false);
        }
    };

    const inputClassName = isFormValid ? "" : "not-valid";

    const errorClassName = getClassName([
        "text-error",
        isFormValid ? "hidden" : "",
    ]);

    const mixedContentClassName = getClassName([
        "text-help",
        isFirefox ? "" : "hidden",
    ]);

    return (
        <form className="stylesheets-form" onSubmit={handleSubmit}>
            <div className="stylesheets-form__group">
                <input
                    type="text"
                    name="stylesheet-url"
                    value={url}
                    onChange={(ev) => setURL(ev.target.value)}
                    placeholder="Add a CSS file URL here..."
                    className={inputClassName}
                />
                <input
                    type="submit"
                    className="button button--success"
                    value="Add Stylesheet"
                />
            </div>

            <div className={errorClassName}>
                Please provide a valid URL. Example: <code>http://localhost/my-theme.css</code>
            </div>

            <div className={mixedContentClassName}>
                <strong>Note:</strong> Firefox uses <code>http://127.0.0.1</code> instead of <code>http://localhost</code>.
                Click <a href={mixedContentURL} target="_blank" rel="noreferrer">here</a> for more info.
            </div>
        </form>
    );
}
