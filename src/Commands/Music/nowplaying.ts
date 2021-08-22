import { MessageHelpers } from '../../Helpers';
import { Command } from '../../Interfaces';

export const command: Command = {
  name: 'nowplaying',
  description: 'Pauses whatever is playing.',
  aliases: ['np'],
  run: async (client, message) => {
    const queue = client.player.getQueue(message.guildId!);
    const isPlaying = queue && queue.playing;

    if (isPlaying) {
      const embed = MessageHelpers.NowPlayingEmbed(queue.current);

      return await message.channel
        .send({ embeds: [embed] })
        .then((message) =>
          MessageHelpers.DeleteMessage({ message, timeout: 10000 }),
        );
    }
  },
};
