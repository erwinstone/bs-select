
# @erwinstone/bs-select

Bootstrap plugin to create select element with dropdown


## Features

- Placeholder
- Optgroup
- Multiple
- Search
- Creatable
- Clearable
- Disabled
- Disabled options
- Sizing
- Validation


## Installation

Install with npm:
```bash
npm install @erwinstone/bs-select
```

Install from cdn:
```html
<link rel="stylesheet" href="https://unpkg.com/@erwinstone/bs-select@1.0.1/dist/bs-select.min.css">
<script src="https://unpkg.com/@erwinstone/bs-select@1.0.1/dist/bs-select.min.js"></script>
```
## Usage/Examples

```html
<select class="form-select" id="example">
  <option value="chrome">Chrome</option>
  <option value="firefox">Firefox</option>
  <option value="safari">Safari</option>
  <option value="edge">Edge</option>
  <option value="opera">Opera</option>
  <option value="brave">Brave</option>
</select>
```
```javascript
new Bss(document.querySelector('#example'))
```

## Options

```javascript
const config = {
  search: false, // Show search input. Default: false
  create: false, // Allow to create a new one if no results found. Default: false
  clear: false, // Show clear button. Default: false
  maxHeight: '25rem', // Maximum height to show scrollbar. Default: 25rem
}
new Bss(document.querySelector('#example'), config)
```

All options can also be set with attribute "data-bss-*"
```html
<select data-bss-search data-bss-create data-bss-clear data-bss-max-height="300px" class="form-select" id="example">
...
</select>
```

more documentation please see https://bs-select.vercel.app/
