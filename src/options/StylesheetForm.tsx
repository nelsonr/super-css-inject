import { FormEvent, useState } from "react";

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
    
    const handleSubmit = (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        onSubmit(url);
        setURL("");
    };
    
    return (
        <form className="stylesheets-form" onSubmit={handleSubmit}>
            <div className="stylesheets-form__group">
                <input 
                    type="text" 
                    name="stylesheet-url" 
                    value={url} 
                    onChange={(ev) => setURL(ev.target.value)} 
                    placeholder="Insert stylesheet URL here.." 
                />
                <input type="submit" value="Add Stylesheet" />
            </div>

            <MixedContentNote show={isFirefox} />
        </form>
    );
}
