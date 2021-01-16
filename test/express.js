const { express: Laffey } = require('../build');
const express = require('express');

const app = express();
app.use(express.json());
app.use(Laffey({
  callback(error, bot, voter) {
    if (error) return console.error(error);
    console.log(`User "${voter.username}#${voter.discriminator}" has voted for "${bot.name}"`);
  },
  path: '/votes',
  token: 'abcdef'
}));

const server = app.listen(6969, () => console.log('localhost:6969'));
process.on('SIGINT', () => {
  server.close();
  process.exit(0);
});
