import { MessageHelpers } from '../../Helpers';
import { Command } from '../../Interfaces';

export const command: Command = {
  name: 'volume',
  description: 'Sets volume from 1 - 100.',
  aliases: ['vol'],
  run: async (client, message, args) => {
    const queue = client.player.getQueue(message.guildId!);
    const isPlaying = queue && queue.playing;

    if (!args.length && isPlaying) {
      return await message.channel
        .send(`Current volume level is ${queue.volume}%`)
        .then((message) => MessageHelpers.DeleteMessage({ message }));
    }

    const volume = parseInt(args.join(''));

    if (volume === NaN || volume <= 0 || volume >= 100) return;

    if (isPlaying) {
      queue.setVolume(volume);
      return await message.channel
        .send(`Set volume level to ${volume}%.`)
        .then((message) =>
          MessageHelpers.DeleteMessage({ message, timeout: 3000 }),
        );
    }
  },
};
