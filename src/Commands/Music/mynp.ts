import { MessageEmbed } from 'discord.js';
import { MessageHelpers, MusicHelpers } from '../../Helpers';
import { Command } from '../../Interfaces';

export const command: Command = {
  name: 'mynp',
  description: 'Posts which song currently playing on Spotify.',
  run: async (client, message, args) => {
    const { player } = client;
    await MessageHelpers.DeleteMessage({ message });
    const taggedUser = args
      .join('')
      .match(/(?<=<@!)(.*)(?=\>)/g)
      ?.join('');

    const foundUser = message.guild?.members.cache.get(
      taggedUser ?? message.author.id,
    )!;

    const { presence, displayName, displayColor } = foundUser;

    const userPresence = presence?.activities.find(
      (activity) => activity.name === 'Spotify',
    )!;

    if (!userPresence) return;

    const [song] = (
      await player.search(`${userPresence.details} ${userPresence.state}`, {
        requestedBy: message.author,
      })
    ).tracks;

    const embed = new MessageEmbed()
      .setAuthor(`${displayName}'s Spotify is Currently Playing`)
      .setColor(displayColor)
      .setTitle(song.title)
      .setURL(song.url)
      .setThumbnail(song.thumbnail);

    return await message.channel.send({ embeds: [embed] });
  },
};
