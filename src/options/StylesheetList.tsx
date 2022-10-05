import { StylesheetItem } from "./StylesheetItem";
import { Stylesheet } from "../Stylesheet";

interface IProps {
    list: Stylesheet[];
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
    
    return (
        <>
            <div className="stylesheets-message hidden">No stylesheets added yet.</div>
            <div className="stylesheets-list">{stylesheetsList}</div>
        </>
    );
}
