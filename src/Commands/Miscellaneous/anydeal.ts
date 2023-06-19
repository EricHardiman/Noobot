import {
  EmbedField,
  ButtonBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonStyle,
} from 'discord.js';
import { GetGameTitle, DeleteMessage } from '../../Helpers';
import { Command } from '../../Interfaces';
import { AnyDealCollector } from '../../Collectors';
import { AnyDealGame } from '../../global';

export const command: Command = {
  name: 'anydeal',
  aliases: ['deal', 'any', 'ad'],
  description: 'Finds the cheapest price for a game.',
  run: async (_client, message, args) => {
    if (!args) return;

    const gameTitle = args.join(' ');
    const returnedGames: AnyDealGame[] = await GetGameTitle(gameTitle);

    if (!returnedGames.length)
      return await message.channel.send(`No results for ${gameTitle}.`).then(
        async (noResult) =>
          await DeleteMessage({
            messages: [message, noResult],
            timeout: 5000,
          }),
      );

    const fields: EmbedField[] = returnedGames.map(
      ({ title, price_new, shop: { name }, urls: { buy } }, index) => ({
        name: `${index + 1}.  ${title}`,
        value: `Currently [$${price_new} on ${name}](${buy})`,
        inline: false,
      }),
    );

    const buttonRow = new ActionRowBuilder<ButtonBuilder>();
    for (const index in returnedGames) {
      buttonRow.addComponents(
        new ButtonBuilder()
          .setCustomId(`anydeal-${index}`)
          .setStyle(ButtonStyle.Primary)
          .setLabel(`Game ${parseInt(index) + 1}`),
      );
    }
    const gameList = new EmbedBuilder({
      fields,
    }).setColor('DarkOrange');

    return await message.channel
      .send({
        components: [buttonRow],
        embeds: [gameList],
      })
      .then((sentMessage) =>
        AnyDealCollector({
          games: returnedGames,
          sentMessage,
          originalMessage: message,
        }),
      );
  },
};
