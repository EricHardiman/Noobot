import { Track } from 'discord-player';
import { EmbedField } from 'discord.js';
import { MathHelpers } from '..';

const TrackSelectionEmbed = (
  { title, author, durationMS, url }: Track,
  index: number,
): EmbedField => {
  const name = `${index + 1}.  ${title}`;
  const convertedDuration = MathHelpers.ConvertSecondsToString(
    durationMS / 1000,
  );
  const value = `${author} - ${convertedDuration} - [Link](${url})`;

  return { name, value, inline: false };
};

export default TrackSelectionEmbed;
