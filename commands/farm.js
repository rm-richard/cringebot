const Enmap = require('enmap');
const Discord = require('discord.js');
const format = require('../lib/formatters.js');
const { arabToRoman } = require('roman-numbers');

exports.run = (client, message, args) => {
  const key = message.author.id;

  client.farmDb.ensure(key, {
    user: message.author.id,
    copper: 0,
    lastFarmed: 0,
    farmTier: 0,
    fatigueLevel: 0,
    bonusAvailable: false,
    bogSpent: 0,
    ascension: 0,
    ascensionMultiplier: 1
  });

  const farmTierIdx = client.farmDb.get(key, 'farmTier');
  const farmTier = client.config.farmTiers[farmTierIdx];
  const totalCopper = client.farmDb.get(key, 'copper');
  const currentALvl = client.farmDb.get(key, 'ascension') || 0;
  const currentAMulti = client.farmDb.get(key, 'ascensionMultiplier') || 1;
  const ascensionPrefix = currentALvl > 0 ? `Ascended ${arabToRoman(currentALvl)}. ` : '';
  const costToAscend = 10000000 * (currentALvl * 3 + 1);

  const currentTime = new Date().getTime();
  const farmAvailable = client.farmDb.get(key, 'lastFarmed') + calculateDelay(client, key);
  const diffMs = farmAvailable - currentTime;

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
    var description = '';
    if (farmAvailable < currentTime) {
      description = 'Farming is **AVAILABLE**!';
    } else {
      description = `Farming will be available in ${format.toDisplayedTime(diffMs)}.`;
    }

    const reply = new Discord.RichEmbed().setColor('#0cf246')
      .setDescription(description)
      .setThumbnail(message.author.displayAvatarURL)
      .addField('Total gold', format.toGSC(client.farmDb.get(key, 'copper')), true)
      .addField('Farm tier', `${ascensionPrefix}${farmTier.name}`, true)
      .addField('Next tier cost', format.toGSC(farmTier.investCost, true), true)
      .addField(`Fatigue level: ${client.farmDb.get(key, 'fatigueLevel')}`, format.toDisplayedTime(calculateDelay(client, key)), true);
      message.channel.send(reply);
  }
  else if (args[0] === 'ascend') {
    const nextAMulti = currentAMulti + (currentALvl + 1) * (client.farmDb.get(key, 'farmTier') / 10);

    if (args[1] === '--doit') {
      // just ascend
      const copper = client.farmDb.get(key, 'copper') || 0;
      if (copper < costToAscend) return message.reply(`you dont have enought gold to ascend. You need ${format.toGSC(costToAscend, true)}`);

      client.farmDb.set(key, 0, 'copper');
      client.farmDb.set(key, 0, 'lastFarmed');
      client.farmDb.set(key, 0, 'farmTier');
      client.farmDb.set(key, 0, 'fatigueLevel');
      client.farmDb.set(key, 0, 'bogSpent');
      client.farmDb.set(key, currentALvl + 1, 'ascension');
      client.farmDb.set(key, nextAMulti, 'ascensionMultiplier');
      message.reply(`you are now an __**Ascended ${arabToRoman(currentALvl+1)}. Rabszolga**__. Get !farm-ing!`);
    }
    else {
      const reply = new Discord.RichEmbed().setColor('#faeb14')
        .setTitle('!!! WARNING !!!')
        .setDescription(`Ascending will reset your progress, but it will grant you a permanent bonus to all of your future gold yields.

          - Ascension level: **${currentALvl} --> ${currentALvl + 1}**
          - Gold gain: **${Math.round(currentAMulti * 100)}% --> ${Math.round(nextAMulti * 100)}%**
          - Fatigue and farm timer reset to zero
          - You regain your spent BOGs
          - You become a Rabszolga again

        It costs ${format.toGSC(costToAscend, true)} to ascend. If you really want to do it, type '!farm ascend --doit'`);
      message.channel.send(reply);
    }
  }
  else {
    // standard farm + status flow
    const reply = new Discord.RichEmbed();

    if (farmAvailable < currentTime) {
      const bonusAvailable = client.farmDb.get(key, 'bonusAvailable');
      const farmedCopper = Math.floor(getFarmFromAvg(farmTier.averageGain) * currentAMulti);
      const bonusCopper = bonusAvailable ? farmedCopper * client.config.bonus.multiplier : 0;

      client.farmDb.set(key, false, 'bonusAvailable');
      client.farmDb.math(key, "+", farmedCopper + bonusCopper, 'copper');
      client.farmDb.inc(key, 'fatigueLevel');
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
      .addField('Farm tier', `${ascensionPrefix}${farmTier.name}`, true)
      .addField('Next tier cost', format.toGSC(farmTier.investCost, true), true)
      .addField(`Fatigue level: ${client.farmDb.get(key, 'fatigueLevel')}`, format.toDisplayedTime(calculateDelay(client, key)), true);
    message.channel.send(reply);
  }
}

function invest(key, client, message, farmTierIdx, farmTier, totalCopper) {
  if (totalCopper < farmTier.investCost) {
    return message.reply(`not enough funds! You need ${format.toGSC(farmTier.investCost)} to improve your farm!`);
  }
  else if (client.farmDb.get(key, 'farmTier') === client.config.farmTiers.length - 1) {
    return message.reply(`you have already reached the max farm tier upgrade and!`);
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
