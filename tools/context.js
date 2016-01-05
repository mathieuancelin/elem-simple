/* eslint react/no-multi-comp: 0, react/prop-types: 0  */
import React from '../src/index';

// creates an higher order component that can map parts of the context on subcomponent props
export default function enhance(mapper = a => a) {
  return (Component) => {
    return (props) => {
      return (
        <Component { ...props } { ...mapper(props.treeContext.__providedContext) } />
      );
    };
  };
}

// wrapper components and provide a context
export default class Provider extends React.Component {
  constructor(props) {
    super(props);
    if (!props.treeContext.__providedContext) {
      props.treeContext.__providedContext = props.context;
    }
  }
  render() {
    return this.props.children;
  }
}
