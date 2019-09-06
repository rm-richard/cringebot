const Discord = require('discord.js');
const client = new Discord.Client();

const Enmap = require("enmap");
const fs = require('fs');
const config = require('./config.json');

client.config = config;
client.farmDb = new Enmap({name: 'farmDb', ensureProps: true});
client.playDb = new Enmap({name: 'playDb', ensureProps: true});

// load events
fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
  });
});

// load commands
client.commands = new Enmap();
fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let command = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    console.log(`Attempting to load command ${commandName}`);
    client.commands.set(commandName, command);
  });

  console.log(`Successfully loaded ${files.length} commands.`)
});

if (config.botToken) {
  console.log("Logging in...")
  client.login(config.botToken);
} else {
  console.log('"botToken" not found in config.json!')
}
