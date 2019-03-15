module.exports = class Storage {
    /**
     * Create a new instance of the Storage interface
     * @param {StorageInfo} info The information to store 
     */
    constructor(info) {
        this.type = info.type;
    }
}

/**
 * @typedef {Object} StorageInfo Any information about the storage
 * @prop {"redis" | "enmap"} type The type of storage (values: `redis` or `enmap`)
 */