import { getGlobalScope } from './runtime';

type DomParserConstructor = new () => DOMParser;

let cachedConstructor: DomParserConstructor | null = null;

const loadPolyfill = (): DomParserConstructor => {
  if (cachedConstructor) {
    return cachedConstructor;
  }
  // tslint:disable-next-line:no-var-requires
  const { DOMParser } = require('linkedom');
  cachedConstructor = DOMParser as DomParserConstructor;
  return cachedConstructor;
};

const resolveConstructor = (): DomParserConstructor => {
  const globalScope = getGlobalScope();
  if (typeof globalScope.DOMParser !== 'undefined') {
    return globalScope.DOMParser;
  }
  return loadPolyfill();
};

export const createDomParser = () => {
  const Constructor = resolveConstructor();
  return new Constructor();
};
