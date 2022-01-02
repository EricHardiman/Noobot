import axios from 'axios';
import { Command } from '../../Interfaces';
import { OWNERS, IMDB_URL } from '../../config.json';
import { DeleteMessage } from '../../Helpers';
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
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

      const embed = new MessageEmbed()
        .setAuthor('Come Watch Together!')
        .setTitle(Title)
        .setURL(imdbSearch)
        .setThumbnail(`https:${Poster}`)
        .setDescription(Plot)
        .addFields(
          { name: 'Released', value: Released, inline: true },
          { name: 'Genre', value: Genre, inline: true },
          { name: 'Length', value: Runtime, inline: true },
        )
        .setFooter('This will be Deleted in 5 Minutes');

      const buttonRow = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId(`invite`)
          .setStyle('SUCCESS')
          .setLabel('Send Invite'),
        new MessageButton()
          .setCustomId(`delete-watch`)
          .setStyle('DANGER')
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
