## ResizeMirror

The resize mirror plugin changes the mirror dimensions as you drag it over other draggable elements. etc etc

This plugin is not included by default, so make sure to import it before using.

### Import

```js
import {Plugins} from '@shopify/draggable';
```

```js
import ResizeMirror from '@shopify/draggable/lib/plugins/resize-mirror';
```

```html
<script src="https://cdn.jsdelivr.net/npm/@shopify/draggable@1.0.0-beta.4/lib/plugins.js"></script>
```

```html
<script src="https://cdn.jsdelivr.net/npm/@shopify/draggable@1.0.0-beta.4/lib/plugins/resize-mirror.js"></script>
```

### API

**`new ResizeMirror(draggable: Draggable): ResizeMirror`**  
To create a resize mirror plugin instance.

### Options

**`duration {Integer}`**  
The duration option allows you to specify the animation duration when resizing the mirror. Default: `150`

**`easingFunction {String}`**  
The easing option allows you to specify an animation easing function when resizing the mirror. Default: `'ease-in-out'`

### Examples

```js
import {Sortable, Plugins} from '@shopify/draggable';

const sortable = new Sortable(document.querySelectorAll('ul'), {
  draggable: 'li',
  resizeMirror: {
    duration: 200,
    easingFunction: 'ease-in-out',
  },
  plugins: [Plugins.ResizeMirror],
});
```

### Plans

- 

### Caveats

- Does not work with empty containers (no draggable elements to base dimensions off)