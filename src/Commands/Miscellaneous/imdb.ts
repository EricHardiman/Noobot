import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from 'discord.js';
import { Command } from '../../Interfaces';
import { searchTitleByName } from 'movier';
import { MovieSelectionEmbed } from '../../Helpers';
import { ImdbSearchCollector } from '../../Collectors';

export const command: Command = {
  name: 'imdb',
  description: 'Search IMDB by name.',
  run: async (_client, message, args) => {
    if (!args) return;

    const imdbSearch = args.join(' ');

    try {
      const movies = (await searchTitleByName(imdbSearch)).slice(0, 5);
      const embed = new EmbedBuilder({
        title: 'Which movie?',
        fields: movies.map(MovieSelectionEmbed),
      }).setColor('Blurple');

      const buttonRow = new ActionRowBuilder<ButtonBuilder>();
      for (const index in movies) {
        buttonRow.addComponents(
          new ButtonBuilder()
            .setCustomId(`movie-${index}`)
            .setStyle(ButtonStyle.Primary)
            .setLabel(`${parseInt(index) + 1}`),
        );
      }

      return await message.channel
        .send({
          embeds: [embed],
          components: [buttonRow],
        })
        .then((sentMessage) =>
          ImdbSearchCollector({
            originalMessage: message,
            sentMessage,
            movies,
          }),
        );
    } catch {
      return await message.channel.send('Problem searching IMDb.');
    }
  },
};
