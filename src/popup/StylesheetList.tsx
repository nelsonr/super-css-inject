import { getStylesheetName } from "../utils";
import { StylesheetItem } from "./StylesheetItem";

interface IProps {
    list: string[];
    activeList: Set<string>;
    search: string;
    onSelectionChange: (isActive: boolean, url: string) => unknown;
}

export function StylesheetList (props: IProps) {
    const { list, activeList, search, onSelectionChange } = props;

    const searchIsEmpty = search.trim().length === 0;
    const searchRegex = new RegExp(search.trim(), "gi");
    
    const stylesheets = list.map((stylesheet: string, index: number) => {
        const isActive = activeList.has(stylesheet);
        const name = getStylesheetName(stylesheet);
        const isFiltered = !searchIsEmpty && name.match(searchRegex) === null;
        
        const handleActiveChange = (isActive: boolean) => {
            return onSelectionChange(isActive, stylesheet);
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
