/* eslint no-unused-vars:0, no-undef:0, no-unused-expressions:0, react/no-multi-comp: 0, react/prop-types: 0, react/jsx-boolean-value: 0 */

import * as React from '../src/index';
import { isFunction } from '../src/utils';
import chai, { expect } from 'chai';

describe('elem-simple', () => {
  it('should just work !!!', () => {
    const App = (props) => {
      return (
        <div id="hello" dataTruc="machin" className={['btn', 'btn-primary']} style={{ color: 'red', backgroundColor: 'white' }}>Hello World!</div>
      );
    };
    const app = React.render(App, document.getElementById('app'));
    const div = document.getElementById('hello');
    expect(div.innerHTML).to.be.equal('Hello World!');
    expect(div.getAttribute('data-truc')).to.be.equal('machin');
    expect(div.style.color).to.be.equal('red');
    expect(div.style.backgroundColor).to.be.equal('white');
    expect(div.style['background-color']).to.be.equal('white');
    expect(div.getAttribute('class')).to.be.equal('btn btn-primary');
    app.cleanup();
  });
  it('should handle direct attributes with the `attributes` props', () => {
    const app = React.render(<h1 attributes={{ yo: 'Man' }}>Hello</h1>, document.getElementById('app'));
    const h1 = document.getElementsByTagName('h1')[0];
    expect(h1.yo).to.be.equal('Man');
    app.cleanup();
  });
  it('should handle innerHTML with the `attributes` props', () => {
    const app = React.render(<div attributes={{ innerHTML: '<h1>Test innerHTML</h1>' }}></div>, document.getElementById('app'));
    const h1 = document.getElementsByTagName('h1')[0];
    expect(h1.innerHTML).to.be.equal('Test innerHTML');
    app.cleanup();
  });
  it('should provide a way to get actual DOM node references', () => {
    const app = React.render(<input value="textvalue" ref={(n) => n.value = 'set value'} />, document.getElementById('app'));
    const input = document.getElementsByTagName('input')[0];
    expect(input.value).to.be.equal('set value');
    app.cleanup();
  });
  it('should provide a way set event handlers on DOM nodes', () => {
    let inputNode;
    const app = React.render(<div>
      <button type="button" onClick={(e) => inputNode.value = 'clicked'}>Click me</button>
      <input value="textvalue" ref={(n) => inputNode = n} />
    </div>, document.getElementById('app'));
    const input = document.getElementsByTagName('input')[0];
    const button = document.getElementsByTagName('button')[0];
    expect(input.value).to.be.equal('textvalue');
    button.click();
    expect(input.value).to.be.equal('clicked');
    app.cleanup();
  });
  it('should provide a way render HTML on the server', () => {
    const app = React.renderToString(<h1 className="title" style={{ color: 'red' }}>Hello World!</h1>);
    expect(app).to.be.equal('<h1 class="title" style="color:red;">Hello World!</h1>');
  });
  it('should provide components through pure functions', () => {
    const Item = (props) => <li>Item : {props.name}</li>;
    const App = (props) => {
      return (
        <div>
          <Item name="John" />
          <Item name="Paul" />
          <Item name="Jones" />
        </div>
      );
    };
    const app = React.render(App, document.getElementById('app'));
    const items = document.getElementsByTagName('li');
    expect(items.length).to.be.equal(3);
    expect(items[0].innerHTML).to.be.equal('Item : John');
    expect(items[1].innerHTML).to.be.equal('Item : Paul');
    expect(items[2].innerHTML).to.be.equal('Item : Jones');
    app.cleanup();
  });
  it('should be able to render SVG nodes', () => {
    const shapes = (
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="300" height="200">
        <rect width="100" height="80" x="0" y="70" fill="green" />
        <line x1="5" y1="5" x2="250" y2="95" stroke="red" />
        <circle cx="90" cy="80" r="50" fill="blue" />
      </svg>
    );
    const app = React.render(shapes, document.getElementById('app'));
    const rect = document.getElementsByTagName('rect')[0];
    const line = document.getElementsByTagName('line')[0];
    const circle = document.getElementsByTagName('circle')[0];

    expect(rect.getAttribute('fill')).to.be.equal('green');
    expect(rect.getAttribute('width')).to.be.equal('100');
    expect(rect.getAttribute('height')).to.be.equal('80');
    expect(rect.getAttribute('x')).to.be.equal('0');
    expect(rect.getAttribute('y')).to.be.equal('70');

    expect(line.getAttribute('x1')).to.be.equal('5');
    expect(line.getAttribute('x2')).to.be.equal('250');
    expect(line.getAttribute('y1')).to.be.equal('5');
    expect(line.getAttribute('y2')).to.be.equal('95');
    expect(line.getAttribute('stroke')).to.be.equal('red');

    expect(circle.getAttribute('cx')).to.be.equal('90');
    expect(circle.getAttribute('cy')).to.be.equal('80');
    expect(circle.getAttribute('r')).to.be.equal('50');
    expect(circle.getAttribute('fill')).to.be.equal('blue');

    app.cleanup();
  });
  it('should handle simple className', () => {
    const App = (props) => {
      return (
        <h1 className="btn">Hello World!</h1>
      );
    };
    const app = React.render(App, document.getElementById('app'));
    const h1 = document.getElementsByTagName('h1')[0];
    expect(h1.getAttribute('class')).to.be.equal('btn');
    app.cleanup();
  });
  it('should handle array className', () => {
    const App = (props) => {
      return (
        <h1 className={['btn', 'btn-danger']}>Hello World!</h1>
      );
    };
    const app = React.render(App, document.getElementById('app'));
    const h1 = document.getElementsByTagName('h1')[0];
    expect(h1.getAttribute('class')).to.be.equal('btn btn-danger');
    app.cleanup();
  });
  it('should handle object className', () => {
    const App = (props) => {
      return (
        <h1 className={{ btn: true, btnDanger: false, btnWarning: true }}>Hello World!</h1>
      );
    };
    const app = React.render(App, document.getElementById('app'));
    const h1 = document.getElementsByTagName('h1')[0];
    expect(h1.getAttribute('class')).to.be.equal('btn btn-warning');
    app.cleanup();
  });
  it('should handle style object', () => {
    const App = (props) => {
      return (
        <h1 style={{ color: 'red', backgroundColor: 'black', border: '1px solid blue' }}>Hello World!</h1>
      );
    };
    const app = React.render(App, document.getElementById('app'));
    const h1 = document.getElementsByTagName('h1')[0];
    expect(h1.style.color).to.be.equal('red');
    expect(h1.style.backgroundColor).to.be.equal('black');
    expect(h1.style.border).to.be.equal('1px solid blue');
    expect(h1.getAttribute('style')).to.be.equal('color:red;background-color:black;border:1px solid blue;');
    app.cleanup();
  });
  it('should handle style string', () => {
    const App = (props) => {
      return (
        <h1 style="color:red;background-color:black;border:1px solid blue;">Hello World!</h1>
      );
    };
    const app = React.render(App, document.getElementById('app'));
    const h1 = document.getElementsByTagName('h1')[0];
    expect(h1.style.color).to.be.equal('red');
    expect(h1.style.backgroundColor).to.be.equal('black');
    expect(h1.style.border).to.be.equal('1px solid blue');
    expect(h1.getAttribute('style')).to.be.equal('color:red;background-color:black;border:1px solid blue;');
    app.cleanup();
  });
  it('should provide a context to its components', () => {
    const FirstComponent = (props) => {
      props.context.secondvalue = 'value2';
      return <div className="firstcomponent">{props.context.value}</div>;
    };
    const SecondComponent = (props) => <div className="secondcomponent">{props.context.value} {props.context.secondvalue}</div>;
    const App = (props) => {
      props.context.value = 'value1';
      return (
        <div>
          <FirstComponent />
          <SecondComponent />
        </div>
      );
    };
    const app = React.render(App, document.getElementById('app'));
    const div1 = document.querySelector('.firstcomponent');
    const div2 = document.querySelector('.secondcomponent');
    expect(div1.innerHTML).to.be.equal('value1');
    expect(div2.innerHTML).to.be.equal('value1 value2');
    app.cleanup();
  });
  it('should provide a way to redraw the whole element tree', () => {
    let firstValue = 1;
    let secondValue = 1;
    const FirstComponent = (props) => <div className="firstcomponent">{firstValue}</div>;
    const SecondComponent = (props) => <div className="secondcomponent" onClick={(e) => {
      firstValue = 200;
      secondValue = 400;
      props.redraw();
    }}>{secondValue}</div>;
    const App = (props) => {
      return (
        <div>
          <FirstComponent />
          <SecondComponent />
          <button type="button" onClick={(e) => {
            firstValue += 1;
            secondValue += 2;
            props.redraw();
          }}>click me</button>
        </div>
      );
    };
    const app = React.render(App, document.getElementById('app'));
    let div1 = document.querySelector('.firstcomponent');
    let div2 = document.querySelector('.secondcomponent');
    const button = document.getElementsByTagName('button')[0];
    expect(div1.innerHTML).to.be.equal('1');
    expect(div2.innerHTML).to.be.equal('1');
    button.click();
    div1 = document.querySelector('.firstcomponent');
    div2 = document.querySelector('.secondcomponent');
    expect(div1.innerHTML).to.be.equal('2');
    expect(div2.innerHTML).to.be.equal('3');
    div2.click();
    div1 = document.querySelector('.firstcomponent');
    div2 = document.querySelector('.secondcomponent');
    expect(div1.innerHTML).to.be.equal('200');
    expect(div2.innerHTML).to.be.equal('400');
    app.cleanup();
  });
  it('should provide a way to redraw a particular tag', () => {
    let firstValue = 1;
    let secondValue = 1;
    const FirstComponent = (props) => <div className="firstcomponent">{props.value}</div>;
    const SecondComponent = (props) => {
      return (
        <div className="secondcomponent" onClick={(e) => {
          secondValue = 600;
          firstValue = 1000;
          props.myself.redraw({ value: secondValue });
        }}>{props.value}</div>
    );
    };
    const App = (props) => {
      return (
        <div>
          <FirstComponent value={firstValue} />
          <SecondComponent value={secondValue} />
        </div>
      );
    };
    const app = React.render(App, document.getElementById('app'));
    const div1 = document.querySelector('.firstcomponent');
    let div2 = document.querySelector('.secondcomponent');
    expect(div1.innerHTML).to.be.equal('1');
    expect(div2.innerHTML).to.be.equal('1');
    div2.click();
    div2 = document.querySelector('.secondcomponent');
    expect(div1.innerHTML).to.be.equal('1');
    expect(div2.innerHTML).to.be.equal('600');
    app.cleanup();
  });
  it('should provide a way to replace a particular tag', () => {
    let firstValue = 1;
    let secondValue = 1;
    const FirstComponent = (props) => <div className="firstcomponent">{props.value}</div>;
    const SecondComponent = (props) => {
      return (
        <div className="secondcomponent" onClick={(e) => {
          secondValue = 600;
          firstValue = 1000;
          props.myself.replaceWith(<SecondComponent value={secondValue} />);
        }}>{props.value}</div>
      );
    };
    const App = (props) => {
      return (
        <div>
          <FirstComponent value={firstValue} />
          <SecondComponent value={secondValue} />
        </div>
      );
    };
    const app = React.render(App, document.getElementById('app'));
    const div1 = document.querySelector('.firstcomponent');
    let div2 = document.querySelector('.secondcomponent');
    expect(div1.innerHTML).to.be.equal('1');
    expect(div2.innerHTML).to.be.equal('1');
    div2.click();
    div2 = document.querySelector('.secondcomponent');
    expect(div1.innerHTML).to.be.equal('1');
    expect(div2.innerHTML).to.be.equal('600');
    app.cleanup();
  });
  it('should handle components with children', () => {
    const Item = (props) => <li className="item">{props.value}</li>;
    const Wrapper = (props) => <ul className="wrapper">{props.children}</ul>;
    const App = (props) => {
      return (
        <Wrapper>
          <Item value="Item 1" />
          <Item value="Item 2" />
          <Item value="Item 3" />
        </Wrapper>
      );
    };
    const app = React.render(App, document.getElementById('app'));
    const ul = document.querySelector('ul');
    const children = ul.childNodes;
    expect(ul.className).to.be.equal('wrapper');
    expect(children.length).to.be.equal(3);
    expect(children[0].innerHTML).to.be.equal('Item 1');
    expect(children[0].tagName).to.be.equal('LI');
    expect(children[0].className).to.be.equal('item');
    expect(children[1].innerHTML).to.be.equal('Item 2');
    expect(children[1].tagName).to.be.equal('LI');
    expect(children[1].className).to.be.equal('item');
    expect(children[2].innerHTML).to.be.equal('Item 3');
    expect(children[2].tagName).to.be.equal('LI');
    expect(children[2].className).to.be.equal('item');
    app.cleanup();
  });
  it('should play nice with predicates', () => {
    const Item = (props) => <li className="item">{props.value}</li>;
    const App = (props) => {
      return (
        <ul>
          {React.predicate(true, <Item value="Item 1" />)}
          {React.predicate(false, <Item value="Item 2" />)}
          {React.predicate(() => true, <Item value="Item 3" />)}
          {React.predicate(() => true, () => <Item value="Item 4" />)}
        </ul>
      );
    };
    const app = React.render(App, document.getElementById('app'));
    const ul = document.querySelector('ul');
    const children = ul.childNodes;
    expect(children.length).to.be.equal(3);
    expect(children[0].innerHTML).to.be.equal('Item 1');
    expect(children[0].tagName).to.be.equal('LI');
    expect(children[0].className).to.be.equal('item');
    expect(children[1].innerHTML).to.be.equal('Item 3');
    expect(children[1].tagName).to.be.equal('LI');
    expect(children[1].className).to.be.equal('item');
    expect(children[2].innerHTML).to.be.equal('Item 4');
    expect(children[2].tagName).to.be.equal('LI');
    expect(children[2].className).to.be.equal('item');
    app.cleanup();
  });
  it('should be able to wrap other components easily', () => {
    const Item = (props) => <li className="item">{props.value}</li>;
    const Conditional = (props) => {
      if (props.condition === true) {
        return props.children[0];
      } if (isFunction(props.condition) && props.condition()) {
        return props.children[0];
      } else {
        return null;
      }
    };
    const App = (props) => {
      return (
        <ul>
          <Conditional condition={true}><Item value="Item 1" /></Conditional>
          <Conditional condition={false}><Item value="Item 2" /></Conditional>
          <Conditional condition={() => true}><Item value="Item 3" /></Conditional>
          <Conditional condition={() => true}><Item value="Item 4" /></Conditional>
        </ul>
      );
    };
    const app = React.render(App, document.getElementById('app'));
    const ul = document.querySelector('ul');
    const children = ul.childNodes;
    expect(children.length).to.be.equal(3);
    expect(children[0].innerHTML).to.be.equal('Item 1');
    expect(children[0].tagName).to.be.equal('LI');
    expect(children[0].className).to.be.equal('item');
    expect(children[1].innerHTML).to.be.equal('Item 3');
    expect(children[1].tagName).to.be.equal('LI');
    expect(children[1].className).to.be.equal('item');
    expect(children[2].innerHTML).to.be.equal('Item 4');
    expect(children[2].tagName).to.be.equal('LI');
    expect(children[2].className).to.be.equal('item');
    app.cleanup();
  });
  it('should handle null or undefined nodes', () => {
    const App = (props) => {
      return (
        <ul>
          <li className="item">Item 1</li>
          {null}
          <li className="item">Item 2</li>
          {undefined}
          <li className="item">Item 3</li>
        </ul>
      );
    };
    const app = React.render(App, document.getElementById('app'));
    const ul = document.querySelector('ul');
    const children = ul.childNodes;
    expect(children.length).to.be.equal(3);
    expect(children[0].innerHTML).to.be.equal('Item 1');
    expect(children[0].tagName).to.be.equal('LI');
    expect(children[0].className).to.be.equal('item');
    expect(children[1].innerHTML).to.be.equal('Item 2');
    expect(children[1].tagName).to.be.equal('LI');
    expect(children[1].className).to.be.equal('item');
    expect(children[2].innerHTML).to.be.equal('Item 3');
    expect(children[2].tagName).to.be.equal('LI');
    expect(children[2].className).to.be.equal('item');
    app.cleanup();
  });
  it('should be able to provide higher order components', () => {
    const provideStyle = (style) => (Component) => (props) => <Component {...props} commonStyle={style} />;
    const Item = (props) => <div className={['item', props.commonStyle.name]}>{props.value}</div>;
    const BootstrapItem = provideStyle({ name: 'bootstrap' })(Item);
    const MaterialItem = provideStyle({ name: 'material' })(Item);
    const App = (props) => {
      return (
        <div>
          <BootstrapItem value="Item 1" />
          <MaterialItem value="Item 2" />
          <BootstrapItem value="Item 3" />
          <MaterialItem value="Item 4" />
        </div>
      );
    };
    const app = React.render(App, document.getElementById('app'));
    const bootstrapDivs = [].slice.call(document.querySelectorAll('.bootstrap'));
    const materialDivs = [].slice.call(document.querySelectorAll('.material'));
    expect(bootstrapDivs.length).to.be.equal(2);
    expect(materialDivs.length).to.be.equal(2);
    expect(bootstrapDivs[0].innerHTML).to.be.equal('Item 1');
    expect(bootstrapDivs[1].innerHTML).to.be.equal('Item 3');
    expect(materialDivs[0].innerHTML).to.be.equal('Item 2');
    expect(materialDivs[1].innerHTML).to.be.equal('Item 4');
    app.cleanup();
  });
});

// DONE : function tag
// DONE : tree redraw
// DONE : tag redraw
// DONE : tag replace
// DONE : props.children
// DONE : props.myself
// DONE : props.context
// DONE : svg
// DONE : style
// DONE : class + classes + bool classes
// DONE : Universal
// DONE : node refs
// DONE : event handlers
// DONE : direct attributes
// DONE : direct tree in render
