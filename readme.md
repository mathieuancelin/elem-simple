# elem-simple

Super simple version of elem, under 300 loc and 4Kb gzipped

```
npm install --save elem-simple
```

or import the script from npmcdn with

```html
<script src="https://npmcdn.com/elem-simple/dist/elem.js"></script>
```

### Basics

```javascript
import Elem from 'elem-simple';

// a simple Hello component
const Hello = ({ who = 'World' }) => <h1>Hello {who}! ({Date.now()})</h1>;

// an app that uses the Hello component
const App = () => <div><Hello who="Mathieu" /></div>;

// render the App function inside the DOM
const app = Elem.render(App, document.getElementById('app'));

// redraw the App function every second
const interval = setInterval(app.redraw, 1000);

// after 5 seconds, cleanup everything
setTimeout(() => {
  clearInterval(interval);
  app.cleanup(); // remove app nodes from the DOM
}, 5000);
```

### JSX support

elem comes with builtin [JSX](https://jsx.github.io/) support through `createElement` or `jsx` functions.

You can either provider a `jsx pragma` to Babel

```
// .babelrc
{
  "presets": ["stage-0", "es2015", "react"],
  "plugins": [
    ["transform-react-jsx", { "pragma": "Elem.jsx" }]
  ]
}
```

```javascript
import Elem from 'elem-simple';

const App = ({ who = 'World' }) => <h1>Hello {who}!</h1>;

Elem.render(<App who="Mathieu" />, document.getElementById('app'));
```

or provide a fake `React` context

```javascript
import { render, createElement } from 'elem-simple';

const React = { createElement };

const App = ({ who = 'World' }) => <h1>Hello {who}!</h1>;

render(<App who="Mathieu" />, document.getElementById('app'));
```

### Functions as tag

```javascript
import Elem from 'elem-simple';

const Item = ({ name = '--' }) => <li>{props.name}</li>;
const App = (props) => ['Mathieu', 'Quentin'].map(item => <Item name={item} />);

Elem.render(<App who="Mathieu" />, document.getElementById('app'));
```

### Properties

Whenever you use a function as a JSX tag, a `props` object is passed allong. In this `props` object you will find any parameters passed to the JSX node and the following properties :

* `props.children` : the children of the tag
  * `const list = <List><li>Hello</li></List>`
* `props.redraw` : if you pass a function reference to `Elem.render` then any call to `redraw` from any component inside the tree will trigger a new `Elem.render` of the same function
* `props.myself`
  * `selector` : the query selector for the root node returned by the current function
  * `getNode()` : get the root node returned by the current function
  * `redraw(element)` : replace the root node returned by the current function wtih another element
* `props.context` : a plain old javascript object common to the whole tree. You can put whatener you need inside and you are responsible for it's management

### SVG support

```javascript

import Elem from 'elem-simple';

const shapes = (
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="300" height="200">
    <rect width="100" height="80" x="0" y="70" fill="green" />
    <line x1="5" y1="5" x2="250" y2="95" stroke="red" />
    <circle cx="90" cy="80" r="50" fill="blue" />
  </svg>
);

Elem.render(shapes, document.getElementById('app'));
```

### Inline styling

You can use plain old javascript object to define inline style on your HTML nodes

```javascript
const style = {
  color: 'red',
  backgroundColor: 'black',
  fontSize: '29px',
};
const node1 = <div style={style}>Hello</div>;
```

### CSS classes support

When you have to provide one or more classes on an HTML element, you can do it the following ways. Don't forget to use `className` instead of `class`.

```javascript
const node1 = <div className="hello">Hello</div>;
const node2 = <div className="hello hello-green">Hello</div>;
const node3 = <div className={['hello', 'hello-green']}>Hello</div>;
const node4 = <div className={{ hello: true, helloGreen: true, helloBlack: false }}>Hello</div>;
```

### Universal render

```javascript
import Elem from 'elem-simple';

const App = ({ who = 'World' }) => <h1>Hello {who}!</h1>;

const htmlCode = Elem.renderToString(<App who="Mathieu" />);

console.log(htmlCode);
```

### DOM nodes references

Whenever you need to get the actual DOM node behind a JSX node, you can provide a `ref` callback

```javascript
let textinput;

const Component = (props) => {
  return (
    <div>
      <input type="text" ref={(n) => textinput = n} />
      <button type="button"
        onClick={() => console.log(textinput.value)}>
        redraw
      </button>
    </div>
  );
};
```

### Predicate

`Elem.predicate(predicate, element)` allow conditional render of JSX nodes
