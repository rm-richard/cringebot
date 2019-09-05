const Discord = require('discord.js');

exports.run = (client, message, args) => {
  console.log(message.author);
  console.log(message.author.username);

  const reply = new Discord.RichEmbed()
    .setColor('#0cf246')
    .setTitle('Successful grind!')
    .addField('Gold farmed', `5 <:gold:618818303615303700> 6 <:silver:618818303632343111> 7 <:copper:618818303577554989>`)
    .addBlankField()
    .addField('Total gold is 5g, 5s, 6c')
    .addField('Mention', `<@${message.author.id}>`);

  message.reply(reply);
}
