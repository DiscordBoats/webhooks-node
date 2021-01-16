const { Server } = require('../build');
const server = new Server(7998, '/', {
  webhook: {
    enabled: true,
    url: 'https://discord.com/api/webhooks/761229940607025172/L9XgrFJ6qMMkUDum68GYz6lEMS_p_Py9KcJjzVe0F41vyVf5y4QswKsKgiqhHDxcPo7t'
  },
  token: 'abcdefghijklmnopqrstuvwxyz'
});

server.on('listen', () => console.log('Now listening at 7998'));
server.on('error', console.error);
server.on('close', () => console.log('Server has closed'));
server.on('vote', (bot, user) => console.log(bot, '\n', user));
server.on('debug', console.debug);

server.listen();
process.on('SIGINT', () => {
  server.close();
  process.exit(0);
});
