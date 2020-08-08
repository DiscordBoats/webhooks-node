/**
 * Copyright (c) 2020 August
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { Server as HttpServer, ServerResponse, IncomingMessage, createServer } from 'http';
import { EventEmitter } from 'events';
import { HttpClient } from '@augu/orchid';
import { getOption } from './util';

interface LaffeyOptions {
  webhook?: { enabled: boolean; url?: string; }
  token: string;
}

export class Server extends EventEmitter {
  /**
   * Amount of requests we have received from discord.boats
   */
  public requests: number;

  /**
   * The HTTP server to receive messages
   */
  private _server: HttpServer;

  /**
   * The webhook
   */
  public webhook: { enabled: boolean; url?: string; }

  /**
   * The authenication token (can't be get from `eval`)
   */
  public token!: string;

  /**
   * How many votes Laffey has received (if it was successful)
   */
  public votes: number;

  /**
   * The HTTP client
   */
  private http: HttpClient;

  /**
   * The path
   */
  public path: string;

  /**
   * The port to connect to
   */
  public port: number;

  /**
   * Creates a new [Server]
   * @param port The port
   * @param path The path
   * @param options The additional options
   */
  constructor(port: number, path: string, options: LaffeyOptions) {
    if (typeof port !== 'number') throw new TypeError('`port` must be a number (https://docs.augu.dev/laffey/errors#constructor-port-is-nan)');
    if (typeof path !== 'string') throw new TypeError('`path` must be a string (https://docs.augu.dev/laffey/errors#constructor-path-is-not-a-string)');
    if (typeof options !== 'object' && !Array.isArray(options)) throw new TypeError('`options` must be an object, refer to docs: https://docs.augu.dev/laffey/errors#constructor-not-an-object');
    
    const token = getOption<LaffeyOptions, string | undefined>('token', undefined, options);
    if (token === undefined) throw new TypeError('`token` must be defined in this context (https://docs.augu.dev/laffey/errors#constructor-token-definition)');
    if (typeof token !== 'string') throw new TypeError('`token` must be a string (https://docs.augu.dev/laffey/errors#constructor-token-not-a-string)');

    super();

    this.requests = 0;
    this._server = createServer((req, res) => this.onRequest.apply(this, [req, res]));
    this.webhook = getOption('webhook', { enabled: false }, options);
    this.votes = 0;
    this.http = new HttpClient();
    this.port = port;
    this.path = path;

    Object.defineProperty(this, 'token', { value: options.token });
  }

  /**
   * Listens to the server
   */
  listen() {
    this._server.listen(this.port, () => this.emit('listen'));
    return this;
  }

  /**
   * Closes the server
   */
  close() {
    this._server.close();
    this.emit('close');
  }

  /**
   * Executes the webhook
   */
  private sendWebhook(payload: any) {
    if (!this.webhook.enabled) return;
    
    const url = getOption<{ enabled: boolean; url?: string }, string | undefined>('url', undefined, this.webhook);
    if (url === undefined) throw new TypeError('You need to provide a webhook URL');
    return this.http.request({
      method: 'POST',
      url: `${this.webhook.url}?wait=true`,
      data: { embeds: [payload] }
    }).then(() => true).catch(() => false);
  }

  /**
   * Actually does the request for us
   * @param req The request
   * @param res The request
   */
  private onRequest(req: IncomingMessage, res: ServerResponse) {
    this.requests++;
    const isNotPost = this.path === '/'
      ? false
      : req.method! === 'GET';

    if (req.url === '/' && isNotPost) {
      res.statusCode = 200;
      return res.end(JSON.stringify({
        requests: this.requests,
        votes: this.votes
      }));
    } else if (req.url === '/favicon.ico') {
      res.statusCode = 404;
      return res.end('Cannot GET /favicon.ico');
    } else if (req.url === this.path && req.method === 'POST') {
      if (!req.headers.authorization) {
        this.emit('error', 'Didn\'t receive the "Authorization" header');
        res.statusCode = 401;

        // TODO: Maybe add customizable messages for this?
        return res.end(JSON.stringify({
          success: false,
          message: 'Missing "Authorization" header'
        }));
      }

      if (req.headers.authorization !== this.token) {
        this.emit('error', 'Invalid Authorization header was provided');
        res.statusCode = 403;
        return res.end(JSON.stringify({
          success: false,
          message: 'Invalid "Authorization" header'
        }));
      }

      if (!req.headers['content-type'] || req.headers['content-type'] !== 'application/json') {
        this.emit('error', `Missing "Content-Type" header or provided an invalid Content-Type (${req.headers['content-type']})`);
        res.statusCode = 406;
        return res.end(JSON.stringify({
          success: false,
          message: `Missing "Content-Type" header or provided an invalid content type (${req.headers['content-type']})`
        }));
      }

      let data = Buffer.alloc(0);
      req.on('data', chunk => {
        data = Buffer.concat([data, chunk]);
      });

      req.on('end', async() => {
        let payload!: any;
        try {
          payload = JSON.parse(data.toString());
        } catch {
          this.emit('error', 'Unable to parse payload!');
          res.statusCode = 500;
          return res.end(JSON.stringify({
            success: false,
            message: 'Payload wasn\'t able to be converted to JSON'
          }));
        }

        this.emit('vote', payload.bot, payload.user);

        this.votes++;
        await this.sendWebhook({
          author: {
            name: `[ ${payload.user.username}#${payload.user.discriminator} | Voted for ${payload.bot.name} ]`,
            icon_url: payload.bot.avatar, // eslint-disable-line
            url: payload.bot.url
          },
          footer: {
            text: `Now at ${this.requests.toLocaleString()} requests received!`
          }
        });

        res.statusCode = 200;
        return res.end(JSON.stringify({
          success: true
        }));
      });
    } else {
      this.emit('error', `Invalid path or method (path: ${req.url}; method: ${req.method})`);

      res.statusCode = 405;
      return res.end(JSON.stringify({
        success: false,
        message: 'Method was not a "POST" request'
      }));
    }
  }
}