module.exports = {
    Laffey: require('./laffey'),
    Voter: require('./interfaces/voter'),
    Storage: {
        RedisStorage: require('./storages/redis-storage'),
        EnmapStorage: require('./storages/enmap-storage')
    },
    version: require('../package.json').version
};