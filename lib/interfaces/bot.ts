export default class DiscordBot {
    public username: string;
    public id: string;

    constructor(pkt: any) {
        this.username = pkt.name;
        this.id = pkt.id;
    }
}