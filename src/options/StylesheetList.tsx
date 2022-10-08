import { setCSSClasses } from "../utils";
import { StylesheetItem } from "./StylesheetItem";

interface IProps {
    list: string[];
    onRemove: (url: string) => unknown;
}

export function StylesheetList (props: IProps) {
    const { list, onRemove } = props;

    const stylesheetsList = list.map((stylesheet, index) => 
        <StylesheetItem 
            key={index} 
            stylesheet={stylesheet} 
            onRemove={onRemove}
        />
    );

    const messageClassName = setCSSClasses([
        "stylesheets-message",
        (list.length > 0 ? "hidden" : "")
    ]);
    
    return (
        <>
            <div className={messageClassName}>No stylesheets added yet.</div>
            <div className="stylesheets-list">{stylesheetsList}</div>
        </>
    );
}
