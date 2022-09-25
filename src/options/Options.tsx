import { useEffect, useReducer, useRef } from "react";
import { StylesheetForm } from "./StylesheetForm";
import { StylesheetList } from "./StylesheetList";
import { loadStorage, updateStorage } from "../storage";
import { SuperCSSInject } from "../types";
import { reducer, ActionType } from "./reducer";

const initialState: SuperCSSInject = {
    stylesheets: [],
    tabs: {}
};

function Options() {
    const firstRender = useRef(false);
    const [state, updateState] = useReducer(reducer, initialState);

    useEffect(() => {
        if (!firstRender.current) {
            console.log("Load from local storage");
            
            const fetchData = async () => {
                const data: SuperCSSInject = await loadStorage();
                updateState({ type: ActionType.UpdateState, value: data });
            };
    
            firstRender.current = true; 
            fetchData().catch(console.error);
        }
    }, []);

    // Update local storage whenever theres a change on the state variable
    useEffect(() => {
        if (firstRender.current) {
            updateStorage(state);
        }
    }, [state]);
    
    const addStylesheet = (url: string) => {
        updateState({ type: ActionType.Add, value: url });
    };

    const removeStylesheet = (id: number) => {
        updateState({ type: ActionType.Remove, value: id });
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
