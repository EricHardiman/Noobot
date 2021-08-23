import { Track } from 'discord-player';
import { Command } from '../../Interfaces';
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import SongSearchCollector from '../../Collectors/SongSearch';
import { MessageHelpers } from '../../Helpers';

export const command: Command = {
  name: 'search',
  description: 'Search YouTube for Song and return first three results.',
  run: async (client, message, args) => {
    const { player } = client;
    const songSearch = args.join('');
    if (!songSearch) return;

    let returnedSongs: Track[];

    try {
      returnedSongs = (
        await player.search(songSearch, { requestedBy: message.author })
      ).tracks.slice(0, 3);
    } catch {
      returnedSongs = [];
    }

    if (!returnedSongs.length) return;

    const embed = new MessageEmbed({
      title: 'Please Select a Song:',
      color: 'BLURPLE',
      fields: returnedSongs.map(MessageHelpers.TrackSelectionEmbed),
    });

    const buttonRow = new MessageActionRow();

    for (const index in returnedSongs) {
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
          songs: returnedSongs,
          player,
        }),
      );
  },
};
