import { PopupSearch } from "./PopupSearch";

export function PopupHeader () {
    return (
        <header>
            <div className="column">
                <div className="logo">
                    <img src="icons/128x128.png" width="26" alt="" />
                </div>

                <div className="title-wrapper">
                    <h3 className="title">Super CSS Inject</h3>
                    <PopupSearch />
                </div>
            </div>
        </header>
    );
}
