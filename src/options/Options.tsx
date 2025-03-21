import { useEffect, useReducer, useState } from "react";
import { Stylesheet } from "../Stylesheet";
import { updateStorage } from "../storage";
import { Config, StorageData } from "../types";
import { OptionsReducer } from "./OptionsReducer";
import { ConfigModal } from "./components/ConfigModal";
import { StylesheetForm } from "./components/StylesheetForm";
import { StylesheetListTable } from "./components/StylesheetListTable";

interface IProps {
    initialState: StorageData;
}

function Options (props: IProps) {
    const [ state, setState ] = useReducer(OptionsReducer, props.initialState);
    const [ showConfigModal, setShowConfigModal ] = useState(false);

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

    const updateConfig = (config: Config) => {
        setState({
            type: "updateConfig",
            config: config
        });
        setShowConfigModal(false);
    };

    return (
        <>
            <header>
                <div className="column">
                    <img className="logo" src="icons/128x128.png" width="36" alt="" />
                    <h3 className="title">Super CSS Inject Options</h3>

                    <div className="menu">
                        <button className="button--small" onClick={() => setShowConfigModal(!showConfigModal)}>Config</button>
                        {showConfigModal && (
                            <ConfigModal config={state.config}
                                onUpdate={updateConfig}
                                onCancel={() => setShowConfigModal(false)}
                            ></ConfigModal>
                        )}
                    </div>
                </div>
            </header>

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
