var cron = require('node-cron');

function run(client) {
  console.log('[Bonus] Granting daily bonuses');
  client.farmDb.forEach((val, key) => {
    val.bonusAvailable = true;
  });
}

exports.schedule = (client) => {
  cron.schedule('0 3 * * *', () => run(client));
};
