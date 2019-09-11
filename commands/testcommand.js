const Discord = require('discord.js');
const format = require('../lib/formatters.js');
const playtime = require('../lib/playtime.js');

exports.run = (client, message, args) => {
  if (message.author.id !== client.config.ownerID) {
    return message.reply("You are not authorized to execute this command.");
  }

  const boj = '<:boj:620585665805025280>';
  let shop = new Discord.RichEmbed();
  shop.setColor('#4bd4fa')
    .setTitle('BoG (Badge of Gametime) Shop')
    .addField(`1x ${boj}  !buy nap`, 'Reduces your fatigue level by 1.')
    .addField(`5x ${boj}  !buy rest`, 'Resets your fatigue level to 0.')
    .addField(`5x ${boj}  !buy bonus`, 'Resets your daily bonus, your next farm will yield 400% extra gold')
    .addField(`10x ${boj}  !buy invest`, 'Upgrades your farm, but you lose all of your current gold.');

  const balance = `<@${message.author.id}>, you currently have ${availableBogs(client, message.author.id)}x ${boj}`;
  message.channel.send(balance, shop);
}

function availableBogs(client, id) {
  const bogsAll = Math.floor(client.playDb.get(id, 'totalTime') / (60*60*1000));
  const bogsSpent = client.farmDb.get(id, 'bogSpent') || 0;
  return bogsAll - bogsSpent;
}
