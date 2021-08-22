import { Command } from '../../Interfaces';

export const command: Command = {
  name: 'stop',
  description: 'Leaves voice channel, clears queue, destroys player.',
  run: async (client, message) => {
    const queue = client.player.getQueue(message.guildId!);

    if (queue) queue.destroy();
  },
};
