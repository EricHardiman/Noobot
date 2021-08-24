import { Player } from 'discord-player';
import { Message } from 'discord.js';
import { MusicHelpers } from '..';
import SpotifyMatch from './SpotifyMatch';

const PlaySpotify = async ({
  message,
  player,
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
        async (search) =>
          (
            await player.search(search, { requestedBy: message.author })
          ).tracks[0],
      ),
    );

    return MusicHelpers.Play({ message, player, songs });
  } else {
    const [song] = (
      await player.search(spotifyReturn, { requestedBy: message.author })
    ).tracks;

    return MusicHelpers.Play({ message, player, song });
  }
};

interface PlaySpotifyProps {
  player: Player;
  spotifyMatch: RegExpMatchArray | null;
  message: Message;
}

export default PlaySpotify;
