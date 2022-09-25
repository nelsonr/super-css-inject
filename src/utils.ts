import { Stylesheet } from "./Stylesheet";

export const sortByName = (
    stylesSheetA: Stylesheet,
    stylesSheetB: Stylesheet
) => {
    const nameA = stylesSheetA.name.toLowerCase();
    const nameB = stylesSheetB.name.toLowerCase();

    if (nameA < nameB) {
        return -1;
    } else if (nameA > nameB) {
        return 1;
    }

    return 0;
};
