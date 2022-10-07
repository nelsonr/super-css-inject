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
            
            const fetchData = async () => {
                const data: SuperCSSInject = await loadStorage();
                setState({ 
                    type: "updateStylesheets", 
                    stylesheets: data.stylesheets
                });
            };
    
            fetchData().catch(console.error);
            firstRender.current = false;
        }
    }, []);

    const addStylesheet = (url: string) => {
        setState({ 
            type: "add",
            url: url, 
            persist: true 
        });
    };

    const removeStylesheet = (url: string) => {
        setState({ 
            type: "remove",
            url: url,
            persist: true 
        });

        broadcastStylesheetRemoved(url);
    };
    
    return (
        <div className="App">
            <header>
                <div className="column">
                    <img className="logo" src="icons/128x128.png" width="36" alt="" />
                    <h3 className="title">Super CSS Inject Options</h3>
                </div>
            </header>
    
            <main className="column">
                <StylesheetForm onSubmit={addStylesheet} />
                <StylesheetList list={state?.stylesheets} onRemove={removeStylesheet} />
            </main>
        </div>
    );
}
    
export default Options;
