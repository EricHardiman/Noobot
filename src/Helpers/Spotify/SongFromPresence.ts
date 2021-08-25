import { Player, Track } from 'discord-player';
import { GuildMember, Message } from 'discord.js';
import { GetCurrentPlayingTrack } from '.';
import { DatabaseHelpers } from '..';

const SongFromPresence = async ({
  args,
  player,
  message,
}: PresenceProps): Promise<{ song: Track; foundUser: GuildMember } | void> => {
  const taggedUser = args
    .join('')
    .match(/(?<=<@!)(.*)(?=\>)/g)
    ?.join('');

  const foundUser = message.guild?.members.cache.get(
    taggedUser ?? message.author.id,
  )!;

  const spotifyLink = await DatabaseHelpers.RetrieveSpotifyLink(foundUser.id);

  if (spotifyLink) {
    const spotifyReturn = await GetCurrentPlayingTrack(spotifyLink);

    const [song] = (
      await player.search(spotifyReturn, {
        requestedBy: message.author,
      })
    ).tracks;

    return { song, foundUser };
  } else {
    const { presence } = foundUser;

    const userPresence = presence?.activities.find(
      (activity) => activity.name === 'Spotify',
    )!;

    if (!userPresence) return;

    const [song] = (
      await player.search(`${userPresence.details} ${userPresence.state}`, {
        requestedBy: message.author,
      })
    ).tracks;

    return { song, foundUser };
  }
};

interface PresenceProps {
  player: Player;
  message: Message;
  args: any[];
}

export default SongFromPresence;
