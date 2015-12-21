import { isFunction, isString, dasherize } from './utils';

/**
 * Serialize a plain old object into a style string: '${key}:${value};*'
 *
 * @param style the style object
 */
export function serializeStyle(style) {
  // if no style, return an empty string
  if (!style) return '';
  // if it's a string, it should be the actual style value, return it
  if (isString(style)) return style;
  const styles = [];
  // for each key of the style object, add it to the style value array
  for (const key in style) {
    const keyName = dasherize(key);
    let value = style[key];
    /* istanbul ignore else */
    if (value) {
      if (isFunction(value)) {
        value = value();
      }
      /* istanbul ignore else */
      if (value) {
        styles.push(`${keyName}:${value};`);
      }
    }
  }
  // serialize the style array as string
  return styles.join('');
}
