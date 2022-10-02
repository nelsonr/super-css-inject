import { Stylesheet } from "../Stylesheet";
import { StylesheetItem } from "./StylesheetItem";

interface IProps {
    list: Stylesheet[];
    activeList: string[];
    search: string;
    onSelectionChange: (isActive: boolean, id: number) => unknown;
}

export function StylesheetList (props: IProps) {
    const { list, activeList, search, onSelectionChange } = props;

    const searchIsEmpty = search.trim().length === 0;
    const searchRegex = new RegExp(search.trim(), "gi");
    
    const stylesheets = list.map((stylesheet: Stylesheet, index: number) => {
        const handleActiveChange = (isActive: boolean) => onSelectionChange(isActive, index);
        const isActive = activeList.find((url: string) => url === stylesheet.url) !== undefined;
        const isHidden = !searchIsEmpty && stylesheet.name.match(searchRegex) === null;
        
        return (
            <StylesheetItem 
                key={index} 
                stylesheet={stylesheet} 
                active={isActive} 
                hidden={isHidden}
                onActiveToggle={handleActiveChange} 
            />
        );
    });
    
    return (
        <div className="stylesheets-list">
            {stylesheets}
        </div>
    );
}
