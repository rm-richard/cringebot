module.exports = (client) => {
  console.log(`Logged in as ${client.user.tag}`);
  console.log(`Serving ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
};
