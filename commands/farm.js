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
    fatigueLevel: 0,
    bonusAvailable: false,
    ascension: 0,
    ascensionMultiplier: 1
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
  else if (args[0] === 'ascend') {
    const currentALvl = client.farmDb.get(key, 'ascension');
    const currentAMulti = client.farmDb.get(key, 'ascensionMultiplier');
    const nextAMulti = currentAMulti + client.farmDb.get(key, 'farmTier');

    const reply = new Discord.RichEmbed().setColor('#faeb14')
      .setTitle('!!! WARNING !!!')
      .setDescription(`Ascending will reset your progress, but it will grant you a permanent bonus to all of your future gold yields.

        - Ascension level: ${currentALvl} --> ${currentALvl + 1}
        - Gold multiplier: ${currentAMulti}x --> ${nextAMulti}x

      It costs ${format.toGSC(1000000000, true)} to ascend. Do you really want to do this?`);
      message.channel.send(reply);
  }
  else {
    // standard farm + status flow
    const currentTime = new Date().getTime();
    const farmAvailable = client.farmDb.get(key, 'lastFarmed') + calculateDelay(client, key);
    const diffMs = farmAvailable - currentTime;

    const reply = new Discord.RichEmbed();

    if (farmAvailable < currentTime) {
      const bonusAvailable = client.farmDb.get(key, 'bonusAvailable');
      const farmedCopper = getFarmFromAvg(farmTier.averageGain);
      const bonusCopper = bonusAvailable ? farmedCopper * client.config.bonus.multiplier : 0;
      const currentFatigue = client.farmDb.get(key, 'fatigueLevel');
      const newFatigue = Math.max(Math.floor((currentFatigue + 1) * 1.2), 1);

      client.farmDb.set(key, false, 'bonusAvailable');
      client.farmDb.math(key, "+", farmedCopper + bonusCopper, 'copper');
      client.farmDb.set(key, newFatigue, 'fatigueLevel');
      client.farmDb.set(key, currentTime, 'lastFarmed');

      const bonusMsg = bonusAvailable ? `\nFirst farm of the day bonus: ${format.toGSC(bonusCopper)}!` : '';

      reply.setColor('#0cf246')
        .setTitle('Farming successful!')
        .setDescription(`<@${message.author.id}>, you just gained ${format.toGSC(farmedCopper)}!${bonusMsg}`);
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
      .addField(`Fatigue level: ${client.farmDb.get(key, 'fatigueLevel')}`, format.toDisplayedTime(calculateDelay(client, key)), true);
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
