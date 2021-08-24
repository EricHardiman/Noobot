import { Command } from '../../Interfaces';
import { PREFIX } from '../../config.json';

export const command: Command = {
  name: 'pause',
  description: 'Pauses whatever is playing.',
  run: async (client, message) => {
    const queue = client.player.getQueue(message.guildId!);

    if (queue && !queue.connection.paused) {
      queue.setPaused(true);
      return await message.channel.send(
        `Successfully paused - use \`${PREFIX}resume\` to resume.`,
      );
    }
  },
};
