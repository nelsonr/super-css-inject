import { Stylesheet } from "../Stylesheet";
import { StylesheetItem } from "./StylesheetItem";

interface IProps {
    list: Stylesheet[];
    activeList: Set<string>;
    search: string;
    onSelectionChange: (isActive: boolean, url: string) => unknown;
}

export function StylesheetList (props: IProps) {
    const { list, activeList, search, onSelectionChange } = props;

    const searchIsEmpty = search.trim().length === 0;
    const searchRegex = new RegExp(search.trim(), "gi");
    
    const stylesheets = list.map((stylesheet: Stylesheet, index: number) => {
        const isActive = activeList.has(stylesheet.url);
        const isFiltered = !searchIsEmpty && stylesheet.name.match(searchRegex) === null;
        
        const handleActiveChange = (isActive: boolean) => {
            return onSelectionChange(isActive, stylesheet.url);
        };

        return (
            <StylesheetItem 
                key={index} 
                stylesheet={stylesheet} 
                active={isActive} 
                hidden={isFiltered}
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
