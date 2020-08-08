const { Server } = require('../build');
const server = new Server(7998, '/webhook', {
  webhook: {
    enabled: true,
    url: 'no'
  },
  token: 'abcdefghijklmnopqrstuvwxyz'
});

server.on('listen', () => console.log('Now listening at 7998'));
server.on('error', console.error);
server.on('close', () => console.log('Server has closed'));
server.on('vote', (bot, user) => console.log(bot, '\n', user));

server.listen();
process.on('SIGINT', () => {
  server.close();
  process.exit(0);
});