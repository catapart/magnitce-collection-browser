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

const COMPONENT_STYLESHEET = new CSSStyleSheet();
COMPONENT_STYLESHEET.replaceSync(style);

const COMPONENT_TAG_NAME = 'collection-browser';
export class CollectionBrowserElement extends HTMLElement
{
    componentParts: Map<string, HTMLElement> = new Map();
    getPart<T extends HTMLElement = HTMLElement>(key: string)
    {
        if(this.componentParts.get(key) == null)
        {
            const part = this.shadowRoot!.querySelector(`[part="${key}"]`) as HTMLElement;
            if(part != null) { this.componentParts.set(key, part); }
        }

        return this.componentParts.get(key) as T;
    }
    findPart<T extends HTMLElement = HTMLElement>(key: string) { return this.shadowRoot!.querySelector(`[part="${key}"]`) as T; }

    get selected()
    {
        return this.#getSelected();
    }
    #getSelected = <T = HTMLElement>() => [
        ...
        ( this.shadowRoot!.querySelector('slot:not([name])') as HTMLSlotElement)
        .assignedElements()
        .reduce((selected, item, _index) => 
        {
            if(item.classList.contains('selected'))
            {
                selected.push(item);
            }
            return selected;
        }, new Array<Element>())
    ] as T[];

    get allowMultiSelect() { return this.hasAttribute('multi') || this.hasAttribute('multiple'); }

    handledItems: WeakSet<Element> = new WeakSet();

    constructor()
    {
        super();
        this.attachShadow({mode: 'open'});

        this.shadowRoot!.innerHTML = html;
        this.shadowRoot!.adoptedStyleSheets.push(COMPONENT_STYLESHEET);

        let previousCategorySelection: Array<HTMLElement> = [];

        this.shadowRoot!.querySelector('selectable-items')!.addEventListener('change', (event) =>
        {
            event.preventDefault();
            event.stopPropagation();

            const categories = [...this.querySelectorAll('[slot="category"]')] as HTMLElement[];
            const selected = categories.find(item => item.classList.contains('selected'));

            const changeEvent = new CustomEvent('category', { cancelable: true, detail: { previousSelection: previousCategorySelection, newSelection: selected } });
            const value = this.dispatchEvent(changeEvent);
            if(selected == null) { previousCategorySelection = []; }
            else { previousCategorySelection = [selected]; }

            if(value == false || selected == null) { return; }
            
            const category = selected.dataset.category;
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

        this.shadowRoot!.querySelector('slot:not([name])')!.addEventListener('slotchange', (event) =>
        {
            const children = (event.target as HTMLSlotElement).assignedElements();
            for(let i = 0; i < children.length; i++)
            {
                if(this.handledItems.has(children[i]))
                {
                    continue;
                }
                children[i].addEventListener('click', (event) =>
                {
                    event.stopPropagation();

                    const currentlySelected = children.reduce((selected, item, _index) => 
                    {
                        if(item.classList.contains(CollectionBrowserElement.selectedClassName) && item != children[i])
                        {
                            selected.push(item);
                        }
                        return selected;
                    }, new Array<Element>());

                    const shift = (event as MouseEvent).getModifierState("Shift");
                    const ctrl = (event as MouseEvent).getModifierState("Control");
                    const alt = (event as MouseEvent).getModifierState("Alt");
                    
                    const changeEvent = new CustomEvent('change', { cancelable: true, detail: { newSelection: children[i], previousSelection: currentlySelected, shift, ctrl, alt } });
                    const value = this.dispatchEvent(changeEvent);

                    if(value == false) { return; }
                    
                    if(this.allowMultiSelect == false)
                    {
                        for(let i = 0; i < currentlySelected.length; i++)
                        {
                            currentlySelected[i].classList.remove(CollectionBrowserElement.selectedClassName);
                        }
                    }
                    children[i].classList.toggle(CollectionBrowserElement.selectedClassName);
                });
            }
        });
    }

    static selectedClassName: string = 'selected';

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
        this.dispatchEvent(new CustomEvent('change', { detail: { newSelection: null, previousSelection: this.selected, shift: false, ctrl: false, alt: false } }));
    }

}

if(customElements.get(COMPONENT_TAG_NAME) == null)
{
    customElements.define(COMPONENT_TAG_NAME, CollectionBrowserElement);
}