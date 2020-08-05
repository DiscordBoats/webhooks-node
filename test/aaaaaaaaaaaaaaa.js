const { HttpClient } = require('@augu/orchid');
const http = new HttpClient({
  defaults: { baseUrl: 'http://localhost:7998' }
});

http.request({
  method: 'POST',
  url: '/webhook',
  data: {
    bot: {
      avatar: 'https://cdn.discordapp.com/avatars/531613242473054229/a822e90063fd0359d15fdf6ad3af64de.png?size=1024',
      name: 'Nino#0989',
      url: 'https://discord.boats/bot/nino',
      id: '531613242473054229'
    },
    user: {
      discriminator: 5820,
      username: 'Chris 🌺',
      id: '280158289667555328'
    }
  },
  headers: {
    'Authorization': 'abcdefghijklmnopqrstuvwxyz',
    'Content-Type': 'application/json'
  }
}).then((res) => console.log(res)).catch(console.error);