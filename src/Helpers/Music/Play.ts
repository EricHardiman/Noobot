import { Message } from 'discord.js';
import { Manager } from 'lavacord';
import { NowPlaying, RetrievePlayer } from '.';
import { VolcanoTrack } from '../../global';
import {
  FindCreateQueue,
  JoinVoice,
  AddTrack,
  AddTracks,
  PlayNext,
  ClearQueue,
} from '..';

const PlayHelper = async ({ message, manager, song, songs }: PlayProps) => {
  const existingPlayer = RetrievePlayer(manager, message);
  const player = existingPlayer ?? (await JoinVoice(manager, message));

  if (song) await AddTrack({ song, message });
  if (songs) await AddTracks({ songs, message });

  if (!player.playing) {
    const queue = await FindCreateQueue(message.guildId!);

    await player.volume(80);
    await player.play(queue.current.track);

    player.on('start', async () => {
      return await NowPlaying(message);
    });

    player.on('end', async ({ reason }) => {
      if (reason === 'REPLACED') return;

      const nextTrack = await PlayNext({ message, manager });

      if (nextTrack) {
        return await player.play(nextTrack.track);
      } else {
        await manager.leave(message.guildId!);
        return await ClearQueue(message.guildId!);
      }
    });
  }

  return;
};

interface PlayProps {
  message: Message;
  song?: VolcanoTrack;
  songs?: VolcanoTrack[];
  manager: Manager;
}

export default PlayHelper;
