import { getStylesheetName } from "./utils";

export class Stylesheet {
    url: string;
    shortname: string;

    constructor (url: string, shortname = "") {
        this.url = url;
        this.shortname = shortname;
    }

    get name () {
        return this.shortname || getStylesheetName(this.url);
    }
}
