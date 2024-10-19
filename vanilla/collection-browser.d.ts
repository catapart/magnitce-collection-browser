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
    componentParts: Map<string, HTMLElement>;
    getPart<T extends HTMLElement = HTMLElement>(key: string): T;
    findPart<T extends HTMLElement = HTMLElement>(key: string): T;
    get selected(): HTMLElement[];
    get allowMultiSelect(): boolean;
    handledItems: WeakSet<Element>;
    constructor();
    static selectedClassName: string;
    clearSelection(): void;
}

export { CollectionBrowserElement, CollectionBrowserParts, type CollectionBrowserProperties };
