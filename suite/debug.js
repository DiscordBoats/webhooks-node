const { Laffey, MemoryStorage } = require('../build');

const app = new Laffey(6969, '/webhook', {
  storage: new MemoryStorage(),
  auth: 'abcdefg'
});

app.on('vote', console.log);
app.on('listen', () => console.log('Now listening!'));

app.listen();