import { Message } from 'discord.js';
import { DeleteMessage, FindCreateQueue, NowPlayingEmbed } from '..';

const NowPlaying = async (message: Message) => {
  const queue = await FindCreateQueue(message.guildId!);
  const embed = NowPlayingEmbed(queue.current);

  return await message.channel
    .send({ embeds: [embed], isInteraction: false })
    .then(async (message) => await DeleteMessage({ message, timeout: 5000 }));
};

export default NowPlaying;
