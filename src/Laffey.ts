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
    super();

    this.requests = 0;
    this._server = createServer((req, res) => this.onRequest.apply(this, [req, res]));
    this.webhook = getOption('webhook', { enabled: false }, options);
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
   * Executes the webhook
   */
  private sendWebhook(payload: any) {
    if (!this.webhook.enabled) return;
    
    const url = getOption<{ enabled: boolean; url?: string }, string | undefined>('url', undefined, this.webhook);
    if (url === undefined) throw new TypeError('You need to provide a webhook URL');
    if (!url.startsWith('https://discord.com/api/webhooks')) throw new TypeError('Webhook URL must start with "https://discord.com/api/webhooks"');

    return this.http.request({
      method: 'POST',
      url: `${this.webhook.url}?wait=true`,
      data: { embeds: [payload] }
    }).then(res => {
      const data = res.json();
      console.log(data);

      return true;
    }).catch(() => false);
  }

  /**
   * Actually does the request for us
   * @param req The request
   * @param res The request
   */
  private onRequest(req: IncomingMessage, res: ServerResponse) {
    if (req.url === this.path && req.method === 'POST') {
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

        this.emit('vote', payload.bot.id, payload.user.id);
        this.requests++;
        await this.sendWebhook({
          title: `User ${payload.user.username}#${payload.user.discriminator} has voted for bot ${payload.bot.name}`,
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