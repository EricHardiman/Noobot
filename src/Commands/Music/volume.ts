import { DeleteMessage, RetrievePlayer } from '../../Helpers';
import { Command } from '../../Interfaces';

export const command: Command = {
  name: 'volume',
  description: 'Sets volume from 1 - 100.',
  aliases: ['vol'],
  run: async (client, message, args) => {
    const { manager } = client;
    const player = RetrievePlayer(manager, message);

    const isPlaying = player && player.playing;
    if (!args.length && isPlaying) {
      return await message.channel
        .send(`Current volume level is ${player.state.volume}%`)
        .then(
          async (message) => await DeleteMessage({ message, timeout: 5000 }),
        );
    }

    const volume = parseInt(args.join(''));
    if (volume === NaN || volume <= 0 || volume >= 100) return;
    if (isPlaying) {
      player.volume(volume);
      return await message.channel
        .send(`Set volume level to ${volume}%.`)
        .then(
          async (message) => await DeleteMessage({ message, timeout: 3000 }),
        );
    }
  },
};
