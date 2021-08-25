import { MessageHelpers, MusicHelpers } from '../../Helpers';
import SongFromPresence from '../../Helpers/Spotify/SongFromPresence';
import { Command } from '../../Interfaces';

export const command: Command = {
  name: 'playnp',
  description: 'Plays song currently being listened to by you/tagged user',
  run: async (client, message, args) => {
    const { player } = client;
    await MessageHelpers.DeleteMessage({ message });

    const songAndUser = await SongFromPresence({
      args,
      message,
      player,
    });

    if (songAndUser) {
      const { song } = songAndUser;

      return MusicHelpers.Play({ message, player, song });
    }
  },
};
