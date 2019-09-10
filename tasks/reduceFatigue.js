var cron = require('node-cron');

function run(client) {
  console.log('[Fatigue] Reducing fatigue levels');
  client.farmDb.forEach((val, key) => {
    const newLevel = Math.max(0, val.fatigueLevel - 1) || 0;
    client.farmDb.set(key, newLevel, 'fatigueLevel');
  });

  try {
    client.channels.get(client.config.spamChannel).send('Fatigue levels are reduced by 1. Check your farms!');
  } catch (error) {
    console.log(error);
  }
}

exports.schedule = (client) => {
  cron.schedule('0 */3 * * *', () => run(client));
};
