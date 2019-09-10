var cron = require('node-cron');

function run(client) {
  console.log('[Fatigue] Reducing fatigue levels');
  client.farmDb.forEach((val, key) => {
    const newLevel = Math.max(0, val.fatigueLevel - 1) || 0;
    client.farmDb.set(key, newLevel, 'fatigueLevel');
  });
}

exports.schedule = (client) => {
  cron.schedule('0 * * * *', () => run(client));
};
