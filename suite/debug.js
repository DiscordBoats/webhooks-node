const Laffey = require('../build');
const Storages = require('../build/storages');

const app = new Laffey(6969, '/webhook', {
  storage: new Storages.MemoryStorage(),
  auth: 'abcdefg'
});

app.on('vote', console.log);
app.on('listen', console.log);

app.listen();