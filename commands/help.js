const helpMessage = `\`\`\`
Supported commands:
  !farm          - farm for gold every 20 minutes
  !farm invest   - upgrade your farm if you have enough gold
  !farm tiers    - list farm upgrades with costs

  !duel @mention - challenge another user to a duel
  !duel accept   - accept a duel challenge

  !played        - display your total time spent in WoW

  !help          - display this message
\`\`\``;

exports.run = (client, message, args) => {
  message.channel.send(helpMessage);
}
