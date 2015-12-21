/* eslint eqeqeq: 0 */

let counter = 0;

/**
 * return a new sequential ID with a prefix
 */
export function sid(prefix) {
  const id = ++counter + '';
  return prefix ? prefix + id : id;
}

/**
 * check if a string startsWith another string
 */
export function startsWith(source, start) {
  return source.indexOf(start) === 0;
}

/**
 * transform camel case word into a dash separated lowercase words
 * backgroundColor => background-color
 */
export function dasherize(what) {
  return what.replace(/([A-Z\d]+)([A-Z][a-z])/g, '$1_$2')
    .replace(/([a-z\d])([A-Z])/g, '$1_$2').toLowerCase().replace(/_/g, '-');
}

/**
 * Throw an error if the condition is falsy. Provide some formating for the message
 */
export function invariant(condition, message, ...args) {
  if (!condition) {
    let argIndex = 0;
    const error = new Error(`${message.replace(/%s/g, () => { return args[argIndex++]; })}`);
    error.name = 'Violation';
    error.framesToPop = 2;
    throw error;
  }
}

const escapeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '`': '&#x60;',
};
const source = `(?:${Object.keys(escapeMap).join('|')})`;
const testRegexp = RegExp(source);
const replaceRegexp = RegExp(source, 'g');

/**
 * check if value is an object
 */
export function isObject(x) {
  /* istanbul ignore next */
  return !!x && (typeof x === 'object' || typeof x === 'function');
}

/**
 * Escape HTML expressions
 */
export function escape(value = '') {
  return testRegexp.test(value) ? value.replace(replaceRegexp, (match) => escapeMap[match]) : value;
}

/**
 * check if value is an array
 */
export const isArray = Array.isArray;

/**
 * change any object to an array
 */
export const toArray = (what) => isArray(what) ? what : [what];

/**
 * check if value is undefined
 */
export const isUndefined = (x) => x === undefined;

/**
 * check if an array caontains a value
 */
export const includes = (array, what) => array.indexOf(what) > -1;

/**
 * check if value is a function
 */
export const isFunction = (x) => isObject(x) && Object.prototype.toString.call(x) === '[object Function]';

/**
 * check if value is a string
 */
 /* istanbul ignore next */
export const isString = (x) => typeof x === 'string' || ((!!x && typeof x === 'object') && Object.prototype.toString.call(x) === '[object String]');
