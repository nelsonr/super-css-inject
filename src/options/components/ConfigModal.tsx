import { ChangeEvent, FormEvent, useState } from "react";
import { defaultConfig } from "../../storage";
import { Config } from "../../types";
import { getClassName, validateWebSocketURL } from "../../utils";

interface IProps {
    config: Config;
    onUpdate: (config: Config) => unknown;
    onCancel: () => unknown;
}

export function ConfigModal (props: IProps) {
    const { config, onUpdate, onCancel } = props;
    const [ url, setURL ] = useState(config.webSocketServerURL);
    const [ formValidations, setFormValidations ] = useState({
        websocketServerURL: {
            isValid: true,
            validationMessage: ""
        },
    });

    const validateForm = () => {
        const validations = structuredClone(formValidations);

        if (url.length > 0 && validateWebSocketURL(url)) {
            validations.websocketServerURL.isValid = true;
            validations.websocketServerURL.validationMessage = "";
        } else {
            validations.websocketServerURL.isValid = false;
            validations.websocketServerURL.validationMessage = "The URL is not valid.";
        }

        setFormValidations(validations);

        return validations.websocketServerURL.isValid;
    };

    const onSave = (ev: FormEvent) => {
        ev.preventDefault();

        if (validateForm()) {
            onUpdate({ ...config, webSocketServerURL: url });
        }
    };

    const onResetDefaults = () => {
        setURL(defaultConfig.webSocketServerURL);
    };

    const onEditURL = (ev: ChangeEvent<HTMLInputElement>) => {
        setURL(ev.target.value);
    };

    const classNames = {
        websocketServerURL: getClassName([
            "form-field",
            (formValidations.websocketServerURL.isValid ? "" : "form-field--not-valid")
        ]),
    };

    return (
        <div className="modal modal--show">
            <div className="modal__overlay" onClick={onCancel}></div>

            <div className="modal__main">
                <div className="modal__content">
                    <form onSubmit={onSave} className="form">
                        <div className={classNames.websocketServerURL}>
                            <label htmlFor="websocket-server-url">WebSocket Server URL</label>
                            <input id="websocket-server-url" type="text" value={url} onInput={onEditURL} />
                            <div className="validation-message">{formValidations.websocketServerURL.validationMessage}</div>
                            <div className="note">The URL for the WebSocket server that Super CSS Inject will attempt to connect to enable live reload whenever there&apos;s a change to the injected stylesheets.</div>
                        </div>

                        <div className="form-actions">
                            <button className="button button--small" type="button" onClick={onResetDefaults}>Reset Defaults</button>
                            <button className="button button--small" type="button" onClick={onCancel}>Cancel</button>
                            <button className="button button--small button--success" type="submit">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
