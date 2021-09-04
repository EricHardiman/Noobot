import { DeleteMessage, FindCreateQueue, RetrievePlayer } from '../../Helpers';
import { Command } from '../../Interfaces';

export const command: Command = {
  name: 'resume',
  description: 'Resumes whatever was playing.',
  run: async (client, message) => {
    const { manager } = client;
    const player = RetrievePlayer(manager, message);
    const queue = await FindCreateQueue(message.guildId!);

    if (player && player.paused) {
      await player.pause(false);
      return message.channel
        .send(`Resuming \`${queue.current.info.title}\`.`)
        .then((message) => DeleteMessage({ message, timeout: 3000 }));
    }
  },
};
