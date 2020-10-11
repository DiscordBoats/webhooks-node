declare module 'laffey' {
  import { Request, Response, NextFunction } from 'express';
  import { EventEmitter } from 'events';

  namespace laffey {
    /**
     * Returns the version of Laffey
     */
    export const version: string;

    /**
     * Express middleware for Laffey
     * @param options The options to use
     * @example
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
     */
    export function express(options: ExpressOptions): ExpressMiddleware;

    /**
     * Options avaliable
     */
    interface LaffeyOptions {
      /**
       * Discord webhook option
       */
      webhook?: { enabled: boolean; url?: string; }

      /**
       * The authorization token
       * 
       * @note `token` is a customisable thing! It can be anything
       * you like it to be set. You must put your token and URL in
       * your bot's page.
       */
      token: string;
    }    

    export class Server extends EventEmitter {
      /**
       * Amount of requests we have received from discord.boats
       */
      public requests: number;

      /**
       * The webhook
       */
      public webhook: { enabled: boolean; url?: string; }

      /**
       * How many successful votes Laffey has seen
       */
      public votes: number;

      /**
       * The path
       */
      public path: string;

      /**
       * The port to connect to
       */
      public port: number;

      /**
       * Creates a new [laffey.Server] instance
       * @param port The port
       * @param path The path
       * @param opts The options to use
       */
      constructor(port: number, path: string, opts: laffey.LaffeyOptions);

      /**
       * Listens to the port you specified
       * @returns This context to chain methods?
       */
      public listen(): this;

      /**
       * Closes the server down
       */
      public close(): void;

      /**
       * Emitted when the user has started the server
       */
      public on(event: 'listen', listener: () => void): this;

      /**
       * Emitted when Laffey errored during execution
       */
      public on(event: 'error', listener: (error: string) => void): this;

      /**
       * Emitted when the server has closed (called by Server#close)
       */
      public on(event: 'close', listener: () => void): this;

      /**
       * Emitted when Laffey has successfully received a vote
       */
      public on(event: 'vote', listener: (bot: laffey.BotPacket, user: laffey.UserPacket) => void): this;
    }

    /**
    * The packet the webhook payload sends as `bot`
    */
    interface BotPacket {
      /**
       * The avatar URL for the bot
       */
      avatar: string;
  
      /**
       * The bot's name
       */
      name: string;
  
      /**
       * The URL of the bot (discord.boats URL!)
       */
      url: string;
    }

    interface UserPacket {
      /**
       * The user's discriminator (i.e: `#0001`)
       */
      discriminator: string;
  
      /**
       * The user's username
       */
      username: string;
  
      /**
       * The user's ID
       */
      id: string;
    }

    interface ExpressOptions {
      callback(error: Error | null, bot: laffey.BotPacket, voter: laffey.UserPacket): void;
      token: string;
      path: string;
    }

    type ExpressMiddleware = (req: Request, res: Response, next: NextFunction) => void;
  }

  export = laffey;
}
