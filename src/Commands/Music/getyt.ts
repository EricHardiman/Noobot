import { MessageHelpers, PlayerHelpers } from '../../Helpers';
import SpotifyMatch from '../../Helpers/Spotify/SpotifyMatch';
import { Command } from '../../Interfaces';

export const command: Command = {
  name: 'getyt',
  description: 'Retrieves YouTube link from Single Spotify Song URL.',
  aliases: ['yt', 'gyt'],
  run: async (client, message, args) => {
    const { player } = client;
    const songSearch = args.join('');

    if (!songSearch) return;

    const spotifyMatch = songSearch.match(/(?<=open.spotify.com\/)(.*)(?=\?)/g);

    const [searchType, searchId] = spotifyMatch!.toString().split('/');
    const spotifyReturn = await SpotifyMatch({
      message,
      searchId,
      searchType,
    });

    if (!Array.isArray(spotifyReturn)) {
      const [song] = (
        await player.search(spotifyReturn, { requestedBy: message.author })
      ).tracks;

      return await message.channel.send(song.url).then(() => {
        MessageHelpers.DeleteMessage({ message, timeout: 1000 });
      });
    }
  },
};
