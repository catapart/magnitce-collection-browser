# magnitce-collection-browser
A custom `HTMLElement` that provides a selection gallery to mimic an os-native file browser.

Package size: ~8kb minified, ~13kb verbose.

## Quick Reference
```html
<collection-browser>
    <h2 slot="navigation-header">Categories</h2>
    <div slot="category" data-category="1">Category 1</div>
    <div slot="category" data-category="2">Category 2</div>
    <div data-category="1">A</div>
    <div data-category="1">B</div>
    <div data-category="1">C</div>
    <div data-category="2">D</div>
    <div data-category="2">E</div>
    <div data-category="2">F</div>
</collection-browser>
<script type="module" src="/path/to/collection-browser[.min].js"></script>
```

## Demos
https://catapart.github.io/magnitce-collection-browser/demo/

## Support
- Firefox
- Chrome
- Edge
- <s>Safari</s> (Has not been tested; should be supported, based on custom element support)

## Getting Started
 1. [Install/Reference the library](#referenceinstall)

### Reference/Install
#### HTML Import (not required for vanilla js/ts; alternative to import statement)
```html
<script type="module" src="/path/to/collection-browser[.min].js"></script>
```
#### npm
```cmd
npm install @magnit-ce/collection-browser
```

### Import
#### Vanilla js/ts
```js
import "/path/to/collection-browser[.min].js"; // if you didn't reference from a <script>, reference with an import like this

import { CollectionBrowserElement } from "/path/to/collection-browser[.min].js";
```
#### npm
```js
import "@magnit-ce/collection-browser"; // if you didn't reference from a <script>, reference with an import like this

import { CollectionBrowserElement } from "@magnit-ce/collection-browser";
```

---
---
---

## Overview
The `<collection-browser>` element is a container element for any arbitrary child elements that will display them as a gallery of selectable items.

It consists of a gallery of items and a navigation pane for including elements that can be used to filter the gallery items, with headers for each - the gallery and the navigation.

The element uses the shadowDOM both for its styling scope, to manage its internal layout, and for its slotting functionality, to place items and navigation categories appropriately.

It also provides simple item filtering using the category elements, as well as events for custom handling of all of its management.

## Events
The `<collection-browser>` element dispatches the following three events:
- `change`: fires when an item is selected. Provides data about the current selected item, as well as the previously selected items.
- `category`: fires when a category is selected. Provides data about the current selected category, as well as the previously selected category.
- `add`: fires when the "Add Item" button is clicked.

By default, when a `change` event, or a `category` event is dispatched, the `<collection-browser>` element will apply styles and filtering to the items. Both of these functions can be prevented on each event by handling the event and calling the `preventDefault()` function on th `Event` parameter.

Selection is managed by a `selected` class which is added or removed from items depending upon their selected state. The actual class name can be customized by setting the static `selectedClassName` property on the element.

Default filtering functionality consists of adding or removing a `has-category` class depending upon whether an item can be matched (see [Attributes](#attributes)) to the selected category.

## Attributes
The `<collection-browser>` element uses the `multi` attribute (alternative: `multiple`) to determine if only a single item can be selected, or if multiple items can be selected. If the `multi` attribute is present, all items may be selected at the same time. If the `multi` attribute is not present, each selection event will deselect all previously selected items.

### `data-category` data attribute
Simple filtering can be achieved with the `<collection-browser>` by using the `data-category` attribute as a key to match each item with an element that fills the `category` slot. In the simplest example, this means adding a `data-category` attribute with a specific value to a `category` element, and then adding a `data-category` attribute with that same value to an item element:
```html
<collection-browser>
    <div slot="category" data-category="1">Category 1</div>
    <div slot="category" data-category="2">Category 2</div>
    <div slot="category" data-category="3">Category 3</div>
    <div slot="category" data-category="4">Category 4</div>
    <div data-category="1">A</div>
    <div data-category="1">B</div>
    <div data-category="1">C</div>
    <div data-category="2">D</div>
    <div data-category="2">E</div>
    <div data-category="2">F</div>
    <div data-category="3">G</div>
    <div data-category="3">H</div>
    <div data-category="3">I</div>
    <div data-category="4">J</div>
    <div data-category="4">K</div>
    <div data-category="4">L</div>
</collection-browser>
```

Items may be linked to multiple `category` elements by providing each of the `category` keys as a comma-separated list as the value for the item's `data-category` attribute. In this example, the "J", "K", and "L" elements would get the `has-category` class if either of their provided categories were selected:
```html
<collection-browser>
    <div slot="category" data-category="1">Category 1</div>
    <div slot="category" data-category="2">Category 2</div>
    <div slot="category" data-category="3">Category 3</div>
    <div slot="category" data-category="4">Category 4</div>
    <div data-category="1">A</div>
    <div data-category="1">B</div>
    <div data-category="1">C</div>
    <div data-category="2">D</div>
    <div data-category="2">E</div>
    <div data-category="2">F</div>
    <div data-category="3">G</div>
    <div data-category="3">H</div>
    <div data-category="3">I</div>
    <div data-category="1,4">J</div>
    <div data-category="2,4">K</div>
    <div data-category="3,4">L</div>
</collection-browser>
```

## Slots
The `<collection-browser>` element exposes the following `slot`s: 
|Slot Name|Description|Default
|-|-|-|
|[Default]|Slot that holds all of the `<collection-browser>`'s items.(*note: this slot has no name; all children of the `<collection-browser>` element that do not have an assigned `slot` attribute will be placed in this default slot.*)|[empty]|
|`category`|A category that is related to the items and can be used for populating or filtering the items. Multiple elements can use the `category` slot at the same time for a list of categories.|[empty]|
|`navigation-header`|A header for the navigation pane. Can be used to describe the collection of categories.|`HTMLHeaderElement[part="navigation-header"]`|
|`navigation-header-content`|Content to be rendered inside the header for the list of categories.|[empty]|
|`header`|A header for the browser's items.|`HTMLHeaderElement[part="header"]`|
|`header-content`|Content to be rendered inside the header for the browser's items. For convenience, this slot does **not** include the "Add Item" button, despite the button being rendered in the header element.|[empty]|
|`add-button`|A button that dispatches an event to indicate a new item should be added to the `<collection-browser>` element.|[`HTMLButtonElement[part="add-button"]`]|
|`add-button-content`|Content to be rendered inside of the "Add Item" button. Replaces the `add-button-icon` and `add-button-label` parts.|[`HTMLSpanElement[part="add-button-icon"]`,`HTMLSpanElement[part="add-button-label"]`]|

## Parts
The `<collection-browser>` element uses the following `part`s: 
|Part Name|Description|Default
|-|-|-|
|`navigation`|A container for category elements.|`HTMLNavElement`|
|`navigation-header`|A container for category elements.|`HTMLHeaderElement`|
|`categories`|A list of categories that can be selected.|Custom [`<selectable-items>`](https://github.com/catapart/magnitce-selectable-items) element|
|`gallery`|A container for the `<collection-browser>`'s items, as well as a header for those items.|`HTMLDivElement`|
|`header`|A header for the `<collection-browser>`'s items.|`HTMLHeaderElement`|
|`add-button`|A button that dispatches an event to indicate a new item should be added to the `<collection-browser>` element.|`HTMLButtonElement`|
|`add-button-icon`|An icon to indicate "Adding".|`HTMLSpanElement`|
|`add-button-label`|Text that indicates "Add".|`HTMLSpanElement`|
|`items`|A container the browser's items.|`HTMLDivElement`|

## Styling
The `<collection-browser>` element can be styled with CSS, normally, but it also makes use of the shadowDOM for it's layout and functionality. Each of the elements in the `<collection-browser>` element's shadowRoot can be selected for styling, directly, by using the `::part()` selector.

In this example, the `header` part is being selected for styling:
```css
collection-browser::part(header)
{
    /* styling */
}
```

For a list of all part names, see the [parts](#parts) section.

## License
This library is in the public domain. You do not need permission, nor do you need to provide attribution, in order to use, modify, reproduce, publish, or sell it or any works using it or derived from it.