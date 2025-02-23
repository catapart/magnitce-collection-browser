import '../vanilla/collection-browser.js';
const COMPONENT_TAG_NAME = 'shadow-wrapper';
export class ShadowWrapperElement extends HTMLElement
{
    constructor()
    {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `<collection-browser part="collection-browser" placeholder="Collection is empty">
                            <slot></slot>
                            <slot name="category" slot="category"></slot>
                        </collection-browser>`;
    }
}

if(customElements.get(COMPONENT_TAG_NAME) == null)
{
    customElements.define(COMPONENT_TAG_NAME, ShadowWrapperElement);
}