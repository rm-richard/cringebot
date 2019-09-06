exports.update = (client, userId, currentGame) => {
  if (!isOnline(currentGame)) {
    console.log('  Not online, skipping saving..')
    return;
  }

  client.playDb.ensure(userId, {
    playtime: 0,
    lastSaved: 0
  });

  const currentTime = new Date().getTime();
  const lastSaved = client.playDb.get(userId, 'lastSaved');
  const gameStarted = currentGame.timestamps.start.getTime();
  let unsavedTime = lastSaved > gameStarted
      ? currentTime - lastSaved
      : currentTime - gameStarted;

  client.playDb.math(userId, '+', unsavedTime, 'playtime');
  client.playDb.set(userId, currentTime, 'lastSaved');
  return client.playDb.get(userId, 'playtime');
}

function isOnline(currentGame) {
  return currentGame && currentGame.name.toLowerCase().startsWith("world of warcraft");
}
