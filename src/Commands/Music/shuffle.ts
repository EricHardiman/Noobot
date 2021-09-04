import { ShuffleTracks } from '../../Helpers';
import { Command } from '../../Interfaces';

export const command: Command = {
  name: 'shuffle',
  description: 'Shuffles the queue',
  run: async (_client, message) => {
    return await ShuffleTracks({ message });
  },
};
