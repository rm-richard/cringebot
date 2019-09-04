const Discord = require('discord.js');

exports.run = (client, message, args) => {
  let attach = new Discord.Attachment(message.author.avatarURL.split('?')[0]);
  message.channel.send(attach);
}
