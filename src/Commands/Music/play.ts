import axios from 'axios';
import { Play, PlaySpotify, SongSearch } from '../../Helpers';
import { Command } from '../../Interfaces';

export const command: Command = {
  name: 'play',
  description: 'Plays a song',
  run: async (client, message, args) => {
    const { manager } = client;

    // Initial search sent by Discord User
    const search = args.join('');

    if (!search) return;

    // If RegEx expression matches that a Spotify URL was sent, PlaySpotify handles the rest
    const spotifyMatch = search.match(/(?<=open.spotify.com\/)(.*)(?=\?)/g);
    if (spotifyMatch) return PlaySpotify({ spotifyMatch, manager, message });

    // Otherwise, search YouTube
    const { tracks, playlist } = await SongSearch({ manager, search });

    if (playlist) {
      return await Play({
        message,
        manager,
        songs: tracks,
      });
    }

    //If non-playlist get first index of tracks array, and play it
    return await Play({ message, manager, song: tracks[0] });
  },
};
