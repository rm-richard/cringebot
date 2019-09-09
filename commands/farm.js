const Enmap = require('enmap');
const Discord = require('discord.js');
const format = require('../lib/formatters.js');

exports.run = (client, message, args) => {
  const key = message.author.id;

  client.farmDb.ensure(key, {
    user: message.author.id,
    copper: 0,
    lastFarmed: 0,
    farmTier: 0,
    fatigueLevel: 0
  });

  const farmTierIdx = client.farmDb.get(key, 'farmTier');
  const farmTier = client.config.farmTiers[farmTierIdx];
  const totalCopper = client.farmDb.get(key, 'copper');

  if (args[0] === 'invest') {
    invest(key, client, message, farmTierIdx, farmTier, totalCopper);
  }
  else if (args[0] === 'tiers') {
    var reply = 'Available farm tiers (average income / upgrade cost):\n';

    client.config.farmTiers.forEach(tier => {
      reply = reply.concat(`  - ${tier.name} (${format.toGSC(tier.averageGain, true)} / ${format.toGSC(tier.investCost, true)})\n`)
      if (reply.length >= 1700) {
        message.channel.send(reply);
        reply = '';
      }
    });

    if (reply.length > 0) {
      message.channel.send(reply);
    }
  }
  else if (args[0] === 'status') {
    const reply = new Discord.RichEmbed().setColor('#0cf246')
      .setThumbnail(message.author.displayAvatarURL)
      .addField('Total gold', format.toGSC(client.farmDb.get(key, 'copper')), true)
      .addField('Farm tier', farmTier.name, true)
      .addField('Next tier cost', format.toGSC(farmTier.investCost, true), true)
      .addField(`Fatigue level: ${client.farmDb.get(key, 'fatigueLevel')}`, format.toDisplayedTime(calculateDelay(client, key)), true);
      message.channel.send(reply);
  }
  else {
    // standard farm + status flow
    reduceFatigue(client, key);

    const currentTime = new Date().getTime();
    const farmAvailable = client.farmDb.get(key, 'lastFarmed') + calculateDelay(client, key);
    const diffMs = farmAvailable - currentTime;

    const reply = new Discord.RichEmbed();

    if (farmAvailable < currentTime) {
      const farmedCopper = getFarmFromAvg(farmTier.averageGain);
      client.farmDb.math(key, "+", farmedCopper, 'copper');
      client.farmDb.inc(key, 'fatigueLevel');
      client.farmDb.set(key, currentTime, 'lastFarmed');

      reply.setColor('#0cf246')
        .setTitle('Farming successful!')
        .setDescription(`<@${message.author.id}>, you just gained ${format.toGSC(farmedCopper)}! Check back in ${format.toDisplayedTime(calculateDelay(client, key))}.`);
    }
    else {
      reply.setColor('#a30a0a')
        .setTitle('Farming is not available yet!')
        .setDescription(`<@${message.author.id}>, you can farm in ${format.toDisplayedTime(diffMs)}!`);
    }

    reply.addBlankField()
      .setThumbnail(message.author.displayAvatarURL)
      .addField('Total gold', format.toGSC(client.farmDb.get(key, 'copper')), true)
      .addField('Farm tier', farmTier.name, true)
      .addField('Next tier cost', format.toGSC(farmTier.investCost, true), true)
      .addField(`Fatigue level: ${client.farmDb.get(key, 'fatigueLevel')}`, format.toDisplayedTime(calculateDelay(client, key)), true)
      .addBlankField()
      .setFooter("To upgrade your farm, type '!farm invest'. View upgrades with '!farm tiers'.");
    message.channel.send(reply);
  }
}

function invest(key, client, message, farmTierIdx, farmTier, totalCopper) {
  if (totalCopper < farmTier.investCost) {
    return message.reply(`not enough funds! You need ${format.toGSC(farmTier.investCost)} to improve your farm!`);
  }
  else {
    client.farmDb.math(key, "-", farmTier.investCost, 'copper');
    client.farmDb.set(key, farmTierIdx + 1, 'farmTier');
    return message.reply(`farm improved! You are now a ${client.config.farmTiers[farmTierIdx+1].name}! GG`)
  }
}

function reduceFatigue(client, key) {
  const timeSinceLastFarm = new Date().getTime() - client.farmDb.get(key, 'lastFarmed');
  const currentDelay = calculateDelay(client, key);

  if (timeSinceLastFarm < currentDelay * 2) {
    // farmed too soon, not reducing fatigue
    return;
  }

  const lvlDrop = Math.floor(timeSinceLastFarm / client.config.fatigue.decreaseIntervalMs);
  const newLevel = Math.max(0, client.farmDb.get(key, 'fatigueLevel') - lvlDrop);
  client.farmDb.set(key, newLevel, 'fatigueLevel');
}

function calculateDelay(client, key) {
  const fatigueLvl = client.farmDb.get(key, 'fatigueLevel');
  const cfg = client.config.fatigue;
  return (cfg.initial + (cfg.scalar * Math.pow(cfg.base, fatigueLvl))) * 60 * 1000;
}

function getFarmFromAvg(averageGain) {
  return generateRandomInteger(averageGain * 0.6, averageGain * 1.5);
}

function generateRandomInteger(min, max) {
  return Math.floor(min + Math.random()*(max + 1 - min))
}
