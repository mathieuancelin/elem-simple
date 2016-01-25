/* eslint react/no-multi-comp: 0, react/prop-types: 0  */
import * as React from '../src/index';
import { invariant, isObject } from '../src/utils';

// creates an higher order component that can map parts of the context on subcomponent props
export function enhanceWithPropsFromContext(mapper = a => a) {
  return (Component) => (props) => (
    <Component { ...props } { ...mapper(props.treeContext.__providedContext) } />
  );
}

// wrapper components and provide a context
export class ContextProvider extends React.Component {
  constructor(props) {
    invariant(props.context && isObject(props.context), 'You must provide a valid context as ContextProvider props');
    invariant(props.children && props.children.length === 1, 'Only one child is allowed inside ContextProvider');
    super(props);
    const parentContext = props.treeContext.__providedContext || {};
    props.treeContext.__providedContext = { // eslint-disable-line
      ...props.context,
      ...parentContext,
    };
  }
  render() {
    return (
      this.props.children[0]
    );
  }
}
