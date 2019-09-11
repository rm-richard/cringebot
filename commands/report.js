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
    var played = 'No data';

    try {
      played = format.toDisplayedTime(client.playDb.get(key, 'totalTime'))
    } catch (error) {
      // ignore
    }

    reply += `${key} - ${name}  -  Tier: ${val.farmTier}, Fatigue: ${val.fatigueLevel}, BonusAvailable: ${val.bonusAvailable}, TotalPlayed: ${played}\n`;
  });
  message.reply(reply);
}
