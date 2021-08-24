import Spotify from 'node-spotify-api';
import { MessageHelpers } from '..';
import { SPOTIFY_ID, SPOTIFY_SECRET } from '../../config.json';
import { SpotifyPlaylist } from '../../global';
import { SpotifyHelperProps } from './SpotifyMatch';

const SearchPlaylist = async ({
  searchId,
  message,
}: SpotifyHelperProps): Promise<SpotifyPlaylist> => {
  const spotify = new Spotify({ id: SPOTIFY_ID, secret: SPOTIFY_SECRET });

  const playlist = await spotify
    .request(`https://api.spotify.com/v1/playlists/${searchId}`)
    .then((data: SpotifyPlaylist) => data)
    .catch(() => {
      message.channel
        .send('No results found from given Spotify link.')
        .then(
          async (message) =>
            await MessageHelpers.DeleteMessage({ message, timeout: 3000 }),
        );
    });

  return playlist;
};

export default SearchPlaylist;
