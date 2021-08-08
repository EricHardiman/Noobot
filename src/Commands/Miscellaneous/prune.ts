import { Command } from '../../Interfaces';

export const command: Command = {
  name: 'prune',
  description: 'Mass deletes 1-100 Messages at a time."',
  run: async (_client, message, [amount]) => {
    if (message.channel.type === 'DM') return;

    let amountToPrune = 2;
    if (parseInt(amount) && parseInt(amount) < 100 && parseInt(amount) >= 1) {
      amountToPrune = parseInt(amount) + 1;
    }

    if (parseInt(amount) >= 100) amountToPrune = 100;

    await message.channel.messages
      .fetch({
        limit: amountToPrune,
      })
      .then((messages) => {
        if (message.channel.type === 'GUILD_TEXT')
          message.channel.bulkDelete(messages, true);
      });
  },
};
