const Discord = require('discord.js');
const format = require('../lib/formatters.js');
const playtime = require('../lib/playtime.js');

exports.run = (client, message, args) => {
  if (message.author.id !== client.config.ownerID) {
    return message.reply("You are not authorized to execute this command.");
  }

  const boj = '<:boj:620585665805025280>';
  let reply = new Discord.RichEmbed();
  reply.setColor('#4bd4fa')
    .setTitle('BoG (Badge of Gametime) Shop')
    .addField(`1x ${boj}  !buy nap`, 'You nap a little, reducing your fatigue level by 1.', true)
    .addField(`5x ${boj}  !buy rest`, 'You get a full night\'s sleep. This resets your fatigue level to 0.', true)
    .addField(`1x ${boj}  !buy quads`, 'You invest extra time in your next harvest. The next !farm command will earn you 400% gold', true)
    .addField(`10x ${boj}  !buy invest`, 'Igor rode the pump again, and Ethereum prices are inflated as fuck. You decide to pay for your next upgrade in an exotic currency.', true);
  message.reply(reply);

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
