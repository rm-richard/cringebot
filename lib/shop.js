const Enmap = require("enmap");
const items = new Enmap();
const format = require('./formatters.js');

items.set('nap', {
  cost: 1, buy: nap,
  description: 'Reduces your fatigue level by 1.'
});

items.set('rest', {
  cost: 10, buy: rest,
  description: 'Resets your fatigue level to 0.'
});

items.set('bonus', {
  cost: 8, buy: bonus,
  description: 'Resets your daily bonus, your next farm will yield 400% extra gold.'
});

items.set('invest', {
  cost: 12, buy: invest, ascension: 1,
  description: 'Upgrades your farm. *Requires at least Ascension I.*'
});

items.set('triplest', {
  cost: 24, buy: triplest, ascension: 3,
  description: 'Upgrades your farm by **3 levels**. *Requires at least Ascension III.*'
});

function nap(client, userId, item) {
  let reducedFatigue = Math.max(client.farmDb.get(userId, 'fatigueLevel') - 1, 0);
  client.farmDb.set(userId, reducedFatigue, 'fatigueLevel');
  spendBogs(client, userId, item.cost);
}

function rest(client, userId, item) {
  client.farmDb.set(userId, 0, 'fatigueLevel');
  spendBogs(client, userId, item.cost);
}

function bonus(client, userId, item) {
  client.farmDb.set(userId, true, 'bonusAvailable');
  spendBogs(client, userId, item.cost);
}

function invest(client, userId, item) {
  client.farmDb.inc(userId, 'farmTier');
  spendBogs(client, userId, item.cost);
}

function triplest(client, userId, item) {
  let currentTier = client.farmDb.get(userId, 'farmTier');
  let newTier = Math.min(currentTier + 3, client.config.farmTiers.length - 1);
  client.farmDb.set(userId, newTier, 'farmTier');
  spendBogs(client, userId, item.cost);
}

function getAvailableBogs(client, id) {
  const bogsAll = Math.floor(client.playDb.get(id, 'totalTime') / (60*60*1000));
  const bogsSpent = client.farmDb.get(id, 'bogSpent') || 0;
  return bogsAll - bogsSpent;
}

function spendBogs(client, userId, amount) {
  let bogSpent = client.farmDb.get(userId, 'bogSpent') || 0;
  client.farmDb.set(userId, bogSpent + amount, 'bogSpent');
}

function buy(client, userId, itemName) {
  const item = items.get(itemName);
  if (!item) return 'no such item in the shop.';

  let availableBogs = getAvailableBogs(client, userId);
  let currentAscension = client.farmDb.get(userId, 'ascension');

  if ((item.ascension || 0) > currentAscension) {
    return `you need to have ascended at least ${item.ascension} times to buy ${itemName}.`
  }
  else if (availableBogs < item.cost) {
    return `not enough BOG! You need ${format.bog(item.cost)} to buy a '${itemName}'.`
  }
  else {
    item.buy(client, userId, item);
    return `you just bought a **${itemName}**. Your remaining balance is ${format.bog(availableBogs - item.cost)}.`
  }
}

exports.items = items;
exports.getAvailableBogs = getAvailableBogs;
exports.buy = buy;
