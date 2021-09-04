import { Message } from 'discord.js';
import { Manager } from 'lavacord';
import { Play, SongSearch } from '..';
import SpotifyMatch from './SpotifyMatch';

const PlaySpotify = async ({
  message,
  manager,
  spotifyMatch,
}: PlaySpotifyProps) => {
  const [searchType, searchId] = spotifyMatch!.toString().split('/');
  const spotifyReturn = await SpotifyMatch({
    message,
    searchId,
    searchType,
  });

  // If spotifyReturn is an array, user sent an Album or Playlist to play
  if (Array.isArray(spotifyReturn)) {
    const songs = await Promise.all(
      spotifyReturn.map(
        async (search) => (await SongSearch({ manager, search })).tracks[0],
      ),
    );
    return Play({ message, manager, songs });
  } else {
    const [song] = (await SongSearch({ manager, search: spotifyReturn }))
      .tracks;
    return Play({ message, manager, song });
  }
};

interface PlaySpotifyProps {
  manager: Manager;
  spotifyMatch: RegExpMatchArray | null;
  message: Message;
}

export default PlaySpotify;
