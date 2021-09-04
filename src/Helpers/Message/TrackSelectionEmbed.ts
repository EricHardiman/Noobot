import { EmbedField } from 'discord.js';
import { ConvertSecondsToString } from '..';
import { VolcanoTrack } from '../../global';

const TrackSelectionEmbed = (
  { info: { title, length, author, uri } }: VolcanoTrack,
  index: number,
): EmbedField => {
  const name = `${index + 1}.  ${title}`;
  const convertedDuration = ConvertSecondsToString(length / 1000);
  const value = `${author} - ${convertedDuration} - [Link](${uri})`;

  return { name, value, inline: false };
};

export default TrackSelectionEmbed;
