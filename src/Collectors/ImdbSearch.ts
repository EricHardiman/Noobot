import { Message } from 'discord.js';
import { Manager } from 'lavacord';
import { VolcanoTrack } from '../global';
import { DeleteMessage, Play } from '../Helpers';
import { IFoundedTitleDetails } from 'movier';

const ImdbSearchCollector = ({
  sentMessage,
  originalMessage,
  movies,
}: SongSearchProps) => {
  const collector = sentMessage.channel.createMessageComponentCollector({
    filter: (i) => i.user.id === originalMessage.author.id,
    time: 15000,
  });

  collector.on('collect', async (i) => {
    const [, movieIndex] = i.customId.split('-');
    const selectedMovie = movies[movieIndex] as IFoundedTitleDetails;

    originalMessage.channel.send(selectedMovie.url);
    return collector.stop('stop');
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

interface SongSearchProps {
  sentMessage: Message;
  originalMessage: Message;
  movies: IFoundedTitleDetails[];
}

export default ImdbSearchCollector;
