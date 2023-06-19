import { Message } from 'discord.js';
import { DeleteMessage } from '../Helpers';
import CreateMovieNight, {
  MovieObject,
} from '../Helpers/Message/CreateMovieNight';
import MovieTimeCollector from './MovieTime';

const mmDdYyyyRegex = /[01]?[0-9][-/][0-3]?[0-9][-/]\d{4}/gim;

const MovieDateCollector = ({
  sentMessage,
  originalMessage,
  userTime,
  movieObject,
}: MovieDateProps) => {
  const collector = sentMessage.channel.createMessageCollector({
    filter: (i) => i.author.id === originalMessage.author.id,
    time: 15000,
  });

  collector.on('collect', async (message) => {
    const userDate = message.content;

    if (mmDdYyyyRegex.test(userDate)) {
      if (userTime) {
        const { embed, actionRow } = CreateMovieNight({
          movieObject,
          userDate,
          userTime,
        });

        collector.stop('stop');

        await message.channel.send({
          embeds: [embed],
          components: [actionRow],
        });
      } else {
        message
          .reply('No time given. What time do you want the event to start?')
          .then(() =>
            MovieTimeCollector({
              sentMessage,
              originalMessage,
              userDate,
              movieObject,
            }),
          );
      }
    } else {
      collector.stop('stop');

      await message
        .reply(
          'Invalid date. Try something like `4/1/23`.\n\nNo date given, what day do you want the event to start?',
        )
        .then(() =>
          MovieDateCollector({
            sentMessage,
            originalMessage,
            userTime,
            movieObject,
          }),
        );
    }
    return;
  });

  collector.on('end', async (collection, reason) => {
    if (reason === 'stop') {
      return await DeleteMessage({ message: sentMessage });
    }

    if (![...collection.values()].length)
      return await DeleteMessage({
        messages: [originalMessage, sentMessage],
      });
  });
};

interface MovieDateProps {
  sentMessage: Message;
  originalMessage: Message;
  userTime?: string;
  movieObject: MovieObject;
}

export default MovieDateCollector;
