import { Queue } from 'discord-player';
import { MathHelpers, MessageHelpers } from '../../Helpers';
import { Command } from '../../Interfaces';

export const command: Command = {
  name: 'nowplaying',
  description: 'Pauses whatever is playing.',
  aliases: ['np'],
  run: async (client, message) => {
    const queue = client.player.getQueue(message.guildId!);
    const isPlaying = queue && queue.playing;

    if (isPlaying) {
      const embed = MessageHelpers.NowPlayingEmbed(queue.current);
      embed.setDescription(handlePlayingBar(queue));

      return await message.channel
        .send({ embeds: [embed] })
        .then(
          async (message) =>
            await MessageHelpers.DeleteMessage({ message, timeout: 10000 }),
        );
    }

    return;
  },
};

const handlePlayingBar = (queue: Queue): string => {
  const twentyDashes = '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬';
  const secondsPassed =
    queue.connection.audioPlayer.state['playbackDuration'] / 1000;
  const currentSongDuration = queue.current.durationMS / 1000;

  const playingDotIndex = Math.floor(
    secondsPassed / currentSongDuration / 0.05,
  );
  const playingBar =
    twentyDashes.slice(0, playingDotIndex) +
    '🔵' +
    twentyDashes.slice(playingDotIndex, 19);

  return `${playingBar} ${MathHelpers.ConvertSecondsToString(
    Math.floor(secondsPassed),
  )} /${MathHelpers.ConvertSecondsToString(currentSongDuration)}`;
};
