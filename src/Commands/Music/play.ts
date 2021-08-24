import { MusicHelpers } from '../../Helpers';
import PlaySpotify from '../../Helpers/Spotify/PlaySpotify';
import { Command } from '../../Interfaces';

export const command: Command = {
  name: 'play',
  description: 'Plays a song',
  run: async (client, message, args) => {
    const { player } = client;

    // Initial search sent by Discord User
    const songSearch = args.join('');

    if (!songSearch) return;

    // If RegEx expression matches that a Spotify URL was sent, PlaySpotify handles the rest
    const spotifyMatch = songSearch.match(/(?<=open.spotify.com\/)(.*)(?=\?)/g);
    if (spotifyMatch) return PlaySpotify({ spotifyMatch, player, message });

    // Otherwise, search YouTube, get first index of tracks array, and play it
    const [song] = (
      await player.search(songSearch, { requestedBy: message.author })
    ).tracks;

    return await MusicHelpers.Play({ message, player, song });
  },
};
