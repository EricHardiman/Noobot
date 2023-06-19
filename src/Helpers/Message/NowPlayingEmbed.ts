import { EmbedBuilder } from 'discord.js';
import { VolcanoTrack } from '../../global';

const NowPlayingEmbed = (
  track: VolcanoTrack,
  additionalFooter?: string,
): EmbedBuilder => {
  const {
    info: { title, uri, identifier },
  } = track;

  const embed = new EmbedBuilder()
    .setAuthor({ name: 'Now Playing' })
    .setTitle(title)
    .setURL(uri)
    .setThumbnail(`https://i.ytimg.com/vi/${identifier}/hqdefault.jpg`)
    .setColor('Blurple');

  additionalFooter && embed.setFooter({ text: additionalFooter });

  return embed;
};
export default NowPlayingEmbed;
