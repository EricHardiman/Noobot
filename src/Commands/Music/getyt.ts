import { DeleteMessage, SongSearch, SpotifyMatch } from '../../Helpers';
import { Command } from '../../Interfaces';

export const command: Command = {
  name: 'getyt',
  description: 'Retrieves YouTube link from Single Spotify Song URL.',
  aliases: ['yt', 'gyt'],
  run: async (client, message, args) => {
    const { manager } = client;
    const search = args.join('');

    if (!search) return;

    const spotifyMatch = search.match(/(?<=open.spotify.com\/)(.*)(?=\?)/g);

    const [searchType, searchId] = spotifyMatch!.toString().split('/');
    const spotifyReturn = await SpotifyMatch({ message, searchId, searchType });

    if (!Array.isArray(spotifyReturn)) {
      const {
        tracks: [song],
      } = await SongSearch({ manager, search: spotifyReturn });

      return await message.channel.send(song.info.uri).then(() => {
        DeleteMessage({ message, timeout: 1000 });
      });
    }

    return message.channel.send('Needs to be a single Spotify Track link.');
  },
};
