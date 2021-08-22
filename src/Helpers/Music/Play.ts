import { Message } from 'discord.js';
import { Track, Player } from 'discord-player';
import { MessageHelpers, PlayerHelpers } from '..';

const PlayHelper = async ({ message, player, song }: PlayProps) => {
  player.removeAllListeners('trackStart');
  const queue = PlayerHelpers.RetrieveQueue({
    guild: message.member?.guild!,
    player,
  });
  const isConnected = queue && queue.connection;

  player.once('trackStart', (_, track) => {
    const embed = MessageHelpers.NowPlayingEmbed(track);

    return message.channel
      .send({ embeds: [embed] })
      .then((message) =>
        MessageHelpers.DeleteMessage({ message, timeout: 5000 }),
      );
  });

  queue.addTrack(song);

  if (!isConnected) {
    await PlayerHelpers.JoinServer({ message, queue });
    try {
      queue.setVolume(80);
      queue.tracks.length && (await queue.play());
    } catch {
      await message.channel
        .send({
          content: 'Could not join your voice channel!',
          isInteraction: false,
        })
        .then((message) =>
          MessageHelpers.DeleteMessage({ message, timeout: 3000 }),
        );
    }
  } else {
    await message.channel
      .send({ content: `Added ${song.title} to Queue!`, isInteraction: false })
      .then((message) =>
        MessageHelpers.DeleteMessage({ message, timeout: 3000 }),
      );
  }
};

interface PlayProps {
  message: Message;
  song: Track;
  player: Player;
}

export default PlayHelper;
