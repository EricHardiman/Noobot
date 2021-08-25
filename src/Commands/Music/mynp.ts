import { MONGOOSE_URL } from '../../config.json';
import { MessageEmbed } from 'discord.js';
import { DatabaseHelpers, MessageHelpers, SpotifyHelpers } from '../../Helpers';
import { Command } from '../../Interfaces';

export const command: Command = {
  name: 'mynp',
  description: 'Posts which song currently playing on Spotify.',
  run: async (client, message, args) => {
    const { player } = client;
    await MessageHelpers.DeleteMessage({ message });
    const spotifyLink = await DatabaseHelpers.RetrieveSpotifyLink(
      message.author.id,
    );

    if (spotifyLink) {
      await SpotifyHelpers.GetSpotifyUser(spotifyLink);
    }

    const songAndUser = await SpotifyHelpers.SongFromPresence({
      args,
      message,
      player,
    });

    if (songAndUser) {
      const {
        foundUser: { displayColor, displayName },
        song,
      } = songAndUser;

      const embed = new MessageEmbed()
        .setAuthor(`${displayName}'s Spotify is Currently Playing`)
        .setColor(displayColor)
        .setTitle(song.title)
        .setURL(song.url)
        .setThumbnail(song.thumbnail);

      return await message.channel.send({ embeds: [embed] });
    }
  },
};
