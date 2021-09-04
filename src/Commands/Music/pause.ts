import { Command } from '../../Interfaces';
import { PREFIX } from '../../config.json';
import { DeleteMessage, RetrievePlayer } from '../../Helpers';

export const command: Command = {
  name: 'pause',
  description: 'Pauses whatever is playing.',
  run: async (client, message) => {
    const { manager } = client;
    const player = RetrievePlayer(manager, message);

    if (player && !player.paused) {
      await player.pause(true);
      return await message.channel
        .send(`Successfully paused - use \`${PREFIX}resume\` to resume.`)
        .then((message) => DeleteMessage({ message, timeout: 3000 }));
    }
  },
};
