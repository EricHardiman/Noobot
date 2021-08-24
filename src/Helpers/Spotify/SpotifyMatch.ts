import { Message } from 'discord.js';
import SearchTrack from './SearchTrack';
import SearchAlbum from './SearchAlbum';
import SearchPlaylist from './SearchPlaylist';

const SpotifyMatch = async ({
  message,
  searchId,
  searchType,
}: SpotifyMatchProps): Promise<string | string[]> => {
  switch (searchType) {
    case 'track':
      return await SearchTrack({ message, searchId }).then(
        ({ artists, name }) => `${name} ${artists[0].name}`,
      );

    case 'album':
      return await SearchAlbum({ message, searchId }).then(({ tracks }) =>
        tracks.items.map(({ name, artists }) => `${name} ${artists[0].name}`),
      );

    case 'playlist':
      return await SearchPlaylist({ message, searchId }).then(({ tracks }) =>
        tracks.items.map(
          ({ track: { name, artists } }) => `${name} ${artists[0].name}`,
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
