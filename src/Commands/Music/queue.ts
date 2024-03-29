import PaginationCollector from '../../Collectors/Pagination';
import {
  CreatePagination,
  DeleteMessage,
  FindCreateQueue,
  RetrievePlayer,
  TrackSelectionEmbed,
  ClearQueue,
} from '../../Helpers';
import { Command } from '../../Interfaces';

export const command: Command = {
  name: 'queue',
  description: "Shows upcoming songs for a server's queue.",
  run: async (client, message, [clear]) => {
    const { manager } = client;
    const queue = await FindCreateQueue(message.guildId!);
    const player = RetrievePlayer(manager, message);

    if (queue && !queue.tracks.length) {
      return message.channel
        .send('Nothing in queue.')
        .then(
          async (message) => await DeleteMessage({ message, timeout: 5000 }),
        );
    }

    if (clear === 'clear') {
      await ClearQueue(message.guildId!);
      return message.channel.send('Queue cleared!');
    }

    const options = queue.tracks.map(TrackSelectionEmbed);

    if (player && player.playing) {
      const title = `Current ${message.guild?.name} Queue`;
      const { embeds, components } = CreatePagination({
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
