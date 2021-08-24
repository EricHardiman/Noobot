import Spotify from 'node-spotify-api';
import { MessageHelpers } from '..';
import { SPOTIFY_ID, SPOTIFY_SECRET } from '../../config.json';
import { SpotifyTrack, SpotifyAlbum } from '../../global';
import { SpotifyHelperProps } from './SpotifyMatch';

const SearchAlbum = async ({
  searchId,
  message,
}: SpotifyHelperProps): Promise<SpotifyAlbum> => {
  const spotify = new Spotify({ id: SPOTIFY_ID, secret: SPOTIFY_SECRET });

  const album = await spotify
    .request(`https://api.spotify.com/v1/albums/${searchId}`)
    .then((data: SpotifyAlbum) => data)
    .catch(() => {
      message.channel
        .send('No results found from given Spotify link.')
        .then((message) =>
          MessageHelpers.DeleteMessage({ message, timeout: 3000 }),
        );
    });

  return album;
};

export default SearchAlbum;
