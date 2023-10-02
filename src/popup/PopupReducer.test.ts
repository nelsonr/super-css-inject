import { PopupReducer } from "./PopupReducer";

const tabId = 1010977386;
const stylesheetA = "http://127.0.0.1:3000/public/css/theme-A.css";
const stylesheetB = "http://127.0.0.1:3000/public/css/theme-B.css";

const states = { 
    noInjectedStylesheet:  {
        tabId: tabId,
        stylesheets: [
            stylesheetA,
            stylesheetB,
        ],
        injected: {}
    },
    oneInjectedStylesheet: {
        tabId: tabId,
        stylesheets: [
            stylesheetA,
            stylesheetB,
        ],
        injected: {
            [tabId]: [
                stylesheetA,
            ]
        }
    },
    multipleInjectedStylesheets: {
        tabId: tabId,
        stylesheets: [
            stylesheetA,
            stylesheetB,
        ],
        injected: {
            [tabId]: [
                stylesheetA,
                stylesheetB,
            ]
        }
    },
};

describe("Injecting stylesheets", () => {
    test("Injects one stylesheet", () => {
        const initialState = states.noInjectedStylesheet;
        const expectedState = states.oneInjectedStylesheet;
        
        const updatedState = PopupReducer(initialState, {
            type: "inject",
            tabId: tabId,
            url: stylesheetA
        });
    
        expect(updatedState).toEqual(expectedState);
    });
    
    test("Injects additional stylesheets", () => {
        const initialState = states.oneInjectedStylesheet;
        const expectedState = states.multipleInjectedStylesheets;
        
        const updatedState = PopupReducer(initialState, {
            type: "inject",
            tabId: tabId,
            url: stylesheetB
        });
    
        expect(updatedState).toEqual(expectedState);
    });
});

describe("Clearing injected stylesheets", () => {
    test("Clears one injected stylesheet", () => {
        const initialState = states.multipleInjectedStylesheets;
        const expectedState = states.oneInjectedStylesheet;
        
        const updatedState = PopupReducer(initialState, {
            type: "clear",
            tabId: tabId,
            url: stylesheetB
        });
    
        expect(updatedState).toEqual(expectedState);
    });
    
    test("Clears remaining injected stylesheet", () => {
        const initialState = states.oneInjectedStylesheet;
        const expectedState = states.noInjectedStylesheet;
        
        const updatedState = PopupReducer(initialState, {
            type: "clear",
            tabId: tabId,
            url: stylesheetA
        });
    
        expect(updatedState).toEqual(expectedState);
    });
});

export { };
