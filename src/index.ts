import Instance from './Laffey';

const Storages = require('./storages');

/**
 * Gets the current version of Laffey
 */
export const version: string = require('../package.json').version;

export default Instance;
module.exports = Instance;
export { Instance as Laffey, Storages };