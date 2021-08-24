import { ButtonInteraction, Message, MessageEmbed } from 'discord.js';
import { AnyDealGame } from '../global';
import { MessageHelpers } from '../Helpers';
import { GetGamePrice } from '../Helpers/Fetch';

const AnyDealCollector = ({
  sentMessage,
  originalMessage,
  games,
}: AnyDealProps) => {
  const filter = (i: ButtonInteraction) =>
    i.user.id === originalMessage.author.id;

  const collector = sentMessage.channel.createMessageComponentCollector({
    filter,
    time: 20000,
  });

  collector.on('collect', async (i) => {
    const [, gameIndex] = i.customId.split('-');
    const selectedGame: AnyDealGame = games[gameIndex];
    const gamePrices = await GetGamePrice(selectedGame.plain);

    const gamePricesEmbed = new MessageEmbed({
      title: selectedGame.title,
      fields: gamePrices.map(({ price_new, url, shop: { name } }) => ({
        name: `Price: $${price_new}`,
        inline: false,
        value: `Purchase from [${name}](${url})`,
      })),
    });

    return await i.update({
      components: [],
      embeds: [gamePricesEmbed],
    });
  });

  collector.on('end', async () => {
    await MessageHelpers.DeleteMessage({
      messages: [originalMessage, sentMessage],
    });
  });
};

interface AnyDealProps {
  sentMessage: Message;
  originalMessage: Message;
  games: AnyDealGame[];
}

export default AnyDealCollector;
