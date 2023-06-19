import { Command } from '../../Interfaces';
import { getTitleDetailsByUrl } from 'movier';
import {
  CreateMovieCollector,
  MovieDateCollector,
  MovieTimeCollector,
} from '../../Collectors';
import { CreateMovieNight } from '../../Helpers';

const mmDdYyyyRegex = /[01]?[0-9][-/][0-3]?[0-9][-/]\d{4}/gim;
const timeRegex = /^\b(0?\d|1[0-2]):[0-5]\d(\s)?([AaPp][Mm]$)/gim;
type StringUndefined = string | undefined;

export const command: Command = {
  name: 'movienight',
  aliases: ['movie'],
  description: 'Creates movie night event with IMDB Link.',
  run: async (_client, message, [imdbLink, ...rest]) => {
    if (!imdbLink) return;
    let userDate: StringUndefined, userTime: StringUndefined;

    rest.forEach((arg) => {
      if (mmDdYyyyRegex.test(arg)) {
        userDate = arg;
      }

      if (timeRegex.test(arg)) {
        userTime = arg;
      }
    });

    try {
      const {
        name,
        plot,
        mainRate: { rate, votesCount },
        runtime: { title: totalRunTime },
        ageCategoryTitle,
        dates: { titleYear },
        posterImage: { url: posterUrl },
        casts,
      } = await getTitleDetailsByUrl(imdbLink);

      const movieObject = {
        name,
        plot,
        rate,
        votesCount: votesCount.toLocaleString('en-US'),
        totalRunTime,
        ageCategoryTitle,
        titleYear,
        posterUrl,
        imdbLink,
        casts: casts
          .slice(0, 3)
          .map(({ name }) => name)
          .join(', '),
      };

      if ((!userTime && userDate) || !Boolean(rest.length)) {
        return await message
          .reply('No time given, what time do you want the event to start?')
          .then((sentMessage) =>
            MovieTimeCollector({
              movieObject,
              originalMessage: message,
              sentMessage,
              userDate,
            }),
          );
      } else if (!userDate && userTime) {
        return await message
          .reply(
            'No date given, what day do you want the event to start? \nMM/DD/YYYY format please.',
          )
          .then((sentMessage) =>
            MovieDateCollector({
              movieObject,
              originalMessage: message,
              sentMessage,
              userTime,
            }),
          );
      } else if (userDate && userTime) {
        const { embed, actionRow } = CreateMovieNight({
          movieObject,
          userDate,
          userTime,
        });

        await message.channel
          .send({
            embeds: [embed],
            components: [actionRow],
          })
          .then((sentMessage) =>
            CreateMovieCollector({
              sentMessage,
              originalMessage: message,
              movieObject,
              userDate,
              userTime,
            }),
          );
        return;
      }
    } catch {
      return await message.channel.send('Problem searching IMDb.');
    }
  },
};
