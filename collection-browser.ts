import { default as style } from './collection-browser.css?raw';
import { default as html } from './collection-browser.html?raw';


import '@magnit-ce/selectable-items';

export enum CollectionBrowserParts 
{

}

export type CollectionBrowserProperties = 
{
    open?: boolean,
    navigationOpen?: boolean,
    detailsOpen?: boolean,
    navigationLabel?: string,
    detailsLable?: string,
    cancelLabel?: string,
}
// const CAPTIONED_THUMBNAIL_TAG_NAME = "CAPTIONED-THUMBNAIL";
// function elementIsThumbnail(target: HTMLElement) { return target.tagName == CAPTIONED_THUMBNAIL_TAG_NAME; }

const COMPONENT_STYLESHEET = new CSSStyleSheet();
COMPONENT_STYLESHEET.replaceSync(style);

const COMPONENT_TAG_NAME = 'collection-browser';
export class CollectionBrowserElement extends HTMLElement
{
    static selectedClassName: string = 'selected';

    componentParts: Map<string, HTMLElement> = new Map();
    getElement<T extends HTMLElement = HTMLElement>(id: string)
    {
        if(this.componentParts.get(id) == null)
        {
            const part = this.findElement(id);
            if(part != null) { this.componentParts.set(id, part); }
        }

        return this.componentParts.get(id) as T;
    }
    findElement<T extends HTMLElement = HTMLElement>(id: string) { return this.shadowRoot!.getElementById(id) as T; }

    // get selected()
    // {
    //     return this.#getSelected();
    // }
    

    get allowMultiSelect() { return this.hasAttribute('multi') || this.hasAttribute('multiple'); }

    // handledItems: WeakSet<Element> = new WeakSet();

    #defaultSlot!: HTMLSlotElement;
    #boundSlotChange: (_event: Event) => void;

    constructor()
    {
        super();
        this.attachShadow({mode: 'open'});

        this.shadowRoot!.innerHTML = html;
        this.shadowRoot!.adoptedStyleSheets.push(COMPONENT_STYLESHEET);
        this.#applyPartAttributes();

        this.#boundSlotChange = ((_event: Event) =>
        {
            const children = this.#defaultSlot.assignedElements();
            if(children.length == 1 && children[0] instanceof HTMLSlotElement)
            {
                let descendantSlot = children[0];
                let descendantSlotChildren = descendantSlot.assignedElements()
                while(descendantSlot instanceof HTMLSlotElement && descendantSlotChildren[0] instanceof HTMLSlotElement)
                {
                    descendantSlot = descendantSlotChildren[0];
                    if(descendantSlot instanceof HTMLSlotElement)
                    {
                        descendantSlotChildren = descendantSlot.assignedElements();
                    }
                }
                this.#registerSlot('default', descendantSlot);
                return;
            }
            // this.#updateEntries(children);
        }).bind(this);
        this.#defaultSlot = this.shadowRoot!.querySelector('slot:not([name])') as HTMLSlotElement;
        this.#defaultSlot.addEventListener('slotchange', this.#boundSlotChange);

        this.shadowRoot!.querySelector('selectable-items')!.addEventListener('change', (event) =>
        {
            event.preventDefault();
            event.stopPropagation();

            const { selected } = (event as CustomEvent).detail;
            const selectedCategoryItem = selected[0];
            const changeEvent = new CustomEvent('category', { cancelable: true, detail: { selected: selectedCategoryItem } });
            const allowDefault = this.dispatchEvent(changeEvent);

            if(allowDefault == false || selectedCategoryItem == null) { return; }
            (event.target as any).selectItem(selectedCategoryItem);
            
            const category = selectedCategoryItem.dataset.category;
            if(category == null || category.trim() == "") { return; }

            this.dataset.category = category;
            const items = [...this.querySelectorAll(':not([slot])')] as HTMLElement[];
            for(let i = 0; i < items.length; i++)
            {
                const item = items[i];
                item.classList.remove('has-category');
                if(item.dataset.category == null || item.dataset.category.trim() == "")
                {
                    continue;
                }

                if(item.dataset.category == category)
                {
                    item.classList.add('has-category');
                }
                else
                {
                    const categoriesArray: string[] = item.dataset.category.split(',');
                    for(let j = 0; j < categoriesArray.length; j++)
                    {
                        const currentCategory = categoriesArray[j];
                        if(currentCategory == category)
                        {
                            item.classList.add('has-category');
                            break;
                        }
                    }
                }
            }
        });

        this.findElement('gallery').addEventListener('click', (event: MouseEvent) =>
        {
            event.stopPropagation();

            const children = this.#defaultSlot.assignedElements();

            const target = event.composedPath().find(item => item instanceof Element && children.indexOf(item) != -1);
            
            if(target == null 
            || !(target instanceof HTMLElement))
            { return; }

            const currentlySelected = this.getSelected();
            const shift = (event as MouseEvent).getModifierState("Shift");
            const ctrl = (event as MouseEvent).getModifierState("Control");
            const alt = (event as MouseEvent).getModifierState("Alt");
            
            const changeEvent = new CustomEvent('change', { cancelable: true, detail: { newSelection: target, previousSelection: currentlySelected, shift, ctrl, alt } });
            const value = this.dispatchEvent(changeEvent);

            if(value == false) { return; }
            
            if(this.allowMultiSelect == false)
            {
                for(let i = 0; i < currentlySelected.length; i++)
                {
                    const selectedItem = currentlySelected[i];
                    this.#deselectItem(selectedItem);
                }
            }
            this.#toggleSelection(target);
        })
    }
    #registerSlot(slotIdentifier: 'default', slot: HTMLSlotElement)
    {
        if(slotIdentifier == 'default')
        {
            if(this.#defaultSlot != null)
            {
                this.#defaultSlot.removeEventListener('slotchange', this.#boundSlotChange);
            }
            this.#defaultSlot = slot;
            this.#defaultSlot.addEventListener('slotchange', this.#boundSlotChange);
            const children = this.#defaultSlot.assignedElements();
            this.toggleAttribute('empty', children.length == 0);
            // this.#updateEntries(children);
        }
    }
    #applyPartAttributes()
    {
        const identifiedElements = [...this.shadowRoot!.querySelectorAll('[id]')];
        for(let i = 0; i < identifiedElements.length; i++)
        {
            identifiedElements[i].part.add(identifiedElements[i].id);
        }
        const classedElements = [...this.shadowRoot!.querySelectorAll('[class]')];
        for(let i = 0; i < classedElements.length; i++)
        {
            classedElements[i].part.add(...classedElements[i].classList);
        }
    }
    
    getSelected<T extends HTMLElement = HTMLElement>()
    {
        const selected = this.#defaultSlot.assignedElements()
        .reduce((selected, item, _index) => 
        {
            if(item.hasAttribute('aria-selected'))
            {
                selected.push(item);
            }
            return selected;
        }, new Array<Element>());

        return selected as T[];
    }
    selectItems<T extends HTMLElement = HTMLElement>(...items: T[])
    {
        const children = this.#defaultSlot.assignedElements();
        for(let i = 0; i < items.length; i++)
        {
            const item = items[i];
            if(children.indexOf(item) == -1)
            {
                continue;
            }
            this.#selectItem(item);
        }
    }
    #selectItem(item: HTMLElement)
    {
        item.setAttribute('aria-selected', 'option');
        item.classList.add(CollectionBrowserElement.selectedClassName);
    }
    deselectItems<T extends HTMLElement = HTMLElement>(...items: T[])
    {
        const children = this.#defaultSlot.assignedElements();
        for(let i = 0; i < items.length; i++)
        {
            const item = items[i];
            if(children.indexOf(item) == -1)
            {
                continue;
            }
            this.#deselectItem(item);
        }
    }
    #deselectItem(item: HTMLElement)
    {
        item.removeAttribute('aria-selected');
        item.classList.remove(CollectionBrowserElement.selectedClassName);
    }
    #toggleSelection(item: HTMLElement)
    {
        if(item.hasAttribute('aria-selected')) {
            this.#deselectItem(item);
        }
        else {
            this.#selectItem(item);
        }
    }

    // static create(props?: CollectionBrowserProperties)
    // {
    //     const element = document.createElement(COMPONENT_TAG_NAME) as CollectionBrowserElement;
    //     if(props != null)
    //     {
    //         for(const [key, value] of Object.entries(props))
    //         {
    //             if(key == 'open')
    //             {
    //                 element.findPart<HTMLDialogElement>('dialog').open = value as boolean;
    //             }
    //             // else if(key == 'key')
    //             // {
    //             //     element.dataset.key = value as string;
    //             // }
    //             else if(key.startsWith('on'))
    //             {
    //                 // const eventName = key.substring(2).toLowerCase();
    //                 // element.addEventListener(eventName, value as any);
    //             }
    //         }
    //     }
    //     return element;
    // }
    
    // attributeChangedCallback(attributeName: string, _oldValue: string, newValue: string) 
    // {
    // }

    
    clearSelection()
    {
        this.dispatchEvent(new CustomEvent('change', { detail: { newSelection: null, previousSelection: this.getSelected(), shift: false, ctrl: false, alt: false } }));
    }

}

if(customElements.get(COMPONENT_TAG_NAME) == null)
{
    customElements.define(COMPONENT_TAG_NAME, CollectionBrowserElement);
}