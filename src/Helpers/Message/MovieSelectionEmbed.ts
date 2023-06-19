import { EmbedField } from 'discord.js';
import { IFoundedTitleDetails } from 'movier';

const MovieSelectionEmbed = (
  { name: title, titleYear, url }: IFoundedTitleDetails,
  index: number,
): EmbedField => {
  const name = ``;
  const value = `${index + 1}.  [${title} (${`${titleYear}`})](${url})`;

  return { name, value, inline: false };
};

export default MovieSelectionEmbed;
