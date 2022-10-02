import { useState, useEffect, useReducer, useRef } from "react";
import { reducer } from "../reducer";
import { loadStorage } from "../storage";
import { SuperCSSInject } from "../types";
import { getCurrentTab, toggleActiveStylesheet } from "../utils";
import { PopupEmptyMessage } from "./PopupEmptyMessage";
import { PopupHeader } from "./PopupHeader";
import { PopupPreferences } from "./PopupPreferences";
import { PopupSearch } from "./PopupSearch";
import { StylesheetList } from "./StylesheetList";

const initialState: SuperCSSInject = {
    stylesheets: [],
    tabs: {}
};

function Popup() {
    const firstRender = useRef(true);
    const [state, setState] = useReducer(reducer, initialState);
    const [activeTabId, setActiveTabId] = useState<number>();
    const [searchValue, setSearchValue] = useState("");

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
        // Avoid undefined tab id in runtime
        if (!activeTabId) return;
        
        console.log("Toggle active Stylesheet");
        
        setState({
            type: isActive ? "setActive" : "clearActive",
            id: id,
            tabId: activeTabId,
            persist: true
        });

        const url = state.stylesheets[id].url;
        toggleActiveStylesheet(isActive, activeTabId, url);
    };

    let stylesheetsListContent = <PopupEmptyMessage />;

    if (state.stylesheets.length > 0) {
        stylesheetsListContent = (
            <StylesheetList 
                list={state.stylesheets} 
                activeList={activeStylesheets()} 
                onSelectionChange={handleSelection} 
                search={searchValue} 
            />
        );
    }

    let searchContent = null;

    if (state.stylesheets.length >= 6) {
        searchContent = <PopupSearch search={searchValue} onChange={setSearchValue} />;
    }

    return (
        <>
            <PopupPreferences />
            
            <PopupHeader>
                {searchContent}
            </PopupHeader>
            
            {stylesheetsListContent}
        </>
    );
}

export default Popup;
