import { EmbedBuilder, EmbedData } from 'discord.js';
import { Command } from '../../Interfaces';
import { HowLongToBeatService } from 'howlongtobeat';

export const command: Command = {
  name: 'howlongtobeat',
  aliases: ['hltb'],
  description: 'Searches How Long to Beat for game times.',
  run: async (_client, message, game) => {
    if (!game) return;

    const hltbService = new HowLongToBeatService();

    try {
      const [result] = await hltbService.search(game.join(' '));

      if (!result) return await message.reply('Unable to find game.');

      const { name, imageUrl, timeLabels } = result;

      const embedData: EmbedData = {
        title: name,
        color: 53380,
        thumbnail: {
          url: `https://howlongtobeat.com${imageUrl}`,
        },
      };

      const embed = new EmbedBuilder(embedData);

      for (const [key, phrase] of timeLabels) {
        if (result[key] > 0) {
          embed.addFields({
            name: phrase,
            value: `${result[key]} hours`,
            inline: true,
          });
        }
      }
      await message.channel.send({ embeds: [embed] });
    } catch (error) {
      return await message.reply('Problem searching game.');
    }
  },
};
