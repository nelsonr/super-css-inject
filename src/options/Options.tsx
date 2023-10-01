import { useEffect, useReducer } from "react";
import { updateStorage } from "../storage";
import { StorageData } from "../types";
import { OptionsReducer } from "./OptionsReducer";
import { StylesheetForm } from "./StylesheetForm";
import { StylesheetList } from "./StylesheetList";

interface IProps {
    initialState: StorageData;
}

function Options (props: IProps) {
    const [ state, setState ] = useReducer(OptionsReducer, props.initialState);

    useEffect(() => {
        updateStorage(state);
    }, [ state ]);

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
            <StylesheetForm onSubmit={addStylesheet} />
            <StylesheetList
                list={state?.stylesheets}
                onRemove={removeStylesheet}
                onUpdate={updateStylesheet}
            />
        </>
    );
}

export default Options;
