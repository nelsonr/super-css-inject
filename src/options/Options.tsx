import { useEffect, useReducer } from "react";
import { Stylesheet } from "../Stylesheet";
import { updateStorage } from "../storage";
import { StorageData } from "../types";
import { OptionsReducer } from "./OptionsReducer";
import { StylesheetForm } from "./components/StylesheetForm";
import { StylesheetListTable } from "./components/StylesheetListTable";

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

    const updateStylesheet = (prevStylesheet: Stylesheet, newStylesheet: Stylesheet) => {
        setState({
            type: "update",
            prevStyleheet: prevStylesheet,
            newStylesheet: newStylesheet
        });
    };

    const removeStylesheet = (url: string) => {
        setState({
            type: "remove",
            url: url
        });
    };

    return (
        <>
            <StylesheetForm onSubmit={addStylesheet} />
            <StylesheetListTable
                list={state?.stylesheets}
                onRemove={removeStylesheet}
                onUpdate={updateStylesheet}
            />
        </>
    );
}

export default Options;
