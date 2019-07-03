# Laffey <img src="https://azurlane.koumakan.jp/w/images/2/2a/Laffey.png" align="right" width="400px" height="497px">

> **Webhook Handler for [discord.boats](https://discord.boats).**
>
> [GitHub](https://github.com/auguwu/laffey) **|** [NPM](https://npmjs.com/package/laffey) **|** [Documentation](https://docs.augu.me/laffey)

## Plans

- Add custom storages
- Create a new storage: Redis (who have a redis compartment and dont wanna use enmap)

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
    auth: 'youshallnotpass',
    path: '/webhook'
});

handler
    .on('vote', (voter) => console.log(`${voter.tag} has voted!`))
    .on('listen', () => console.log(`Listening on port ${handler.port}`))
    .listen(); // It listens and emits the listen event /\
```

## Typescript Usage

```ts
import { Laffey, Storages, DiscordVoter } from 'laffey';

const handler = new Laffey({
    storage: new Storages.Enmap(),
    port: 7700,
    auth: 'yesowo',
    path: '/webhook/
});

handler
    .on('vote', (voter: DiscordVoter) => console.log(`${voter.tag} has voted!`))
    .on('listen', () => console.log('Laffey is now listening!'))
    .listen();
```

## Contributing

Thanks to contribute to Laffey's repo!

### Process

1) `npm i` or `yarn`
2) Make code changes
3) Run `npm run test` or `yarn test`
4) If everything is ok, pull request
5) You're done!

### Notes

> 1) When installing Laffey and you get this error:

```
Exit code: 1
Command: node-gyp rebuild
Arguments:
Directory: C:\Users\ohlookitsAugust\Documents\Projects\Packages\nodejs\laffey\node_modules\integer
Output:
C:\Users\ohlookitsAugust\Documents\Projects\Packages\nodejs\laffey\node_modules\integer>if not defined npm_config_node_gyp (node "C:\Program Files\nodejs\node_modules\npm\bin\node-gyp-bin\\..\..\node_modules\node-gyp\bin\node-gyp.js" rebuild )  else (node "" rebuild )
gyp info it worked if it ends with ok
gyp info using node-gyp@3.6.2
gyp info using node@10.6.0 | win32 | x64
gyp info spawn C:\Python27\python.exe
gyp info spawn args [ 'C:\\Program Files\\nodejs\\node_modules\\npm\\node_modules\\node-gyp\\gyp\\gyp_main.py',
gyp info spawn args   'binding.gyp',
gyp info spawn args   '-f',
gyp info spawn args   'msvs',
gyp info spawn args   '-G',
gyp info spawn args   'msvs_version=2015',
gyp info spawn args   '-I',
gyp info spawn args   'C:\\Users\\ohlookitsAugust\\Documents\\Projects\\Packages\\nodejs\\laffey\\node_modules\\integer\\build\\config.gypi',
gyp info spawn args   '-I',
gyp info spawn args   'C:\\Program Files\\nodejs\\node_modules\\npm\\node_modules\\node-gyp\\addon.gypi',
gyp info spawn args   '-I',
gyp info spawn args   'C:\\Users\\ohlookitsAugust\\.node-gyp\\10.6.0\\include\\node\\common.gypi',
gyp info spawn args   '-Dlibrary=shared_library',
gyp info spawn args   '-Dvisibility=default',
gyp info spawn args   '-Dnode_root_dir=C:\\Users\\ohlookitsAugust\\.node-gyp\\10.6.0',
gyp info spawn args   '-Dnode_gyp_dir=C:\\Program Files\\nodejs\\node_modules\\npm\\node_modules\\node-gyp',
gyp info spawn args   '-Dnode_lib_file=C:\\Users\\ohlookitsAugust\\.node-gyp\\10.6.0\\<(target_arch)\\node.lib',
gyp info spawn args   '-Dmodule_root_dir=C:\\Users\\ohlookitsAugust\\Documents\\Projects\\Packages\\nodejs\\laffey\\node_modules\\integer',
gyp info spawn args   '-Dnode_engine=v8',
gyp info spawn args   '--depth=.',
gyp info spawn args   '--no-parallel',
gyp info spawn args   '--generator-output',
gyp info spawn args   'C:\\Users\\ohlookitsAugust\\Documents\\Projects\\Packages\\nodejs\\laffey\\node_modules\\integer\\build',
gyp info spawn args   '-Goutput_dir=.' ]
gyp info spawn msbuild
gyp info spawn args [ 'build/binding.sln',
gyp info spawn args   '/clp:Verbosity=minimal',
gyp info spawn args   '/nologo',
gyp info spawn args   '/p:Configuration=Release;Platform=x64' ]
Building the projects in this solution one at a time. To enable parallel build, please add the "/m" switch.
{{PATH}}laffey\node_modules\integer\build\integer.vcxproj(21,3): error MSB4019: The imported project "C:\Microsoft.Cpp.Default.props" was not found. Confirm that the path in the <Import> declaration is correct, and that the file exists on disk.
gyp ERR! build error
gyp ERR! stack Error: `msbuild` failed with exit code: 1
gyp ERR! stack     at ChildProcess.onExit (C:\Program Files\nodejs\node_modules\npm\node_modules\node-gyp\lib\build.js:258:23)
gyp ERR! stack     at ChildProcess.emit (events.js:182:13)
gyp ERR! stack     at Process.ChildProcess._handle.onexit (internal/child_process.js:237:12)
gyp ERR! System Windows_NT 10.0.17134
gyp ERR! command "C:\\Program Files\\nodejs\\node.exe" "C:\\Program Files\\nodejs\\node_modules\\npm\\node_modules\\node-gyp\\bin\\node-gyp.js" "rebuild"
gyp ERR! cwd {{PATH}}\laffey\node_modules\integer
gyp ERR! node -v v10.6.0
gyp ERR! node-gyp -v v3.6.2
gyp ERR! not ok
```

> Linux/MacOS: `rm -fr node_modules && npm i (or yarn)`
> 
> Windows: Soon

## License

> [laffey](https://github.com/auguwu/laffey) is made by [auguwu](https://augu.me) and is released under the MIT license
>
> **Laffey is a shipgirl from the game: Azur Lane; all copyrighted infrigment belong to Yostar Inc**

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
