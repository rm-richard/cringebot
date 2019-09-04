const Discord = require('discord.js');
const client = new Discord.Client();

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

const config = require("./config.json");

db.defaults({ users: [] }).write();
//db.get('users').push({id: 1, name: 'test', char: 'asd'}).write();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    console.log(`Serving ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
});

client.on('message', msg => {
  if (msg.author.bot) return;

  if (msg.content == '!ping') {
    msg.reply('Pong!');
  }

  if (msg.content == '!mirror') {
    var attach = new Discord.Attachment(msg.author.avatarURL.split('?')[0]);
    msg.channel.send(attach);
  }

  if (msg.content == '!grind') {
    console.log(msg.author);
    console.log(msg.author.username);
  }
});

if (config.botToken) {
  console.log("Logging in...")
  client.login(config.botToken);
} else {
  console.log('"botToken" not found in config.json!')
}
