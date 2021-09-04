import {
  DeleteMessage,
  Play,
  RetrievePlayer,
  SongFromPresence,
} from '../../Helpers';
import { Command } from '../../Interfaces';

export const command: Command = {
  name: 'playnp',
  description: 'Plays song currently being listened to by you/tagged user',
  run: async (client, message, args) => {
    const { manager } = client;
    await DeleteMessage({ message });

    const songAndUser = await SongFromPresence({
      args,
      message,
      manager,
    });

    if (songAndUser) {
      const { song } = songAndUser;

      return Play({ message, manager, song });
    }
  },
};
