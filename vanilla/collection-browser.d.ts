declare enum CollectionBrowserParts {
}
type CollectionBrowserProperties = {
    open?: boolean;
    navigationOpen?: boolean;
    detailsOpen?: boolean;
    navigationLabel?: string;
    detailsLable?: string;
    cancelLabel?: string;
};
declare class CollectionBrowserElement extends HTMLElement {
    #private;
    static selectedClassName: string;
    componentParts: Map<string, HTMLElement>;
    getElement<T extends HTMLElement = HTMLElement>(id: string): T;
    findElement<T extends HTMLElement = HTMLElement>(id: string): T;
    get allowMultiSelect(): boolean;
    constructor();
    getSelected<T extends HTMLElement = HTMLElement>(): T[];
    selectItems<T extends HTMLElement = HTMLElement>(...items: T[]): void;
    deselectItems<T extends HTMLElement = HTMLElement>(...items: T[]): void;
    clearSelection(): void;
}

export { CollectionBrowserElement, CollectionBrowserParts, type CollectionBrowserProperties };
