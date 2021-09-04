import { Command } from '../../Interfaces';
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import SongSearchCollector from '../../Collectors/SongSearch';
import { SongSearch, TrackSelectionEmbed } from '../../Helpers';

export const command: Command = {
  name: 'search',
  description: 'Search YouTube for Song and return first three results.',
  run: async (client, message, args) => {
    const { manager } = client;
    const search = args.join('');
    if (!search) return;

    const tracks = (await SongSearch({ manager, search })).tracks.slice(0, 3);

    if (!tracks.length) return;

    const embed = new MessageEmbed({
      title: 'Please Select a Song:',
      color: 'BLURPLE',
      fields: tracks.map(TrackSelectionEmbed),
    });

    const buttonRow = new MessageActionRow();

    for (const index in tracks) {
      buttonRow.addComponents(
        new MessageButton()
          .setCustomId(`songSearch-${index}`)
          .setStyle('PRIMARY')
          .setLabel(`Song ${parseInt(index) + 1}`),
      );
    }

    return await message.channel
      .send({ embeds: [embed], components: [buttonRow] })
      .then((sentMessage) =>
        SongSearchCollector({
          originalMessage: message,
          sentMessage,
          songs: tracks,
          manager,
        }),
      );
  },
};
