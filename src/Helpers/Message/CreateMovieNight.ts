import { EmbedBuilder } from '@discordjs/builders';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
} from 'discord.js';

interface Props {
  movieObject: MovieObject;
  userDate: string;
  userTime: string;
}

const CreateMovieNight = ({
  movieObject,
  userDate,
  userTime,
}: Props): {
  embed: EmbedBuilder;
  actionRow: ActionRowBuilder<ButtonBuilder>;
} => {
  const {
    name,
    posterUrl,
    imdbLink,
    titleYear,
    plot,
    rate,
    votesCount,
    totalRunTime,
    ageCategoryTitle,
    casts,
  } = movieObject;

  const embed = new EmbedBuilder()
    .setAuthor({ name: `Movie Night for ${userDate} at ${userTime}` })
    .setTitle(name)
    .setDescription(plot)
    .setFields([
      { name: 'Starring', value: casts },
      { name: `Rating`, value: `${rate}/10 from ${votesCount} votes` },
      { name: 'Age Rating', value: ageCategoryTitle },
      { name: 'Runtime', value: totalRunTime },
      { name: 'Release Year', value: `${titleYear}` },
    ])
    .setURL(imdbLink)
    .setColor(Colors.Blurple)
    .setImage(posterUrl);

  const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`confirm-movie`)
      .setStyle(ButtonStyle.Success)
      .setLabel('Confirm'),
    new ButtonBuilder()
      .setCustomId(`cancel-movie`)
      .setStyle(ButtonStyle.Danger)
      .setLabel('Cancel'),
  );

  return { embed, actionRow };
};

export interface MovieObject {
  name: string;
  rate: number;
  plot: string;
  votesCount: string;
  totalRunTime: string;
  ageCategoryTitle: string;
  titleYear: number;
  posterUrl: string;
  imdbLink: string;
  casts: string;
}

export default CreateMovieNight;
