import { Message, EmbedBuilder } from 'discord.js';
import { AnyDealGame } from '../global';
import { DeleteMessage, GetGamePrice } from '../Helpers';

const AnyDealCollector = ({
  sentMessage,
  originalMessage,
  games,
}: AnyDealProps) => {
  const collector = sentMessage.channel.createMessageComponentCollector({
    filter: (i) => i.user.id === originalMessage.author.id,
    time: 20000,
  });

  collector.on('collect', async (i) => {
    const [, gameIndex] = i.customId.split('-');
    const selectedGame: AnyDealGame = games[gameIndex];
    const gamePrices = await GetGamePrice(selectedGame.plain);

    const gamePricesEmbed = new EmbedBuilder({
      title: selectedGame.title,
      fields: gamePrices.map(({ price_new, url, shop: { name } }) => ({
        name: `Price: $${price_new}`,
        inline: false,
        value: `Purchase from [${name}](${url})`,
      })),
    });

    await i.update({
      components: [],
      embeds: [gamePricesEmbed],
    });
  });

  collector.on('end', async () => {
    await DeleteMessage({
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
