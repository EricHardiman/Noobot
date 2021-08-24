import PaginationCollector from '../../Collectors/Pagination';
import { MathHelpers, MessageHelpers } from '../../Helpers';
import { Command } from '../../Interfaces';

export const command: Command = {
  name: 'queue',
  description: "Shows upcoming songs for a server's queue.",
  run: async (client, message) => {
    const queue = client.player.getQueue(message.guildId!);

    if (!queue || (queue && !queue.tracks.length))
      return message.channel
        .send('Nothing in queue.')
        .then(
          async (message) =>
            await MessageHelpers.DeleteMessage({ message, timeout: 5000 }),
        );
    const options = queue.tracks.map(MessageHelpers.TrackSelectionEmbed);

    if (queue && queue.playing) {
      const title = `Current ${message.guild?.name} Queue`;
      const { embeds, components } = MessageHelpers.CreatePagination({
        options,
        title,
      });

      await message.channel
        .send({
          components: [components],
          embeds: [embeds],
        })
        .then((sentMessage) =>
          PaginationCollector({
            sentMessage,
            originalMessage: message,
            options,
            title,
          }),
        );
    }
  },
};
