const helpMessage = `\`\`\`
Supported commands:
  !farm          - farm for gold
  !farm invest   - upgrade your farm if you have enough gold
  !farm tiers    - list farm upgrades with costs
  !farm ascend   - reset your progress for permanent gold bonus

  !shop          - list items buyable with BOGs
  !buy 'item'    - buy an item from the BOG shop

  !duel @mention - challenge another user to a duel
  !duel accept   - accept a duel challenge

  !played        - display your total time spent in WoW

  !help          - display this message

Concepts:
      Fatigue: each level adds more delay between farms. Each successful
               farm increases fatigue by 1. Reduced by 1 every 2 hours.
          BOG: 'Badge of Gametime' token. You get 1 for every hour spent
               in WoW. Spend them in the '!shop'.
  Daily bonus: the first farm each day yields extra 400% gold.
\`\`\``;

exports.run = (client, message, args) => {
  message.channel.send(helpMessage);
}
