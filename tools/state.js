import * as Elem from '../src/index';

const noop = () => ({});

export class LeafComponentWithState extends Elem.Component {
  constructor(props) {
    super(props);
    const copy = { ...this.props };
    this.getInitialState = this.getInitialState || (() => ({}));
    this.state = copy.$$state || this.getInitialState();
    delete copy.$$state;
    this.props = copy;
    this.replaceState = (ns, cb = noop) => {
      props.myself.redraw({ ...copy, $$state: ns });
      cb();
    };
    this.setState = (ns, cb = noop) => this.replaceState({ ...this.state, ...ns }, cb);
  }
}
