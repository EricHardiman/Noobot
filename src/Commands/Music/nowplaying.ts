import { Player } from 'lavacord';
import { IQueue } from '../../Database/Queue';
import {
  ConvertSecondsToString,
  DeleteMessage,
  FindCreateQueue,
  NowPlayingEmbed,
  RetrievePlayer,
} from '../../Helpers';
import { Command } from '../../Interfaces';

export const command: Command = {
  name: 'nowplaying',
  description: 'Pauses whatever is playing.',
  aliases: ['np'],
  run: async (client, message) => {
    const { manager } = client;
    const queue = await FindCreateQueue(message.guildId!);
    const isPlaying = queue && queue.current;

    if (isPlaying) {
      const player = RetrievePlayer(manager, message);
      const embed = NowPlayingEmbed(queue.current);

      embed.setDescription(handlePlayingBar(queue, player!));

      return await message.channel
        .send({ embeds: [embed] })
        .then(
          async (message) => await DeleteMessage({ message, timeout: 10000 }),
        );
    }
    return message.channel
      .send('Nothing playing at the moment.')
      .then((message) => DeleteMessage({ message, timeout: 5000 }));
  },
};

const handlePlayingBar = (queue: IQueue, player: Player): string => {
  const twentyDashes = '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬';
  const secondsPassed = player.state.position! / 1000;
  const currentSongDuration = queue.current.info.length / 1000;

  const playingDotIndex = Math.floor(
    secondsPassed / currentSongDuration / 0.05,
  );
  const playingBar =
    twentyDashes.slice(0, playingDotIndex) +
    '🔵' +
    twentyDashes.slice(playingDotIndex, 19);

  return `${playingBar} ${ConvertSecondsToString(
    Math.floor(secondsPassed),
  )} /${ConvertSecondsToString(currentSongDuration)}`;
};
