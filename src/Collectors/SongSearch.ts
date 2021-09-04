import { ButtonInteraction, Message } from 'discord.js';
import { Manager } from 'lavacord';
import { VolcanoTrack } from '../global';
import { DeleteMessage, Play } from '../Helpers';

const SongSearchCollector = ({
  sentMessage,
  originalMessage,
  songs,
  manager,
}: SongSearchProps) => {
  const filter = (i: ButtonInteraction) =>
    i.user.id === originalMessage.author.id;

  const collector = sentMessage.channel.createMessageComponentCollector({
    filter,
    time: 15000,
  });

  collector.on('collect', async (i) => {
    const [, songIndex] = i.customId.split('-');
    const selectedSong = songs[songIndex];

    await Play({
      message: originalMessage,
      manager,
      song: selectedSong,
    });

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
  songs: VolcanoTrack[];
  manager: Manager;
}

export default SongSearchCollector;
