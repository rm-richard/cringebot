const Discord = require('discord.js');
const shop = require('../lib/shop.js');
const format = require('../lib/formatters.js');

exports.run = (client, message, args) => {
  let reply = new Discord.RichEmbed()
    .setColor('#4bd4fa')
    .setTitle('BoG (Badge of Gametime) Shop');

  shop.items.forEach((item, name) => {
    reply.addField(`${format.bog(item.cost)}   !buy ${name}`, item.description);
  });

  const balance = `<@${message.author.id}>, you currently have ${format.bog(shop.getAvailableBogs(client, message.author.id))}. You get one for every hour spent in WoW.`;
  message.channel.send(balance, reply);
}
