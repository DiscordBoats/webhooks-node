# Laffey <img src="https://azurlane.koumakan.jp/w/images/2/2a/Laffey.png" align="right" width="400px" height="497px">

> **Webhook Handler for [discord.boats](https://discord.boats)**

## Usage

```js
// Storages: Redis, enmap, more soon?
const {
    Laffey,
    Storage: { Redis }
} = require('laffey');

const handler = new Laffey({
    storage: new Redis(),
    port: 7700,
    auth: 'youshallnotpass'
});

handler
    .on('vote', (voter) => {
        console.log(voter.username + ' has voted!');
    })
    .on('listen', () => console.log(`Listening on port ${handler.port}`));

handler.listen();
```

## License

> [laffey](https://github.com/auguwu/laffey) is made by [auguwu](https://augu.me) and is released under the MIT license
>
> **Laffey is a shipgirl from the game: Azur Lane; all artwork is copyrighted to them**

```
Copyright (c) 2019-present auguwu

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