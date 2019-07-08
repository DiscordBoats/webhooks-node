import { EventEmitter } from 'events';
import http from 'http';

declare namespace Laffey {
    export const version: string;

    export class Instance extends EventEmitter {
        constructor(info: InstanceInfo);
        public options: InstanceInfo;
        public port: number;
        public authKey: string;
        public path: string;
        public server: http.Server;
        public requests: number;
        public webhook: WebhookOptions;
        public on(event: 'vote', listener: (voter: DiscordVoter, bot: DiscordBot) => void): this;
        public on(event: 'listen', listener: () => void): this;
        public on(event: 'error', listener: (message: string) => void): this;
    }

    export class DiscordVoter {
        constructor(pkt: any);
        public username: string;
        public id: string;
    }

    export class DiscordBot {
        constructor(pkt: any);
        public name: string;
        public id: string;
    }

    export interface InstanceInfo {
        port: number;
        auth: string;
        path: string;
        webhook: WebhookOptions;
    }
    
    export interface WebhookOptions {
        enabled: boolean;
        token: string;
        id: string;
    }
}

declare module 'laffey' {
    export default Laffey;
}