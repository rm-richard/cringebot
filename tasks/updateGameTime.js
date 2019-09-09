const format = require('../lib/formatters.js');
const playtime = require('../lib/playtime.js');

const INTERVAL_MS = 10 * 60 * 1000;

function run(client) {
  client.guilds.forEach(guild => {
    guild.members.forEach((member, id) => {
      if (member.presence.game) {
        let elapsedTime = new Date().getTime() - member.presence.game.timestamps.start.getTime();
        console.log(`[Playtime] ${member.displayName} - ${format.toDisplayedTime(elapsedTime)}. Total: ${format.toDisplayedTime(playtime.update(client, id, member.presence.game))}`);
      }
    });
  });
}

exports.schedule = (client) => {
  setInterval(() => run(client), INTERVAL_MS);
};
