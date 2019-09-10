const helpMessage = `\`\`\`
Supported commands:
  !farm          - farm for gold
  !farm invest   - upgrade your farm if you have enough gold
  !farm tiers    - list farm upgrades with costs

  !duel @mention - challenge another user to a duel
  !duel accept   - accept a duel challenge

  !played        - display your total time spent in WoW

  !help          - display this message

Concepts:
  Fatigue: each level adds more delay between farms. Each successful
           farm increases fatigue by 20%. Reduced by 1 ever 3 hours.
  Daily bonus: the first farm each day yields extra 400% gold.
\`\`\``;

exports.run = (client, message, args) => {
  message.channel.send(helpMessage);
}
