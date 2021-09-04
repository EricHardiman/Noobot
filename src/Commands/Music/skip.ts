import { NowPlaying, PlayNext, RetrievePlayer } from '../../Helpers';
import { Command } from '../../Interfaces';

export const command: Command = {
  name: 'skip',
  description: 'Skips currently playing song.',
  run: async (client, message) => {
    const { manager } = client;
    const player = RetrievePlayer(manager, message);

    if (player && player.playing) {
      const nextTrack = await PlayNext({ message, manager });

      if (nextTrack) {
        await player.play(nextTrack.track);
        return await NowPlaying(message);
      }

      return;
    }
  },
};
