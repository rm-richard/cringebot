const Enmap = require("enmap");
const items = new Enmap();
const format = require('./formatters.js');

items.set('nap', {
  cost: 1, buy: nap,
  description: 'Reduces your fatigue level by 1.'
});

items.set('rest', {
  cost: 12, buy: rest,
  description: 'Resets your fatigue level to 0.'
});

items.set('bonus', {
  cost: 8, buy: bonus,
  description: 'Resets your daily bonus, your next farm will yield 400% extra gold.'
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
  if (availableBogs < item.cost) {
    return `not enough BOG! You need ${format.bog(item.cost)} to buy a '${itemName}'.`
  } else {
    item.buy(client, userId, item);
    return `you just bought a **${itemName}**. Your remaining balance is ${format.bog(availableBogs - item.cost)}.`
  }
}

exports.items = items;
exports.getAvailableBogs = getAvailableBogs;
exports.buy = buy;
