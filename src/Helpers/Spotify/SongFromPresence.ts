import { GuildMember, Message } from 'discord.js';
import { Manager } from 'lavacord';
import { GetCurrentPlayingTrack } from '.';
import { RetrieveSpotifyLink } from '../Database';
import { VolcanoTrack } from '../../global';
import { SongSearch } from '..';

const SongFromPresence = async ({
  args,
  manager,
  message,
}: PresenceProps): Promise<{
  song: VolcanoTrack;
  foundUser: GuildMember;
} | void> => {
  const taggedUser = args
    .join('')
    .match(/(?<=\<@)(.*?)(?=\>)/g)
    ?.join('');

  const foundUser = message.guild?.members.cache.get(
    taggedUser ?? message.author.id,
  )!;

  const spotifyLink = await RetrieveSpotifyLink(foundUser.id);

  if (spotifyLink) {
    const spotifyReturn = await GetCurrentPlayingTrack(spotifyLink);

    if (!spotifyReturn) return;

    const {
      tracks: [song],
    } = await SongSearch({
      manager,
      search: spotifyReturn,
    });

    return { song, foundUser };
  } else {
    const { presence } = foundUser;

    const userPresence = presence?.activities.find(
      (activity) => activity.name === 'Spotify',
    )!;

    if (!userPresence) return;

    const {
      tracks: [song],
    } = await SongSearch({
      manager,
      search: `${userPresence.details} ${userPresence.state}`,
    });

    return { song, foundUser };
  }
};

interface PresenceProps {
  manager: Manager;
  message: Message;
  args: any[];
}

export default SongFromPresence;
