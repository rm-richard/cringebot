const Discord = require('discord.js');
const format = require('../lib/formatters.js');

exports.run = (client, message, args) => {
  if (args[0].toLowerCase() === 'accept') {
    return;
  }

  if (!message.mentions.users.first()) {
    return message.reply('no target specified. Usage: !duel @mention.');
  }

  var challenger = message.author;
  var target = message.mentions.users.first();

  message.channel.send(`<@${target.id}>, ${message.author.username} has challenged you to a duel! You have 60 seconds to type __**!duel accept**__ if you want to fight him.`);

  const filter = reply => {
    return reply.author.id === target.id
      && reply.content.toLowerCase().startsWith('!duel accept');
  }
  const collector = message.channel.createMessageCollector(filter, {time: 60000});

  collector.on('collect', m => {
    const targetWon = Math.random() >= 0.5;
    const winner = targetWon ? target : challenger;
    const loser = targetWon ? challenger : target;

    const lostGold = loseGold(client, loser.id);
    gainGold(client, winner.id, lostGold);

    const reply = new Discord.RichEmbed()
      .setColor('#1ca476')
      .setTitle('Duel finished!')
      .setDescription(`<@${loser.id}> just lost **half** of his money to <@${winner.id}> in a high stakes duel. So long and thanks for all the ${format.toGSC(lostGold)}`);

    message.channel.send(reply);
    collector.stop();
  });

  collector.on('end', (collected, reason) => {
    if (reason === "time") {
      message.reply(`${target.username} did not accept the duel in time.`)
    }
  });
}

// FIXME: client.farmDb needs to be initialized by the farm command first
function loseGold(client, userId) {
  client.farmDb.ensure(userId, {copper: 0});
  const g = Math.floor(client.farmDb.get(userId, 'copper') / 2);
  client.farmDb.set(userId, g, 'copper');
  return g;
}

function gainGold(client, userId, gold) {
  client.farmDb.ensure(userId, {copper: 0});
  client.farmDb.math(userId, "+", gold, 'copper');
}
