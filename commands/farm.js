const Enmap = require('enmap');
const Discord = require('discord.js');

const FARM_DELAY_MS = 20 * 60 * 1000;

exports.run = (client, message, args) => {
  if (!client.farmDb) client.farmDb = new Enmap({name: 'farmDb', ensureProps: true});

  const key = message.author.id;

  client.farmDb.ensure(key, {
    user: message.author.id,
    copper: 0,
    lastFarmed: 0,
    farmTier: 0
  });

  const farmTierIdx = client.farmDb.get(key, 'farmTier');
  const farmTier = client.config.farmTiers[farmTierIdx];
  const totalCopper = client.farmDb.get(key, 'copper');

  if (args[0] === 'invest') {
    invest(key, client, message);
  } else {
    // standard farm + status flow
    const currentTime = new Date().getTime();
    const farmAvailable = client.farmDb.get(key, 'lastFarmed') + FARM_DELAY_MS;
    const diffSec = (farmAvailable - currentTime) / 1000;

    const reply = new Discord.RichEmbed();

    if (farmAvailable < currentTime) {
      const farmedCopper = generateRandomInteger(45, 300);
      client.farmDb.math(key, "+", farmedCopper, 'copper');
      client.farmDb.set(key, currentTime, 'lastFarmed');

      reply.setColor('#0cf246')
        .setTitle('Farming successful!')
        .setDescription(`<@${message.author.id}>, you just gained ${formatWallet(farmedCopper)}! Check back in 20 minutes.`);
    }
    else {
      reply.setColor('#a30a0a')
        .setTitle('Farming failed!')
        .setDescription(`<@${message.author.id}>, you can next farm in ${Math.floor(diffSec/60).toFixed()} minutes ${(diffSec % 60).toFixed()} seconds!`);
    }

    reply.addBlankField()
      .addField('Total gold', formatWallet(client.farmDb.get(key, 'copper')), true)
      .addField('Farm tier', farmTier.name, true)
      .addField('Next tier cost', formatWallet(farmTier.investCost), true)
      .addBlankField()
      .setFooter("To upgrade your farm tier, type '!farm invest'");
    message.channel.send(reply);
  }
}

function invest(key, client, message) {
  message.reply('investing is not implemented yet!');
}

function generateRandomInteger(min, max) {
  return Math.floor(min + Math.random()*(max + 1 - min))
}

function formatWallet(copper) {
  const c = copper % 100;
  const s = Math.floor(copper / 100) % 100;
  const g = Math.floor(copper / 10000);
  return `${g} <:gold:618818303615303700> ${s} <:silver:618818303632343111> ${c} <:copper:618818303577554989>`;
}
