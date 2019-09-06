function isPlayingWow(currentGame) {
  return currentGame && currentGame.name.toLowerCase().startsWith("world of warcraft");
}

exports.isPlayingWow = isPlayingWow;

exports.update = (client, userId, currentGame) => {
  if (!isPlayingWow(currentGame)) {
    console.log('  Not playing WoW, skipping saving..')
    return;
  }

  client.playDb.ensure(userId, {
    totalTime: 0,
    lastSaved: 0
  });

  const currentTime = new Date().getTime();
  const lastSaved = client.playDb.get(userId, 'lastSaved');
  const gameStarted = currentGame.timestamps.start.getTime();
  let unsavedTime = lastSaved > gameStarted
      ? currentTime - lastSaved
      : currentTime - gameStarted;

  client.playDb.math(userId, '+', unsavedTime, 'totalTime');
  client.playDb.set(userId, currentTime, 'lastSaved');
  return client.playDb.get(userId, 'totalTime');
};

exports.guildTotal = (client) => {
  return client.playDb.reduce((acc, curr) => acc + curr.totalTime, 0);
};
