import { ClearQueue, DeleteMessage, RetrievePlayer } from '../../Helpers';
import { Command } from '../../Interfaces';

export const command: Command = {
  name: 'stop',
  description: 'Leaves voice channel, clears queue, destroys player.',
  run: async (client, message) => {
    const { manager } = client;
    const player = RetrievePlayer(manager, message);

    if (player) {
      await player.destroy();
      await manager.leave(message.guildId!);

      return await ClearQueue(message.guildId!);
    } else {
      return message.channel
        .send('Nothing playing.')
        .then((message) => DeleteMessage({ message, timeout: 3000 }));
    }
  },
};
