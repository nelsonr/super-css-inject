import { useState, useEffect, useReducer, useRef } from "react";
import { reducer } from "../reducer";
import { loadStorage } from "../storage";
import { SuperCSSInject } from "../types";
import { getCurrentTab } from "../utils";
import { StylesheetList } from "./StylesheetList";

const env = chrome || browser;

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
            
            const fetchData = async () => {
                const data: SuperCSSInject = await loadStorage();
                setState({ 
                    type: "updateState",
                    state: data, 
                    persist: false 
                });
            };
    
            fetchData().catch(console.error);

            getCurrentTab().then(
                (tab) => setActiveTabId(tab.id), 
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
    
    return (
        <div>
            <PopupPreferences />
            <PopupHeader />
            <StylesheetList 
                list={state.stylesheets} 
                activeList={activeStylesheets()} 
                onSelectionChange={handleSelection} 
                search={""} 
            />
        </div>
    );
}

function PopupHeader() {
    return (
        <header>
            <div className="column">
                <div className="logo">
                    <img src="icons/128x128.png" width="26" alt="" />
                </div>

                <div className="title-wrapper">
                    <h3 className="title">Super CSS Inject</h3>
                    <div className="search">
                        <svg className="icon-search" xmlns="http://www.w3.org/2000/svg" viewBox="294 210 32 32" width="32pt" height="32pt">
                            <path d=" M 316.564 231.253 C 318.412 229.093 319.44 226.336 319.44 223.475 C 319.44 220.306 318.18 217.266 315.94 215.022 C 313.7 212.782 310.656 211.526 307.491 211.526 C 304.322 211.526 301.278 212.782 299.038 215.022 C 296.798 217.266 295.538 220.306 295.538 223.475 C 295.538 226.644 296.798 229.684 299.038 231.928 L 299.038 231.928 C 301.278 234.168 304.322 235.424 307.491 235.424 C 310.336 235.424 313.084 234.409 315.237 232.576 L 322.862 240.205 C 323.038 240.38 323.28 240.478 323.526 240.478 C 323.776 240.478 324.014 240.38 324.189 240.205 C 324.365 240.029 324.462 239.787 324.462 239.541 C 324.462 239.292 324.365 239.054 324.189 238.878 L 316.564 231.253 Z  M 300.357 230.605 C 298.468 228.716 297.407 226.148 297.407 223.475 C 297.407 220.802 298.468 218.234 300.357 216.345 C 302.25 214.457 304.818 213.391 307.491 213.395 C 310.164 213.391 312.728 214.457 314.62 216.345 C 316.509 218.234 317.571 220.802 317.571 223.475 C 317.571 226.148 316.509 228.716 314.62 230.605 C 312.728 232.494 310.164 233.555 307.491 233.555 C 304.818 233.555 302.25 232.494 300.357 230.605 L 300.357 230.605 Z " fillRule="evenodd" fill="rgb(0,0,0)"></path>
                        </svg>

                        <svg className="icon-cross hidden" xmlns="http://www.w3.org/2000/svg" viewBox="4.5 4.5 23 23" width="23pt" height="23pt">
                            <path d=" M 13.88 16 L 4.94 24.94 C 4.66 25.22 4.5 25.6 4.5 26 C 4.5 26.4 4.66 26.78 4.94 27.06 C 5.22 27.34 5.6 27.5 6 27.5 C 6.4 27.5 6.78 27.34 7.06 27.06 L 16 18.12 L 24.94 27.06 C 25.22 27.34 25.6 27.5 26 27.5 C 26.4 27.5 26.78 27.34 27.06 27.06 C 27.34 26.78 27.5 26.4 27.5 26 C 27.5 25.6 27.34 25.22 27.06 24.94 L 18.12 16 L 27.06 7.06 C 27.34 6.78 27.5 6.4 27.5 6 C 27.5 5.6 27.34 5.22 27.06 4.94 C 26.78 4.66 26.4 4.5 26 4.5 C 25.6 4.5 25.22 4.66 24.94 4.94 L 16 13.88 L 7.06 4.94 C 6.78 4.66 6.4 4.5 6 4.5 C 5.6 4.5 5.22 4.66 4.94 4.94 C 4.66 5.22 4.5 5.6 4.5 6 C 4.5 6.4 4.66 6.78 4.94 7.06 L 13.88 16 Z " fill="rgb(0,0,0)"></path>
                        </svg>

                        <input type="text" placeholder="Search" />
                    </div>
                </div>
            </div>
        </header>
    ); 
}

function PopupPreferences() {
    const openOptionsPage = () => env.runtime.openOptionsPage();
    
    return (
        <div className="preferences" data-action="preferences" title="Options" onClick={openOptionsPage}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="212 11.001 16 15.999" width="16pt" height="15.999pt">
                <path d=" M 227.789 13.868 L 227.612 13.332 L 224.786 16.158 L 223.398 15.602 L 222.843 14.215 L 225.669 11.389 L 225.133 11.212 C 224.711 11.073 224.27 11.001 223.826 11.001 C 221.525 11.001 219.652 12.873 219.652 15.175 C 219.652 15.689 219.746 16.192 219.933 16.673 L 212.496 24.11 C 212.176 24.429 212 24.855 212 25.307 C 212 25.76 212.176 26.185 212.496 26.505 C 212.826 26.835 213.26 27 213.694 27 C 214.127 27 214.561 26.835 214.891 26.505 L 222.328 19.068 C 222.808 19.254 223.312 19.349 223.826 19.349 C 226.128 19.349 228 17.476 228 15.175 C 228 14.733 227.929 14.294 227.789 13.868 Z " />
            </svg>
        </div>
    );
}

export default Popup;
