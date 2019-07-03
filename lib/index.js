module.exports = {
    Laffey: require('./laffey'),
    DiscordVoter: require('./interfaces/voter'),
    Storages: {
        RedisStorage: require('./storages/redis-storage')
    },
    version: require('../package.json').version
};