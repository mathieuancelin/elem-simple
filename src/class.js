import { isString, isArray, dasherize } from './utils';

/**
 * Serialize a plain old object into a className string
 * works with a string, an array of string or an object with boolean values.
 */
export function serializeClass(classes) {
  // if no classes, return empty string as class
  if (!classes) return '';
  // if it's a string, it should be already the className, so return it
  if (isString(classes)) return classes;
  // if it's an array, it should be multiple className, so return it as string
  if (isArray(classes)) return classes.join(' ');
  const classNames = [];
  // classes is an object, so lets traverse the keys and compose className based on true values
  for (const key in classes) {
    const value = classes[key];
    // if the value is true, add it to classNames
    if (value === true) classNames.push(dasherize(key));
  }
  // serialize the class array as string
  return classNames.join(' ');
}
