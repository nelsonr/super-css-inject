import { useState, useEffect, useReducer, useRef } from "react";
import { reducer } from "../reducer";
import { loadStorage } from "../storage";
import { SuperCSSInject, Tab, TabId } from "../types";
import { getTabInjectedStylesheets, getCurrentTab } from "../utils";
import { broadcastClearStylesheet, broadcastInjectStylesheet } from "../Messages";
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
            
            getCurrentTab().then(
                (tab: Tab) => {
                    if (tab && tab.id) {
                        const tabId = tab.id;

                        getTabInjectedStylesheets(tabId).then(
                            (stylesheets: string[]) => {
                                setState({ 
                                    type: "updateTabStylesheets", 
                                    tabId: tabId,
                                    stylesheets: stylesheets 
                                });
                            },
                            (error) => console.error(error)
                        );
                        
                        setCurrentTabId(tabId);
                    }
                }, 
                (error) => console.error(error)
            );
        
            firstRender.current = false;
        }
    }, []);

    const handleSelection = (isActive: boolean, url: string) => {
        if (currentTabId) {
            console.log("Toggle active Stylesheet");
        
            setState({
                type: isActive ? "setActive" : "setInactive",
                url: url,
                tabId: currentTabId,
            });

            if (isActive) {
                broadcastInjectStylesheet(currentTabId, url);
            } else {
                broadcastClearStylesheet(currentTabId, url);
            }
        }
    };

    const activeStylesheets = (): Set<string> => {
        if (currentTabId && state.tabs[currentTabId]) {
            return state.tabs[currentTabId];
        }

        return new Set();
    };

    const renderStylesheetsList = () => {
        if (state.stylesheets.length > 0) {
            return (
                <StylesheetList
                    list={state.stylesheets}
                    activeList={activeStylesheets()}
                    onSelectionChange={handleSelection}
                    search={searchValue} 
                />
            );
        }
        
        return <PopupEmptyMessage />;
    };
    
    const renderSearch = () => {
        if (state.stylesheets.length >= 6) {
            return (
                <PopupSearch
                    search={searchValue}
                    onChange={setSearchValue}
                />
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
            
            {renderStylesheetsList()}
        </>
    );
}

export default Popup;
