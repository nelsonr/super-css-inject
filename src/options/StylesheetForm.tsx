import { FormEvent, useState } from "react";
import { setCSSClasses, validateURL } from "../utils";

const isFirefox = /Firefox\/\d{1,2}/.test(navigator.userAgent);

function MixedContentNote({ show }: { show: boolean }) {
    const mixedContentURL = "https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content#Warnings_in_Web_Console";

    if (!show) {
        return null;
    }

    return (
        <div className="note">
            <strong>Note:</strong> In Firefox use http://127.0.0.1 instead of http://localhost
                (<a href={mixedContentURL} target="_blank" rel="noreferrer">more info</a>).
        </div>
    );
}

interface IProps {
    onSubmit: (url: string) => unknown;
}

export function StylesheetForm (props: IProps) {
    const { onSubmit } = props;
    const [url, setURL] = useState("");
    const [isFormValid, setValidForm] = useState(true);
    
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

    const inputClassName = (isFormValid ? "" : "not-valid");

    const helpClassName = setCSSClasses([
        "help",
        (isFormValid ? "hidden" : "")
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
                <input type="submit" className="button button--success" value="Add Stylesheet" />
            </div>

            <div className={helpClassName}>
                A valid URL should start with <code>http://</code> or <code>https://</code>. Example: <code>http://localhost/my-theme.css</code>
            </div>
            
            <MixedContentNote show={isFirefox} />
        </form>
    );
}
