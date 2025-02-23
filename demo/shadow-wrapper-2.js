import '../vanilla/collection-browser.js';
const COMPONENT_TAG_NAME = 'shadow-wrapper-2';
export class ShadowWrapperElement extends HTMLElement
{
    constructor()
    {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `<shadow-wrapper part="shadow-wrapper" exportpart="collection-browser">
                                        <slot></slot>
                                        <slot name="category" slot="category"></slot>
                                    </shadow-wrapper`;
    }
}

if(customElements.get(COMPONENT_TAG_NAME) == null)
{
    customElements.define(COMPONENT_TAG_NAME, ShadowWrapperElement);
}