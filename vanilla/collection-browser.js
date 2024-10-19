// collection-browser.css?raw
var collection_browser_default = ':host\r\n{\r\n    --border-color: rgb(205 205 205);\r\n\r\n    display: grid;\r\n    border: solid 1px var(--border-color);\r\n}\r\n@media (prefers-color-scheme: dark) \r\n{\r\n    :host\r\n    {\r\n        --border-color: rgb(81 81 81);\r\n    }\r\n}\r\n\r\n[part="navigation"]\r\n{\r\n    border-right: solid 1px var(--border-color);\r\n}\r\n[part="categories"] > ::slotted(*)\r\n{\r\n    padding: var(--category-padding, 5px 15px);\r\n}\r\n\r\n[part="gallery"]\r\n{\r\n    margin: 0;\r\n    display: grid;\r\n    grid-template-rows: auto 1fr;\r\n    /* gap: 1em; */\r\n    user-select: none;\r\n    overflow: auto;\r\n}\r\n\r\n[part="header"]\r\n{\r\n    display: grid;\r\n    grid-template-columns: 1fr auto;\r\n    align-items: center;\r\n\r\n    border-bottom: solid 1px var(--border-color);\r\n}\r\n\r\n[part="items"]\r\n{\r\n    padding: 0;\r\n    margin: 0;\r\n    list-style: none;\r\n\r\n    display: grid;\r\n    grid-template-columns: repeat(auto-fill, var(--item-width, minmax(0, 100px)));\r\n    /* grid-column-gap: var(--column-gap, 1em);\r\n    grid-row-gap: var(--row-gap, 1em); */\r\n}\r\n\r\n\r\n::slotted(:not([slot]))\r\n{\r\n    border: solid 1px transparent;\r\n    margin: 3px 7px;\r\n}\r\n\r\n::slotted(:not([slot]):focus)\r\n{\r\n    border-color: rgb(205 205 205);\r\n}\r\n::slotted(:not([slot]):hover)\r\n{\r\n    background-color: var(--background-color-hover, rgb(221, 221, 221));\r\n}\r\n::slotted(:not([slot]).selected)\r\n{\r\n    background-color: var(--background-color-selected, highlight);\r\n    color: var(--color-selected, highlighttext);\r\n}\r\n@media (prefers-color-scheme: dark) \r\n{\r\n    ::slotted(:not([slot]):hover)\r\n    {\r\n        --background-color-hover: rgb(197, 197, 197);\r\n    }\r\n}\r\n\r\n[part="add-button"]\r\n{\r\n    align-self: center;\r\n    justify-self: flex-end;\r\n    margin: .5em 1em;\r\n}\r\n\r\n\r\n@media (max-width: 800px) \r\n{\r\n    \r\n}\r\n@media (min-width: 800px) \r\n{\r\n    :host\r\n    {\r\n        display: grid;\r\n        grid-template-columns: auto 1fr;\r\n    }\r\n}';

// collection-browser.html?raw
var collection_browser_default2 = '<nav part="navigation">\r\n    <slot name="navigation-header">\r\n        <header part="navigation-header">\r\n            <slot name="navigation-header-content"></slot>\r\n        </header>\r\n    </slot>\r\n    <selectable-items part="categories"><slot name="category"></slot></selectable-items>\r\n</nav>\r\n<div part="gallery">\r\n    <slot name="header">\r\n        <header part="header">\r\n            <slot name="header-content">\r\n            </slot>\r\n            <slot name="add-button">\r\n                <button part="add-button">\r\n                    <slot name="add-button-content">\r\n                        <span part="add-button-icon">+</span>\r\n                        <span part="add-button-label">Add Item</span>\r\n                    </slot>\r\n                </button>\r\n            </slot>\r\n        </header>\r\n    </slot>\r\n    <div part="items">\r\n        <slot></slot>\r\n    </div>\r\n</div>';

// node_modules/.pnpm/@magnit-ce+selectable-items@0.0.6/node_modules/@magnit-ce/selectable-items/dist/selectable-items.js
var selectable_items_default = ":host { user-select: none; }\n::slotted(*)\n{\n    user-select: none;\n    cursor: pointer;\n}\n::slotted(:hover)\n{\n    background-color: var(--background-color-hover, rgb(221, 221, 221));\n}\n::slotted(.selected)\n{\n    background-color: var(--background-color-selected, highlight);\n    color: var(--color-selected, highlighttext);\n}\n@media (prefers-color-scheme: dark) \n{\n    ::slotted(:hover)\n    {\n        --background-color-hover: rgb(197, 197, 197);\n    }\n}";
var COMPONENT_STYLESHEET = new CSSStyleSheet();
COMPONENT_STYLESHEET.replaceSync(selectable_items_default);
document.addEventListener("keydown", (event) => {
  if (SelectableItemsElement.multipleModifierKeys.indexOf(event.code) > -1) {
    SelectableItemsElement._multipleModifierActive = true;
    return;
  }
});
document.addEventListener("keyup", (event) => {
  if (SelectableItemsElement.multipleModifierKeys.indexOf(event.code) > -1) {
    SelectableItemsElement._multipleModifierActive = SelectableItemsElement.multipleModifierActive;
  }
});
var COMPONENT_TAG_NAME = "selectable-items";
var SelectableItemsElement = class _SelectableItemsElement extends HTMLElement {
  static observedAttributes = [];
  // internal
  static _multipleModifierActive = false;
  // externally available to define when multiples are selected
  static multipleModifierKeys = ["ShiftLeft", "ShiftRight", "ControlLeft", "ControlRight"];
  static multipleModifierActive = false;
  static selectKeys = ["Enter", "Space"];
  static selectedClassName = "selected";
  selected = () => [...this.querySelectorAll(`.${_SelectableItemsElement.selectedClassName}`)];
  handledItems = /* @__PURE__ */ new WeakSet();
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `<slot></slot>`;
    this.shadowRoot.adoptedStyleSheets.push(COMPONENT_STYLESHEET);
    this.shadowRoot.querySelector("slot").addEventListener("slotchange", (event) => {
      const children = event.target.assignedElements();
      for (let i = 0; i < children.length; i++) {
        if (this.handledItems.has(children[i]) || children[i].tagName.toLowerCase() == "slot") {
          continue;
        }
        children[i].setAttribute("tabIndex", "0");
        children[i].addEventListener("keydown", (event2) => {
          if (_SelectableItemsElement.selectKeys.indexOf(event2.code) > -1) {
            this.selectItem(event2.currentTarget);
          }
        });
        children[i].addEventListener("click", (event2) => {
          this.selectItem(event2.currentTarget);
        });
        this.handledItems.add(children[i]);
      }
    });
  }
  selectItem(item) {
    const allowMultipleAttribute = this.getAttribute("multiple") ?? this.getAttribute("multi");
    if (_SelectableItemsElement._multipleModifierActive == false || allowMultipleAttribute == null) {
      const currentlySelected = [...(item.parentElement ?? this).children].reduce((selected, currentItem, _index) => {
        if (this.handledItems.has(currentItem) && currentItem.classList.contains(_SelectableItemsElement.selectedClassName)) {
          selected.push(currentItem);
        }
        return selected;
      }, new Array());
      currentlySelected.forEach((currentItem) => currentItem.classList.remove(_SelectableItemsElement.selectedClassName));
    }
    item.classList.add(_SelectableItemsElement.selectedClassName);
    this.dispatchEvent(new Event("change"));
  }
};
if (customElements.get(COMPONENT_TAG_NAME) == null) {
  customElements.define(COMPONENT_TAG_NAME, SelectableItemsElement);
}

// collection-browser.ts
var CollectionBrowserParts = /* @__PURE__ */ ((CollectionBrowserParts2) => {
  return CollectionBrowserParts2;
})(CollectionBrowserParts || {});
var COMPONENT_STYLESHEET2 = new CSSStyleSheet();
COMPONENT_STYLESHEET2.replaceSync(collection_browser_default);
var COMPONENT_TAG_NAME2 = "collection-browser";
var CollectionBrowserElement = class _CollectionBrowserElement extends HTMLElement {
  componentParts = /* @__PURE__ */ new Map();
  getPart(key) {
    if (this.componentParts.get(key) == null) {
      const part = this.shadowRoot.querySelector(`[part="${key}"]`);
      if (part != null) {
        this.componentParts.set(key, part);
      }
    }
    return this.componentParts.get(key);
  }
  findPart(key) {
    return this.shadowRoot.querySelector(`[part="${key}"]`);
  }
  get selected() {
    return this.#getSelected();
  }
  #getSelected = () => [
    ...this.shadowRoot.querySelector("slot:not([name])").assignedElements().reduce((selected, item, _index) => {
      if (item.classList.contains("selected")) {
        selected.push(item);
      }
      return selected;
    }, new Array())
  ];
  get allowMultiSelect() {
    return this.hasAttribute("multi") || this.hasAttribute("multiple");
  }
  handledItems = /* @__PURE__ */ new WeakSet();
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = collection_browser_default2;
    this.shadowRoot.adoptedStyleSheets.push(COMPONENT_STYLESHEET2);
    let previousCategorySelection = [];
    this.shadowRoot.querySelector("selectable-items").addEventListener("change", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const categories = [...this.querySelectorAll('[slot="category"]')];
      const selected = categories.find((item) => item.classList.contains("selected"));
      const changeEvent = new CustomEvent("category", { cancelable: true, detail: { previousSelection: previousCategorySelection, newSelection: selected } });
      const value = this.dispatchEvent(changeEvent);
      if (selected == null) {
        previousCategorySelection = [];
      } else {
        previousCategorySelection = [selected];
      }
      if (value == false || selected == null) {
        return;
      }
      const category = selected.dataset.category;
      if (category == null || category.trim() == "") {
        return;
      }
      this.dataset.category = category;
      const items = [...this.querySelectorAll(":not([slot])")];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        item.classList.remove("has-category");
        if (item.dataset.category == null || item.dataset.category.trim() == "") {
          continue;
        }
        if (item.dataset.category == category) {
          item.classList.add("has-category");
        } else {
          const categoriesArray = item.dataset.category.split(",");
          for (let j = 0; j < categoriesArray.length; j++) {
            const currentCategory = categoriesArray[j];
            if (currentCategory == category) {
              item.classList.add("has-category");
              break;
            }
          }
        }
      }
    });
    this.shadowRoot.querySelector("slot:not([name])").addEventListener("slotchange", (event) => {
      const children = event.target.assignedElements();
      for (let i = 0; i < children.length; i++) {
        if (this.handledItems.has(children[i])) {
          continue;
        }
        children[i].addEventListener("click", (event2) => {
          event2.stopPropagation();
          const currentlySelected = children.reduce((selected, item, _index) => {
            if (item.classList.contains(_CollectionBrowserElement.selectedClassName) && item != children[i]) {
              selected.push(item);
            }
            return selected;
          }, new Array());
          const shift = event2.getModifierState("Shift");
          const ctrl = event2.getModifierState("Control");
          const alt = event2.getModifierState("Alt");
          const changeEvent = new CustomEvent("change", { cancelable: true, detail: { newSelection: children[i], previousSelection: currentlySelected, shift, ctrl, alt } });
          const value = this.dispatchEvent(changeEvent);
          if (value == false) {
            return;
          }
          if (this.allowMultiSelect == false) {
            for (let i2 = 0; i2 < currentlySelected.length; i2++) {
              currentlySelected[i2].classList.remove(_CollectionBrowserElement.selectedClassName);
            }
          }
          children[i].classList.toggle(_CollectionBrowserElement.selectedClassName);
        });
      }
    });
  }
  static selectedClassName = "selected";
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
  clearSelection() {
    this.dispatchEvent(new CustomEvent("change", { detail: { newSelection: null, previousSelection: this.selected, shift: false, ctrl: false, alt: false } }));
  }
};
if (customElements.get(COMPONENT_TAG_NAME2) == null) {
  customElements.define(COMPONENT_TAG_NAME2, CollectionBrowserElement);
}
export {
  CollectionBrowserElement,
  CollectionBrowserParts
};
