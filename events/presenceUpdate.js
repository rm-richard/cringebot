const format = require('../lib/formatters.js');
const playtime = require('../lib/playtime.js');

module.exports = (client, oldMember, newMember) => {
  const oldGame = oldMember.presence.game;
  const newGame = newMember.presence.game;

  if (oldGame && !newGame) {
    var elapsedTime = 0;
    if (oldGame.timestamps.start) {
       elapsedTime = new Date().getTime() - oldGame.timestamps.start.getTime();
    }
    console.log(`[Playtime] ${oldMember.displayName} stopped playing ${oldGame.name} after ${format.toDisplayedTime(elapsedTime)}.`);

    let total = playtime.update(client, oldMember.id, oldGame);

    console.log(`[Playtime] ${oldMember.displayName} played ${oldGame.name} for a total of ${format.toDisplayedTime(total)}`);
  }
  else if (!oldGame && newGame) {
    console.log(`[Playtime] ${oldMember.displayName} started playing ${newGame.name}`);
  }
};
