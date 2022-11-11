import { useReducer, useState } from "react";
import { PopupState } from "../types";
import { PopupEmptyMessage } from "./PopupEmptyMessage";
import { PopupHeader } from "./PopupHeader";
import { PopupPreferences } from "./PopupPreferences";
import { PopupReducer } from "./PopupReducer";
import { PopupSearch } from "./PopupSearch";
import { StylesheetList } from "./StylesheetList";

interface IProps {
    initialState: PopupState;
}

function Popup (props: IProps) {
    const [ state, setState ] = useReducer(PopupReducer, props.initialState);
    const [ searchValue, setSearchValue ] = useState("");

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
