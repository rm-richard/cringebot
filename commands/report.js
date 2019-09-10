const Discord = require('discord.js');
const format = require('../lib/formatters.js');
const playtime = require('../lib/playtime.js');

exports.run = (client, message, args) => {
  if (message.author.id !== client.config.ownerID) {
    return message.reply("You are not authorized to execute this command.");
  }

  var reply = `User status report:\n`;
  client.farmDb.forEach((val, key) => {
    var name = client.guilds.first().members.get(key).displayName;
    reply += `${name}  -  Tier: ${val.farmTier}, Fatigue: ${val.fatigueLevel}, BonusAvailable: ${val.bonusAvailable}\n`;
  });
  message.reply(reply);
}
