import { ButtonInteraction, Message } from 'discord.js';
import { Player, Track } from 'discord-player';
import { MessageHelpers, MusicHelpers } from '../Helpers';

const SongSearchCollector = ({
  sentMessage,
  originalMessage,
  songs,
  player,
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

    await MusicHelpers.Play({
      message: originalMessage,
      player,
      song: selectedSong,
    });

    return collector.stop('stop');
  });

  collector.on('end', async (collection, reason) => {
    if (reason === 'stop') {
      return MessageHelpers.DeleteMessage({ message: sentMessage });
    }

    if (![...collection.values()].length)
      return MessageHelpers.DeleteMessage({
        messages: [originalMessage, sentMessage],
      });
  });
};

interface SongSearchProps {
  sentMessage: Message;
  originalMessage: Message;
  songs: Track[];
  player: Player;
}

export default SongSearchCollector;
