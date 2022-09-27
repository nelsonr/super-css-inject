import { Stylesheet } from "../Stylesheet";
import { StylesheetItem } from "./StylesheetItem";

interface IProps {
    list: Stylesheet[];
    activeList: string[];
    search: string;
    onSelectionChange: (isActive: boolean, id: number) => unknown;
}

export function StylesheetList (props: IProps) {
    const { list, onSelectionChange: onSelectionToggle, activeList } = props;

    const stylesheets = list.map((stylesheet: Stylesheet, index: number) => {
        const handleActiveChange = (isActive: boolean) => onSelectionToggle(isActive, index);
        const isActive: boolean = activeList.find((url: string) => url === stylesheet.url) !== undefined;
        
        return <StylesheetItem key={index} stylesheet={stylesheet} active={isActive} onActiveToggle={handleActiveChange} />;
    });
    
    return (
        <div className="stylesheets-list">
            {stylesheets}
        </div>
    );
}
