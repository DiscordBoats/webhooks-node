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
> Released under the **MIT** License

```
Copyright (c) 2019 August

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```