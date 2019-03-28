module.exports = class Storage {
    /**
     * Create a new instance of the Storage interface
     * @param {StorageInfo} info The information to store 
     */
    constructor(info) {
        this.type = info.type;
    }
    
    /**
     * Adds something
     * @param {any} pkt The packet
     */
    add(pkt) {
        throw new SyntaxError(`Storage ${this.constructor.name} doesn't bind an add(pkt: any) function!`);
    }
}

/**
 * @typedef {Object} StorageInfo Any information about the storage
 * @prop {"redis" | "enmap"} type The type of storage (values: `redis` or `enmap`)
 */
