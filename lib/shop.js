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
  cost: 50, buy: bonus,
  description: 'Resets your daily bonus, your next farm will yield 400% extra gold.'
});

function nap() {}
function rest() {}
function bonus() {}

function getAvailableBogs(client, id) {
  const bogsAll = Math.floor(client.playDb.get(id, 'totalTime') / (60*60*1000));
  const bogsSpent = client.farmDb.get(id, 'bogSpent') || 0;
  return bogsAll - bogsSpent;
}

function buy(client, userId, itemName) {
  const item = items.get(itemName);
  if (!item) return 'no such item in the shop.';

  let availableBogs = getAvailableBogs(client, userId);
  if (availableBogs < item.cost) {
    return `not enough BOG! You need ${format.bog(item.cost)} to buy a '${itemName}'.`
  } else {
    return `you just bought a ${itemName}. Your remaining balance is ${format.bog(availableBogs - item.cost)}.`
  }
}

exports.items = items;
exports.getAvailableBogs = getAvailableBogs;
exports.buy = buy;
