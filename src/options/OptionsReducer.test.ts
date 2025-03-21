import { Stylesheet } from "../Stylesheet";
import { StorageData } from "../types";
import { OptionsReducer } from "./OptionsReducer";

const webSocketServerURL = "ws://localhost:35729/livereload";

const states: Record<string, StorageData> = {
    empty: {
        stylesheets: [],
        injected: {},
        config: { webSocketServerURL: webSocketServerURL }

    },
    oneStylesheet: {
        stylesheets: [
            new Stylesheet("http://127.0.0.1:3000/public/css/theme-A.css"),
        ],
        injected: {},
        config: { webSocketServerURL: webSocketServerURL }

    },
    renamedStyleSheet: {
        stylesheets: [
            new Stylesheet("http://127.0.0.1:3000/public/css/theme-B.css"),
        ],
        injected: {},
        config: { webSocketServerURL: webSocketServerURL }

    },
    oneInjectedStylesheet: {
        stylesheets: [
            new Stylesheet("http://127.0.0.1:3000/public/css/theme-A.css"),
        ],
        injected: {
            "1010977386": [
                "http://127.0.0.1:3000/public/css/theme-A.css",
            ]
        },
        config: { webSocketServerURL: webSocketServerURL }

    },
    multipleTabsInjected: {
        stylesheets: [
            new Stylesheet("http://127.0.0.1:3000/public/css/theme-A.css"),
        ],
        injected: {
            "1010977386": [
                "http://127.0.0.1:3000/public/css/theme-A.css",
            ],
            "2021021202": [
                "http://127.0.0.1:3000/public/css/theme-A.css",
            ]
        },
        config: { webSocketServerURL: webSocketServerURL }

    },
    multipleInjectedStylesheets: {
        stylesheets: [
            new Stylesheet("http://127.0.0.1:3000/public/css/theme-A.css"),
            new Stylesheet("http://127.0.0.1:3000/public/css/theme-B.css"),
        ],
        injected: {
            "1010977386": [
                "http://127.0.0.1:3000/public/css/theme-A.css",
                "http://127.0.0.1:3000/public/css/theme-B.css"
            ]
        },

        config: { webSocketServerURL: webSocketServerURL }

    },
};

describe("Adding and updating stylesheets", () => {
    test("Adds a stylesheet", () => {
        const urlToAdd = "http://127.0.0.1:3000/public/css/theme-A.css";
        const updatedState = OptionsReducer(states.empty, {
            type: "add",
            url: urlToAdd
        });

        expect(updatedState).toStrictEqual(states.oneStylesheet);
    });

    test("Renames a stylesheet", () => {
        const prevStylesheet = new Stylesheet("http://127.0.0.1:3000/public/css/theme-A.css");
        const newStylesheet = new Stylesheet("http://127.0.0.1:3000/public/css/theme-B.css");

        const updatedState = OptionsReducer(states.oneStylesheet, {
            type: "update",
            prevStyleheet: prevStylesheet,
            newStylesheet: newStylesheet
        });

        expect(updatedState).toStrictEqual(states.renamedStyleSheet);
    });
});

describe("Removing stylesheets", () => {
    test("Removes a stylesheet", () => {
        const urlToRemove = "http://127.0.0.1:3000/public/css/theme-A.css";
        const updatedState = OptionsReducer(states.oneStylesheet, {
            type: "remove",
            url: urlToRemove
        });

        expect(updatedState).toStrictEqual(states.empty);
    });

    test("Clears from the injected stylesheets when removed", () => {
        const urlToRemove = "http://127.0.0.1:3000/public/css/theme-A.css";
        const updatedState = OptionsReducer(states.oneInjectedStylesheet, {
            type: "remove",
            url: urlToRemove
        });

        expect(updatedState).toStrictEqual(states.empty);
    });

    test("Clears the stylesheet from all injected browser tabs", () => {
        const urlToRemove = "http://127.0.0.1:3000/public/css/theme-A.css";
        const updatedState = OptionsReducer(states.multipleTabsInjected, {
            type: "remove",
            url: urlToRemove
        });

        expect(updatedState).toStrictEqual(states.empty);
    });

    test("Leaves other injected stylesheets untouched", () => {
        const urlToRemove = "http://127.0.0.1:3000/public/css/theme-B.css";
        const updatedState = OptionsReducer(states.multipleInjectedStylesheets, {
            type: "remove",
            url: urlToRemove
        });

        expect(updatedState).toStrictEqual(states.oneInjectedStylesheet);
    });
});

export { };
