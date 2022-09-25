import { StylesheetItem } from "./StylesheetItem";
import { Stylesheet } from "../Stylesheet";

interface IProps {
    list: Stylesheet[];
    onRemove: (id: number) => unknown;
}

export function StylesheetList (props: IProps) {
    const { list, onRemove } = props;

    const stylesheetsList = list.map((stylesheet, index) => 
        <StylesheetItem 
            stylesheet={stylesheet} 
            key={index} 
            id={index} 
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
