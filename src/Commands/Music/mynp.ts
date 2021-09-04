import { MessageEmbed } from 'discord.js';
import { DeleteMessage, SongFromPresence } from '../../Helpers';
import { Command } from '../../Interfaces';

export const command: Command = {
  name: 'mynp',
  description: 'Posts which song currently playing on Spotify.',
  run: async (client, message, args) => {
    const { manager } = client;
    await DeleteMessage({ message });

    const songAndUser = await SongFromPresence({
      args,
      message,
      manager,
    });

    if (songAndUser) {
      const {
        foundUser: { displayColor, displayName },
        song,
      } = songAndUser;

      const embed = new MessageEmbed()
        .setAuthor(`${displayName}'s Spotify is Currently Playing`)
        .setColor(displayColor)
        .setTitle(song.info.title)
        .setURL(song.info.uri);

      return await message.channel.send({ embeds: [embed] });
    }
  },
};
