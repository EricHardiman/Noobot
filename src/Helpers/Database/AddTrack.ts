import Queue from '../../Database/Queue';
import { VolcanoTrack } from '../../global';
import { Message } from 'discord.js';
import { FindCreateQueue } from '.';
import { DeleteMessage } from '..';

const AddTrack = async ({ message, song }: AddTrackProps): Promise<void> => {
  const queue = await FindCreateQueue(message.guildId!);

  if (queue.current) {
    await Queue.updateOne(
      { guildId: message.guildId! },
      { tracks: [...queue.tracks, song] },
    );
  } else {
    await Queue.updateOne({ guildId: message.guildId! }, { current: song });
  }

  return await message.channel
    .send(`Added ${song.info.title} to Queue!`)
    .then((newMessage) =>
      DeleteMessage({
        messages: [newMessage, message],
        timeout: 3000,
      }),
    );
};

interface AddTrackProps {
  song: VolcanoTrack;
  message: Message;
}

export default AddTrack;
