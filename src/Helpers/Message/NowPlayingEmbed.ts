import { MessageEmbed } from 'discord.js';
import { VolcanoTrack } from '../../global';

const NowPlayingEmbed = (
  track: VolcanoTrack,
  additionalFooter?: string,
): MessageEmbed => {
  const {
    info: { title, uri },
  } = track;

  const embed = new MessageEmbed()
    .setAuthor('Now Playing')
    .setColor('BLURPLE')
    .setTitle(title)
    .setURL(uri);

  additionalFooter && embed.setFooter(additionalFooter);

  return embed;
};
export default NowPlayingEmbed;
