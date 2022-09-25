export class Stylesheet {
    url: string;
    name: string;

    constructor(url: string) {
        this.url = url;

        const urlParts = this.url.split("/");
        this.name = urlParts[urlParts.length - 1];
    }
}
