import { MessageEmbed } from 'discord.js';
import { DeleteMessage, SongFromPresence } from '../../Helpers';
import { Command } from '../../Interfaces';
import { OWNERS } from '../../config.json';

export const command: Command = {
  name: 'restartbot',
  description: 'Restarts Noobot.',
  run: async (client, message, args) => {
    if (OWNERS.includes(message.author.id)) {
      message.channel.send('In owner array');
    }

    return;
  },
};
