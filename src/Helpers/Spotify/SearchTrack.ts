import Spotify from 'node-spotify-api';
import { MessageHelpers } from '..';
import { SPOTIFY_ID, SPOTIFY_SECRET } from '../../config.json';
import { SpotifyTrack } from '../../global';
import { SpotifyHelperProps } from './SpotifyMatch';

const SearchTrack = async ({
  searchId,
  message,
}: SpotifyHelperProps): Promise<SpotifyTrack> => {
  const spotify = new Spotify({ id: SPOTIFY_ID, secret: SPOTIFY_SECRET });

  const track = await spotify
    .request(`https://api.spotify.com/v1/tracks/${searchId}`)
    .then((data: SpotifyTrack) => data)
    .catch(() => {
      message.channel
        .send('No results found from given Spotify link.')
        .then(
          async (message) =>
            await MessageHelpers.DeleteMessage({ message, timeout: 3000 }),
        );
    });

  return track;
};

export default SearchTrack;
