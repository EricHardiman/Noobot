import { ChannelType } from 'discord.js';
import { Command } from '../../Interfaces';

export const command: Command = {
  name: 'lmgtfy',
  description: 'Sends a lmgtfy link."',
  run: async (_client, message, query) => {
    if (message.channel.type === ChannelType.DM) return;
    if (!query) return;

    return await message.channel.send(
      `https://lmgtfy.app/?q=${query.join('+')}`,
    );
  },
};
