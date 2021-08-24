import { Message } from 'discord.js';
import { Track, Player } from 'discord-player';
import { MessageHelpers, PlayerHelpers } from '..';

const PlayHelper = async ({ message, player, song, songs }: PlayProps) => {
  const queue = PlayerHelpers.RetrieveQueue({
    guild: message.member?.guild!,
    player,
  });

  player.once('trackStart', async (_, track) => {
    const embed = MessageHelpers.NowPlayingEmbed(track);

    await message.channel
      .send({ embeds: [embed], isInteraction: false })
      .then((message) =>
        MessageHelpers.DeleteMessage({ message, timeout: 5000 }),
      );

    return player.removeAllListeners('trackStart');
  });

  player.once('tracksAdd', async (_, tracks) => {
    await message.channel
      .send({
        content: `Added ${tracks.length} to the Queue!`,
        isInteraction: false,
      })
      .then((message) =>
        MessageHelpers.DeleteMessage({ message, timeout: 5000 }),
      );

    return player.removeAllListeners('tracksAdd');
  });

  player.once('trackAdd', async (_, track) => {
    await message.channel
      .send({
        content: `Added ${track.title} to the Queue!`,
        isInteraction: false,
      })
      .then((message) =>
        MessageHelpers.DeleteMessage({ message, timeout: 5000 }),
      );

    return player.removeAllListeners('trackAdd');
  });

  if (song) queue.addTrack(song);
  if (songs?.length) queue.addTracks(songs);

  const playerIsConnected = queue && queue.connection;

  if (!playerIsConnected) {
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
  }
};

interface PlayProps {
  message: Message;
  song?: Track;
  songs?: Track[];
  player: Player;
}

export default PlayHelper;
