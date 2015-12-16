import { isString, isArray, dasherize } from './utils';

/**
 * Serialize a plain old object into a className string
 * works with a string, an array of string or an object with boolean values.
 */
export function serializeClass(attrs) {
  if (!attrs) return '';
  if (isString(attrs)) return attrs;
  if (isArray(attrs)) return attrs.join(' ');
  const attrsArray = [];
  for (const key in attrs) {
    const value = attrs[key];
    if (value === true) {
      attrsArray.push(dasherize(key));
    }
  }
  return attrsArray.join(' ');
}
