import Mongoose from 'mongoose';
import Queue from '../../Database/Queue';
import { MONGOOSE_URL } from '../../config.json';
import { VolcanoTrack } from '../../global';
import { Message } from 'discord.js';
import { FindCreateQueue } from '.';
import { DeleteMessage } from '..';

const AddTracks = async ({ message, songs }: AddTracksProps): Promise<void> => {
  const queue = await FindCreateQueue(message.guildId!);
  const mongoose = await Mongoose.connect(MONGOOSE_URL);

  if (queue.current) {
    await Queue.updateOne(
      { guildId: message.guildId! },
      { tracks: [...queue.tracks, ...songs] },
    );
  } else {
    const [current, ...rest] = songs;
    await Queue.updateOne(
      { guildId: message.guildId! },
      { current, tracks: rest },
    );
  }

  await message.channel
    .send(`Added ${songs.length} Songs to the Queue!`)
    .then((message) => DeleteMessage({ message, timeout: 3000 }));

  return await mongoose.connection.close();
};

interface AddTracksProps {
  songs: VolcanoTrack[];
  message: Message;
}

export default AddTracks;
