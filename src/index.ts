import Instance, { Options } from './Laffey';
import * as Storages from './storages';

/**
 * Creates a new Laffey instance
 * @param port The port to use
 * @param path The path to use
 * @param options Any additional options
 */
function Laffey(port: number, path: string, options: Options) {
    return new Instance(port, path, options);
}

/**
 * Gets the version of Laffey
 */
export const version: string = require('../package.json').version;

export default Laffey;
module.exports = Laffey;
export { Instance as Laffey, Storages };