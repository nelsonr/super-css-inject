import { useState, useEffect, useReducer, useRef } from "react";
import { reducer } from "../reducer";
import { loadStorage } from "../storage";
import { SuperCSSInject, Tab, TabId, Tabs } from "../types";
import { getTabs, getCurrentTab, toggleActiveStylesheet } from "../utils";
import { PopupHeader } from "./PopupHeader";
import { PopupPreferences } from "./PopupPreferences";
import { PopupSearch } from "./PopupSearch";
import { PopupEmptyMessage } from "./PopupEmptyMessage";
import { StylesheetList } from "./StylesheetList";

const initialState: SuperCSSInject = {
    stylesheets: [],
    tabs: {}
};

function Popup() {
    const firstRender = useRef(true);
    const [state, setState] = useReducer(reducer, initialState);
    const [currentTabId, setCurrentTabId] = useState<TabId>();
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        if (firstRender.current) {
            console.log("Load from local storage");
            
            loadStorage().then(
                (data: SuperCSSInject) => { 
                    setState({ 
                        type: "updateStylesheets", 
                        stylesheets: data.stylesheets, 
                    }); 
                },
                (error) => console.error(error)
            );
                    
            getTabs().then(
                (tabs: Tabs) => {
                    setState({ 
                        type: "updateTabs", 
                        tabs: tabs 
                    });
                },
                (error) => console.error(error)
            );

            getCurrentTab().then(
                (tab: Tab) => tab && setCurrentTabId(tab.id), 
                (error) => console.error(error)
            );
        
            firstRender.current = false;
        }
    }, []);

    const activeStylesheets = (): Set<string> => {
        if (state.tabs && currentTabId && state.tabs[currentTabId]) {
            return state.tabs[currentTabId];
        }

        return new Set();
    };

    const handleSelection = (isActive: boolean, url: string) => {
        if (currentTabId) {
            console.log("Toggle active Stylesheet");
        
            setState({
                type: isActive ? "setActive" : "setInactive",
                url: url,
                tabId: currentTabId,
            });

            toggleActiveStylesheet(currentTabId, isActive, url);
        }
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

    const renderSearch = () => {
        const showSearch = state.stylesheets.length >= 6;

        if (showSearch) {
            return (
                <PopupSearch
                    search={searchValue}
                    onChange={setSearchValue} />
            );
        }
        
        return null;
    };

    return (
        <>
            <PopupPreferences />
            
            <PopupHeader>
                {renderSearch()}
            </PopupHeader>
            
            {stylesheetsListContent}
        </>
    );

}

export default Popup;
