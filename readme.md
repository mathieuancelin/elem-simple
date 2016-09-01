# elem-simple

Super simple version of `elemjs`, under 300 loc and around 3,5Kb gzipped, with absolutely no runtime dependencies.

```
npm install --save elem-simple
```

or import the script from unpkg with

```html
<script src="https://unpkg.com/elem-simple/dist/elem.js"></script>
```

### Basics

the `Elem` API is pretty simple

* `Elem.createElement(name, props, ...children)`: create the representation of a DOM node(called an element below). Used by JSX expressions.
* `Elem.render(tree, node, append = false)`: render the tree of elements into the `node`
* `Elem.renderToString(tree)`: return an HTML string representation for the tree of elements
* `Elem.Component` : Component class to subclass

you can use it this way

```javascript
import Elem from 'elem-simple';

// a simple Hello component
const Hello = ({ who = 'World' }) => <h1>Hello {who}! ({Date.now()})</h1>;

// an app that uses the Hello component
const App = () => <div><Hello who="Mathieu" /></div>;

// render the App function inside the DOM
const app = Elem.render(<App />, document.getElementById('app'));

// redraw the App function every second
const interval = setInterval(app.redraw, 1000);

// after 5 seconds, cleanup everything
setTimeout(() => {
  clearInterval(interval);
  const actualDOMNodeOfApp = app.getNode();
  ...
  app.cleanup(); // remove app nodes from the DOM
}, 5000);
```

### JSX support

elem comes with builtin [JSX](https://facebook.github.io/jsx/) support through `createElement` function.

You can either provider a `jsx pragma` to Babel

```
// .babelrc
{
  "presets": ["stage-0", "es2015", "react"],
  "plugins": [
    ["transform-react-jsx", { "pragma": "Elem.createElement" }]
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
const ReactDOM = { render };

const App = ({ who = 'World' }) => <h1>Hello {who}!</h1>;

ReactDOM.render(<App who="Mathieu" />, document.getElementById('app'));
```

### Functions as tags (or stateless components)

As you may have noticed, the first argument of `Elem.createElement` is either a string, a function that
return a JSX tree or a subclass instance of `Elem.Component`.

```javascript
import Elem from 'elem-simple';

const Item = ({ name = '--' }) => <li>{props.name}</li>;
const App = (props) => <ul>{props.who.map(item => <Item name={item} />)}</ul>;

Elem.render(<App who={['John', 'Jane']} />, document.getElementById('app'));
```

### Classes as tags or stateless components

```javascript
import Elem from 'elem-simple';

class App extends Elem.Component {
  constructor(props) {
    super(props);
  }
  getDefaultProps() {
    return {
      who: 'World',
    };
  },
  render() {
    return (
      <h1>Hello {this.props.who}!</h1>
    );
  }
}

Elem.render(<App who="Mathieu" />, document.getElementById('app'));
```

### Properties

Whenever you use a function as a JSX tag, a `props` object is passed along. In this `props` object you will find any parameters passed to the JSX node and the following properties :

* `props.children` : the children of the tag
  * `const list = <List><li>Hello</li></List>`
* `props.redraw` : if you pass a function reference to `Elem.render` then any call to `redraw` from any function element inside the tree will trigger a new `Elem.render` of the same function
* `props.myself`
  * `getNode()` : get the root node returned by the current function
  * `redraw(props)` : redraw the root node returned by the current function with the same element and different props
  * `replaceWith(element)` : replace the root node returned by the current function with another element
* `props.treeContext` : a plain old javascript object common to the whole tree. You can put whatever you need inside and you are responsible for it's management

So when you are passing properties to a functional element, avoid to name your properties with the following values

* children
* redraw
* myself
* treeContext

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

### Specs

* JSX first class support through `Elem.createElement`
* you can attach event handlers on any DOM element with a function as property called `onEventname`
* reusable components are done via plain old functions
  * each call to these functions are made by the library
  * the call to these functions is deferred until the library need to render it to the DOM or elsewhere
  * the first and only argument of the function is the properties of the element
  * the properties contains a special attribute (`children`) that represents the array of children of the element. Can be empty
  * the properties contains a special attribute (`redraw`) that allow the user to re-render the whole element tree passed to `Elem.render`
  * the properties contains a special attribute (`myself`) that contains informations about the physical place in DOM where the element tree of the function will be inserted
    * `myself` has a function called `getNode` that returns the root node return by the function
    * `myself` has a function called `redraw` that recall the original function with new properties and renders it at the same place
    * `myself` has a function called `replaceWith` that renders it a new element tree at the same place
  * if you define the property `className` (the class) it can be
    * a simple string
    * an array of string
    * an object with boolean values. Each key with a true value will be added to the class
  * if you define the property `style` it can be
    * a simple string
    * an object that will be serialized to a style value
  * if you define the property `ref` on a DOM element as a function, this function will be called with the actual DOM node created by `Elem` as the first parameter of the function
* reusable components are also done via classes that extends `Elem.Component` with a `render` method. `props` are available through `this`.
* `Elem.render` can render an element tree, or an array of element tree created with `Elem.createElement`
* `Elem.render` takes an `HTMLElement` as second parameter
* `Elem.render` can take a third parameter to specify if the element tree will be appended to the root node of if the content of the root node will be deleted. By default, it's deleted
* `Elem.renderToString` return a string output of the element tree
* `Elem.renderToString` doesn't need to be called inside a browser env
* `Elem` can render `SVG` nodes
* if you pass an `attributes` object on an HTML element, all the values of the object will be directly set on the actual DOM node. Works for stuff like `innerHTML`, `indeterminate`, etc ...
