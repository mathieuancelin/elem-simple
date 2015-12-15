import { isString, isArray, dasherize } from './utils';

export function serializeClass(attrs) {
  if (!attrs) return [];
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
