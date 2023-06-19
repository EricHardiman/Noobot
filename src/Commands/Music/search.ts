import { Command } from '../../Interfaces';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from 'discord.js';
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

    const embed = new EmbedBuilder({
      title: 'Please Select a Song:',
      fields: tracks.map(TrackSelectionEmbed),
    }).setColor('Blurple');

    const buttonRow = new ActionRowBuilder<ButtonBuilder>();

    for (const index in tracks) {
      buttonRow.addComponents(
        new ButtonBuilder()
          .setCustomId(`songSearch-${index}`)
          .setStyle(ButtonStyle.Primary)
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
