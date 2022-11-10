import { useEffect, useReducer, useRef, useState } from "react";
import { loadStorage } from "../storage";
import { PopupState } from "../types";
import { getCurrentTab } from "../utils";
import { PopupEmptyMessage } from "./PopupEmptyMessage";
import { PopupHeader } from "./PopupHeader";
import { PopupPreferences } from "./PopupPreferences";
import { PopupReducer } from "./PopupReducer";
import { PopupSearch } from "./PopupSearch";
import { StylesheetList } from "./StylesheetList";

export async function getInitialPopupState (): Promise<PopupState> {
    const storage = await loadStorage();
    const currentTab = await getCurrentTab();

    return {
        stylesheets: storage.stylesheets,
        injected: storage.injected,
        tabId: currentTab?.id,
    };
}

const emptyState: PopupState = {
    stylesheets: [],
    injected: {},
    tabId: undefined,
};

function Popup () {
    const firstRender = useRef(true);
    const [ state, setState ] = useReducer(PopupReducer, emptyState);
    const [ searchValue, setSearchValue ] = useState("");

    useEffect(() => {
        if (firstRender.current) {
            console.log("Load from local storage");

            getInitialPopupState().then((data: PopupState) => {
                setState({
                    type: "updateState",
                    state: data,
                });
            });

            firstRender.current = false;
        }
    }, []);

    const handleSelection = (isActive: boolean, url: string) => {
        if (state.tabId) {
            console.log("Toggle active Stylesheet");

            setState({
                type: isActive ? "inject" : "clear",
                tabId: state.tabId,
                url: url,
            });
        }
    };

    const activeStylesheets = (): string[] => {
        if (state.tabId) {
            return state.injected[state.tabId] || [];
        }

        return [];
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
                <PopupSearch search={searchValue} onChange={setSearchValue} />
            );
        }

        return null;
    };

    return (
        <>
            <PopupPreferences />
            <PopupHeader>{renderSearch()}</PopupHeader>
            {renderStylesheetsList()}
        </>
    );
}

export default Popup;
