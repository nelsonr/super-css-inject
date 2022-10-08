import { useEffect, useReducer, useRef } from "react";
import { StylesheetForm } from "./StylesheetForm";
import { StylesheetList } from "./StylesheetList";
import { loadStorage } from "../storage";
import { SuperCSSInject } from "../types";
import { reducer } from "../reducer";
import { broadcastStylesheetRemoved } from "../Messages";

const initialState: SuperCSSInject = {
    stylesheets: [],
    tabs: {}
};

function Options() {
    const firstRender = useRef(true);
    const [state, setState] = useReducer(reducer, initialState);

    useEffect(() => {
        if (firstRender.current) {
            console.log("Load from local storage");

            loadStorage().then(
                (data: SuperCSSInject) => {
                    setState({ 
                        type: "updateStylesheets", 
                        stylesheets: data.stylesheets
                    });
                },
                (error: Error) => console.error(error)
            );
    
            firstRender.current = false;
        }
    }, []);

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

        // Send a message to the background worker
        // to update tabs that might be using the removed stylesheet
        broadcastStylesheetRemoved(url);
    };
    
    return (
        <>
            <header>
                <div className="column">
                    <img className="logo" src="icons/128x128.png" width="36" alt="" />
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
