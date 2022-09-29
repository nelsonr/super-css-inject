import { useState, useEffect, useReducer, useRef } from "react";
import { reducer } from "../reducer";
import { loadStorage } from "../storage";
import { SuperCSSInject } from "../types";
import { env, getCurrentTab } from "../utils";
import { PopupEmptyMessage } from "./PopupEmptyMessage";
import { PopupHeader } from "./PopupHeader";
import { PopupPreferences } from "./PopupPreferences";
import { StylesheetList } from "./StylesheetList";

const initialState: SuperCSSInject = {
    stylesheets: [],
    tabs: {}
};

function Popup() {
    const firstRender = useRef(true);
    const [state, setState] = useReducer(reducer, initialState);
    const [activeTabId, setActiveTabId] = useState<number>();

    useEffect(() => {
        if (firstRender.current) {
            console.log("Load from local storage");
            
            loadStorage().then(
                (data: SuperCSSInject) => { 
                    setState({ 
                        type: "updateState", 
                        state: data, 
                        persist: false 
                    }); 
                },
                (error) => console.error(error)
            );

            getCurrentTab().then(
                (tab) => tab && setActiveTabId(tab.id), 
                (error) => console.error(error)
            );
            
            firstRender.current = false;
        }
    }, []);

    const activeStylesheets = () => {
        if (activeTabId !== undefined && state.tabs[activeTabId]) {
            return state.tabs[activeTabId];
        }

        return [];
    };

    const handleSelection = (isActive: boolean, id: number) => {
        console.log("Toggle active Stylesheet");
        
        setState({
            type: isActive ? "setActive" : "clearActive",
            id: id,
            tabId: activeTabId as number,
            persist: true
        });

        const url = state.stylesheets[id].url;

        if (isActive) {
            env.runtime.sendMessage({ action: "inject", tabId: activeTabId, url: url }).then(
                () => console.log("INJECT"),
                (error) => console.error(error)
            );
        } else {
            env.runtime.sendMessage({ action: "clear", tabId: activeTabId, url: url }).then(
                () => console.log("CLEAR"),
                (error) => console.error(error)
            );
        }
    };

    let content = <PopupEmptyMessage />;

    if (state.stylesheets.length > 0) {
        content = (
            <StylesheetList 
                list={state.stylesheets} 
                activeList={activeStylesheets()} 
                onSelectionChange={handleSelection} 
                search={""} 
            />
        );
    }

    return (
        <>
            <PopupPreferences />
            <PopupHeader />
            {content}
        </>
    );
}

export default Popup;
