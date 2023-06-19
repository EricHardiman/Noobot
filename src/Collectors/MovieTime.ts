import { Message, MessageCollector } from 'discord.js';
import { DeleteMessage } from '../Helpers';
import CreateMovieNight, {
  MovieObject,
} from '../Helpers/Message/CreateMovieNight';
import MovieDateCollector from './MovieDate';

const timeRegex = /^\b(0?\d|1[0-2]):[0-5]\d(\s)?([AaPp][Mm]$)/gim;

const MovieTimeCollector = ({
  sentMessage,
  originalMessage,
  userDate,
  movieObject,
}: MovieTimeProps) => {
  const collector = sentMessage.channel.createMessageCollector({
    filter: (i) => i.author.id === originalMessage.author.id,
    time: 15000,
  });

  collector.on('collect', async (message) => {
    const userTime = message.content;

    if (timeRegex.test(userTime)) {
      if (userDate) {
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
        return;
      } else {
        collector.stop('stop');
        await message
          .reply('No date given. What day do you want the event to start?')
          .then(() =>
            MovieDateCollector({
              sentMessage,
              originalMessage,
              userTime,
              movieObject,
            }),
          );
        return;
      }
    } else {
      collector.stop('stop');

      await message
        .reply(
          'Invalid time. Try something like `10:30pm`.\n\nNo time given, what time do you want the event to start?',
        )
        .then(() =>
          MovieTimeCollector({
            sentMessage,
            originalMessage,
            userDate,
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

interface MovieTimeProps {
  sentMessage: Message;
  originalMessage: Message;
  userDate?: string;
  movieObject: MovieObject;
  messageCollector?: MessageCollector;
}

export default MovieTimeCollector;
