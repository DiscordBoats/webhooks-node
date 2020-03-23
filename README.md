# Laffey
> **Webhook Handler for [discord.boats](https://discord.boats).**
>
> [Documentation](https://auguwu.github.io/laffey) **|** [GitHub](https://github.com/auguwu/laffey) **|** [NPM](https://npmjs.com/package/laffey)

## Example
```js
const { Laffey, MemoryStorage } = require('laffey');

const handler = new Laffey({
  storage: new MemoryStorage(),
  port: 7700,
  auth: 'youshallnotpass',
  path: '/webhook'
});

handler
  .on('vote', (voter, bot) => console.log(`${voter.username} has voted ${bot.name}`))
  .on('listen', () => console.log(`Listening on port ${handler.port}`))
  .listen(); // It listens and emits the listen event /\
```

## License
**laffey** is released under the MIT License. Read [here](/LICENSE) for more information.