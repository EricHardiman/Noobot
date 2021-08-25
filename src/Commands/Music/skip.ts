import { Command } from '../../Interfaces';

export const command: Command = {
  name: 'skip',
  description: 'Skips currently playing song.',
  run: async (client, message) => {
    const queue = client.player.getQueue(message.guildId!);

    if (queue && queue.playing)
      try {
        queue.skip();
      } catch {}
  },
};
