import Queue from '../../Database/Queue';
import { VolcanoTrack } from '../../global';
import { Message } from 'discord.js';
import { FindCreateQueue } from '.';
import { DeleteMessage } from '..';

const AddTracks = async ({ message, songs }: AddTracksProps): Promise<void> => {
  const queue = await FindCreateQueue(message.guildId!);

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

  return await message.channel
    .send(`Added ${songs.length} Songs to the Queue!`)
    .then((newMessage) =>
      DeleteMessage({ messages: [newMessage, message], timeout: 3000 }),
    );
};

interface AddTracksProps {
  songs: VolcanoTrack[];
  message: Message;
}

export default AddTracks;
