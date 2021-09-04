import Mongoose from 'mongoose';
import Queue from '../../Database/Queue';
import { MONGOOSE_URL } from '../../config.json';
import { VolcanoTrack } from '../../global';
import { Message } from 'discord.js';
import { FindCreateQueue } from '.';
import { DeleteMessage } from '..';

const AddTrack = async ({ message, song }: AddTrackProps): Promise<void> => {
  const queue = await FindCreateQueue(message.guildId!);
  const mongoose = await Mongoose.connect(MONGOOSE_URL);

  if (queue.current) {
    await Queue.updateOne(
      { guildId: message.guildId! },
      { tracks: [...queue.tracks, song] },
    );
  } else {
    await Queue.updateOne({ guildId: message.guildId! }, { current: song });
  }

  await message.channel
    .send(`Added ${song.info.title} to Queue!`)
    .then((message) => DeleteMessage({ message, timeout: 3000 }));

  return await mongoose.connection.close();
};

interface AddTrackProps {
  song: VolcanoTrack;
  message: Message;
}

export default AddTrack;
