const Discord = require('discord.js');
const format = require('../lib/formatters.js');
const playtime = require('../lib/playtime.js');

exports.run = (client, message, args) => {
  if (message.author.id !== client.config.ownerID) {
    return message.reply("You are not authorized to execute this command.");
  }

  console.log("");
  client.guilds.forEach(guild => {
    console.log(`Guild: ${guild.name}`);

    guild.members.forEach((member, id) => {
      console.log(`   ${id} - ${member.displayName} - ${member.presence.game}`);
      if (member.presence.game) {
        let elapsedTime = new Date().getTime() - member.presence.game.timestamps.start.getTime();
        console.log("      Updating playtime...");
        console.log(`      Currently playing for ${format.toDisplayedTime(elapsedTime)}`);
        console.log(`      Total played: ${format.toDisplayedTime(playtime.update(client, id, member.presence.game))}`)
      }
    });

  });
  console.log("");
  console.log(`Guild total time is ${format.toDisplayedTime(playtime.guildTotal(client))}`);
}
