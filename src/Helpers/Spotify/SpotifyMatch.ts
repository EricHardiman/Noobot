import { Message } from 'discord.js';
import SearchTrack from './SearchTrack';
import SearchAlbum from './SearchAlbum';
import SearchPlaylist from './SearchPlaylist';
import { SpotifyTrack } from '../../global';

const handleSpotifyReturn = ({
  artists,
  name,
}: Pick<SpotifyTrack, 'name' | 'artists'>) => {
  const artistNames = artists.map((artist) => artist.name).join(', ');

  return `${name} ${artistNames}`;
};

const SpotifyMatch = async ({
  message,
  searchId,
  searchType,
}: SpotifyMatchProps): Promise<string | string[]> => {
  switch (searchType) {
    case 'track':
      return await SearchTrack({ message, searchId }).then(
        ({ artists, name }) => handleSpotifyReturn({ name, artists }),
      );

    case 'album':
      return await SearchAlbum({ message, searchId }).then(({ tracks }) =>
        tracks.items.map(({ name, artists }) =>
          handleSpotifyReturn({ name, artists }),
        ),
      );

    case 'playlist':
      return await SearchPlaylist({ message, searchId }).then(({ tracks }) =>
        tracks.items.map(({ track: { name, artists } }) =>
          handleSpotifyReturn({ name, artists }),
        ),
      );

    default:
      return '';
  }
};

interface SpotifyMatchProps {
  searchType: string;
  searchId: string;
  message: Message;
}

export interface SpotifyHelperProps {
  searchId: string;
  message: Message;
}

export default SpotifyMatch;
