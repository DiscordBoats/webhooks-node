import Instance from './Laffey';

/**
 * Gets the current version of Laffey
 */
export const version: string = require('../package.json').version;
export { Instance as Laffey };
export * from './storages';