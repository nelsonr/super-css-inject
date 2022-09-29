import { env } from "../utils";

export function PopupEmptyMessage () {
    const openOptionsPage = () => env.runtime.openOptionsPage();

    console.log("Render popup empty message");

    return (
        <div className="stylesheets-message">
            <div>No stylesheets added yet.</div>
            <button data-action="preferences" onClick={openOptionsPage}>Add stylesheet</button>
        </div>
    );
}
