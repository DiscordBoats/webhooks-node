# DEPRECATED
The website this module is for has shutdown.

# Laffey
> :office: **| Webhook handler for [discord.boats](https://discord.boats)**

## Example
```js
const { Server } = require('laffey');

const handler = new Server(7700, '/webhook', {
  token: 'youshallnotpass'
});

handler
  .on('vote', (voter, bot) => console.log(`${voter.username} has voted ${bot.name}`))
  .on('listen', () => console.log(`Listening on port ${handler.port}`))
  .listen(); // It listens and emits the listen event /\
```

## Express Example
```js
const { express: laffey } = require('laffey');
const express = require('express');

const app = express();
app.use(express.json());
app.use(laffey({
  callback: (error, bot, voter) => {
    if (error) return console.error(error);

    // vote logic is here
  },
  token: 'any random token you wanna set',
  path: '/votes'
}));

app.listen(3000, () => console.log('localhost:3000'));
```

## License
**laffey** is released under the MIT License. Read [here](/LICENSE) for more information.
