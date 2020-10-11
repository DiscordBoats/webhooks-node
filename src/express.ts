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

import type { Request, Response, NextFunction } from 'express';
import type { LaffeyOptions } from './Laffey';

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
  callback(error: Error | null, bot?: BotPacket, voter?: UserPacket): void;
  token: string;
  path: string;
}

type Middleware<T> = (...args: T[]) 
  => (req: Request, res: Response, next: NextFunction) 
    => void;

export const express: Middleware<ExpressOptions> = (options) =>
  (req, res, next) => {
    switch (req.url) {
      case options.path: 
        handle(req, res, next, options);
        break;
    }
  };

const handle = (req: Request, res: Response, next: NextFunction, options: ExpressOptions) => {
  if (req.method !== 'POST') {
    res.status(401).json({
      success: false,
      message: 'Path wasn\'t a POST method'
    });

    options.callback(new Error(`Path "${options.path}" was not a POST method`));
    return next();
  }

  if (!req.headers.authorization) {
    res.status(401).json({
      success: false,
      message: 'Missing "Authorization" header'
    });

    options.callback(new Error('Missing "Authorization" header'));
    return next();
  }

  if (req.headers.authorization !== options.token) {
    res.status(403).json({
      success: false,
      message: 'Invalid "Authorization" header'
    });

    options.callback(new Error('Authorization header wasn\'t same as the token'));
    return next();
  }

  if (!req.headers['content-type']) {
    res.status(406).json({
      success: false,
      message: 'Missing "Content-Type" header'
    });

    options.callback(new Error('Missing "Content-Type" header'));
    return next();
  }

  if (req.headers['content-type'] !== 'application/json') {
    res.status(406).json({
      success: false,
      message: `Received invalid "Content-Type" header, expected "application/json", received "${req.headers['content-type']}"`
    });

    options.callback(new Error(`Received invalid "Content-Type" header (expected: "application/json", received: "${req.headers['content-type']}")`));
    return next();
  }

  if (!req.body) {
    res.status(405).json({
      success: false,
      message: 'No body was implemented into this request.'
    });

    options.callback(new Error('No body implementation was added onto this request.'));
    return next();
  }

  options.callback(null, req.body.bot, req.body.user);
  res.status(204).send();
  return next();
};
