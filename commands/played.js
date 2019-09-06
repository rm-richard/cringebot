const Discord = require('discord.js');
const Enmap = require('enmap');
const format = require('../lib/formatters');
const playtime = require('../lib/playtime.js');

exports.run = (client, message, args) => {
  const id = message.author.id;

  client.playDb.ensure(id, {totalTime: 0});

  const currentTime = new Date().getTime();
  const game = message.author.presence.game;

  var totalTime;
  var reply = '';

  if (playtime.isPlayingWow(game)) {
    const onlineFor = currentTime - game.timestamps.start.getTime();
    reply += `you are currently playing WoW for **${format.toDisplayedTime(onlineFor)}**. `;
    totalTime = playtime.update(client, id, game);
  } else {
    reply += 'you are not playing WoW right now. ';
    totalTime = client.playDb.get(id, 'totalTime');
  }

  reply += `\nYour total ingame time is **${format.toDisplayedTime(totalTime)}**.`;

  message.reply(reply);
}
