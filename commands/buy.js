const Enmap = require("enmap");
const items = new Enmap();
const shop = require('../lib/shop.js');

exports.run = (client, message, args) => {
  let reply = shop.buy(client, message.author.id, args[0]);
  message.reply(reply);
}
