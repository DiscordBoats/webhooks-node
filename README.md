# Laffey
> :office: **| Webhook handler for [discord.boats](https://discord.boats)**

## Example
```js
const { Server, storages: { MemoryStorage } } = require('laffey');

const handler = new Laffey(7700, '/webhook' {
  storage: new MemoryStorage(),
  auth: 'youshallnotpass'
});

handler
  .on('vote', (voter, bot) => console.log(`${voter.username} has voted ${bot.name}`))
  .on('listen', () => console.log(`Listening on port ${handler.port}`))
  .listen(); // It listens and emits the listen event /\
```

## License
**laffey** is released under the MIT License. Read [here](/LICENSE) for more information.