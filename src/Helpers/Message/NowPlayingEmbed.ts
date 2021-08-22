import { Track } from 'discord-player';
import { MessageEmbed } from 'discord.js';

const NowPlayingEmbed = (track: Track): MessageEmbed => {
  const {
    title,
    url,
    thumbnail,
    requestedBy: { id, avatar, username },
  } = track;

  const embed = new MessageEmbed()
    .setAuthor('Now Playing')
    .setColor('BLURPLE')
    .setTitle(title)
    .setURL(url)
    .setThumbnail(thumbnail)
    .setFooter(
      `Requested by ${username}`,
      `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`,
    );

  return embed;
};
export default NowPlayingEmbed;
