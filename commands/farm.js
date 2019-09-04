const Enmap = require('enmap');

const FARM_DELAY_MS = 20 * 1000;

exports.run = (client, message, args) => {
  if (!client.farmDb) client.farmDb = new Enmap({name: 'farmDb'});

  const key = message.author.id;

  client.farmDb.ensure(key, {
    user: message.author.id,
    copper: 0,
    lastFarmed: 0
  });

  const currentTime = new Date().getTime();
  const farmAvailable = client.farmDb.get(key, 'lastFarmed') + FARM_DELAY_MS;

  if (farmAvailable < currentTime) {
    const farmedCopper = generateRandomInteger(45, 300);
    client.farmDb.math(key, "+", farmedCopper, 'copper');
    client.farmDb.set(key, currentTime, 'lastFarmed');
    const totalCopper = client.farmDb.get(key, 'copper');

    message.reply(`you just farmed ${formatWallet(farmedCopper)}!`);
    message.reply(`you now have ${formatWallet(totalCopper)}!`);
  } else {
    const diffSec = (farmAvailable - currentTime) / 1000;
    message.reply(`you can farm in ${Math.floor(diffSec/60).toFixed()} minutes ${(diffSec % 60).toFixed()} seconds!`)
  }
}

function generateRandomInteger(min, max) {
  return Math.floor(min + Math.random()*(max + 1 - min))
}

function formatWallet(copper) {
  const c = copper % 100;
  const s = Math.floor(copper / 100) % 100;
  const g = Math.floor(copper / 10000);
  return `${g} gold ${s} silver ${c} copper`;
}
