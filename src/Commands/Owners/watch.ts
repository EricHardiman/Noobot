import axios from 'axios';
import { Command } from '../../Interfaces';
import { OWNERS, IMDB_URL } from '../../config.json';
import { DeleteMessage } from '../../Helpers';
import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';
import { Watch as WatchCollector } from '../../Collectors';

export const command: Command = {
  name: 'watch',
  description: 'Search calmx for movie.',
  run: async (_client, message, args) => {
    if (!OWNERS.includes(message.author.id)) return;
    const imdbSearch = args.join('');

    try {
      const { Title, Poster, Plot, Released, Genre, Runtime, roomId } =
        await axios
          .get(`${IMDB_URL}${imdbSearch}&id=${message.author.id}`)
          .then(({ data }) => data);

      const embed = new EmbedBuilder()
        .setAuthor({ name: 'Come Watch Together!' })
        .setTitle(Title)
        .setURL(imdbSearch)
        .setThumbnail(`https:${Poster}`)
        .setDescription(Plot)
        .addFields(
          { name: 'Released', value: Released, inline: true },
          { name: 'Genre', value: Genre, inline: true },
          { name: 'Length', value: Runtime, inline: true },
        )
        .setFooter({ text: 'This will be Deleted in 5 Minutes' });

      const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId(`invite`)
          .setStyle(ButtonStyle.Success)
          .setLabel('Send Invite'),
        new ButtonBuilder()
          .setCustomId(`delete-watch`)
          .setStyle(ButtonStyle.Danger)
          .setLabel('Close'),
      );

      return await message.channel
        .send({
          embeds: [embed],
          components: [buttonRow],
        })
        .then((sentMessage) =>
          WatchCollector({
            sentMessage,
            originalMessage: message,
            roomId,
            Title,
            Poster,
            Plot,
          }),
        );
    } catch {
      return await message.channel
        .send("Can't find requested link")
        .then((message) => DeleteMessage({ message, timeout: 5000 }));
    }
  },
};
