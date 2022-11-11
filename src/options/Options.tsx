import { useReducer } from "react";
import { StorageData } from "../types";
import { OptionsReducer } from "./OptionsReducer";
import { StylesheetForm } from "./StylesheetForm";
import { StylesheetList } from "./StylesheetList";

interface IProps {
    initialState: StorageData;
}

function Options (props: IProps) {
    const [ state, setState ] = useReducer(OptionsReducer, props.initialState);

    const addStylesheet = (url: string) => {
        setState({
            type: "add",
            url: url,
        });
    };

    const updateStylesheet = (url: string, newURL: string) => {
        setState({
            type: "update",
            url: url,
            newURL: newURL,
        });
    };

    const removeStylesheet = (url: string) => {
        setState({
            type: "remove",
            url: url,
        });
    };

    return (
        <>
            <header>
                <div className="column">
                    <img
                        className="logo"
                        src="icons/128x128.png"
                        width="36"
                        alt=""
                    />
                    <h3 className="title">Super CSS Inject Options</h3>
                </div>
            </header>

            <main className="column">
                <StylesheetForm onSubmit={addStylesheet} />
                <StylesheetList
                    list={state?.stylesheets}
                    onRemove={removeStylesheet}
                    onUpdate={updateStylesheet}
                />
            </main>
        </>
    );
}

export default Options;
