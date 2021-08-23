import { MessageHelpers, MusicHelpers } from '../../Helpers';
import { Command } from '../../Interfaces';

export const command: Command = {
  name: 'play',
  description: 'Plays a song',
  run: async (client, message, args) => {
    const { player } = client;
    const songSearch = args.join('');

    if (!songSearch) return;

    const [song] = (
      await player.search(songSearch, { requestedBy: message.author })
    ).tracks;

    await MusicHelpers.Play({ message, player, song });
  },
};
