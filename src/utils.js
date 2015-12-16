/* eslint eqeqeq: 0 */

let counter = 0;

export function sid(prefix) {
  const id = ++counter + '';
  return prefix ? prefix + id : id;
}

export function startsWith(source, start) {
  return source.indexOf(start) === 0;
}

export function dasherize(what) {
  return what.replace(/([A-Z\d]+)([A-Z][a-z])/g, '$1_$2')
    .replace(/([a-z\d])([A-Z])/g, '$1_$2').toLowerCase().replace(/_/g, '-');
}

export function invariant(condition, message, ...args) {
  if (!condition) {
    let argIndex = 0;
    throw new Error(`Violation : ${message.replace(/%s/g, () => { return args[argIndex++]; })}`);
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

export function isObject(χ) {
  return !!χ && (typeof χ == 'object' || typeof χ == 'function');
}

export function escape(value = '') {
  const string = value === null ? '' : '' + value;
  return testRegexp.test(string) ? string.replace(replaceRegexp, (match) => escapeMap[match]) : string;
}

export const isArray = Array.isArray;

export const isUndefined = (χ) => χ === undefined;

export const includes = (array, what) => array.indexOf(what) > -1;

export const isFunction = (χ) => isObject(χ) && Object.prototype.toString.call(χ) == '[object Function]';

export const isString = (χ) => typeof χ == 'string' || ((!!χ && typeof χ == 'object') && Object.prototype.toString.call(χ) == '[object String]');
