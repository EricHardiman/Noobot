import { Message } from 'discord.js';
import { Manager } from 'lavacord';
import { FindCreateQueue } from '.';
import { DeleteMessage } from '..';
import Queue from '../../Database/Queue';

const ShuffleTracks = async ({ message }: ShuffleTracksProps) => {
  const { tracks } = await FindCreateQueue(message.guildId!);

  if (tracks.length >= 2) {
    let currentIndex = tracks.length,
      randomIndex: number;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [tracks[currentIndex], tracks[randomIndex]] = [
        tracks[randomIndex],
        tracks[currentIndex],
      ];
    }

    await Queue.updateOne({ guildId: message.guildId! }, { tracks });

    return await message.channel
      .send('Successfully shuffled Queue!')
      .then((message) => DeleteMessage({ message, timeout: 3000 }));
  } else {
    return await message.channel
      .send('Not enough songs in Queue to Shuffle.')
      .then((message) => DeleteMessage({ message, timeout: 3000 }));
  }
};

interface ShuffleTracksProps {
  message: Message;
}

export default ShuffleTracks;
