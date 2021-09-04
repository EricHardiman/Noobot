import Mongoose from 'mongoose';
import { MONGOOSE_URL } from '../../config.json';
import { Message } from 'discord.js';
import { Manager } from 'lavacord';
import { NowPlaying, RetrievePlayer } from '.';
import { VolcanoTrack } from '../../global';
import { FindCreateQueue, JoinVoice, AddTrack, AddTracks, PlayNext } from '..';

const PlayHelper = async ({ message, manager, song, songs }: PlayProps) => {
  const mongoose = await Mongoose.connect(MONGOOSE_URL);
  const player =
    RetrievePlayer(manager, message) ?? (await JoinVoice(manager, message));

  player.removeAllListeners('start');
  player.removeAllListeners('end');

  player.on('start', async () => {
    return await NowPlaying(message);
  });

  player.on('end', async () => {
    const nextTrack = await PlayNext({ message, manager });

    if (nextTrack) return await player.play(nextTrack.track);
  });

  if (song) await AddTrack({ song, message });
  if (songs) await AddTracks({ songs, message });

  if (!player.playing) {
    const queue = await FindCreateQueue(message.guildId!);

    await player.volume(80);
    await player.play(queue.current.track);
  }

  return mongoose.connection.close();
};

interface PlayProps {
  message: Message;
  song?: VolcanoTrack;
  songs?: VolcanoTrack[];
  manager: Manager;
}

export default PlayHelper;
