var cron = require('node-cron');

function run(client) {
  console.log('[Bonus] Granting daily bonuses');
  client.farmDb.forEach((val, key) => {
    client.farmDb.set(key, true, 'bonusAvailable');
  });
}

exports.schedule = (client) => {
  cron.schedule('0 3 * * *', () => run(client));
};
