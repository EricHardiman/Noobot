import {
  EmbedField,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from 'discord.js';
import { GetGameTitle } from '../../Helpers/Fetch';
import { Command } from '../../Interfaces';
import { AnyDealCollector } from '../../Collectors';
import { AnyDealGame } from '../../global';
import { MessageHelpers } from '../../Helpers';

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
          await MessageHelpers.DeleteMessage({
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

    const buttonRow = new MessageActionRow();
    for (const index in returnedGames) {
      buttonRow.addComponents(
        new MessageButton()
          .setCustomId(`anydeal-${index}`)
          .setStyle('PRIMARY')
          .setLabel(`Game ${parseInt(index) + 1}`),
      );
    }
    const gameList = new MessageEmbed({
      fields,
      color: 'DARK_ORANGE',
    });

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
